import { prisma } from "../prisma/client";

export const refreshTokenRepository = {
  create: (input: { tokenHash: string; userId: string; expiresAt: Date }) =>
    prisma.refreshToken.create({
      data: input,
    }),

  findActiveByHash: (tokenHash: string) =>
    prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    }),

  /** Find a token record by hash regardless of revocation status (for reuse detection). */
  findByHash: (tokenHash: string) =>
    prisma.refreshToken.findFirst({
      where: { tokenHash },
      include: { user: true },
    }),

  revokeByHash: (tokenHash: string) =>
    prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    }),

  /** Revoke all active tokens for a user (token family invalidation). */
  revokeAllByUserId: (userId: string) =>
    prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    }),
};
