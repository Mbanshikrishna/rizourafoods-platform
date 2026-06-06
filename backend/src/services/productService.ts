import type { ProductStatus } from "@prisma/client";
import { productRepository } from "../repositories/productRepository";
import { ApiError } from "../utils/apiError";
import { getPagination, getPaginationMeta } from "../utils/pagination";
import { toSlug } from "../utils/slug";

interface ProductListInput {
  search?: string;
  category?: string;
  status?: ProductStatus;
  page: number;
  pageSize: number;
}

interface ProductWriteInput {
  name: string;
  slug?: string;
  description: string;
  category: string;
  imageUrl?: string;
  status?: ProductStatus;
}

export const productService = {
  list: async (filters: ProductListInput) => {
    const pagination = getPagination(filters);
    const [items, total] = await productRepository.findMany(filters, pagination.skip, pagination.take);

    return {
      data: items,
      meta: getPaginationMeta(filters, total),
    };
  },

  getById: async (id: string) => {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new ApiError(404, "Product not found", "PRODUCT_NOT_FOUND");
    }

    return product;
  },

  create: (input: ProductWriteInput) =>
    productRepository.create({
      name: input.name,
      slug: input.slug ? toSlug(input.slug) : toSlug(input.name),
      description: input.description,
      category: input.category,
      imageUrl: input.imageUrl,
      status: input.status ?? "DRAFT",
    }),

  update: async (id: string, input: Partial<ProductWriteInput>) => {
    await productService.getById(id);

    return productRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.slug !== undefined ? { slug: toSlug(input.slug!) } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    });
  },

  delete: async (id: string) => {
    await productService.getById(id);
    return productRepository.delete(id);
  },
};
