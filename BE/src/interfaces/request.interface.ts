import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { HydratedDocument } from "mongoose";

import { IAccountUser } from "../models/account-user.model";
import { IAccountCompany } from "../models/account-company.model";

interface AccountRequest extends Request {
  account?: HydratedDocument<IAccountUser> | HydratedDocument<IAccountCompany>;
  role?: "user" | "company" | "admin";
}

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  role?: "user" | "company" | "admin";
}

interface ServiceResponse<T> {
  statusCode: number;
  body: T;
}

export { AccountRequest, DecodedToken, ServiceResponse };
