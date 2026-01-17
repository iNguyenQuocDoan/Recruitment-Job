import jwt from "jsonwebtoken";

import { Request, Response } from "express";
import AccountUser from "../models/account-user.model";
import AccountCompany from "../models/account-company.model";

export const check = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json({
        code: "unauthenticated",
        message: "User is not authenticated",
      });
    }

    var decoded = jwt.verify(
      token,
      `${process.env.JWT_SECRET}`
    ) as jwt.JwtPayload;
    const { id, email } = decoded;

    const existUser = await AccountUser.findOne({
      _id: id,
      email: email,
    });

    if (existUser) {
      const infoUser = {
        id: existUser._id,
        email: existUser.email,
        fullName: existUser.fullName,
        phone: existUser.phone,
        avatar: existUser.avatar,
      };
      res.locals.account = existUser;

      return res.json({
        code: "success",
        message: "User is authenticated",
        infoUser: infoUser,
      });
    }

    const existAccountCompany = await AccountCompany.findOne({
      _id: id,
      email: email,
    });

    if (existAccountCompany) {
      const infoCompany = {
        id: existAccountCompany._id,
        email: existAccountCompany.email,
        companyName: existAccountCompany.companyName,
        logo: existAccountCompany.logo,
        phone: existAccountCompany.phone,
        city: existAccountCompany.city,
        address: existAccountCompany.address,
        companyModel: existAccountCompany.companyModel,
        companyEmployees: existAccountCompany.companyEmployees,
        workingTime: existAccountCompany.workingTime,
        workOvertime: existAccountCompany.workOvertime,
        description: existAccountCompany.description,
      };
      res.locals.account = existAccountCompany;

      return res.json({
        code: "success",
        message: "User is authenticated",
        infoCompany: infoCompany,
      });
    }

    return res.json({
      code: "unauthenticated",
      message: "User is not authenticated",
    });
  } catch (error) {
    console.log("Error in auth check:", error);
    return res.json({
      code: "unauthenticated",
      message: "User is not authenticated",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  return res.json({
    code: "success",
    message: "User logged out successfully",
  });
};
