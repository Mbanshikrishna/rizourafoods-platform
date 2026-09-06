import { z } from "zod";
import { idParamSchema } from "./common";
export const listCategorySchema = z.object({ query: z.object({ includeInactive: z.coerce.boolean().optional() }) });
export const createCategorySchema = z.object({ body: z.object({ code: z.string().min(2).max(40).regex(/^[A-Za-z0-9 _-]+$/), name: z.string().min(2).max(80) }) });
export const updateCategorySchema = z.object({ params: idParamSchema, body: z.object({ name: z.string().min(2).max(80).optional(), isActive: z.boolean().optional() }).refine((value) => Object.keys(value).length > 0) });
