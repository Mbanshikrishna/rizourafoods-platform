import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/apiError";
import { logger } from "../config/logger";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      issues: error.flatten(),
      requestId: req.requestId,
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
      details: error.details,
      requestId: req.requestId,
    });
  }

  if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
    return res.status(401).json({
      message: "Authentication token is invalid or expired",
      code: "AUTH_TOKEN_INVALID",
      requestId: req.requestId,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const isUniqueConstraint = error.code === "P2002";
    return res.status(isUniqueConstraint ? 409 : 400).json({
      message: isUniqueConstraint ? "A unique field already exists" : "Database request failed",
      code: error.code,
      requestId: req.requestId,
    });
  }

  logger.error(
    {
      err: error,
      requestId: req.requestId,
      path: req.originalUrl,
      method: req.method,
    },
    "Unhandled application error",
  );

  return res.status(500).json({
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
    requestId: req.requestId,
  });
};
