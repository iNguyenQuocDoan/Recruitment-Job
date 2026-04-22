import { Request, Response } from "express";
import dotenv from "dotenv";

import { AccountRequest } from "../interfaces/request.interface";
import { STATUS_CODE, RESPONSE_CODE } from "../constants/http.constant";
import {
  createJobService,
  deleteJobService,
  listCompanyJobService,
  loginCompanyService,
  registerCompanyService,
  updateCompanyProfileService,
} from "../services/company.service";

dotenv.config();

const registerController = async (req: Request, res: Response) => {
  try {
    const result = await registerCompanyService(req.body);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ code: RESPONSE_CODE.ERROR, message: "Internal server error" });
  }
};

const loginController = async (req: Request, res: Response) => {
  try {
    const result = await loginCompanyService(req.body);

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
    return res
      .status(500)
      .json({ code: RESPONSE_CODE.ERROR, message: "Internal server error" });
  }
};

const updateProfileController = async (req: AccountRequest, res: Response) => {
  const result = await updateCompanyProfileService(req);
  return res.status(result.statusCode).json(result.body);
};

const createJobController = async (req: AccountRequest, res: Response) => {
  try {
    const result = await createJobService(req);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during job creation:", error);
    return res
      .status(500)
      .json({ code: RESPONSE_CODE.ERROR, message: "Internal server error" });
  }
};

const deleteJobController = async (req: AccountRequest, res: Response) => {
  try {
    const result = await deleteJobService(req, req.params.id);

    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    return res
      .status(500)
      .json({ code: RESPONSE_CODE.ERROR, message: "Internal server error" });
  }
};

const listJobController = async (req: AccountRequest, res: Response) => {
  try {
    const result = await listCompanyJobService(req);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during job list:", error);
    return res
      .status(500)
      .json({ code: RESPONSE_CODE.ERROR, message: "Internal server error" });
  }
};

export {
  registerController,
  loginController,
  updateProfileController,
  createJobController,
  listJobController,
  deleteJobController,
};
