import { Request, Response } from "express";

import {
  STATUS_CODE,
  RESPONSE_CODE,
  RESPONSE_MESSAGE,
} from "../constants/http.constant";
import {
  detailCompanyPublicService,
  detailJobPublicService,
  listCompanyPublicService,
  listJobService,
} from "../services/job.service";

const listJobController = async (req: Request, res: Response) => {
  try {
    const result = await listJobService(req.query as Record<string, any>);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

const detailJobController = async (req: Request, res: Response) => {
  try {
    const result = await detailJobPublicService(req.params.id);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

const listCompanyPublicController = async (req: Request, res: Response) => {
  try {
    const result = await listCompanyPublicService(req.query as Record<string, any>);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

const detailCompanyPublicController = async (req: Request, res: Response) => {
  try {
    const result = await detailCompanyPublicService(req.params.id);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

export {
  listJobController,
  detailJobController,
  listCompanyPublicController,
  detailCompanyPublicController,
};
