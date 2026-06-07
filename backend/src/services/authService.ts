import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import ms from "ms";
import type { UserRole } from "@prisma/client";
import { env } from "../config/env";
import { adminUserRepository } from "../repositories/adminUserRepository";
import { refreshTokenRepository } from "../repositories/refreshTokenRepository";
import { ApiError } from "../utils/apiError";
import { hashPassword, verifyPassword } from "../utils/password";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AccessPayload {
  sub: string;
  email: string;
  role: UserRole;
}

const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

const signAccessToken = (payload: AccessPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_TTL as ms.StringValue,
  });

const signRefreshToken = (payload: AccessPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_TTL as ms.StringValue,
  });

const persistRefreshToken = async (userId: string, refreshToken: string) => {
  const tokenHash = hashToken(refreshToken);
  const ttlMs = ms(env.JWT_REFRESH_TTL as ms.StringValue);

  if (typeof ttlMs !== "number") {
    throw new ApiError(500, "Invalid refresh token TTL configuration", "AUTH_CONFIG_INVALID");
  }

  await refreshTokenRepository.create({
    tokenHash,
    userId,
    expiresAt: new Date(Date.now() + ttlMs),
  });
};

const issueTokens = async (payload: AccessPayload): Promise<AuthTokens> => {
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await persistRefreshToken(payload.sub, refreshToken);

  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  login: async (email: string, password: string) => {
    const user = await adminUserRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    return issueTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  },

  refresh: async (refreshToken: string) => {
    const tokenHash = hashToken(refreshToken);
    const record = await refreshTokenRepository.findActiveByHash(tokenHash);

    if (!record) {
      // Token reuse detection: if the token exists but is already revoked,
      // an attacker may have stolen it. Revoke all tokens for the user.
      const revokedRecord = await refreshTokenRepository.findByHash(tokenHash);
      if (revokedRecord) {
        await refreshTokenRepository.revokeAllByUserId(revokedRecord.userId);
      }
      throw new ApiError(401, "Refresh token is invalid or revoked", "REFRESH_TOKEN_INVALID");
    }

    try {
      jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    } catch {
      await refreshTokenRepository.revokeByHash(tokenHash);
      throw new ApiError(401, "Refresh token is expired", "REFRESH_TOKEN_EXPIRED");
    }

    await refreshTokenRepository.revokeByHash(tokenHash);

    return issueTokens({
      sub: record.user.id,
      email: record.user.email,
      role: record.user.role,
    });
  },

  logout: async (refreshToken: string) => {
    const tokenHash = hashToken(refreshToken);
    await refreshTokenRepository.revokeByHash(tokenHash);
  },

  seedDefaultAdmin: async () => {
    const existingAdmin = await adminUserRepository.findByEmail(env.DEFAULT_ADMIN_EMAIL);

    if (existingAdmin) {
      return existingAdmin;
    }

    const passwordHash = await hashPassword(env.DEFAULT_ADMIN_PASSWORD);
    return adminUserRepository.create({
      name: env.DEFAULT_ADMIN_NAME,
      email: env.DEFAULT_ADMIN_EMAIL,
      passwordHash,
      role: "ADMIN",
    });
  },
};
