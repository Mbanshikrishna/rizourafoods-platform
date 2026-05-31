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
};
