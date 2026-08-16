import type { Request, Response } from "express";
import { productService } from "../services/productService";

export const productController = {
  list: async (_req: Request, res: Response) => {
    const result = await productService.list(res.locals.validatedQuery as never);
    res.status(200).json(result);
  },

  getById: async (req: Request, res: Response) => {
    const result = await productService.getById(req.params.id as string);
    res.status(200).json({ data: result });
  },

  create: async (req: Request, res: Response) => {
    const result = await productService.create(req.body);
    res.status(201).json({ data: result });
  },

  update: async (req: Request, res: Response) => {
    const result = await productService.update(req.params.id as string, req.body);
    res.status(200).json({ data: result });
  },

  delete: async (req: Request, res: Response) => {
    await productService.delete(req.params.id as string);
    res.status(204).send();
  },
};
