import bcrypt from "bcryptjs";

import AccountUser, { IAccountUser } from "../models/account-user.model";
import { AccountRequest } from "../interfaces/request.interface";
import { ServiceResponse } from "../interfaces/request.interface";
import {
  STATUS_CODE,
  RESPONSE_CODE,
  RESPONSE_MESSAGE,
} from "../constants/http.constant";
import { generateToken } from "../helper/token.helper";

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
        message: RESPONSE_MESSAGE.EMAIL_ALREADY_IN_USE,
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
      message: RESPONSE_MESSAGE.USER_REGISTER_SUCCESS,
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
        message: RESPONSE_MESSAGE.ACCOUNT_NOT_FOUND,
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
        message: RESPONSE_MESSAGE.INVALID_PASSWORD,
      },
    };
  }

  const token = generateToken({
    id: existAccount._id.toString(),
    email: existAccount.email?.toString(),
    role: "user",
  });

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      message: RESPONSE_MESSAGE.USER_LOGIN_SUCCESS,
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

  const user = accountRequest.account as IAccountUser;

  await AccountUser.updateOne({ _id: user._id }, accountRequest.body);

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      message: RESPONSE_MESSAGE.USER_PROFILE_UPDATED,
    },
  };
};

export { registerUserService, loginUserService, updateUserProfileService };
