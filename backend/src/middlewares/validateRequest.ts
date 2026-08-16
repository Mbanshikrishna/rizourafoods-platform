import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod";

export const validateRequest =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsed.body ?? req.body;
      // In Express 5, req.query is a getter. Preserve parsed query values on
      // response locals for controllers instead of assigning to req.query.
      res.locals.validatedQuery = parsed.query;
      req.params = parsed.params ?? req.params;

      next();
    } catch (error) {
      next(error);
    }
  };
