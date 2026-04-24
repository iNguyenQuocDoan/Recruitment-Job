import bcrypt from "bcryptjs";

import AccountUser, { IAccountUser } from "../models/account-user.model";
import { AccountRequest } from "../interfaces/request.interface";
import { ServiceResponse } from "../interfaces/request.interface";
import { STATUS_CODE, RESPONSE_CODE } from "../constants/http.constant";
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

  const token = generateToken({
    id: existAccount._id.toString(),
    email: existAccount.email?.toString(),
    role: "user",
  });

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

  const user = accountRequest.account as IAccountUser;

  await AccountUser.updateOne({ _id: user._id }, accountRequest.body);

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      message: "Profile updated successfully",
    },
  };
};

export { registerUserService, loginUserService, updateUserProfileService };
