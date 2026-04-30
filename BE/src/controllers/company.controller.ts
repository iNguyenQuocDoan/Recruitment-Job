import { Request, Response } from "express";

import { AccountRequest } from "../interfaces/request.interface";
import {
  STATUS_CODE,
  RESPONSE_CODE,
  RESPONSE_MESSAGE,
} from "../constants/http.constant";
import {
  createJobService,
  deleteJobService,
  detailJobService,
  editJobService,
  listCompanyJobService,
  loginCompanyService,
  registerCompanyService,
  updateCompanyProfileService,
} from "../services/company.service";
import { authCookieOptions } from "../helper/cookie.helper";

const registerController = async (req: Request, res: Response) => {
  try {
    const result = await registerCompanyService(req.body);
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
    const result = await loginCompanyService(req.body);

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
  const result = await updateCompanyProfileService(req);
  return res.status(result.statusCode).json(result.body);
};

const createJobController = async (req: AccountRequest, res: Response) => {
  try {
    const result = await createJobService(req);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during job creation:", error);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

const deleteJobController = async (req: AccountRequest, res: Response) => {
  try {
    const result = await deleteJobService(req, req.params.id);

    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

const listJobController = async (req: AccountRequest, res: Response) => {
  try {
    const result = await listCompanyJobService(req);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during job list:", error);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

const detailJobController = async (req: AccountRequest, res: Response) => {
  try {
    const result = await detailJobService(req, req.params.id);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

const editJobController = async (req: AccountRequest, res: Response) => {
  try {
    const result = await editJobService(req, req.params.id);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

export {
  registerController,
  loginController,
  updateProfileController,
  createJobController,
  listJobController,
  deleteJobController,
  detailJobController,
  editJobController,
};
