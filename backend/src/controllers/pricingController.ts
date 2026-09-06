import type { Request, Response } from "express";
import { pricingService } from "../services/pricingService";

export const pricingController = {
  list: async (req: Request, res: Response) => res.json({ data: await pricingService.list(req.params.id as string, res.locals.validatedQuery.customerId) }),
  create: async (req: Request, res: Response) => res.status(201).json({ data: await pricingService.create(req.params.id as string, req.body, req.user!.userId) }),
  update: async (req: Request, res: Response) => res.json({ data: await pricingService.update(req.params.id as string, req.body, req.user!.userId) }),
  resolve: async (req: Request, res: Response) => res.json({ data: await pricingService.resolve(req.params.id as string, res.locals.validatedQuery?.quantity ?? 1, req.customer?.customerId) }),
};
