import { Prisma, type AddressType, type BusinessProfileStatus, type CustomerStatus } from "@prisma/client";
import { prisma } from "../prisma/client";

const customerSelect = { id: true, name: true, email: true, phone: true, status: true, createdAt: true } as const;
const customerBusinessSelect = { id: true, customerId: true, businessName: true, tradingName: true, businessType: true, gstNumber: true, registrationNumber: true, panNumber: true, website: true, phone: true, email: true, address: true, city: true, state: true, pincode: true, country: true, estimatedMonthlyVolume: true, status: true, createdAt: true, updatedAt: true } as const;

export const customerRepository = {
  findByEmail: (email: string) => prisma.customer.findUnique({ where: { email } }),
  create: (data: Prisma.CustomerCreateArgs["data"]) => prisma.customer.create({ data }),
  createRefreshToken: (data: Prisma.CustomerRefreshTokenUncheckedCreateInput) => prisma.customerRefreshToken.create({ data }),
  findRefreshToken: (tokenHash: string) => prisma.customerRefreshToken.findUnique({ where: { tokenHash }, include: { customer: true } }),
  revokeRefreshToken: (id: string) => prisma.customerRefreshToken.update({ where: { id }, data: { revokedAt: new Date() } }),
  revokeRefreshTokens: (tokenHash: string) => prisma.customerRefreshToken.updateMany({ where: { tokenHash, revokedAt: null }, data: { revokedAt: new Date() } }),
  getSelf: (id: string) => prisma.customer.findUniqueOrThrow({ where: { id }, select: customerSelect }),
  updateSelf: (id: string, data: Pick<Prisma.CustomerUpdateInput, "name" | "phone">) => prisma.customer.update({ where: { id }, data, select: customerSelect }),
  getBusinessForCustomer: (customerId: string) => prisma.businessProfile.findUniqueOrThrow({ where: { customerId }, select: customerBusinessSelect }),
  updateBusinessForCustomer: (customerId: string, data: Prisma.BusinessProfileUpdateInput) => prisma.businessProfile.update({ where: { customerId }, data, select: customerBusinessSelect }),
  listAddressesForCustomer: (customerId: string) => prisma.address.findMany({ where: { customerId }, orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] }),
  async createAddress(customerId: string, data: Omit<Prisma.AddressUncheckedCreateInput, "customerId">) {
    return prisma.$transaction(async (tx) => {
      if (data.isDefault) await tx.address.updateMany({ where: { customerId }, data: { isDefault: false } });
      const existing = await tx.address.count({ where: { customerId } });
      return tx.address.create({ data: { ...data, customerId, isDefault: data.isDefault ?? existing === 0 } });
    });
  },
  async updateAddress(customerId: string, id: string, data: Prisma.AddressUpdateManyMutationInput) {
    return prisma.$transaction(async (tx) => {
      if (data.isDefault === true) await tx.address.updateMany({ where: { customerId }, data: { isDefault: false } });
      const updated = await tx.address.updateMany({ where: { id, customerId }, data });
      if (!updated.count) return null;
      return tx.address.findUnique({ where: { id } });
    });
  },
  deleteAddress: (customerId: string, id: string) => prisma.address.deleteMany({ where: { id, customerId } }),
  listContactsForCustomer: (customerId: string) => prisma.customerContact.findMany({ where: { customerId }, orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }] }),
  async createContact(customerId: string, data: Omit<Prisma.CustomerContactUncheckedCreateInput, "customerId">) {
    return prisma.$transaction(async (tx) => {
      if (data.isPrimary) await tx.customerContact.updateMany({ where: { customerId }, data: { isPrimary: false } });
      const existing = await tx.customerContact.count({ where: { customerId } });
      return tx.customerContact.create({ data: { ...data, customerId, isPrimary: data.isPrimary ?? existing === 0 } });
    });
  },
  async updateContact(customerId: string, id: string, data: Prisma.CustomerContactUpdateManyMutationInput) {
    return prisma.$transaction(async (tx) => {
      if (data.isPrimary === true) await tx.customerContact.updateMany({ where: { customerId }, data: { isPrimary: false } });
      const updated = await tx.customerContact.updateMany({ where: { id, customerId }, data });
      if (!updated.count) return null;
      return tx.customerContact.findUnique({ where: { id } });
    });
  },
  deleteContact: (customerId: string, id: string) => prisma.customerContact.deleteMany({ where: { id, customerId } }),
  findContactForCustomer: (customerId: string, id: string) => prisma.customerContact.findFirst({ where: { id, customerId } }),
  async listCrmCustomers(input: { page: number; pageSize: number; search?: string; status?: CustomerStatus; businessType?: Prisma.EnumBusinessTypeFilter; city?: string; state?: string; createdFrom?: Date; createdTo?: Date }) {
    const where: Prisma.CustomerWhereInput = {
      ...(input.status ? { status: input.status } : {}),
      ...(input.createdFrom || input.createdTo ? { createdAt: { ...(input.createdFrom ? { gte: input.createdFrom } : {}), ...(input.createdTo ? { lte: input.createdTo } : {}) } } : {}),
      ...(input.search ? { OR: [{ name: { contains: input.search, mode: "insensitive" } }, { email: { contains: input.search, mode: "insensitive" } }, { businessProfile: { businessName: { contains: input.search, mode: "insensitive" } } }] } : {}),
      ...(input.businessType || input.city || input.state ? { businessProfile: { is: { ...(input.businessType ? { businessType: input.businessType } : {}), ...(input.city ? { city: { equals: input.city, mode: "insensitive" } } : {}), ...(input.state ? { state: { equals: input.state, mode: "insensitive" } } : {}) } } } : {}),
    };
    const [data, total] = await Promise.all([
      prisma.customer.findMany({ where, skip: (input.page - 1) * input.pageSize, take: input.pageSize, orderBy: { createdAt: "desc" }, select: { ...customerSelect, businessProfile: { select: { businessName: true, tradingName: true, businessType: true, city: true, state: true, status: true } }, contacts: { where: { isPrimary: true }, take: 1, select: { id: true, name: true, phone: true, email: true, role: true } }, crmActivities: { take: 1, orderBy: { createdAt: "desc" }, select: { type: true, subject: true, createdAt: true } } } }),
      prisma.customer.count({ where }),
    ]);
    return { data, total };
  },
  getCrmCustomer: (id: string) => prisma.customer.findUnique({ where: { id }, select: { ...customerSelect, updatedAt: true, businessProfile: true, contacts: { orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }] }, addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] }, crmActivities: { orderBy: { createdAt: "desc" }, take: 20, include: { contact: { select: { id: true, name: true } }, createdBy: { select: { id: true, name: true, email: true, role: true } } } } } }),
  updateCustomerStatus: (id: string, status: CustomerStatus) => prisma.customer.update({ where: { id }, data: { status }, select: customerSelect }),
  updateCrmBusiness: (customerId: string, data: Prisma.BusinessProfileUpdateInput) => prisma.businessProfile.update({ where: { customerId }, data }),
  reviewBusiness: (customerId: string, status: BusinessProfileStatus) => prisma.businessProfile.update({ where: { customerId }, data: { status } }),
  createActivity: (data: Prisma.CrmActivityUncheckedCreateInput) => prisma.crmActivity.create({
    data,
    include: {
      contact: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true, email: true } },
    },
  }),
  listActivities: (customerId: string, page: number, pageSize: number) => Promise.all([prisma.crmActivity.findMany({ where: { customerId }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: "desc" }, include: { contact: { select: { id: true, name: true } }, createdBy: { select: { id: true, name: true, email: true } } } }), prisma.crmActivity.count({ where: { customerId } })]),
};

export type CustomerAddressInput = { label?: string; type: AddressType; line1: string; line2?: string; city: string; state: string; pincode: string; country: string; phone?: string; isDefault?: boolean };
