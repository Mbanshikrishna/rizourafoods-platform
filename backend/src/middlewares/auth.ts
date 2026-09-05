import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "@prisma/client";
import type { CustomerStatus } from "@prisma/client";
import { env } from "../config/env";
import { ApiError } from "../utils/apiError";
import { prisma } from "../prisma/client";

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

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
    req.user = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (error) {
    next(error);
  }
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

interface CustomerAccessPayload { sub: string; email: string; kind: "customer"; status: CustomerStatus }

export const optionalCustomerAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) return next();
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as CustomerAccessPayload;
    if (payload.kind !== "customer") throw new Error("Invalid customer token");
    const customer = await prisma.customer.findUnique({
      where: { id: payload.sub },
      select: { email: true, status: true },
    });
    if (!customer || customer.status === "SUSPENDED" || customer.status === "REJECTED") {
      throw new Error("Customer account is not permitted");
    }
    req.customer = { customerId: payload.sub, email: customer.email, status: customer.status };
    next();
  } catch { next(new ApiError(401, "Customer session is invalid or expired", "CUSTOMER_AUTH_INVALID")); }
};

export const requireCustomer = (req: Request, res: Response, next: NextFunction) =>
  optionalCustomerAuth(req, res, (error?: unknown) => error ? next(error) : req.customer ? next() : next(new ApiError(401, "Customer authentication is required", "CUSTOMER_AUTH_REQUIRED")));
