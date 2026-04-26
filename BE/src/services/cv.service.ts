import Cv from "../models/cv.model";
import Job from "../models/jobs.model";
import { IAccountUser } from "../models/account-user.model";
import { IAccountCompany } from "../models/account-company.model";
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

/**
 * Load CV theo id, kiểm ownership: CV thuộc job của company hiện tại.
 * Trả về { cv, error } — error là ServiceResponse sẵn sàng trả về controller nếu có.
 */
const loadCvForCompany = async (
  cvId: string,
  company: IAccountCompany,
): Promise<{ cv: any; error?: ServiceResponse<any> }> => {
  const cv = await Cv.findOne({ _id: cvId, deletedAt: null }).populate({
    path: "jobId",
    select: "companyId title",
  });

  if (!cv) {
    return {
      cv: null,
      error: {
        statusCode: STATUS_CODE.NOT_FOUND,
        body: { code: RESPONSE_CODE.ERROR, message: RESPONSE_MESSAGE.CV_NOT_FOUND },
      },
    };
  }

  const job: any = cv.jobId;
  if (!job?.companyId?.equals(company._id)) {
    return {
      cv: null,
      error: {
        statusCode: STATUS_CODE.FORBIDDEN,
        body: { code: RESPONSE_CODE.FORBIDDEN, message: RESPONSE_MESSAGE.FORBIDDEN },
      },
    };
  }

  return { cv };
};

const listCompanyCvService = async (
  accountRequest: AccountRequest,
): Promise<ServiceResponse<any>> => {
  const company = accountRequest.account as IAccountCompany;
  const { jobId, status } = accountRequest.query;
  const page = Math.max(parseInt(String(accountRequest.query.page || "1"), 10), 1);
  const limit = Math.max(parseInt(String(accountRequest.query.limit || "12"), 10), 1);
  const skip = (page - 1) * limit;

  // Lấy danh sách jobId của company hiện tại
  const companyJobs = await Job.find({ companyId: company._id }).select("_id").lean();
  const companyJobIds = companyJobs.map((j) => j._id);

  const filter: any = {
    deletedAt: null,
    jobId: { $in: companyJobIds },
  };

  if (jobId && typeof jobId === "string" && /^[a-f\d]{24}$/i.test(jobId)) {
    // Chỉ áp filter nếu jobId thuộc company (đã có trong companyJobIds)
    filter.jobId = jobId;
  }

  if (status && ["pending", "approved", "rejected"].includes(String(status))) {
    filter.status = status;
  }

  const total = await Cv.countDocuments(filter);
  const cvs = await Cv.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({ path: "jobId", select: "title" })
    .lean();

  const data = cvs.map((cv: any) => ({
    _id: cv._id,
    jobId: cv.jobId?._id || cv.jobId,
    jobTitle: cv.jobId?.title || "",
    fullName: cv.fullName,
    email: cv.email,
    phone: cv.phone,
    fileUrl: cv.fileUrl,
    status: cv.status,
    viewed: cv.viewed,
    note: cv.note || "",
    createdAt: cv.createdAt,
  }));

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      data,
      total,
      page,
      limit,
    },
  };
};

const detailCompanyCvService = async (
  accountRequest: AccountRequest,
  cvId: string,
): Promise<ServiceResponse<any>> => {
  const company = accountRequest.account as IAccountCompany;
  const { cv, error } = await loadCvForCompany(cvId, company);
  if (error) return error;

  // Đánh dấu đã xem nếu chưa
  if (!cv.viewed) {
    cv.viewed = true;
    await cv.save();
  }

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      data: {
        _id: cv._id,
        jobId: cv.jobId?._id || cv.jobId,
        jobTitle: cv.jobId?.title || "",
        fullName: cv.fullName,
        email: cv.email,
        phone: cv.phone,
        fileUrl: cv.fileUrl,
        status: cv.status,
        viewed: cv.viewed,
        note: cv.note || "",
        createdAt: cv.createdAt,
      },
    },
  };
};

const approveCompanyCvService = async (
  accountRequest: AccountRequest,
  cvId: string,
): Promise<ServiceResponse<any>> => {
  const company = accountRequest.account as IAccountCompany;
  const { cv, error } = await loadCvForCompany(cvId, company);
  if (error) return error;

  cv.status = "approved";
  if (typeof accountRequest.body.note === "string") {
    cv.note = accountRequest.body.note;
  }
  await cv.save();

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      message: RESPONSE_MESSAGE.CV_APPROVE_SUCCESS,
    },
  };
};

const rejectCompanyCvService = async (
  accountRequest: AccountRequest,
  cvId: string,
): Promise<ServiceResponse<any>> => {
  const company = accountRequest.account as IAccountCompany;
  const { cv, error } = await loadCvForCompany(cvId, company);
  if (error) return error;

  cv.status = "rejected";
  if (typeof accountRequest.body.note === "string") {
    cv.note = accountRequest.body.note;
  }
  await cv.save();

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      message: RESPONSE_MESSAGE.CV_REJECT_SUCCESS,
    },
  };
};

const deleteCompanyCvService = async (
  accountRequest: AccountRequest,
  cvId: string,
): Promise<ServiceResponse<any>> => {
  const company = accountRequest.account as IAccountCompany;
  const { cv, error } = await loadCvForCompany(cvId, company);
  if (error) return error;

  cv.deletedAt = new Date();
  await cv.save();

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      message: RESPONSE_MESSAGE.CV_DELETE_SUCCESS,
    },
  };
};

const listUserCvService = async (
  accountRequest: AccountRequest,
): Promise<ServiceResponse<any>> => {
  const user = accountRequest.account as IAccountUser;
  const page = Math.max(parseInt(String(accountRequest.query.page || "1"), 10), 1);
  const limit = Math.max(parseInt(String(accountRequest.query.limit || "12"), 10), 1);
  const skip = (page - 1) * limit;

  const filter = { userId: user._id, deletedAt: null };

  const total = await Cv.countDocuments(filter);
  const cvs = await Cv.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({ path: "jobId", select: "title companyId" })
    .lean();

  const data = cvs.map((cv: any) => ({
    _id: cv._id,
    jobId: cv.jobId?._id || cv.jobId,
    jobTitle: cv.jobId?.title || "",
    fullName: cv.fullName,
    email: cv.email,
    phone: cv.phone,
    fileUrl: cv.fileUrl,
    status: cv.status,
    note: cv.note || "",
    createdAt: cv.createdAt,
  }));

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      data,
      total,
      page,
      limit,
    },
  };
};

const deleteUserCvService = async (
  accountRequest: AccountRequest,
  cvId: string,
): Promise<ServiceResponse<any>> => {
  const user = accountRequest.account as IAccountUser;
  const cv = await Cv.findOne({ _id: cvId, deletedAt: null });

  if (!cv) {
    return {
      statusCode: STATUS_CODE.NOT_FOUND,
      body: { code: RESPONSE_CODE.ERROR, message: RESPONSE_MESSAGE.CV_NOT_FOUND },
    };
  }

  if (!cv.userId?.equals(user._id)) {
    return {
      statusCode: STATUS_CODE.FORBIDDEN,
      body: { code: RESPONSE_CODE.FORBIDDEN, message: RESPONSE_MESSAGE.FORBIDDEN },
    };
  }

  if (cv.status !== "pending") {
    return {
      statusCode: STATUS_CODE.BAD_REQUEST,
      body: {
        code: RESPONSE_CODE.ERROR,
        message: RESPONSE_MESSAGE.CV_DELETE_NOT_PENDING,
      },
    };
  }

  cv.deletedAt = new Date();
  await cv.save();

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      message: RESPONSE_MESSAGE.CV_DELETE_SUCCESS,
    },
  };
};

export {
  submitCvService,
  listCompanyCvService,
  detailCompanyCvService,
  approveCompanyCvService,
  rejectCompanyCvService,
  deleteCompanyCvService,
  listUserCvService,
  deleteUserCvService,
};
