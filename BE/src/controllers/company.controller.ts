import { Request, Response } from "express";
import dotenv from "dotenv";

import { AccountRequest } from "../interfaces/request.interface";
import {
  createJobService,
  listCompanyJobService,
  loginCompanyService,
  registerCompanyService,
  updateCompanyProfileService,
} from "../services/company.service";

dotenv.config();

const registerPostController = async (req: Request, res: Response) => {
  try {
    const result = await registerCompanyService(req.body);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginPostController = async (req: Request, res: Response) => {
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
      .json({ code: "error", message: "Internal server error" });
  }
};

const profilePatchController = async (req: AccountRequest, res: Response) => {
  const result = await updateCompanyProfileService(req);
  return res.status(result.statusCode).json(result.body);
};

const createJobPost = async (req: AccountRequest, res: Response) => {
  try {
    const result = await createJobService(req);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during job creation:", error);
    return res
      .status(500)
      .json({ code: "error", message: "Internal server error" });
  }
};

const listJob = async (req: AccountRequest, res: Response) => {
  try {
    const result = await listCompanyJobService(req);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during job list:", error);
    return res
      .status(500)
      .json({ code: "error", message: "Internal server error" });
  }
};

export {
  registerPostController,
  loginPostController,
  profilePatchController,
  createJobPost,
  listJob,
};
