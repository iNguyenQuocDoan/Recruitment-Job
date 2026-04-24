import jwt from "jsonwebtoken";

import AccountUser from "../models/account-user.model";
import AccountCompany from "../models/account-company.model";
import { STATUS_CODE, RESPONSE_CODE } from "../constants/http.constant";
import { ServiceResponse } from "../interfaces/request.interface";

const checkAuthService = async (
  token?: string,
): Promise<ServiceResponse<any>> => {
  try {
    if (!token) {
      return {
        statusCode: STATUS_CODE.OK,
        body: {
          code: RESPONSE_CODE.ERROR,
          message: "User is not authenticated",
        },
      };
    }

    const decoded = jwt.verify(
      token,
      `${process.env.JWT_SECRET}`,
    ) as jwt.JwtPayload;
    const { id, email } = decoded;

    const existUser = await AccountUser.findOne({ _id: id, email });

    if (existUser) {
      return {
        statusCode: STATUS_CODE.OK,
        body: {
          code: RESPONSE_CODE.SUCCESS,
          message: "User is authenticated",
          infoUser: {
            id: existUser._id,
            email: existUser.email,
            fullName: existUser.fullName,
            phone: existUser.phone,
            avatar: existUser.avatar,
          },
          account: existUser,
        },
      };
    }

    const existAccountCompany = await AccountCompany.findOne({
      _id: id,
      email,
    }).populate<{ city: { _id: string; name: string } | null }>("city");

    if (existAccountCompany) {
      return {
        statusCode: STATUS_CODE.OK,
        body: {
          code: RESPONSE_CODE.SUCCESS,
          message: "User is authenticated",
          infoCompany: {
            id: existAccountCompany._id,
            email: existAccountCompany.email,
            companyName: existAccountCompany.companyName,
            logo: existAccountCompany.logo,
            phone: existAccountCompany.phone,
            city: existAccountCompany.city?.name ?? null,
            address: existAccountCompany.address,
            companyModel: existAccountCompany.companyModel,
            companyEmployees: existAccountCompany.companyEmployees,
            workingTime: existAccountCompany.workingTime,
            workOvertime: existAccountCompany.workOvertime,
            description: existAccountCompany.description,
          },
          account: existAccountCompany,
        },
      };
    }

    return {
      statusCode: STATUS_CODE.OK,
      body: {
        code: RESPONSE_CODE.ERROR,
        message: "User is not authenticated",
      },
    };
  } catch {
    return {
      statusCode: STATUS_CODE.OK,
      body: {
        code: RESPONSE_CODE.ERROR,
        message: "User is not authenticated",
      },
    };
  }
};

const logoutService = (): ServiceResponse<any> => {
  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      message: "User logged out successfully",
    },
  };
};

export { checkAuthService, logoutService };
