import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import AccountUser from "../models/account-user.model";
import { AccountRequest } from "../interfaces/request.interface";
import { ServiceResponse } from "../interfaces/request.interface";
import { STATUS_CODE, RESPONSE_CODE } from "../constants/http.constant";

const registerUserService = async (
  body: any,
): Promise<ServiceResponse<any>> => {
  const { fullName, email, password } = body;

  const existAccount = await AccountUser.findOne({ email });

  if (existAccount) {
    return {
      statusCode: STATUS_CODE.BAD_REQUEST,
      body: {
        code: RESPONSE_CODE.ERROR,
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
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
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
      statusCode: STATUS_CODE.BAD_REQUEST,
      body: {
        code: RESPONSE_CODE.ERROR,
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
      statusCode: STATUS_CODE.BAD_REQUEST,
      body: {
        code: RESPONSE_CODE.ERROR,
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
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
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
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      message: "Profile updated successfully",
    },
  };
};

export { registerUserService, loginUserService, updateUserProfileService };
