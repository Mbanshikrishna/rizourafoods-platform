import type { Request, Response } from "express";
import { healthService } from "../services/healthService";

export const healthController = {
  health: (_req: Request, res: Response) => {
    res.status(200).json(healthService.liveness());
  },

  ready: async (_req: Request, res: Response) => {
    const readiness = await healthService.readiness();
    const statusCode = readiness.status === "ready" ? 200 : 503;
    res.status(statusCode).json(readiness);
  },
};
