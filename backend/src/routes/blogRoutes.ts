import { Router } from "express";
import { blogController } from "../controllers/blogController";
import { requireAuth, requireRole } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createBlogSchema,
  getBlogSchema,
  listBlogsSchema,
  updateBlogSchema,
} from "../validations/blogValidation";

const router = Router();

router.get("/", validateRequest(listBlogsSchema), asyncHandler(blogController.list));
router.get("/:slug", validateRequest(getBlogSchema), asyncHandler(blogController.getBySlug));
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "EDITOR"),
  validateRequest(createBlogSchema),
  asyncHandler(blogController.create),
);
router.put(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "EDITOR"),
  validateRequest(updateBlogSchema),
  asyncHandler(blogController.update),
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(updateBlogSchema.pick({ params: true })),
  asyncHandler(blogController.delete),
);

export default router;
