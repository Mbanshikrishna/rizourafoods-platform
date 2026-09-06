import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./prisma/client";

export const startServer = async () => {
  await prisma.$connect();

  const server = app.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        environment: env.NODE_ENV,
      },
      "Rizoura Foods backend started",
    );
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutdown signal received");
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
};

if (require.main === module) {
  void startServer().catch(async (error) => {
    logger.error({ err: error }, "Failed to start server");
    await prisma.$disconnect();
    process.exit(1);
  });
}
