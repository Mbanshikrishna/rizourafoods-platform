import { Router } from "express";
import { authController } from "../controllers/authController";
import { validateRequest } from "../middlewares/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { loginSchema, refreshSchema } from "../validations/authValidation";

const router = Router();

router.post("/login", validateRequest(loginSchema), asyncHandler(authController.login));
router.post("/refresh", validateRequest(refreshSchema), asyncHandler(authController.refresh));
router.post("/logout", asyncHandler(authController.logout));

export default router;
