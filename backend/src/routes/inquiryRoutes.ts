import { Router } from "express";
import { inquiryController } from "../controllers/inquiryController";
import { requireAuth, requireRole } from "../middlewares/auth";
import { publicFormLimiter } from "../middlewares/rateLimiter";
import { validateRequest } from "../middlewares/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { createInquirySchema, listInquirySchema } from "../validations/inquiryValidation";

const router = Router();

router.post("/", publicFormLimiter, validateRequest(createInquirySchema), asyncHandler(inquiryController.create));
router.get(
  "/",
  requireAuth,
  requireRole("ADMIN", "EDITOR", "VIEWER"),
  validateRequest(listInquirySchema),
  asyncHandler(inquiryController.list),
);
router.get(
  "/export",
  requireAuth,
  requireRole("ADMIN", "EDITOR"),
  validateRequest(listInquirySchema),
  asyncHandler(inquiryController.exportCsv),
);

export default router;
