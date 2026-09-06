import { Prisma, type PriceTier } from "@prisma/client";
import { prisma } from "../prisma/client";

const activeAt = (at: Date): Prisma.ProductPriceWhereInput => ({ active: true, validFrom: { lte: at }, OR: [{ validUntil: null }, { validUntil: { gte: at } }] });

export const pricingRepository = {
  getProduct: (id: string) => prisma.product.findUnique({ where: { id }, select: { id: true, name: true, sku: true, status: true, b2bEligible: true } }),
  customerTier: (customerId: string) => prisma.customer.findUnique({ where: { id: customerId }, select: { status: true, businessProfile: { select: { businessType: true } } } }),
  list: (productId: string, customerId?: string) => prisma.productPrice.findMany({ where: { productId, ...(customerId ? { customerId } : {}) }, orderBy: [{ customerId: "desc" }, { tier: "asc" }, { minQuantity: "asc" }, { validFrom: "desc" }] }),
  findById: (id: string) => prisma.productPrice.findUnique({ where: { id } }),
  create: (data: Prisma.ProductPriceUncheckedCreateInput) => prisma.productPrice.create({ data }),
  update: (id: string, data: Prisma.ProductPriceUncheckedUpdateInput) => prisma.productPrice.update({ where: { id }, data }),
  async findOverlap(input: { productId: string; tier: PriceTier; customerId?: string | null; validFrom: Date; validUntil?: Date | null; excludeId?: string }) {
    return prisma.productPrice.findFirst({ where: { productId: input.productId, tier: input.tier, customerId: input.customerId ?? null, active: true, ...(input.excludeId ? { id: { not: input.excludeId } } : {}), validFrom: { lte: input.validUntil ?? new Date("9999-12-31") }, OR: [{ validUntil: null }, { validUntil: { gte: input.validFrom } }] } });
  },
  findApplicable: (input: { productId: string; tier: PriceTier; customerId?: string; quantity: Prisma.Decimal | number; at: Date }) => prisma.productPrice.findFirst({ where: { productId: input.productId, tier: input.tier, ...(input.customerId ? { customerId: input.customerId } : { customerId: null }), ...activeAt(input.at), minQuantity: { lte: input.quantity }, OR: [{ maxQuantity: null }, { maxQuantity: { gte: input.quantity } }] }, orderBy: [{ minQuantity: "desc" }, { validFrom: "desc" }] }),
};
