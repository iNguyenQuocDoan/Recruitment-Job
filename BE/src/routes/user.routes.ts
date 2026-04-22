import { Router } from "express";

import * as userController from "../controllers/user.controller";
import * as userValidate from "../validates/user.validate";
import multer from "multer";

import { storage } from "../helper/cloudinary.helper";
import { authenticate, authorize } from "../middleware/auth.middleware";

const upload = multer({ storage: storage });

const router = Router();

router.post(
  "/register",
  userValidate.registerPost,
  userController.registerController
);

router.post(
  "/login",
  userValidate.loginPost,
  userController.loginController
);

router.patch(
  "/profile",
  authenticate,
  authorize("user"),
  upload.single("avatar"),
  userValidate.profilePatch,
  userController.updateProfileController
);

export default router;
