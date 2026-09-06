import type { Prisma, ProductStatus } from "@prisma/client";
import { prisma } from "../prisma/client";

export interface ProductListFilters {
  search?: string;
  category?: string;
  status?: ProductStatus;
  page: number;
  pageSize: number;
}

const buildWhere = (filters: ProductListFilters): Prisma.ProductWhereInput => ({
  ...(filters.category ? { category: filters.category } : {}),
  ...(filters.status ? { status: filters.status } : {}),
  ...(filters.search
    ? {
        OR: [
          { name: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
          { slug: { contains: filters.search, mode: "insensitive" } },
          { sku: { contains: filters.search, mode: "insensitive" } },
        ],
      }
    : {}),
});

export const productRepository = {
  findMany: (filters: ProductListFilters, skip: number, take: number) => {
    const where = buildWhere(filters);

    return Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.count({ where }),
    ]);
  },

  findById: (id: string) =>
    prisma.product.findUnique({
      where: { id },
    }),

  findPublishedById: (id: string) => prisma.product.findFirst({ where: { id, status: "PUBLISHED" } }),

  findPublishedBySlug: (slug: string) => prisma.product.findFirst({ where: { slug, status: "PUBLISHED" } }),

  create: (data: Prisma.ProductUncheckedCreateInput) =>
    prisma.product.create({
      data,
    }),

  update: (id: string, data: Prisma.ProductUncheckedUpdateInput) =>
    prisma.product.update({
      where: { id },
      data,
    }),

  delete: (id: string) =>
    prisma.product.delete({
      where: { id },
    }),
};
