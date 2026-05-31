import { prisma } from "../prisma/client";

export const healthService = {
  liveness: () => ({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }),

  readiness: async () => {
    await prisma.$queryRawUnsafe("SELECT 1");

    return {
      status: "ready",
      timestamp: new Date().toISOString(),
      database: "ok",
    };
  },
};
