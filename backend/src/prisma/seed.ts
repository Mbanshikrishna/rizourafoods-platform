import { prisma } from "./client";
import { authService } from "../services/authService";
import { logger } from "../config/logger";

const run = async () => {
  await prisma.$connect();
  const admin = await authService.seedDefaultAdmin();
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
