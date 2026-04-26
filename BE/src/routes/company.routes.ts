import { Router } from "express";
import multer from "multer";

import * as companyController from "../controllers/company.controller";
import * as cvController from "../controllers/cv.controller";

import * as companyValidate from "../validates/company.validate";
import * as cvValidate from "../validates/cv.validate";
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

router.get(
  "/cv/list",
  authenticate,
  authorize("company"),
  cvController.listCompanyCvController,
);

router.get(
  "/cv/detail/:id",
  authenticate,
  authorize("company"),
  cvController.detailCompanyCvController,
);

router.patch(
  "/cv/:id/approve",
  authenticate,
  authorize("company"),
  cvValidate.decisionPatch,
  cvController.approveCompanyCvController,
);

router.patch(
  "/cv/:id/reject",
  authenticate,
  authorize("company"),
  cvValidate.decisionPatch,
  cvController.rejectCompanyCvController,
);

router.delete(
  "/cv/:id",
  authenticate,
  authorize("company"),
  cvController.deleteCompanyCvController,
);

export default router;
