import bcrypt from "bcryptjs";

import AccountCompany, { IAccountCompany } from "../models/account-company.model";
import { ICity } from "../models/city.model";
import { AccountRequest } from "../interfaces/request.interface";
import Job from "../models/jobs.model";
import { ServiceResponse } from "../interfaces/request.interface";
import { generateToken } from "../helper/token.helper";
import { STATUS_CODE, RESPONSE_CODE } from "../constants/http.constant";

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
        message: "Email already in use",
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
      message: "Company registered successfully",
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
        message: "Không tồn tại trong hệ thống",
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
        message: "Incorrect password",
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
      message: "Login success",
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
      message: "Profile updated successfully",
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
      message: "Create job successfully",
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
      body: { code: RESPONSE_CODE.ERROR, message: "Job not found" },
    };
  }

  const company = accountRequest.account as IAccountCompany;

  if (!job.companyId?.equals(company._id)) {
    return {
      statusCode: STATUS_CODE.FORBIDDEN,
      body: { code: RESPONSE_CODE.FORBIDDEN, message: "Forbidden" },
    };
  }

  await Job.deleteOne({ _id: jobId });

  return {
    statusCode: STATUS_CODE.OK,
    body: { code: RESPONSE_CODE.SUCCESS, message: "Job deleted successfully" },
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

export {
  registerCompanyService,
  loginCompanyService,
  updateCompanyProfileService,
  createJobService,
  deleteJobService,
  listCompanyJobService,
};
