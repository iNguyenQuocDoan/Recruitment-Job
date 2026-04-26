import { Response } from "express";

import { AccountRequest } from "../interfaces/request.interface";
import {
  STATUS_CODE,
  RESPONSE_CODE,
  RESPONSE_MESSAGE,
} from "../constants/http.constant";
import {
  submitCvService,
  listCompanyCvService,
  detailCompanyCvService,
  approveCompanyCvService,
  rejectCompanyCvService,
  deleteCompanyCvService,
  listUserCvService,
  deleteUserCvService,
} from "../services/cv.service";

const submitController = async (req: AccountRequest, res: Response) => {
  try {
    const result = await submitCvService(req);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during CV submit:", error);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

const listCompanyCvController = async (req: AccountRequest, res: Response) => {
  try {
    const result = await listCompanyCvService(req);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during company CV list:", error);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

const detailCompanyCvController = async (req: AccountRequest, res: Response) => {
  try {
    const result = await detailCompanyCvService(req, req.params.id);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during company CV detail:", error);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

const approveCompanyCvController = async (req: AccountRequest, res: Response) => {
  try {
    const result = await approveCompanyCvService(req, req.params.id);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during company CV approve:", error);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

const rejectCompanyCvController = async (req: AccountRequest, res: Response) => {
  try {
    const result = await rejectCompanyCvService(req, req.params.id);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during company CV reject:", error);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

const deleteCompanyCvController = async (req: AccountRequest, res: Response) => {
  try {
    const result = await deleteCompanyCvService(req, req.params.id);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during company CV delete:", error);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

const listUserCvController = async (req: AccountRequest, res: Response) => {
  try {
    const result = await listUserCvService(req);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during user CV list:", error);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

const deleteUserCvController = async (req: AccountRequest, res: Response) => {
  try {
    const result = await deleteUserCvService(req, req.params.id);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error during user CV delete:", error);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

export {
  submitController,
  listCompanyCvController,
  detailCompanyCvController,
  approveCompanyCvController,
  rejectCompanyCvController,
  deleteCompanyCvController,
  listUserCvController,
  deleteUserCvController,
};
