import type { Request, Response } from "express";
import { categoryService } from "../services/categoryService";
export const categoryController = {
  list: async (_req: Request, res: Response) => res.json({ data: await categoryService.list(Boolean(res.locals.validatedQuery.includeInactive)) }),
  create: async (req: Request, res: Response) => res.status(201).json({ data: await categoryService.create(req.body) }),
  update: async (req: Request, res: Response) => res.json({ data: await categoryService.update(req.params.id as string, req.body) }),
};
