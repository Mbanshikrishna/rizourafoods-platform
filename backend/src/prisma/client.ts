import { PrismaClient } from "@prisma/client";
import { logger } from "../config/logger";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

prisma.$use(async (params, next) => {
  const start = Date.now();
  const result = await next(params);
  const durationMs = Date.now() - start;

  if (durationMs > 500) {
    logger.warn(
      {
        model: params.model,
        action: params.action,
        durationMs,
      },
      "Slow Prisma query detected",
    );
  }

  return result;
});
