import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";

export const healthService = {
  liveness: () => ({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }),

  readiness: async () => {
    try {
      await prisma.$queryRaw(Prisma.sql`SELECT 1`);

      return {
        status: "ready" as const,
        timestamp: new Date().toISOString(),
        database: "ok",
      };
    } catch {
      return {
        status: "not_ready" as const,
        timestamp: new Date().toISOString(),
        database: "error",
      };
    }
  },
};
