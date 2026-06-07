import type { BlogStatus } from "@prisma/client";
import { blogRepository } from "../repositories/blogRepository";
import { ApiError } from "../utils/apiError";
import { getPagination, getPaginationMeta } from "../utils/pagination";
import { toSlug } from "../utils/slug";

interface BlogListInput {
  search?: string;
  status?: BlogStatus;
  page: number;
  pageSize: number;
}

interface BlogWriteInput {
  title: string;
  slug?: string;
  content: string;
  featuredImage?: string;
  status?: BlogStatus;
}

export const blogService = {
  list: async (filters: BlogListInput) => {
    const pagination = getPagination(filters);
    const [items, total] = await blogRepository.findMany(filters, pagination.skip, pagination.take);

    return {
      data: items,
      meta: getPaginationMeta(filters, total),
    };
  },

  getBySlug: async (slug: string) => {
    const blog = await blogRepository.findBySlug(slug);

    if (!blog) {
      throw new ApiError(404, "Blog entry not found", "BLOG_NOT_FOUND");
    }

    return blog;
  },

  getById: async (id: string) => {
    const blog = await blogRepository.findById(id);

    if (!blog) {
      throw new ApiError(404, "Blog entry not found", "BLOG_NOT_FOUND");
    }

    return blog;
  },

  create: (input: BlogWriteInput) =>
    blogRepository.create({
      title: input.title,
      slug: input.slug ? toSlug(input.slug) : toSlug(input.title),
      content: input.content,
      featuredImage: input.featuredImage,
      status: input.status ?? "DRAFT",
    }),

  update: async (id: string, input: Partial<BlogWriteInput>) => {
    await blogService.getById(id);

    return blogRepository.update(id, {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.slug !== undefined ? { slug: toSlug(input.slug!) } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.featuredImage !== undefined ? { featuredImage: input.featuredImage } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    });
  },

  delete: async (id: string) => {
    await blogService.getById(id);
    return blogRepository.delete(id);
  },
};
