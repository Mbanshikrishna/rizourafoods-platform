import { BlogStatus } from "@prisma/client";
import { z } from "zod";
import { idParamSchema, paginationQuerySchema, slugParamSchema } from "./common";

export const listBlogsSchema = z.object({
  query: paginationQuerySchema.extend({
    search: z.string().trim().optional(),
    status: z.nativeEnum(BlogStatus).optional(),
  }),
});

export const getBlogSchema = z.object({
  params: slugParamSchema,
});

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(160),
    slug: z.string().min(2).max(180).optional(),
    content: z.string().min(40),
    featuredImage: z.string().url().optional(),
    status: z.nativeEnum(BlogStatus).optional(),
  }),
});

export const updateBlogSchema = z.object({
  params: idParamSchema,
  body: z
    .object({
      title: z.string().min(2).max(160).optional(),
      slug: z.string().min(2).max(180).optional(),
      content: z.string().min(40).optional(),
      featuredImage: z.string().url().nullable().optional(),
      status: z.nativeEnum(BlogStatus).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided for update",
    }),
});
