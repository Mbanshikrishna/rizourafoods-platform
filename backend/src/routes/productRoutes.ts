import { Router } from "express";
import { productController } from "../controllers/productController";
import { requireAuth, requireRole } from "../middlewares/auth";
import { optionalCustomerAuth } from "../middlewares/auth";
import { pricingController } from "../controllers/pricingController";
import { validateRequest } from "../middlewares/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createProductSchema,
  getProductSchema,
  getProductBySlugSchema,
  listProductsSchema,
  updateProductSchema,
} from "../validations/productValidation";

const router = Router();

router.get("/", validateRequest(listProductsSchema), asyncHandler(productController.list));
router.get("/admin/catalog", requireAuth, requireRole("ADMIN", "SALES", "VIEWER"), validateRequest(listProductsSchema), asyncHandler(productController.listInternal));
router.get("/slug/:slug", validateRequest(getProductBySlugSchema), asyncHandler(productController.getBySlug));
router.get("/:id/prices", optionalCustomerAuth, validateRequest(getProductSchema), asyncHandler(pricingController.resolve));
router.get("/:id", validateRequest(getProductSchema), asyncHandler(productController.getById));
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "EDITOR"),
  validateRequest(createProductSchema),
  asyncHandler(productController.create),
);
router.put(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "EDITOR"),
  validateRequest(updateProductSchema),
  asyncHandler(productController.update),
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(getProductSchema),
  asyncHandler(productController.delete),
);

export default router;
