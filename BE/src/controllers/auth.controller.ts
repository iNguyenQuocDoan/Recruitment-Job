import { Request, Response } from "express";
import { checkAuthService, logoutService } from "../services/auth.service";

export const checkController = async (req: Request, res: Response) => {
  const result = await checkAuthService(req.cookies.token);

  if (result.body.account) {
    res.locals.account = result.body.account;
    delete result.body.account;
  }

  return res.status(result.statusCode).json(result.body);
};

export const logoutController = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  const result = logoutService();
  return res.status(result.statusCode).json(result.body);
};
