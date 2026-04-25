import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import companyRoutes from "./company.routes";
import cityRoutes from "./city.routes";
import jobRoutes from "./job.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/company", companyRoutes);
router.use("/city", cityRoutes);
router.use("/job", jobRoutes);

export default router;
