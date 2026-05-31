import { InquiryType } from "@prisma/client";
import { z } from "zod";
import { paginationQuerySchema } from "./common";

export const createInquirySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    company: z.string().max(120).optional(),
    country: z.string().max(120).optional(),
    phone: z.string().max(30).optional(),
    inquiryType: z.nativeEnum(InquiryType).optional(),
    message: z.string().min(20).max(5000),
  }),
});

export const listInquirySchema = z.object({
  query: paginationQuerySchema.extend({
    inquiryType: z.nativeEnum(InquiryType).optional(),
  }),
});
