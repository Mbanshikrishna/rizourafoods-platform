import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/repositories/pricingRepository", () => ({
  pricingRepository: { getProduct: vi.fn(), customerTier: vi.fn(), list: vi.fn(), create: vi.fn(), update: vi.fn(), findById: vi.fn(), findOverlap: vi.fn(), findApplicable: vi.fn() },
}));
vi.mock("../src/config/logger", () => ({ logger: { info: vi.fn() } }));

import { pricingRepository } from "../src/repositories/pricingRepository";
import { pricingService } from "../src/services/pricingService";

const product = { id: "product-a", name: "Basmati", sku: "RICE-BASMATI-25KG", status: "PUBLISHED", b2bEligible: true };
const standardPrice = { id: "tier-b2b", unit: "kg", unitPrice: { toString: () => "88.50" }, currency: "INR", minQuantity: { toString: () => "25" }, maxQuantity: null, validUntil: null };

describe("pricingService", () => {
  beforeEach(() => { vi.clearAllMocks(); vi.mocked(pricingRepository.getProduct).mockResolvedValue(product as never); vi.mocked(pricingRepository.findOverlap).mockResolvedValue(null); });

  it("rejects invalid price dates and ranges before persisting", async () => {
    await expect(pricingService.create("product-a", { tier: "B2B", minQuantity: 10, maxQuantity: 5, unit: "kg", unitPrice: 1, currency: "INR" }, "admin-a")).rejects.toMatchObject({ code: "PRICE_QUANTITY_RANGE_INVALID" });
    await expect(pricingService.create("product-a", { tier: "B2B", minQuantity: 1, unit: "kg", unitPrice: 1, currency: "INR", validFrom: new Date("2027-01-02"), validUntil: new Date("2027-01-01") }, "admin-a")).rejects.toMatchObject({ code: "PRICE_DATE_RANGE_INVALID" });
    expect(pricingRepository.create).not.toHaveBeenCalled();
  });

  it("rejects overlapping active prices for the same product, tier, and customer scope", async () => {
    vi.mocked(pricingRepository.findOverlap).mockResolvedValue({ id: "existing" } as never);
    await expect(pricingService.create("product-a", { tier: "B2B", minQuantity: 1, unit: "kg", unitPrice: 88.5, currency: "INR" }, "admin-a")).rejects.toMatchObject({ code: "PRICE_PERIOD_OVERLAP" });
  });

  it("allows an inactive historical price to overlap an active window", async () => {
    vi.mocked(pricingRepository.findOverlap).mockResolvedValue({ id: "existing" } as never);
    vi.mocked(pricingRepository.create).mockResolvedValue({ id: "historic" } as never);
    await expect(pricingService.create("product-a", { tier: "B2B", minQuantity: 1, unit: "kg", unitPrice: 88.5, currency: "INR", active: false }, "admin-a")).resolves.toMatchObject({ id: "historic" });
    expect(pricingRepository.findOverlap).not.toHaveBeenCalled();
  });

  it("resolves a customer override before the applicable HORECA tier", async () => {
    vi.mocked(pricingRepository.customerTier).mockResolvedValue({ status: "ACTIVE", businessProfile: { businessType: "RESTAURANT" } } as never);
    const override = { ...standardPrice, id: "customer-override", unitPrice: { toString: () => "82.00" } };
    vi.mocked(pricingRepository.findApplicable).mockResolvedValueOnce(override as never);
    const resolved = await pricingService.resolve("product-a", 25, "customer-a");
    expect(resolved).toMatchObject({ tier: "HORECA", source: "CUSTOMER_OVERRIDE", price: { id: "customer-override", unitPrice: "82.00" } });
    expect(pricingRepository.findApplicable).toHaveBeenCalledWith(expect.objectContaining({ customerId: "customer-a", tier: "HORECA" }));
  });

  it("falls back deterministically to the active standard tier price", async () => {
    vi.mocked(pricingRepository.customerTier).mockResolvedValue({ status: "ACTIVE", businessProfile: { businessType: "DISTRIBUTOR" } } as never);
    vi.mocked(pricingRepository.findApplicable).mockResolvedValueOnce(null).mockResolvedValueOnce(standardPrice as never);
    const resolved = await pricingService.resolve("product-a", 25, "customer-a");
    expect(resolved).toMatchObject({ tier: "B2B", source: "STANDARD_TIER", price: { id: "tier-b2b" } });
  });
});
