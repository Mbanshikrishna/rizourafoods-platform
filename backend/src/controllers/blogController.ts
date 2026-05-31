import type { Request, Response } from "express";
import { blogService } from "../services/blogService";

export const blogController = {
  list: async (req: Request, res: Response) => {
    const result = await blogService.list(req.query as never);
    res.status(200).json(result);
  },

  getBySlug: async (req: Request, res: Response) => {
    const result = await blogService.getBySlug(req.params.slug);
    res.status(200).json({ data: result });
  },

  create: async (req: Request, res: Response) => {
    const result = await blogService.create(req.body);
    res.status(201).json({ data: result });
  },

  update: async (req: Request, res: Response) => {
    const result = await blogService.update(req.params.id, req.body);
    res.status(200).json({ data: result });
  },

  delete: async (req: Request, res: Response) => {
    await blogService.delete(req.params.id);
    res.status(204).send();
  },
};
