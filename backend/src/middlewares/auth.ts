import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "@prisma/client";
import { env } from "../config/env";
import { ApiError } from "../utils/apiError";

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

const extractBearerToken = (authorizationHeader?: string) => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authorizationHeader.slice(7);
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return next(new ApiError(401, "Authorization token is required", "AUTH_REQUIRED"));
  }

  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
  req.user = {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
  };

  next();
};

export const requireRole =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication is required", "AUTH_REQUIRED"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have access to this resource", "FORBIDDEN"));
    }

    next();
  };
