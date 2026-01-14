import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import companyRoutes from "./company.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/company", companyRoutes);

export default router;
