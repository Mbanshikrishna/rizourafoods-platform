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
    const csv = await inquiryService.exportCsv({
      ...(req.query as never),
      page: 1,
      pageSize: 10000,
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="rizoura-inquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
    );
    res.status(200).send(csv);
  },
};
