import { z } from "zod";
import { idParamSchema, paginationQuerySchema } from "./common";
import { addressCreateSchema, addressTypes, businessTypes } from "./customerValidation";

const contactRoles = ["OWNER", "PROCUREMENT", "PURCHASE_MANAGER", "CHEF", "ACCOUNTS", "OPERATIONS", "OTHER"] as const;
const activityTypes = ["CALL", "WHATSAPP", "EMAIL", "MEETING", "SAMPLE_DISCUSSION", "PRICE_DISCUSSION", "FOLLOW_UP", "NOTE"] as const;
const customerStatuses = ["PENDING", "ACTIVE", "SUSPENDED", "REJECTED"] as const;
const nonEmpty = <T extends z.ZodRawShape>(shape: z.ZodObject<T>) => shape.refine((value) => Object.keys(value).length > 0, "At least one field is required");
const customerAndContactParams = z.object({ id: z.string().min(1), contactId: z.string().min(1) });
const customerAndAddressParams = z.object({ id: z.string().min(1), addressId: z.string().min(1) });

export const crmCustomerListSchema = z.object({ query: paginationQuerySchema.extend({ search: z.string().max(160).optional(), status: z.enum(customerStatuses).optional(), businessType: z.enum(businessTypes).optional(), city: z.string().max(100).optional(), state: z.string().max(100).optional(), createdFrom: z.coerce.date().optional(), createdTo: z.coerce.date().optional() }) });
export const crmCustomerIdSchema = z.object({ params: idParamSchema });
export const customerStatusSchema = z.object({ params: idParamSchema, body: z.object({ status: z.enum(customerStatuses) }) });
export const crmBusinessSchema = z.object({ params: idParamSchema, body: nonEmpty(z.object({ businessName: z.string().min(2).max(160).optional(), tradingName: z.string().max(160).nullable().optional(), businessType: z.enum(businessTypes).optional(), gstNumber: z.string().max(30).nullable().optional(), registrationNumber: z.string().max(60).nullable().optional(), website: z.string().url().max(300).nullable().optional(), phone: z.string().min(6).max(30).nullable().optional(), email: z.string().email().nullable().optional(), city: z.string().min(2).max(100).optional(), state: z.string().min(2).max(100).optional(), pincode: z.string().min(3).max(20).optional(), country: z.string().min(2).max(100).optional(), estimatedMonthlyVolume: z.string().max(120).nullable().optional(), currentSupplier: z.string().max(160).nullable().optional(), monthlyRiceConsumption: z.string().max(120).nullable().optional(), monthlyFoodProcurement: z.string().max(120).nullable().optional(), preferredPackSize: z.string().max(120).nullable().optional(), paymentTerms: z.string().max(160).nullable().optional(), deliveryRequirements: z.string().max(3000).nullable().optional(), deliveryFrequency: z.string().max(120).nullable().optional(), categoriesOfInterest: z.array(z.string().min(1).max(100)).max(30).optional() })) });
export const businessReviewSchema = z.object({ params: idParamSchema, body: z.object({ status: z.enum(["APPROVED", "REJECTED"] as const) }) });

const contactBody = z.object({ name: z.string().min(2).max(120), designation: z.string().max(100).optional(), role: z.enum(contactRoles).default("OTHER"), phone: z.string().min(6).max(30).optional(), email: z.string().email().optional(), isPrimary: z.boolean().optional() });
export const contactCreateSchema = z.object({ body: contactBody });
export const contactUpdateSchema = z.object({ params: idParamSchema, body: nonEmpty(contactBody.partial()) });
export const contactIdSchema = z.object({ params: idParamSchema });
export const crmContactCreateSchema = z.object({ params: idParamSchema, body: contactBody });
export const crmContactUpdateSchema = z.object({ params: customerAndContactParams, body: nonEmpty(contactBody.partial()) });
export const crmContactIdSchema = z.object({ params: customerAndContactParams });

export const crmAddressCreateSchema = z.object({ params: idParamSchema, body: addressCreateSchema.shape.body.extend({ type: z.enum(addressTypes).default("DELIVERY") }) });
export const crmAddressUpdateSchema = z.object({ params: customerAndAddressParams, body: nonEmpty(addressCreateSchema.shape.body.partial()) });
export const crmAddressIdSchema = z.object({ params: customerAndAddressParams });
export const activityCreateSchema = z.object({ params: idParamSchema, body: z.object({ contactId: z.string().min(1).optional(), type: z.enum(activityTypes), subject: z.string().min(2).max(200), details: z.string().max(5000).optional() }) });
export const activityListSchema = z.object({ params: idParamSchema, query: paginationQuerySchema });
