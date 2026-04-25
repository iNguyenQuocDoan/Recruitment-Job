import bcrypt from "bcryptjs";

import AccountCompany, { IAccountCompany } from "../models/account-company.model";
import { ICity } from "../models/city.model";
import { AccountRequest } from "../interfaces/request.interface";
import Job from "../models/jobs.model";
import { ServiceResponse } from "../interfaces/request.interface";
import { generateToken } from "../helper/token.helper";
import {
  STATUS_CODE,
  RESPONSE_CODE,
  RESPONSE_MESSAGE,
} from "../constants/http.constant";

const registerCompanyService = async (
  body: any,
): Promise<ServiceResponse<any>> => {
  const { companyName, email, password } = body;

  const existAccount = await AccountCompany.findOne({ email });

  if (existAccount) {
    return {
      statusCode: STATUS_CODE.BAD_REQUEST,
      body: {
        code: RESPONSE_CODE.ERROR,
        message: RESPONSE_MESSAGE.EMAIL_ALREADY_IN_USE,
      },
    };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newCompany = new AccountCompany({
    companyName,
    email,
    password: hashedPassword,
  });

  await newCompany.save();

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      message: RESPONSE_MESSAGE.COMPANY_REGISTER_SUCCESS,
    },
  };
};

const loginCompanyService = async (
  body: any,
): Promise<ServiceResponse<any> & { token?: string }> => {
  const { email, password } = body;
  const existAccount = await AccountCompany.findOne({ email });

  if (!existAccount) {
    return {
      statusCode: STATUS_CODE.BAD_REQUEST,
      body: {
        code: RESPONSE_CODE.ERROR,
        message: RESPONSE_MESSAGE.ACCOUNT_NOT_FOUND,
      },
    };
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    `${existAccount.password}`,
  );

  if (!isPasswordValid) {
    return {
      statusCode: STATUS_CODE.BAD_REQUEST,
      body: {
        code: RESPONSE_CODE.ERROR,
        message: RESPONSE_MESSAGE.INVALID_PASSWORD,
      },
    };
  }

  const token = generateToken({
    id: existAccount._id.toString(),
    email: existAccount.email?.toString(),
    role: "company",
  });

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      message: RESPONSE_MESSAGE.COMPANY_LOGIN_SUCCESS,
    },
    token,
  };
};

const updateCompanyProfileService = async (
  accountRequest: AccountRequest,
): Promise<ServiceResponse<any>> => {
  if (accountRequest.file) {
    accountRequest.body.logo = accountRequest.file.path;
  } else {
    delete accountRequest.body.logo;
  }

  const company = accountRequest.account as IAccountCompany;

  await AccountCompany.updateOne({ _id: company._id }, accountRequest.body);

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      message: RESPONSE_MESSAGE.COMPANY_PROFILE_UPDATED,
    },
  };
};

const createJobService = async (
  accountRequest: AccountRequest,
): Promise<ServiceResponse<any>> => {
  const company = accountRequest.account as IAccountCompany;
  accountRequest.body.companyId = company._id;
  accountRequest.body.salaryMin = accountRequest.body.salaryMin
    ? parseInt(accountRequest.body.salaryMin, 10)
    : 0;
  accountRequest.body.salaryMax = accountRequest.body.salaryMax
    ? parseInt(accountRequest.body.salaryMax, 10)
    : 0;
  accountRequest.body.technologies = accountRequest.body.technologies
    ? accountRequest.body.technologies.split(",")
    : [];
  accountRequest.body.images = [];

  if (accountRequest.files) {
    for (const file of accountRequest.files as any[]) {
      accountRequest.body.images.push(file.path);
    }
  }

  const newRec = new Job(accountRequest.body);
  await newRec.save();

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      message: RESPONSE_MESSAGE.JOB_CREATE_SUCCESS,
    },
  };
};

const deleteJobService = async (
  accountRequest: AccountRequest,
  jobId: string,
): Promise<ServiceResponse<any>> => {
  const job = await Job.findById(jobId);

  if (!job) {
    return {
      statusCode: STATUS_CODE.NOT_FOUND,
      body: { code: RESPONSE_CODE.ERROR, message: RESPONSE_MESSAGE.JOB_NOT_FOUND },
    };
  }

  const company = accountRequest.account as IAccountCompany;

  if (!job.companyId?.equals(company._id)) {
    return {
      statusCode: STATUS_CODE.FORBIDDEN,
      body: { code: RESPONSE_CODE.FORBIDDEN, message: RESPONSE_MESSAGE.FORBIDDEN },
    };
  }

  await Job.deleteOne({ _id: jobId });

  return {
    statusCode: STATUS_CODE.OK,
    body: { code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.JOB_DELETE_SUCCESS },
  };
};

const listCompanyJobService = async (
  accountRequest: AccountRequest,
): Promise<ServiceResponse<any>> => {
  const company = accountRequest.account as IAccountCompany;
  const companyId = company._id;

  const jobs = await Job.find({ companyId }).sort({ createdAt: -1 });

  const dataFinal = [];

  for (const item of jobs) {
    dataFinal.push({
      _id: item._id,
      companyLogo: company.logo,
      title: item.title,
      companyName: company.companyName,
      salaryMin: item.salaryMin,
      salaryMax: item.salaryMax,
      position: item.position,
      workingForm: item.workingForm,
      technologies: item.technologies,
      companyCity: (company.city as ICity)?.name || "",
      images: item.images,
      description: item.description,
    });
  }

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      data: dataFinal,
    },
  };
};

const detailJobService = async (
  accountRequest: AccountRequest,
  jobId: string,
): Promise<ServiceResponse<any>> => {
  const company = accountRequest.account as IAccountCompany;
  const job = await Job.findById(jobId);

  if (!job) {
    return {
      statusCode: STATUS_CODE.NOT_FOUND,
      body: { code: RESPONSE_CODE.ERROR, message: RESPONSE_MESSAGE.JOB_NOT_FOUND },
    };
  }

  if (!job.companyId?.equals(company._id)) {
    return {
      statusCode: STATUS_CODE.FORBIDDEN,
      body: { code: RESPONSE_CODE.FORBIDDEN, message: RESPONSE_MESSAGE.FORBIDDEN },
    };
  }

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      data: {
        _id: job._id,
        title: job.title,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        position: job.position,
        workingForm: job.workingForm,
        technologies: job.technologies,
        description: job.description,
        images: job.images,
      },
    },
  };
};

const editJobService = async (
  accountRequest: AccountRequest,
  jobId: string,
): Promise<ServiceResponse<any>> => {
  const company = accountRequest.account as IAccountCompany;
  const job = await Job.findById(jobId);

  if (!job) {
    return {
      statusCode: STATUS_CODE.NOT_FOUND,
      body: { code: RESPONSE_CODE.ERROR, message: RESPONSE_MESSAGE.JOB_NOT_FOUND },
    };
  }

  if (!job.companyId?.equals(company._id)) {
    return {
      statusCode: STATUS_CODE.FORBIDDEN,
      body: { code: RESPONSE_CODE.FORBIDDEN, message: RESPONSE_MESSAGE.FORBIDDEN },
    };
  }

  const updateData: any = {
    title: accountRequest.body.title,
    salaryMin: accountRequest.body.salaryMin
      ? parseInt(accountRequest.body.salaryMin, 10)
      : job.salaryMin,
    salaryMax: accountRequest.body.salaryMax
      ? parseInt(accountRequest.body.salaryMax, 10)
      : job.salaryMax,
    position: accountRequest.body.position,
    workingForm: accountRequest.body.workingForm,
    technologies: accountRequest.body.technologies
      ? accountRequest.body.technologies.split(",")
      : job.technologies,
    description: accountRequest.body.description,
  };

  if (accountRequest.files && (accountRequest.files as any[]).length > 0) {
    updateData.images = (accountRequest.files as any[]).map((f) => f.path);
  }

  await Job.updateOne({ _id: jobId }, updateData);

  return {
    statusCode: STATUS_CODE.OK,
    body: { code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.JOB_UPDATE_SUCCESS },
  };
};

export {
  registerCompanyService,
  loginCompanyService,
  updateCompanyProfileService,
  createJobService,
  deleteJobService,
  listCompanyJobService,
  detailJobService,
  editJobService,
};
