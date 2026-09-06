import { Router } from "express";
import { crmController } from "../controllers/crmController";
import { requireAuth, requireRole } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { validateRequest } from "../middlewares/validateRequest";
import { activityCreateSchema, activityListSchema, businessReviewSchema, crmAddressCreateSchema, crmAddressIdSchema, crmAddressUpdateSchema, crmBusinessSchema, crmContactCreateSchema, crmContactIdSchema, crmContactUpdateSchema, crmCustomerIdSchema, crmCustomerListSchema } from "../validations/crmValidation";

const router = Router();
const canRead = requireRole("ADMIN", "SALES", "VIEWER");
const canWrite = requireRole("ADMIN", "SALES");

router.use(requireAuth);
router.get("/customers", canRead, validateRequest(crmCustomerListSchema), asyncHandler(crmController.listCustomers));
router.get("/customers/:id", canRead, validateRequest(crmCustomerIdSchema), asyncHandler(crmController.getCustomer));
router.post("/customers/:id/approve", requireRole("ADMIN"), validateRequest(crmCustomerIdSchema), asyncHandler(crmController.approveCustomer));
router.post("/customers/:id/suspend", requireRole("ADMIN"), validateRequest(crmCustomerIdSchema), asyncHandler(crmController.suspendCustomer));
router.patch("/customers/:id/business", canWrite, validateRequest(crmBusinessSchema), asyncHandler(crmController.updateBusiness));
router.post("/customers/:id/business/review", requireRole("ADMIN"), validateRequest(businessReviewSchema), asyncHandler(crmController.reviewBusiness));
router.get("/customers/:id/contacts", canRead, validateRequest(crmCustomerIdSchema), asyncHandler(crmController.listContacts));
router.post("/customers/:id/contacts", canWrite, validateRequest(crmContactCreateSchema), asyncHandler(crmController.addContact));
router.patch("/customers/:id/contacts/:contactId", canWrite, validateRequest(crmContactUpdateSchema), asyncHandler(crmController.updateContact));
router.delete("/customers/:id/contacts/:contactId", canWrite, validateRequest(crmContactIdSchema), asyncHandler(crmController.deleteContact));
router.get("/customers/:id/addresses", canRead, validateRequest(crmCustomerIdSchema), asyncHandler(crmController.listAddresses));
router.post("/customers/:id/addresses", canWrite, validateRequest(crmAddressCreateSchema), asyncHandler(crmController.addAddress));
router.patch("/customers/:id/addresses/:addressId", canWrite, validateRequest(crmAddressUpdateSchema), asyncHandler(crmController.updateAddress));
router.delete("/customers/:id/addresses/:addressId", canWrite, validateRequest(crmAddressIdSchema), asyncHandler(crmController.deleteAddress));
router.get("/customers/:id/activities", canRead, validateRequest(activityListSchema), asyncHandler(crmController.listActivities));
router.post("/customers/:id/activities", canWrite, validateRequest(activityCreateSchema), asyncHandler(crmController.createActivity));

export default router;
