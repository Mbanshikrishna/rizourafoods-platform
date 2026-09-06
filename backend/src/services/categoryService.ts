import { categoryRepository } from "../repositories/categoryRepository";
import { toSlug } from "../utils/slug";
export const categoryService = {
  list: (includeInactive = false) => categoryRepository.list(includeInactive),
  create: (input: { code: string; name: string }) => categoryRepository.create({ code: toSlug(input.code).replace(/-/g, "_").toUpperCase(), name: input.name }),
  update: (id: string, input: { name?: string; isActive?: boolean }) => categoryRepository.update(id, input),
};
