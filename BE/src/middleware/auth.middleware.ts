import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import AccountUser from "../models/account-user.model";
import AccountCompany from "../models/account-company.model";
import { AccountRequest, DecodedToken } from "../interfaces/request.interface";
import {
  STATUS_CODE,
  RESPONSE_CODE,
  RESPONSE_MESSAGE,
} from "../constants/http.constant";

const authenticate = async (
  req: AccountRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        code: RESPONSE_CODE.UNAUTHORIZED,
        message: RESPONSE_MESSAGE.UNAUTHORIZED,
      });
    }

    const decoded = jwt.verify(
      token,
      `${process.env.JWT_SECRET}`,
    ) as DecodedToken;

    const { id, email, role } = decoded;

    if (role === "user") {
      const account = await AccountUser.findOne({ _id: id, email });
      if (!account) {
        res.clearCookie("token");
        return res.status(STATUS_CODE.UNAUTHORIZED).json({
          code: RESPONSE_CODE.UNAUTHORIZED,
          message: RESPONSE_MESSAGE.UNAUTHORIZED,
        });
      }
      req.account = account;
    } else if (role === "company") {
      const account = await AccountCompany.findOne({ _id: id, email });
      if (!account) {
        res.clearCookie("token");
        return res.status(STATUS_CODE.UNAUTHORIZED).json({
          code: RESPONSE_CODE.UNAUTHORIZED,
          message: RESPONSE_MESSAGE.UNAUTHORIZED,
        });
      }
      req.account = account;
    }

    req.role = role;
    next();
  } catch {
    return res.status(STATUS_CODE.UNAUTHORIZED).json({
      code: RESPONSE_CODE.ERROR,
      message: RESPONSE_MESSAGE.UNAUTHORIZED,
    });
  }
};

const authorize = (...roles: Array<"user" | "company" | "admin">) => {
  return (req: AccountRequest, res: Response, next: NextFunction) => {
    if (!req.role || !roles.includes(req.role)) {
      return res.status(STATUS_CODE.FORBIDDEN).json({
        code: RESPONSE_CODE.FORBIDDEN,
        message: RESPONSE_MESSAGE.FORBIDDEN,
      });
    }
    next();
  };
};

export { authenticate, authorize };
