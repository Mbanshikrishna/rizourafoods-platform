import type { Request, Response } from "express";
import { blogService } from "../services/blogService";

export const blogController = {
  list: async (_req: Request, res: Response) => {
    const result = await blogService.list(res.locals.validatedQuery as never);
    res.status(200).json(result);
  },

  getBySlug: async (req: Request, res: Response) => {
    const result = await blogService.getBySlug(req.params.slug as string);
    res.status(200).json({ data: result });
  },

  create: async (req: Request, res: Response) => {
    const result = await blogService.create(req.body);
    res.status(201).json({ data: result });
  },

  update: async (req: Request, res: Response) => {
    const result = await blogService.update(req.params.id as string, req.body);
    res.status(200).json({ data: result });
  },

  delete: async (req: Request, res: Response) => {
    await blogService.delete(req.params.id as string);
    res.status(204).send();
  },
};
