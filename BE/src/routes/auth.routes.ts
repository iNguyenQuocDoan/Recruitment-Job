import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.get("/check", authController.checkController);

router.post("/logout", authController.logoutController);
export default router;
