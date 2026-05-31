import type { InquiryType, Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";

export interface InquiryListFilters {
  inquiryType?: InquiryType;
  page: number;
  pageSize: number;
}

const buildWhere = (filters: InquiryListFilters): Prisma.InquiryWhereInput => ({
  ...(filters.inquiryType ? { inquiryType: filters.inquiryType } : {}),
});

export const inquiryRepository = {
  create: (data: Prisma.InquiryCreateInput) =>
    prisma.inquiry.create({
      data,
    }),

  findMany: (filters: InquiryListFilters, skip: number, take: number) => {
    const where = buildWhere(filters);

    return Promise.all([
      prisma.inquiry.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.inquiry.count({ where }),
    ]);
  },

  findAll: (filters: InquiryListFilters) =>
    prisma.inquiry.findMany({
      where: buildWhere(filters),
      orderBy: {
        createdAt: "desc",
      },
    }),
};
