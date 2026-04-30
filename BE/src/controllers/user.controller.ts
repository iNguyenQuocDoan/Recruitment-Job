import { Request, Response } from "express";

import { AccountRequest } from "../interfaces/request.interface";
import {
  STATUS_CODE,
  RESPONSE_CODE,
  RESPONSE_MESSAGE,
} from "../constants/http.constant";
import {
  loginUserService,
  registerUserService,
  updateUserProfileService,
} from "../services/user.service";
import { authCookieOptions } from "../helper/cookie.helper";

const registerController = async (req: Request, res: Response) => {
  try {
    const result = await registerUserService(req.body);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

const loginController = async (req: Request, res: Response) => {
  try {
    const result = await loginUserService(req.body);

    if (result.token) {
      res.cookie("token", result.token, authCookieOptions);
    }

    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during user login:", error);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

const updateProfileController = async (req: AccountRequest, res: Response) => {
  const result = await updateUserProfileService(req);
  return res.status(result.statusCode).json(result.body);
};
export { registerController, loginController, updateProfileController };
