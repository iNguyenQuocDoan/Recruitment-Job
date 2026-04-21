import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import AccountUser from "../models/account-user.model";
import { AccountRequest } from "../interfaces/request.interface";
import { ServiceResponse } from "./auth.service";

const registerUserService = async (
  body: any,
): Promise<ServiceResponse<any>> => {
  const { fullName, email, password } = body;

  const existAccount = await AccountUser.findOne({ email });

  if (existAccount) {
    return {
      statusCode: 400,
      body: {
        code: "error",
        message: "Email already in use",
      },
    };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new AccountUser({
    fullName,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  return {
    statusCode: 200,
    body: {
      code: "success",
      message: "User registered successfully",
    },
  };
};

const loginUserService = async (
  body: any,
): Promise<ServiceResponse<any> & { token?: string }> => {
  const { email, password } = body;
  const existAccount = await AccountUser.findOne({ email });

  if (!existAccount) {
    return {
      statusCode: 400,
      body: {
        code: "error",
        message: "Không tồn tại trong hệ thống",
      },
    };
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    `${existAccount.password}`,
  );

  if (!isPasswordValid) {
    return {
      statusCode: 400,
      body: {
        code: "error",
        message: "Mật khẩu không đúng",
      },
    };
  }

  const token = jwt.sign(
    {
      id: existAccount._id,
      email: existAccount.email,
    },
    `${process.env.JWT_SECRET}`,
    {
      expiresIn: "7d",
    },
  );

  return {
    statusCode: 200,
    body: {
      code: "success",
      message: "Login success",
    },
    token,
  };
};

const updateUserProfileService = async (
  accountRequest: AccountRequest,
): Promise<ServiceResponse<any>> => {
  if (accountRequest.file) {
    accountRequest.body.avatar = accountRequest.file.path;
  } else {
    delete accountRequest.body.avatar;
  }

  await AccountUser.updateOne(
    {
      _id: accountRequest.account!._id,
    },
    accountRequest.body,
  );

  return {
    statusCode: 200,
    body: {
      code: "success",
      message: "Profile updated successfully",
    },
  };
};

export { registerUserService, loginUserService, updateUserProfileService };
