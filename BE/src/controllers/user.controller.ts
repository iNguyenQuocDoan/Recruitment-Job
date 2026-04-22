import { Request, Response } from "express";
import dotenv from "dotenv";

import { AccountRequest } from "../interfaces/request.interface";
import {
  loginUserService,
  registerUserService,
  updateUserProfileService,
} from "../services/user.service";

dotenv.config();

const registerController = async (req: Request, res: Response) => {
  try {
    const result = await registerUserService(req.body);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginController = async (req: Request, res: Response) => {
  try {
    const result = await loginUserService(req.body);

    if (result.token) {
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      });
    }

    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during user login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfileController = async (req: AccountRequest, res: Response) => {
  const result = await updateUserProfileService(req);
  return res.status(result.statusCode).json(result.body);
};
export { registerController, loginController, updateProfileController };
