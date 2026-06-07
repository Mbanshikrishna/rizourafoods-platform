import type { Request, Response } from "express";
import { inquiryService } from "../services/inquiryService";

export const inquiryController = {
  create: async (req: Request, res: Response) => {
    const result = await inquiryService.create(req.body);
    res.status(201).json({ data: result });
  },

  list: async (req: Request, res: Response) => {
    const result = await inquiryService.list(req.query as never);
    res.status(200).json(result);
  },

  exportCsv: async (req: Request, res: Response) => {
    const query = req.query as Record<string, unknown>;
    const csv = await inquiryService.exportCsv({
      ...query,
      page: 1,
      pageSize: 10000,
    } as never);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="rizoura-inquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
    );
    res.status(200).send(csv);
  },
};
