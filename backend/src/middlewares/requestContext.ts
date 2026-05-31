import type { NextFunction, Request, Response } from "express";

export const attachRequestContext = (req: Request, _res: Response, next: NextFunction) => {
  req.requestId = typeof req.id === "string" ? req.id : undefined;
  next();
};
