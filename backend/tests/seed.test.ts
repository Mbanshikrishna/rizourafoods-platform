import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/prisma/client", () => ({
  prisma: {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    product: { upsert: vi.fn() },
  },
}));

vi.mock("../src/services/authService", () => ({
  authService: { seedDefaultAdmin: vi.fn() },
}));

vi.mock("../src/config/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));

import { prisma } from "../src/prisma/client";
import { authService } from "../src/services/authService";
import { runSeed } from "../src/prisma/seed";

describe("runSeed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.seedDefaultAdmin).mockResolvedValue({ email: "admin@example.com" } as never);
    vi.mocked(prisma.product.upsert).mockResolvedValue({} as never);
  });

  it("provisions the default admin through the explicit seed operation", async () => {
    await runSeed();

    expect(authService.seedDefaultAdmin).toHaveBeenCalledOnce();
    expect(prisma.$connect).toHaveBeenCalledOnce();
    expect(prisma.$disconnect).toHaveBeenCalledOnce();
    expect(prisma.product.upsert).toHaveBeenCalledTimes(11);
  });
});
