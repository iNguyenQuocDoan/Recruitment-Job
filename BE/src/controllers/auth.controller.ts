import jwt from "jsonwebtoken";

import { Request, Response } from "express";
import AccountUser from "../models/account-user.model";

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

    if (!existUser) {
      res.clearCookie("token");
      return res.json({
        code: "Error",
        message: "User not found",
      });
    }

    const infoUser = {
      id: existUser._id,
      email: existUser.email,
      fullName: existUser.fullName,
    };
    res.locals.account = existUser;

    return res.json({
      code: "success",
      message: "User is authenticated",
      infoUser: infoUser,
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
