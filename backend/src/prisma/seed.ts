import { prisma } from "./client";
import { authService } from "../services/authService";
import { logger } from "../config/logger";

export const runSeed = async () => {
  await prisma.$connect();
  try {
    const admin = await authService.seedDefaultAdmin();
    // Development-only catalogue and indicative tier prices. Commercial terms
    // must still be confirmed by Rizoura Foods before any sale.
    const categories = [
      ["RICE", "Rice"], ["PULSES", "Pulses / Dal"], ["FLOUR", "Flour / Atta"], ["SUGAR", "Sugar"], ["SPICES", "Spices"], ["DRY_GROCERIES", "Dry groceries"], ["MASALAS", "Masalas"],
    ] as const;
    const categoryRecords = await Promise.all(categories.map(([code, name]) => prisma.productCategory.upsert({ where: { code }, update: { name, isActive: true }, create: { code, name } })));
    const categoryByCode = new Map(categoryRecords.map((category) => [category.code, category.id]));
    const products = [
      ["1121 Basmati Rice", "1121-basmati-rice", "RICE", "RICE-1121-25KG", 25], ["Golden Sella Rice", "golden-sella-rice", "RICE", "RICE-SELLA-25KG", 25], ["Everyday Basmati Rice", "everyday-basmati-rice", "RICE", "RICE-EVERYDAY-10KG", 10],
      ["Moong Dal", "moong-dal", "PULSES", "DAL-MOONG-25KG", 25], ["Whole Wheat Atta", "whole-wheat-atta", "FLOUR", "ATTA-WHOLE-10KG", 10], ["Refined Sugar", "refined-sugar", "SUGAR", "SUGAR-REFINED-50KG", 50],
      ["Red Chilli Powder", "red-chilli-powder", "SPICES", "SPICE-CHILLI-1KG", 1], ["Turmeric Powder", "turmeric-powder", "SPICES", "SPICE-TURMERIC-1KG", 1], ["Cumin Powder", "cumin-powder", "SPICES", "SPICE-CUMIN-1KG", 1], ["Coriander Powder", "coriander-powder", "SPICES", "SPICE-CORIANDER-1KG", 1],
      ["Garam Masala", "garam-masala", "MASALAS", "MASALA-GARAM-1KG", 1], ["Biryani Masala", "biryani-masala", "MASALAS", "MASALA-BIRYANI-1KG", 1], ["Fish Masala", "fish-masala", "MASALAS", "MASALA-FISH-1KG", 1], ["Kosha Mangsho Masala", "kosha-mangsho-masala", "MASALAS", "MASALA-KOSHA-1KG", 1],
    ] as const;
    const seededProducts = await Promise.all(products.map(([name, slug, category, sku, packSize]) => prisma.product.upsert({ where: { slug }, update: { sku, categoryId: categoryByCode.get(category), brand: "Rizoura Foods", baseUnit: "kg", packSize, packUnit: "kg", packSizes: [`${packSize} kg`], status: "PUBLISHED" }, create: { name, slug, category, categoryId: categoryByCode.get(category), sku, brand: "Rizoura Foods", baseUnit: "kg", packSize, packUnit: "kg", packSizes: [`${packSize} kg`], description: `Development catalogue entry for ${name}. Contact Rizoura Foods to confirm commercial specifications.`, status: "PUBLISHED" } })));
    await Promise.all(seededProducts.flatMap(() => ["RETAIL", "B2B", "HORECA"] as const).map(async (tier, index) => {
      const product = seededProducts[Math.floor(index / 3)];
      const existingPrice = await prisma.productPrice.findFirst({ where: { productId: product.id, tier, customerId: null, active: true } });
      if (!existingPrice) await prisma.productPrice.create({ data: { productId: product.id, tier, minQuantity: 1, unit: "kg", unitPrice: 1, currency: "INR", active: true } });
    }));
    logger.info({ adminEmail: admin.email }, "Default admin ensured");
  } finally {
    await prisma.$disconnect();
  }
};

if (require.main === module) {
  void runSeed().catch((error) => {
    logger.error({ err: error }, "Seeding failed");
    process.exitCode = 1;
  });
}
