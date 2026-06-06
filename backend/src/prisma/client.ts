import { PrismaClient } from "@prisma/client";
import { logger } from "../config/logger";

const basePrisma = new PrismaClient({
  log: ["warn", "error"],
});

const withSlowQueryLogging = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const start = Date.now();
        const result = await query(args);
        const durationMs = Date.now() - start;

        if (durationMs > 500) {
          logger.warn(
            { model, action: operation, durationMs },
            "Slow Prisma query detected",
          );
        }

        return result;
      },
    },
  },
});

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: typeof withSlowQueryLogging;
};

export const prisma = globalForPrisma.prisma ?? withSlowQueryLogging;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
