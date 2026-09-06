import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const close = vi.fn();

vi.mock("../src/app", () => ({
  app: {
    listen: vi.fn((_port: number, callback: () => void) => {
      callback();
      return { close };
    }),
  },
}));

vi.mock("../src/config/env", () => ({
  env: { PORT: 3000, NODE_ENV: "test" },
}));

vi.mock("../src/config/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));

vi.mock("../src/prisma/client", () => ({
  prisma: { $connect: vi.fn(), $disconnect: vi.fn() },
}));

vi.mock("../src/services/authService", () => ({
  authService: { seedDefaultAdmin: vi.fn() },
}));

import { app } from "../src/app";
import { prisma } from "../src/prisma/client";
import { authService } from "../src/services/authService";
import { startServer } from "../src/server";

describe("server startup architecture", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("connects and starts Express without provisioning a default admin", async () => {
    await startServer();

    expect(prisma.$connect).toHaveBeenCalledOnce();
    expect(app.listen).toHaveBeenCalledWith(3000, expect.any(Function));
    expect(authService.seedDefaultAdmin).not.toHaveBeenCalled();
  });

  it("retains a source-level guard against startup admin provisioning", () => {
    const serverSource = readFileSync(resolve(__dirname, "../src/server.ts"), "utf8");

    expect(serverSource).not.toContain("seedDefaultAdmin");
    expect(serverSource).toContain("await prisma.$connect()");
    expect(serverSource).toContain("app.listen(env.PORT");
  });
});
