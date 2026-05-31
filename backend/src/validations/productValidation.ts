import { ProductStatus } from "@prisma/client";
import { z } from "zod";
import { idParamSchema, paginationQuerySchema } from "./common";

export const listProductsSchema = z.object({
  query: paginationQuerySchema.extend({
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    status: z.nativeEnum(ProductStatus).optional(),
  }),
});

export const getProductSchema = z.object({
  params: idParamSchema,
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    slug: z.string().min(2).max(160).optional(),
    description: z.string().min(20).max(10000),
    category: z.string().min(2).max(80),
    imageUrl: z.string().url().optional(),
    status: z.nativeEnum(ProductStatus).optional(),
  }),
});

export const updateProductSchema = z.object({
  params: idParamSchema,
  body: z
    .object({
      name: z.string().min(2).max(120).optional(),
      slug: z.string().min(2).max(160).optional(),
      description: z.string().min(20).max(10000).optional(),
      category: z.string().min(2).max(80).optional(),
      imageUrl: z.string().url().nullable().optional(),
      status: z.nativeEnum(ProductStatus).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided for update",
    }),
});
