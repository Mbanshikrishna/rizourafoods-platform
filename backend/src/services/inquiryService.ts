import type { InquiryType } from "@prisma/client";
import { inquiryRepository } from "../repositories/inquiryRepository";
import { getPagination, getPaginationMeta } from "../utils/pagination";
import { toCsv } from "../utils/csv";

interface InquiryListInput {
  inquiryType?: InquiryType;
  page: number;
  pageSize: number;
}

interface InquiryCreateInput {
  name: string;
  email: string;
  company?: string;
  country?: string;
  phone?: string;
  inquiryType?: InquiryType;
  message: string;
}

export const inquiryService = {
  create: (input: InquiryCreateInput) =>
    inquiryRepository.create({
      name: input.name,
      email: input.email.toLowerCase(),
      company: input.company,
      country: input.country,
      phone: input.phone,
      inquiryType: input.inquiryType ?? "GENERAL",
      message: input.message,
    }),

  list: async (filters: InquiryListInput) => {
    const pagination = getPagination(filters);
    const [items, total] = await inquiryRepository.findMany(filters, pagination.skip, pagination.take);

    return {
      data: items,
      meta: getPaginationMeta(filters, total),
    };
  },

  exportCsv: async (filters: InquiryListInput) => {
    const inquiries = await inquiryRepository.findAll(filters);
    return toCsv(
      inquiries.map((inquiry) => ({
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        company: inquiry.company,
        country: inquiry.country,
        phone: inquiry.phone,
        inquiryType: inquiry.inquiryType,
        message: inquiry.message,
        createdAt: inquiry.createdAt.toISOString(),
      })),
    );
  },
};
