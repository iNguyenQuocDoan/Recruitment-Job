import { Response } from "express";

import { AccountRequest } from "../interfaces/request.interface";
import {
  STATUS_CODE,
  RESPONSE_CODE,
  RESPONSE_MESSAGE,
} from "../constants/http.constant";
import { submitCvService } from "../services/cv.service";

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

export { submitController };
