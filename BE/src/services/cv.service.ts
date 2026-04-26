import Cv from "../models/cv.model";
import Job from "../models/jobs.model";
import { IAccountUser } from "../models/account-user.model";
import { AccountRequest, ServiceResponse } from "../interfaces/request.interface";
import {
  STATUS_CODE,
  RESPONSE_CODE,
  RESPONSE_MESSAGE,
} from "../constants/http.constant";

const submitCvService = async (
  accountRequest: AccountRequest,
): Promise<ServiceResponse<any>> => {
  if (!accountRequest.file) {
    return {
      statusCode: STATUS_CODE.BAD_REQUEST,
      body: {
        code: RESPONSE_CODE.ERROR,
        message: RESPONSE_MESSAGE.CV_FILE_REQUIRED,
      },
    };
  }

  const { jobId, fullName, email, phone } = accountRequest.body;

  const job = await Job.findById(jobId);
  if (!job) {
    return {
      statusCode: STATUS_CODE.NOT_FOUND,
      body: {
        code: RESPONSE_CODE.ERROR,
        message: RESPONSE_MESSAGE.CV_JOB_NOT_FOUND,
      },
    };
  }

  const user = accountRequest.account as IAccountUser;

  const newCv = new Cv({
    jobId,
    userId: user._id,
    fullName,
    email,
    phone,
    fileUrl: accountRequest.file.path,
  });

  await newCv.save();

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      message: RESPONSE_MESSAGE.CV_SUBMIT_SUCCESS,
    },
  };
};

export { submitCvService };
