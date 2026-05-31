import { Router } from "express";
import authRoutes from "./authRoutes";
import blogRoutes from "./blogRoutes";
import inquiryRoutes from "./inquiryRoutes";
import productRoutes from "./productRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/blogs", blogRoutes);
router.use("/inquiries", inquiryRoutes);

export default router;
