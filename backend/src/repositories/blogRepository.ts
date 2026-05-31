import type { BlogStatus, Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";

export interface BlogListFilters {
  search?: string;
  status?: BlogStatus;
  page: number;
  pageSize: number;
}

const buildWhere = (filters: BlogListFilters): Prisma.BlogWhereInput => ({
  ...(filters.status ? { status: filters.status } : {}),
  ...(filters.search
    ? {
        OR: [
          { title: { contains: filters.search, mode: "insensitive" } },
          { content: { contains: filters.search, mode: "insensitive" } },
          { slug: { contains: filters.search, mode: "insensitive" } },
        ],
      }
    : {}),
});

export const blogRepository = {
  findMany: (filters: BlogListFilters, skip: number, take: number) => {
    const where = buildWhere(filters);

    return Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.blog.count({ where }),
    ]);
  },

  findBySlug: (slug: string) =>
    prisma.blog.findUnique({
      where: { slug },
    }),

  findById: (id: string) =>
    prisma.blog.findUnique({
      where: { id },
    }),

  create: (data: Prisma.BlogCreateInput) =>
    prisma.blog.create({
      data,
    }),

  update: (id: string, data: Prisma.BlogUpdateInput) =>
    prisma.blog.update({
      where: { id },
      data,
    }),

  delete: (id: string) =>
    prisma.blog.delete({
      where: { id },
    }),
};
