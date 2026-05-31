import type { Request, Response } from "express";
import { healthService } from "../services/healthService";

export const healthController = {
  health: (_req: Request, res: Response) => {
    res.status(200).json(healthService.liveness());
  },

  ready: async (_req: Request, res: Response) => {
    const readiness = await healthService.readiness();
    res.status(200).json(readiness);
  },
};
