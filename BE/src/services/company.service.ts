import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import AccountCompany from "../models/account-company.model";
import { AccountRequest } from "../interfaces/request.interface";
import Job from "../models/jobs.model";
import { ServiceResponse } from "./auth.service";

const registerCompanyService = async (
  body: any,
): Promise<ServiceResponse<any>> => {
  const { companyName, email, password } = body;

  const existAccount = await AccountCompany.findOne({ email });

  if (existAccount) {
    return {
      statusCode: 400,
      body: {
        code: "error",
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
    statusCode: 200,
    body: {
      code: "success",
      message: "User registered successfully",
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
      statusCode: 400,
      body: {
        code: "error",
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
      statusCode: 400,
      body: {
        code: "error",
        message: "Mật khẩu không đúng",
      },
    };
  }

  const token = jwt.sign(
    {
      id: existAccount._id,
      email: existAccount.email,
    },
    `${process.env.JWT_SECRET}`,
    {
      expiresIn: "7d",
    },
  );

  return {
    statusCode: 200,
    body: {
      code: "success",
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

  await AccountCompany.updateOne(
    {
      _id: accountRequest.account!._id,
    },
    accountRequest.body,
  );

  return {
    statusCode: 200,
    body: {
      code: "success",
      message: "Profile updated successfully",
    },
  };
};

const createJobService = async (
  accountRequest: AccountRequest,
): Promise<ServiceResponse<any>> => {
  accountRequest.body.companyId = accountRequest.account!._id;
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
    statusCode: 200,
    body: {
      code: "success",
      message: "Create job successfully",
    },
  };
};

const listCompanyJobService = async (
  accountRequest: AccountRequest,
): Promise<ServiceResponse<any>> => {
  const companyId = accountRequest.account!._id;

  const jobs = await Job.find({ companyId: companyId }).sort({
    createdAt: -1,
  });

  const dataFinal = [];

  for (const item of jobs) {
    dataFinal.push({
      _id: item._id,
      companyLogo: accountRequest.account!.logo,
      title: item.title,
      companyName: accountRequest.account!.companyName,
      salaryMin: item.salaryMin,
      salaryMax: item.salaryMax,
      position: item.position,
      workingForm: item.workingForm,
      technologies: item.technologies,
      companyCity: accountRequest.account!.companyCity || "",
      images: item.images,
      description: item.description,
    });
  }

  return {
    statusCode: 200,
    body: {
      code: "success",
      data: dataFinal,
    },
  };
};

export {
  registerCompanyService,
  loginCompanyService,
  updateCompanyProfileService,
  createJobService,
  listCompanyJobService,
};
