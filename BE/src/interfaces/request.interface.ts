import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

interface AccountRequest extends Request {
  account?: any;
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
