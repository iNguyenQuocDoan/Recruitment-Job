import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import AccountUser from "../models/account-user.model";
import { AccountRequest, DecodedToken } from "../interfaces/request.interface";

export const verifyTokenUser = async (
  req: AccountRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/login");
    }

    const decoded = jwt.verify(
      token,
      `${process.env.JWT_SECRET}`
    ) as DecodedToken;
    const { id, email } = decoded;

    const existAccount = await AccountUser.findOne({ _id: id, email: email });

    if (!existAccount) {
      res.clearCookie("token");
      res.redirect("/login");
      return;
    }

    req.account = existAccount;

    next();
  } catch (err) {
    console.log(err);
  }
};
