import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/prisma/client", () => ({
  prisma: {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    product: { upsert: vi.fn() },
    productCategory: { upsert: vi.fn() },
    productPrice: { findFirst: vi.fn(), create: vi.fn() },
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
    vi.mocked(prisma.productCategory.upsert).mockResolvedValue({ id: "category-seed", code: "RICE" } as never);
    vi.mocked(prisma.product.upsert).mockResolvedValue({ id: "product-seed" } as never);
    vi.mocked(prisma.productPrice.findFirst).mockResolvedValue({ id: "existing-price" } as never);
  });

  it("provisions the default admin through the explicit seed operation", async () => {
    await runSeed();

    expect(authService.seedDefaultAdmin).toHaveBeenCalledOnce();
    expect(prisma.$connect).toHaveBeenCalledOnce();
    expect(prisma.$disconnect).toHaveBeenCalledOnce();
    expect(prisma.productCategory.upsert).toHaveBeenCalledTimes(7);
    expect(prisma.product.upsert).toHaveBeenCalledTimes(14);
  });

  it("can be run repeatedly without adding a second provisioning path", async () => {
    await runSeed();
    await runSeed();

    expect(authService.seedDefaultAdmin).toHaveBeenCalledTimes(2);
    expect(prisma.product.upsert).toHaveBeenCalledTimes(28);
    expect(prisma.$disconnect).toHaveBeenCalledTimes(2);
  });

  it("disconnects Prisma when explicit provisioning fails", async () => {
    vi.mocked(authService.seedDefaultAdmin).mockRejectedValue(new Error("seed failed"));

    await expect(runSeed()).rejects.toThrow("seed failed");

    expect(prisma.$disconnect).toHaveBeenCalledOnce();
    expect(prisma.product.upsert).not.toHaveBeenCalled();
  });
});
