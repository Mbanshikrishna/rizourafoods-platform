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
  categoryId?: string;
  sku?: string;
  brand?: string;
  baseUnit?: string;
  packSize?: number;
  packUnit?: string;
  hsnCode?: string;
  imageUrl?: string;
  shortDescription?: string; subcategory?: string; origin?: string; ingredients?: string; unit?: string; packSizes?: string[]; moq?: number; availability?: string; leadTimeDays?: number; b2bEligible?: boolean; badges?: string[]; specifications?: string; storageInstructions?: string; usage?: string;
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

  getPublishedById: async (id: string) => {
    const product = await productRepository.findPublishedById(id);
    if (!product) throw new ApiError(404, "Product not found", "PRODUCT_NOT_FOUND");
    return product;
  },

  getBySlug: async (slug: string) => {
    const product = await productRepository.findPublishedBySlug(slug);
    if (!product) throw new ApiError(404, "Product not found", "PRODUCT_NOT_FOUND");
    return product;
  },

  create: (input: ProductWriteInput) =>
    productRepository.create({
      name: input.name,
      slug: input.slug ? toSlug(input.slug) : toSlug(input.name),
      description: input.description,
      category: input.category,
      categoryId: input.categoryId,
      sku: input.sku?.trim().toUpperCase(),
      brand: input.brand,
      baseUnit: input.baseUnit,
      packSize: input.packSize,
      packUnit: input.packUnit,
      hsnCode: input.hsnCode,
      imageUrl: input.imageUrl,
      shortDescription: input.shortDescription, subcategory: input.subcategory, origin: input.origin, ingredients: input.ingredients, unit: input.unit, packSizes: input.packSizes, moq: input.moq, availability: input.availability, leadTimeDays: input.leadTimeDays, b2bEligible: input.b2bEligible, badges: input.badges, specifications: input.specifications, storageInstructions: input.storageInstructions, usage: input.usage,
      status: input.status ?? "DRAFT",
    }),

  update: async (id: string, input: Partial<ProductWriteInput>) => {
    await productService.getById(id);

    return productRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.slug !== undefined ? { slug: toSlug(input.slug!) } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}), ...(input.sku !== undefined ? { sku: input.sku?.trim().toUpperCase() } : {}), ...(input.brand !== undefined ? { brand: input.brand } : {}), ...(input.baseUnit !== undefined ? { baseUnit: input.baseUnit } : {}), ...(input.packSize !== undefined ? { packSize: input.packSize } : {}), ...(input.packUnit !== undefined ? { packUnit: input.packUnit } : {}), ...(input.hsnCode !== undefined ? { hsnCode: input.hsnCode } : {}),
      ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
      ...(input.shortDescription !== undefined ? { shortDescription: input.shortDescription } : {}), ...(input.subcategory !== undefined ? { subcategory: input.subcategory } : {}), ...(input.origin !== undefined ? { origin: input.origin } : {}), ...(input.ingredients !== undefined ? { ingredients: input.ingredients } : {}), ...(input.unit !== undefined ? { unit: input.unit } : {}), ...(input.packSizes !== undefined ? { packSizes: input.packSizes } : {}), ...(input.moq !== undefined ? { moq: input.moq } : {}), ...(input.availability !== undefined ? { availability: input.availability } : {}), ...(input.leadTimeDays !== undefined ? { leadTimeDays: input.leadTimeDays } : {}), ...(input.b2bEligible !== undefined ? { b2bEligible: input.b2bEligible } : {}), ...(input.badges !== undefined ? { badges: input.badges } : {}), ...(input.specifications !== undefined ? { specifications: input.specifications } : {}), ...(input.storageInstructions !== undefined ? { storageInstructions: input.storageInstructions } : {}), ...(input.usage !== undefined ? { usage: input.usage } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    });
  },

  delete: async (id: string) => {
    await productService.getById(id);
    return productRepository.delete(id);
  },
};
