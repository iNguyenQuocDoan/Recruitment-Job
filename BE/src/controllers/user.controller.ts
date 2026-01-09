import { Request, Response } from "express";
import AccountUser from "../models/account-user.model";
import bcrypt from "bcryptjs";

const registerPostController = async (req: Request, res: Response) => {
  console.log("Received registration data:", req.body);

  try {
    const { fullName, email, password } = req.body;

    const existAccount = await AccountUser.findOne({ email });

    if (existAccount) {
      return res
        .status(400)
        .json({ code: "error", message: "Email already in use" });
    }

    // hash pass
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new AccountUser({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { registerPostController };
