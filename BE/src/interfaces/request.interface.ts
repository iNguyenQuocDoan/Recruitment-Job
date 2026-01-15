import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

interface AccountRequest extends Request {
  account?: any;
}

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
}

export { AccountRequest, DecodedToken };
