import { prisma } from "./client";
import { authService } from "../services/authService";
import { logger } from "../config/logger";

const run = async () => {
  await prisma.$connect();
  const admin = await authService.seedDefaultAdmin();
  // Development catalogue seed only. It intentionally contains no prices,
  // inventory, certifications, laboratory values, or availability claims.
  const products = [
    ["1121 Basmati Rice", "1121-basmati-rice", "RICE"], ["Golden Sella Rice", "golden-sella-rice", "RICE"], ["Everyday Basmati Rice", "everyday-basmati-rice", "RICE"],
    ["Red Chilli Powder", "red-chilli-powder", "SPICES"], ["Turmeric Powder", "turmeric-powder", "SPICES"], ["Cumin Powder", "cumin-powder", "SPICES"], ["Coriander Powder", "coriander-powder", "SPICES"],
    ["Garam Masala", "garam-masala", "MASALAS"], ["Biryani Masala", "biryani-masala", "MASALAS"], ["Fish Masala", "fish-masala", "MASALAS"], ["Kosha Mangsho Masala", "kosha-mangsho-masala", "MASALAS"],
  ] as const;
  await Promise.all(products.map(([name, slug, category]) => prisma.product.upsert({ where: { slug }, update: {}, create: { name, slug, category, description: `Development catalogue entry for ${name}. Contact Rizoura Foods to confirm commercial specifications.`, status: "PUBLISHED" } })));
  logger.info({ adminEmail: admin.email }, "Default admin ensured");
};

void run()
  .catch((error) => {
    logger.error({ err: error }, "Seeding failed");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
