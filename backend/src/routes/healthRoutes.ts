import { Router } from "express";
import { healthController } from "../controllers/healthController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/health", healthController.health);
router.get("/ready", asyncHandler(healthController.ready));

export default router;
