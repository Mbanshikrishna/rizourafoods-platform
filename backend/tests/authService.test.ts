import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/repositories/adminUserRepository", () => ({
  adminUserRepository: {
    findByEmail: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../src/repositories/refreshTokenRepository", () => ({
  refreshTokenRepository: {
    create: vi.fn(),
    findActiveByHash: vi.fn(),
    findByHash: vi.fn(),
    revokeByHash: vi.fn(),
    revokeAllByUserId: vi.fn(),
  },
}));

vi.mock("../src/utils/password", () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
}));

import { authService } from "../src/services/authService";
import { adminUserRepository } from "../src/repositories/adminUserRepository";
import { hashPassword } from "../src/utils/password";

const defaultAdmin = {
  id: "admin-1",
  name: "Test Admin",
  email: "admin@example.com",
  passwordHash: "hashed-password",
  role: "ADMIN" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("authService.seedDefaultAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates the configured ADMIN when the explicit seed finds none", async () => {
    vi.mocked(adminUserRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(hashPassword).mockResolvedValue("hashed-password");
    vi.mocked(adminUserRepository.create).mockResolvedValue(defaultAdmin);

    await expect(authService.seedDefaultAdmin()).resolves.toEqual(defaultAdmin);

    expect(adminUserRepository.create).toHaveBeenCalledWith({
      name: "Test Admin",
      email: "admin@example.com",
      passwordHash: "hashed-password",
      role: "ADMIN",
    });
  });

  it("is idempotent and preserves an existing configured ADMIN", async () => {
    vi.mocked(adminUserRepository.findByEmail)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(defaultAdmin);
    vi.mocked(hashPassword).mockResolvedValue("hashed-password");
    vi.mocked(adminUserRepository.create).mockResolvedValue(defaultAdmin);

    await authService.seedDefaultAdmin();
    await expect(authService.seedDefaultAdmin()).resolves.toEqual(defaultAdmin);

    expect(adminUserRepository.create).toHaveBeenCalledTimes(1);
    expect(hashPassword).toHaveBeenCalledTimes(1);
  });
});
