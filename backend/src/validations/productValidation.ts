import { ProductStatus } from "@prisma/client";
import { z } from "zod";
import { idParamSchema, paginationQuerySchema, slugParamSchema } from "./common";

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

export const getProductBySlugSchema = z.object({ params: slugParamSchema });

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    slug: z.string().min(2).max(160).optional(),
    description: z.string().min(20).max(10000),
    category: z.string().min(2).max(80),
    imageUrl: z.string().url().optional(),
    shortDescription: z.string().max(500).optional(), subcategory: z.string().max(80).optional(), origin: z.string().max(160).optional(), ingredients: z.string().max(1000).optional(), unit: z.string().max(20).optional(), packSizes: z.array(z.string().min(1).max(80)).max(20).optional(), moq: z.coerce.number().positive().optional(), availability: z.string().max(120).optional(), leadTimeDays: z.coerce.number().int().positive().max(365).optional(), b2bEligible: z.boolean().optional(), badges: z.array(z.string().min(1).max(40)).max(10).optional(), specifications: z.string().max(5000).optional(), storageInstructions: z.string().max(2000).optional(), usage: z.string().max(2000).optional(),
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
      shortDescription: z.string().max(500).nullable().optional(), subcategory: z.string().max(80).nullable().optional(), origin: z.string().max(160).nullable().optional(), ingredients: z.string().max(1000).nullable().optional(), unit: z.string().max(20).nullable().optional(), packSizes: z.array(z.string().min(1).max(80)).max(20).optional(), moq: z.coerce.number().positive().nullable().optional(), availability: z.string().max(120).nullable().optional(), leadTimeDays: z.coerce.number().int().positive().max(365).nullable().optional(), b2bEligible: z.boolean().optional(), badges: z.array(z.string().min(1).max(40)).max(10).optional(), specifications: z.string().max(5000).nullable().optional(), storageInstructions: z.string().max(2000).nullable().optional(), usage: z.string().max(2000).nullable().optional(),
      status: z.nativeEnum(ProductStatus).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided for update",
    }),
});
