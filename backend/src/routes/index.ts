import { Router } from "express";
import authRoutes from "./authRoutes";
import blogRoutes from "./blogRoutes";
import inquiryRoutes from "./inquiryRoutes";
import productRoutes from "./productRoutes";
import { customerAuthRoutes, customerMeRoutes } from "./customerRoutes";
import { distributor, exportsRouter, orders, quotes, samples } from "./b2bRoutes";
import crmRoutes from "./crmRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/customer-auth", customerAuthRoutes);
router.use("/me", customerMeRoutes);
router.use("/crm", crmRoutes);
router.use("/quotes", quotes);
router.use("/samples", samples);
router.use("/orders", orders);
router.use("/distributors", distributor);
router.use("/export-inquiries", exportsRouter);
router.use("/products", productRoutes);
router.use("/blogs", blogRoutes);
router.use("/inquiries", inquiryRoutes);

export default router;
