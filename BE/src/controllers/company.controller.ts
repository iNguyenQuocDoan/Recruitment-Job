import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import AccountCompany from "../models/account-company.model";
import { AccountRequest } from "../interfaces/request.interface";

dotenv.config();

const registerPostController = async (req: Request, res: Response) => {
  console.log("Received registration data:", req.body);

  try {
    const { companyName, email, password } = req.body;

    const existAccount = await AccountCompany.findOne({ email });

    if (existAccount) {
      return res
        .status(400)
        .json({ code: "error", message: "Email already in use" });
    }

    // hash pass
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new AccountCompany({
      companyName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.json({
      code: "success",
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginPostController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existAccount = await AccountCompany.findOne({ email });

    if (!existAccount) {
      return res
        .status(400)
        .json({ code: "error", message: "Không tồn tại trong hệ thống" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      `${existAccount.password}`
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ code: "error", message: "Mật khẩu không đúng" });
    }

    const token = jwt.sign(
      {
        id: existAccount._id,
        email: existAccount.email,
      },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // https = true, http = false
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "lax", // Cho phép gửi cookie giữa các tên miền
    });

    return res.json({ code: "success", message: "Login success" });
  } catch (error) {
    console.error("Error during user login:", error);
    return res
      .status(500)
      .json({ code: "error", message: "Internal server error" });
  }
};

const profilePatchController = async (req: AccountRequest, res: Response) => {
  if (req.file) {
    req.body.logo = req.file.path;
  } else {
    delete req.body.logo;
  }

  await AccountCompany.updateOne(
    {
      _id: req.account._id,
    },
    req.body
  );

  return res.json({ code: "success", message: "Profile updated successfully" });
};

export { registerPostController, loginPostController, profilePatchController };
