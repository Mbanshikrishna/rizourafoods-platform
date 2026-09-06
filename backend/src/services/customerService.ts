import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import ms from "ms";
import type { BusinessProfileStatus, BusinessType, ContactRole, CrmActivityType, CustomerStatus, Prisma, UserRole } from "@prisma/client";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { customerRepository } from "../repositories/customerRepository";
import { ApiError } from "../utils/apiError";
import { hashPassword, verifyPassword } from "../utils/password";

type CustomerTokenPayload = { sub: string; email: string; kind: "customer"; status: CustomerStatus };
type AddressInput = { label?: string; type: "BILLING" | "DELIVERY" | "WAREHOUSE" | "OFFICE" | "OTHER"; line1: string; line2?: string; city: string; state: string; pincode: string; country: string; phone?: string; isDefault?: boolean };
type ContactInput = { name: string; designation?: string; role: ContactRole; phone?: string; email?: string; isPrimary?: boolean };
const tokenHash = (token: string) => crypto.createHash("sha256").update(token).digest("hex");
const publicCustomer = (customer: { id: string; name: string; email: string; phone: string | null; status: CustomerStatus; createdAt: Date }) => ({ id: customer.id, name: customer.name, email: customer.email, phone: customer.phone, status: customer.status, createdAt: customer.createdAt });

const issueTokens = async (customer: { id: string; email: string; status: CustomerStatus }) => {
  const payload: CustomerTokenPayload = { sub: customer.id, email: customer.email, kind: "customer", status: customer.status };
  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TTL as ms.StringValue });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_TTL as ms.StringValue });
  const ttl = ms(env.JWT_REFRESH_TTL as ms.StringValue);
  if (typeof ttl !== "number") throw new ApiError(500, "Invalid refresh token configuration", "AUTH_CONFIG_INVALID");
  await customerRepository.createRefreshToken({ tokenHash: tokenHash(refreshToken), customerId: customer.id, expiresAt: new Date(Date.now() + ttl) });
  return { accessToken, refreshToken };
};

const requireRecord = <T>(record: T | null, message: string, code: string): T => {
  if (!record) throw new ApiError(404, message, code);
  return record;
};

export const customerService = {
  publicCustomer,
  async register(input: { name: string; email: string; phone?: string; password: string; businessName: string; businessType: BusinessType; gstNumber?: string; city: string; state: string; pincode: string; estimatedMonthlyVolume?: string }) {
    const email = input.email.toLowerCase();
    if (await customerRepository.findByEmail(email)) throw new ApiError(409, "An account already exists for this email", "CUSTOMER_EXISTS");
    const passwordHash = await hashPassword(input.password);
    const customer = await customerRepository.create({ name: input.name, email, phone: input.phone, passwordHash, businessProfile: { create: { businessName: input.businessName, businessType: input.businessType, gstNumber: input.gstNumber, city: input.city, state: input.state, pincode: input.pincode, estimatedMonthlyVolume: input.estimatedMonthlyVolume } } });
    return { customer: publicCustomer(customer), tokens: await issueTokens(customer) };
  },
  async login(email: string, password: string) {
    const customer = await customerRepository.findByEmail(email.toLowerCase());
    if (!customer || !(await verifyPassword(password, customer.passwordHash))) throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    if (customer.status === "SUSPENDED" || customer.status === "REJECTED") throw new ApiError(403, "This customer account is not permitted to sign in", "CUSTOMER_NOT_PERMITTED");
    return { customer: publicCustomer(customer), tokens: await issueTokens(customer) };
  },
  async refresh(refreshToken: string) {
    const record = await customerRepository.findRefreshToken(tokenHash(refreshToken));
    if (!record || record.revokedAt || record.expiresAt < new Date()) throw new ApiError(401, "Refresh session is invalid or expired", "REFRESH_TOKEN_INVALID");
    try {
      const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as CustomerTokenPayload;
      if (payload.kind !== "customer") throw new Error();
    } catch {
      await customerRepository.revokeRefreshToken(record.id);
      throw new ApiError(401, "Refresh session is invalid or expired", "REFRESH_TOKEN_INVALID");
    }
    await customerRepository.revokeRefreshToken(record.id);
    return { customer: publicCustomer(record.customer), tokens: await issueTokens(record.customer) };
  },
  logout: (refreshToken: string) => customerRepository.revokeRefreshTokens(tokenHash(refreshToken)),
  get: (id: string) => customerRepository.getSelf(id),
  update: (id: string, data: Pick<Prisma.CustomerUpdateInput, "name" | "phone">) => customerRepository.updateSelf(id, data),
  business: (id: string) => customerRepository.getBusinessForCustomer(id),
  updateBusiness: (id: string, data: Prisma.BusinessProfileUpdateInput) => customerRepository.updateBusinessForCustomer(id, data),
  addresses: (id: string) => customerRepository.listAddressesForCustomer(id),
  addAddress: (id: string, data: AddressInput) => customerRepository.createAddress(id, data),
  async updateAddress(customerId: string, id: string, data: Prisma.AddressUpdateManyMutationInput) { return requireRecord(await customerRepository.updateAddress(customerId, id, data), "Address not found", "ADDRESS_NOT_FOUND"); },
  async deleteAddress(customerId: string, id: string) { if (!(await customerRepository.deleteAddress(customerId, id)).count) throw new ApiError(404, "Address not found", "ADDRESS_NOT_FOUND"); },
  contacts: (id: string) => customerRepository.listContactsForCustomer(id),
  addContact: (id: string, data: ContactInput) => customerRepository.createContact(id, data),
  async updateContact(customerId: string, id: string, data: Prisma.CustomerContactUpdateManyMutationInput) { return requireRecord(await customerRepository.updateContact(customerId, id, data), "Contact not found", "CONTACT_NOT_FOUND"); },
  async deleteContact(customerId: string, id: string) { if (!(await customerRepository.deleteContact(customerId, id)).count) throw new ApiError(404, "Contact not found", "CONTACT_NOT_FOUND"); },
  async listCrm(input: Parameters<typeof customerRepository.listCrmCustomers>[0]) {
    const { data, total } = await customerRepository.listCrmCustomers(input);
    return { data, meta: { page: input.page, pageSize: input.pageSize, total, totalPages: Math.max(1, Math.ceil(total / input.pageSize)) } };
  },
  async crmCustomer(id: string, role: UserRole) {
    const customer = requireRecord(await customerRepository.getCrmCustomer(id), "Customer not found", "CUSTOMER_NOT_FOUND");
    if (role !== "VIEWER") return customer;
    const safeCustomer = Object.fromEntries(Object.entries(customer).filter(([key]) => key !== "crmActivities"));
    if (!customer.businessProfile) return safeCustomer;
    const internalBusinessFields = new Set(["currentSupplier", "monthlyRiceConsumption", "monthlyFoodProcurement", "preferredPackSize", "paymentTerms", "deliveryRequirements", "deliveryFrequency", "categoriesOfInterest"]);
    const safeBusiness = Object.fromEntries(Object.entries(customer.businessProfile).filter(([key]) => !internalBusinessFields.has(key)));
    return { ...safeCustomer, businessProfile: safeBusiness };
  },
  async updateCrmBusiness(customerId: string, data: Prisma.BusinessProfileUpdateInput, actorId: string) {
    const business = await customerRepository.updateCrmBusiness(customerId, data);
    logger.info({ event: "crm.business_profile_updated", customerId, actorId }, "CRM business profile updated");
    return business;
  },
  async approveCustomer(id: string, actorId: string) {
    const customer = await customerRepository.getSelf(id);
    if (customer.status !== "PENDING") throw new ApiError(409, "Only pending customers can be approved", "CUSTOMER_STATUS_TRANSITION_INVALID");
    const updated = await customerRepository.updateCustomerStatus(id, "ACTIVE");
    logger.info({ event: "crm.customer_approved", customerId: id, actorId }, "Customer approved");
    return updated;
  },
  async suspendCustomer(id: string, actorId: string) {
    const customer = await customerRepository.getSelf(id);
    if (customer.status !== "ACTIVE") throw new ApiError(409, "Only active customers can be suspended", "CUSTOMER_STATUS_TRANSITION_INVALID");
    const updated = await customerRepository.updateCustomerStatus(id, "SUSPENDED");
    logger.info({ event: "crm.customer_suspended", customerId: id, actorId }, "Customer suspended");
    return updated;
  },
  async reviewBusiness(id: string, status: BusinessProfileStatus, actorId: string) {
    const business = await customerRepository.getBusinessForCustomer(id);
    if (business.status !== "PENDING") throw new ApiError(409, "Only pending business profiles can be reviewed", "BUSINESS_STATUS_TRANSITION_INVALID");
    const updated = await customerRepository.reviewBusiness(id, status);
    logger.info({ event: status === "APPROVED" ? "crm.business_profile_approved" : "crm.business_profile_rejected", customerId: id, actorId }, "Business profile reviewed");
    return updated;
  },
  listCrmContacts: (id: string) => customerRepository.listContactsForCustomer(id),
  createCrmContact: (id: string, data: ContactInput) => customerRepository.createContact(id, data),
  async updateCrmContact(customerId: string, id: string, data: Prisma.CustomerContactUpdateManyMutationInput) { return requireRecord(await customerRepository.updateContact(customerId, id, data), "Contact not found", "CONTACT_NOT_FOUND"); },
  async deleteCrmContact(customerId: string, id: string) { if (!(await customerRepository.deleteContact(customerId, id)).count) throw new ApiError(404, "Contact not found", "CONTACT_NOT_FOUND"); },
  async createActivity(customerId: string, contactId: string | undefined, type: CrmActivityType, subject: string, details: string | undefined, createdById: string) {
    if (contactId && !await customerRepository.findContactForCustomer(customerId, contactId)) throw new ApiError(422, "Contact does not belong to this customer", "CRM_CONTACT_MISMATCH");
    return customerRepository.createActivity({ customerId, contactId, type, subject, details, createdById });
  },
  async listActivities(customerId: string, page: number, pageSize: number) {
    requireRecord(await customerRepository.getCrmCustomer(customerId), "Customer not found", "CUSTOMER_NOT_FOUND");
    const [data, total] = await customerRepository.listActivities(customerId, page, pageSize);
    return { data, meta: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) } };
  },
};
