import type { Request, Response } from "express";
import { productService } from "../services/productService";

export const productController = {
  list: async (req: Request, res: Response) => {
    const result = await productService.list(req.query as never);
    res.status(200).json(result);
  },

  getById: async (req: Request, res: Response) => {
    const result = await productService.getById(req.params.id);
    res.status(200).json({ data: result });
  },

  create: async (req: Request, res: Response) => {
    const result = await productService.create(req.body);
    res.status(201).json({ data: result });
  },

  update: async (req: Request, res: Response) => {
    const result = await productService.update(req.params.id, req.body);
    res.status(200).json({ data: result });
  },

  delete: async (req: Request, res: Response) => {
    await productService.delete(req.params.id);
    res.status(204).send();
  },
};
