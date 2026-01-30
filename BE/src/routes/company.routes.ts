import { Router } from "express";
import multer from "multer";

import * as companyController from "../controllers/company.controller";
import * as companyValidate from "../validates/company.validate";
import * as authMiddleware from "../middleware/auth.middleware";

import { storage } from "../helper/cloudinary.helper";

const upload = multer({ storage });

const router = Router();

router.post(
  "/register",
  companyValidate.registerPost,
  companyController.registerPostController,
);

router.post(
  "/login",
  companyValidate.loginPost,
  companyController.loginPostController,
);

router.patch(
  "/profile",
  authMiddleware.verifyTokenCompany,
  upload.single("logo"),
  companyValidate.profilePatch,
  companyController.profilePatchController,
);

router.patch(
  "/job/create",
  authMiddleware.verifyTokenCompany,
  upload.array("images", 8),
  companyController.createJobPost,
);

export default router;
