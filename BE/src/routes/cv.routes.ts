import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import "../helper/cloudinary.helper";
import * as cvController from "../controllers/cv.controller";
import * as cvValidate from "../validates/cv.validate";
import { authenticate, authorize } from "../middleware/auth.middleware";

const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    resource_type: "raw",
    folder: "cvs",
  }),
});

const uploadPdf = multer({
  storage: pdfStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

const router = Router();

router.post(
  "/submit",
  authenticate,
  authorize("user"),
  uploadPdf.single("file"),
  cvValidate.submitPost,
  cvController.submitController,
);

export default router;
