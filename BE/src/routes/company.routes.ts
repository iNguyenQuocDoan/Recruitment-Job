import { Router } from "express";
import multer from "multer";

import * as companyController from "../controllers/company.controller";

import * as companyValidate from "../validates/company.validate";
import { authenticate, authorize } from "../middleware/auth.middleware";

import { storage } from "../helper/cloudinary.helper";

const upload = multer({ storage });

const router = Router();

router.post(
  "/register",
  companyValidate.registerPost,
  companyController.registerController,
);

router.post(
  "/login",
  companyValidate.loginPost,
  companyController.loginController,
);

router.patch(
  "/profile",
  authenticate,
  authorize("company"),
  upload.single("logo"),
  companyValidate.profilePatch,
  companyController.updateProfileController,
);

router.patch(
  "/job/create",
  authenticate,
  authorize("company"),
  upload.array("images", 8),
  companyController.createJobController,
);

router.get(
  "/job/list",
  authenticate,
  authorize("company"),
  companyController.listJobController,
);

router.delete(
  "/job/delete/:id",
  authenticate,
  authorize("company"),
  companyController.deleteJobController,
);

router.get(
  "/job/detail/:id",
  authenticate,
  authorize("company"),
  companyController.detailJobController,
);

router.patch(
  "/job/edit/:id",
  authenticate,
  authorize("company"),
  upload.array("images", 8),
  companyController.editJobController,
);

export default router;
