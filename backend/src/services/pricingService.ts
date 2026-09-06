import { Prisma, type PriceTier } from "@prisma/client";
import { logger } from "../config/logger";
import { pricingRepository } from "../repositories/pricingRepository";
import { ApiError } from "../utils/apiError";

type PriceInput = { tier: PriceTier; customerId?: string; minQuantity: number; maxQuantity?: number | null; unit: string; unitPrice: number; currency: string; validFrom?: Date; validUntil?: Date | null; active?: boolean };
const requireProduct = async (id: string) => { const product = await pricingRepository.getProduct(id); if (!product) throw new ApiError(404, "Product not found", "PRODUCT_NOT_FOUND"); return product; };
const validateRange = (input: PriceInput) => { if (input.maxQuantity != null && input.maxQuantity < input.minQuantity) throw new ApiError(422, "Maximum quantity must be greater than or equal to minimum quantity", "PRICE_QUANTITY_RANGE_INVALID"); const from = input.validFrom ?? new Date(); if (input.validUntil && input.validUntil < from) throw new ApiError(422, "Price expiry must be after its effective date", "PRICE_DATE_RANGE_INVALID"); return from; };
const tierForCustomer = async (customerId?: string): Promise<PriceTier> => { if (!customerId) return "RETAIL"; const customer = await pricingRepository.customerTier(customerId); if (!customer || customer.status !== "ACTIVE") return "RETAIL"; return ["RESTAURANT", "HOTEL", "CAFE", "CATERER", "CLOUD_KITCHEN", "INSTITUTION"].includes(customer.businessProfile?.businessType ?? "") ? "HORECA" : "B2B"; };

export const pricingService = {
  list: async (productId: string, customerId?: string) => { await requireProduct(productId); return pricingRepository.list(productId, customerId); },
  async create(productId: string, input: PriceInput, actorId: string) {
    await requireProduct(productId); const validFrom = validateRange(input);
    if ((input.active ?? true) && await pricingRepository.findOverlap({ productId, tier: input.tier, customerId: input.customerId, validFrom, validUntil: input.validUntil })) throw new ApiError(409, "An active price already overlaps this period", "PRICE_PERIOD_OVERLAP");
    const price = await pricingRepository.create({ productId, tier: input.tier, customerId: input.customerId, minQuantity: new Prisma.Decimal(input.minQuantity), maxQuantity: input.maxQuantity == null ? null : new Prisma.Decimal(input.maxQuantity), unit: input.unit, unitPrice: new Prisma.Decimal(input.unitPrice), currency: input.currency.toUpperCase(), validFrom, validUntil: input.validUntil, active: input.active ?? true, createdById: actorId });
    logger.info({ event: "pricing.created", productId, priceId: price.id, actorId }, "Product price created"); return price;
  },
  async update(id: string, input: Partial<PriceInput>, actorId: string) {
    const existing = await pricingRepository.findById(id); if (!existing) throw new ApiError(404, "Price not found", "PRICE_NOT_FOUND");
    const merged: PriceInput = { tier: input.tier ?? existing.tier, customerId: input.customerId ?? existing.customerId ?? undefined, minQuantity: input.minQuantity ?? Number(existing.minQuantity), maxQuantity: input.maxQuantity === undefined ? (existing.maxQuantity == null ? null : Number(existing.maxQuantity)) : input.maxQuantity, unit: input.unit ?? existing.unit, unitPrice: input.unitPrice ?? Number(existing.unitPrice), currency: input.currency ?? existing.currency, validFrom: input.validFrom ?? existing.validFrom, validUntil: input.validUntil === undefined ? existing.validUntil : input.validUntil, active: input.active ?? existing.active };
    const validFrom = validateRange(merged);
    if (merged.active && await pricingRepository.findOverlap({ productId: existing.productId, tier: merged.tier, customerId: merged.customerId, validFrom, validUntil: merged.validUntil, excludeId: id })) throw new ApiError(409, "An active price already overlaps this period", "PRICE_PERIOD_OVERLAP");
    const price = await pricingRepository.update(id, { tier: merged.tier, customerId: merged.customerId ?? null, minQuantity: new Prisma.Decimal(merged.minQuantity), maxQuantity: merged.maxQuantity == null ? null : new Prisma.Decimal(merged.maxQuantity), unit: merged.unit, unitPrice: new Prisma.Decimal(merged.unitPrice), currency: merged.currency.toUpperCase(), validFrom, validUntil: merged.validUntil, active: merged.active });
    logger.info({ event: "pricing.updated", productId: existing.productId, priceId: id, actorId }, "Product price updated"); return price;
  },
  async resolve(productId: string, quantity: number, customerId?: string) {
    const product = await requireProduct(productId); if (product.status !== "PUBLISHED" || !product.b2bEligible) throw new ApiError(404, "Product not available for pricing", "PRODUCT_NOT_AVAILABLE");
    const at = new Date(); const tier = await tierForCustomer(customerId);
    const customerPrice = customerId ? await pricingRepository.findApplicable({ productId, tier, customerId, quantity, at }) : null;
    const price = customerPrice ?? await pricingRepository.findApplicable({ productId, tier, quantity, at });
    if (!price) throw new ApiError(404, "No applicable price is available", "PRICE_NOT_AVAILABLE");
    return { product: { id: product.id, name: product.name, sku: product.sku }, tier, source: customerPrice ? "CUSTOMER_OVERRIDE" : "STANDARD_TIER", price: { id: price.id, unit: price.unit, unitPrice: price.unitPrice.toString(), currency: price.currency, minQuantity: price.minQuantity.toString(), maxQuantity: price.maxQuantity?.toString() ?? null, validUntil: price.validUntil } };
  },
};
