import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import ms from "ms";
import type { CustomerStatus, Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";
import { env } from "../config/env";
import { ApiError } from "../utils/apiError";
import { hashPassword, verifyPassword } from "../utils/password";

type CustomerTokenPayload = { sub: string; email: string; kind: "customer"; status: CustomerStatus };
const tokenHash = (token: string) => crypto.createHash("sha256").update(token).digest("hex");
const publicCustomer = (customer: { id: string; name: string; email: string; phone: string | null; status: CustomerStatus; createdAt: Date }) => ({ id: customer.id, name: customer.name, email: customer.email, phone: customer.phone, status: customer.status, createdAt: customer.createdAt });
const issueTokens = async (customer: { id: string; email: string; status: CustomerStatus }) => {
  const payload: CustomerTokenPayload = { sub: customer.id, email: customer.email, kind: "customer", status: customer.status };
  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TTL as ms.StringValue });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_TTL as ms.StringValue });
  const ttl = ms(env.JWT_REFRESH_TTL as ms.StringValue); if (typeof ttl !== "number") throw new ApiError(500, "Invalid refresh token configuration", "AUTH_CONFIG_INVALID");
  await prisma.customerRefreshToken.create({ data: { tokenHash: tokenHash(refreshToken), customerId: customer.id, expiresAt: new Date(Date.now() + ttl) } });
  return { accessToken, refreshToken };
};
export const customerService = {
  publicCustomer,
  async register(input: { name: string; email: string; phone?: string; password: string; businessName: string; businessType: string; gstNumber?: string; city: string; state: string; pincode: string; estimatedMonthlyVolume?: string }) {
    const email = input.email.toLowerCase(); if (await prisma.customer.findUnique({ where: { email } })) throw new ApiError(409, "An account already exists for this email", "CUSTOMER_EXISTS");
    const passwordHash = await hashPassword(input.password);
    const customer = await prisma.customer.create({ data: { name: input.name, email, phone: input.phone, passwordHash, businessProfile: { create: { businessName: input.businessName, businessType: input.businessType, gstNumber: input.gstNumber, city: input.city, state: input.state, pincode: input.pincode, estimatedMonthlyVolume: input.estimatedMonthlyVolume } } } });
    return { customer: publicCustomer(customer), tokens: await issueTokens(customer) };
  },
  async login(email: string, password: string) { const customer = await prisma.customer.findUnique({ where: { email: email.toLowerCase() } }); if (!customer || !(await verifyPassword(password, customer.passwordHash))) throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS"); if (customer.status === "SUSPENDED" || customer.status === "REJECTED") throw new ApiError(403, "This customer account is not permitted to sign in", "CUSTOMER_NOT_PERMITTED"); return { customer: publicCustomer(customer), tokens: await issueTokens(customer) }; },
  async refresh(refreshToken: string) { const record = await prisma.customerRefreshToken.findUnique({ where: { tokenHash: tokenHash(refreshToken) }, include: { customer: true } }); if (!record || record.revokedAt || record.expiresAt < new Date()) throw new ApiError(401, "Refresh session is invalid or expired", "REFRESH_TOKEN_INVALID"); try { const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as CustomerTokenPayload; if (payload.kind !== "customer") throw new Error(); } catch { await prisma.customerRefreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } }); throw new ApiError(401, "Refresh session is invalid or expired", "REFRESH_TOKEN_INVALID"); } await prisma.customerRefreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } }); return { customer: publicCustomer(record.customer), tokens: await issueTokens(record.customer) }; },
  logout: (refreshToken: string) => prisma.customerRefreshToken.updateMany({ where: { tokenHash: tokenHash(refreshToken), revokedAt: null }, data: { revokedAt: new Date() } }),
  get: (id: string) => prisma.customer.findUniqueOrThrow({ where: { id }, select: { id: true, name: true, email: true, phone: true, status: true, createdAt: true } }),
  update: (id: string, data: Prisma.CustomerUpdateInput) => prisma.customer.update({ where: { id }, data, select: { id: true, name: true, email: true, phone: true, status: true, createdAt: true } }),
  business: (id: string) => prisma.businessProfile.findUniqueOrThrow({ where: { customerId: id } }),
  updateBusiness: (id: string, data: Prisma.BusinessProfileUpdateInput) => prisma.businessProfile.update({ where: { customerId: id }, data }),
};
