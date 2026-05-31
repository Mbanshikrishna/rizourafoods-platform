import { Router } from "express";
import { productController } from "../controllers/productController";
import { requireAuth, requireRole } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createProductSchema,
  getProductSchema,
  listProductsSchema,
  updateProductSchema,
} from "../validations/productValidation";

const router = Router();

router.get("/", validateRequest(listProductsSchema), asyncHandler(productController.list));
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
