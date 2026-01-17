import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import companyRoutes from "./company.routes";
import cityRoutes from "./city.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/company", companyRoutes);
router.use("/city", cityRoutes);

export default router;
