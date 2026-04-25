import mongoose from "mongoose";

import Job from "../models/jobs.model";
import AccountCompany from "../models/account-company.model";
import { ICity } from "../models/city.model";
import { IAccountCompany } from "../models/account-company.model";
import { ServiceResponse } from "../interfaces/request.interface";
import { STATUS_CODE, RESPONSE_CODE, RESPONSE_MESSAGE } from "../constants/http.constant";

const listJobService = async (
  query: Record<string, any>,
): Promise<ServiceResponse<any>> => {
  const {
    keyword,
    city,
    position,
    workingForm,
    technologies,
    page = 1,
    limit = 12,
  } = query;

  const filter: Record<string, any> = {};

  if (keyword) {
    filter.title = { $regex: keyword, $options: "i" };
  }
  if (position) {
    filter.position = position;
  }
  if (workingForm) {
    filter.workingForm = workingForm;
  }
  if (technologies) {
    const techList = technologies.split(",").map((t: string) => t.trim());
    filter.technologies = { $in: techList };
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  let jobQuery = Job.find(filter)
    .populate<{ companyId: (IAccountCompany & { city: ICity | null }) | null }>(
      {
        path: "companyId",
        populate: { path: "city", select: "name" },
      },
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  if (city) {
    const companies = await AccountCompany.find({
      city: new mongoose.Types.ObjectId(city),
    }).select("_id");
    const companyIds = companies.map((c) => c._id);
    filter.companyId = { $in: companyIds };
    jobQuery = Job.find(filter)
      .populate<{
        companyId: (IAccountCompany & { city: ICity | null }) | null;
      }>({
        path: "companyId",
        populate: { path: "city", select: "name" },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
  }

  const [jobs, total] = await Promise.all([
    jobQuery,
    Job.countDocuments(filter),
  ]);

  const data = jobs.map((item) => {
    const company = item.companyId as
      | (IAccountCompany & { city: ICity | null })
      | null;
    return {
      _id: item._id,
      title: item.title,
      salaryMin: item.salaryMin,
      salaryMax: item.salaryMax,
      position: item.position,
      workingForm: item.workingForm,
      technologies: item.technologies,
      images: item.images,
      companyId: company?._id,
      companyName: company?.companyName,
      companyLogo: company?.logo,
      companyCity: (company?.city as ICity)?.name || "",
    };
  });

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      data,
      total,
      page: pageNum,
      limit: limitNum,
    },
  };
};

const detailJobPublicService = async (
  jobId: string,
): Promise<ServiceResponse<any>> => {
  const job = await Job.findById(jobId).populate<{
    companyId: (IAccountCompany & { city: ICity | null }) | null;
  }>({
    path: "companyId",
    populate: { path: "city", select: "name" },
  });

  if (!job) {
    return {
      statusCode: STATUS_CODE.NOT_FOUND,
      body: { code: RESPONSE_CODE.ERROR, message: RESPONSE_MESSAGE.JOB_NOT_FOUND },
    };
  }

  const company = job.companyId as
    | (IAccountCompany & { city: ICity | null })
    | null;

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
        company: company
          ? {
              _id: company._id,
              companyName: company.companyName,
              logo: company.logo,
              city: (company.city as ICity)?.name || "",
              address: company.address,
              companyModel: company.companyModel,
              companyEmployees: company.companyEmployees,
              workingTime: company.workingTime,
            }
          : null,
      },
    },
  };
};

const listCompanyPublicService = async (
  query: Record<string, any>,
): Promise<ServiceResponse<any>> => {
  const { page = 1, limit = 12 } = query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const [companies, total] = await Promise.all([
    AccountCompany.find()
      .populate<{ city: ICity | null }>("city", "name")
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    AccountCompany.countDocuments(),
  ]);

  const data = companies.map((c) => ({
    _id: c._id,
    companyName: c.companyName,
    logo: c.logo,
    city: (c.city as unknown as ICity)?.name || "",
    companyModel: c.companyModel,
    companyEmployees: c.companyEmployees,
  }));

  return {
    statusCode: STATUS_CODE.OK,
    body: { code: RESPONSE_CODE.SUCCESS, data, total, page: pageNum, limit: limitNum },
  };
};

const detailCompanyPublicService = async (
  companyId: string,
): Promise<ServiceResponse<any>> => {
  const company = await AccountCompany.findById(companyId)
    .populate<{ city: ICity | null }>("city", "name")
    .select("-password");

  if (!company) {
    return {
      statusCode: STATUS_CODE.NOT_FOUND,
      body: { code: RESPONSE_CODE.ERROR, message: RESPONSE_MESSAGE.NOT_FOUND },
    };
  }

  const jobs = await Job.find({ companyId }).sort({ createdAt: -1 });

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      data: {
        _id: company._id,
        companyName: company.companyName,
        logo: company.logo,
        phone: company.phone,
        city: (company.city as unknown as ICity)?.name || "",
        address: company.address,
        companyModel: company.companyModel,
        companyEmployees: company.companyEmployees,
        workingTime: company.workingTime,
        workOvertime: company.workOvertime,
        description: company.description,
        jobs: jobs.map((j) => ({
          _id: j._id,
          title: j.title,
          salaryMin: j.salaryMin,
          salaryMax: j.salaryMax,
          position: j.position,
          workingForm: j.workingForm,
          technologies: j.technologies,
          images: j.images,
        })),
      },
    },
  };
};

export {
  listJobService,
  detailJobPublicService,
  listCompanyPublicService,
  detailCompanyPublicService,
};
