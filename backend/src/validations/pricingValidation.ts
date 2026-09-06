import { PriceTier } from "@prisma/client";
import { z } from "zod";
import { idParamSchema } from "./common";

const priceFields = z.object({ tier: z.nativeEnum(PriceTier), customerId: z.string().min(1).optional(), minQuantity: z.coerce.number().positive().max(100000000), maxQuantity: z.coerce.number().positive().max(100000000).nullable().optional(), unit: z.enum(["kg", "g", "bag", "box", "carton", "unit"]), unitPrice: z.coerce.number().positive().max(100000000), currency: z.string().trim().regex(/^[A-Z]{3}$/).default("INR"), validFrom: z.coerce.date().optional(), validUntil: z.coerce.date().nullable().optional(), active: z.boolean().optional() });
export const createPriceSchema = z.object({ params: idParamSchema, body: priceFields });
export const updatePriceSchema = z.object({ params: idParamSchema, body: priceFields.partial().refine((value) => Object.keys(value).length > 0) });
export const priceListSchema = z.object({ params: idParamSchema, query: z.object({ customerId: z.string().min(1).optional() }) });
export const resolvePriceSchema = z.object({ params: idParamSchema, query: z.object({ quantity: z.coerce.number().positive().default(1) }) });
