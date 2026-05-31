import type { UserRole } from "@prisma/client";
import { prisma } from "../prisma/client";

export const adminUserRepository = {
  findByEmail: (email: string) =>
    prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    }),

  findById: (id: string) =>
    prisma.adminUser.findUnique({
      where: { id },
    }),

  create: (input: { name: string; email: string; passwordHash: string; role?: UserRole }) =>
    prisma.adminUser.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash: input.passwordHash,
        role: input.role,
      },
    }),
};
