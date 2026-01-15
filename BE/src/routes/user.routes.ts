import { Router } from "express";

import * as userController from "../controllers/user.controller";
import * as userValidate from "../validates/user.validate";
import multer from "multer";

import { storage } from "../helper/cloudinary.helper";
import * as authMiddleware from "../middleware/auth.middleware";

const upload = multer({ storage: storage });

const router = Router();

router.post(
  "/register",
  userValidate.registerPost,
  userController.registerPostController
);

router.post(
  "/login",
  userValidate.loginPost,
  userController.loginPostController
);

router.patch(
  "/profile",
  authMiddleware.verifyTokenUser,
  upload.single("avatar"),
  userValidate.profilePatch,
  userController.profilePatchController
);

export default router;
