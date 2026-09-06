import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";
export const categoryRepository = {
  list: (includeInactive = false) => prisma.productCategory.findMany({ where: includeInactive ? {} : { isActive: true }, orderBy: { name: "asc" } }),
  create: (data: Prisma.ProductCategoryCreateInput) => prisma.productCategory.create({ data }),
  update: (id: string, data: Prisma.ProductCategoryUpdateInput) => prisma.productCategory.update({ where: { id }, data }),
};
