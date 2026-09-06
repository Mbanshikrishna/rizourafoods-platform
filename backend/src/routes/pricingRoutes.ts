import { Router } from "express";
import { pricingController } from "../controllers/pricingController";
import { optionalCustomerAuth, requireAuth, requireRole } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { validateRequest } from "../middlewares/validateRequest";
import { createPriceSchema, priceListSchema, resolvePriceSchema, updatePriceSchema } from "../validations/pricingValidation";

const router = Router();
router.get("/products/:id/resolve", optionalCustomerAuth, validateRequest(resolvePriceSchema), asyncHandler(pricingController.resolve));
router.get("/products/:id", requireAuth, requireRole("ADMIN", "SALES", "VIEWER"), validateRequest(priceListSchema), asyncHandler(pricingController.list));
router.post("/products/:id", requireAuth, requireRole("ADMIN"), validateRequest(createPriceSchema), asyncHandler(pricingController.create));
router.patch("/:id", requireAuth, requireRole("ADMIN"), validateRequest(updatePriceSchema), asyncHandler(pricingController.update));
export default router;
