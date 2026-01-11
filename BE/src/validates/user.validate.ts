import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const registerPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    fullName: Joi.string().min(5).max(50).required().messages({
      "string.empty": "Vui lòng nhập họ và tên!",
      "string.min": "Vui lòng nhập họ và tên ít nhất 5 ký tự!",
      "string.max": "Vui lòng nhập họ và tên dưới 50 ký tự",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "Vui lòng nhập email",
      "string.email": "Vui lòng nhập đúng định dạng email",
    }),
    password: Joi.string()
      .required()
      .min(8)
      .custom((value, helpers) => {
        if (!/[A-Z]/.test(value)) {
          throw new Error("Mật khẩu phải chứa ít nhất một chữ cái in hoa!");
        }

        if (!/[a-z]/.test(value)) {
          throw new Error("Mật khẩu phải chứa ít nhất một chữ cái thường!");
        }

        if (!/\d/.test(value)) {
          throw new Error("Mật khẩu phải chứa ít nhất một chữ số!");
        }

        if (!/[@$!%*?&]/.test(value)) {
          throw new Error("Mật khẩu phải chứa ít nhất một ký tự đặc biệt!");
        }

        return value;
      })
      .messages({
        "string.empty": "Vui lòng nhập mật khẩu!",
        "string.min": "Mật khẩu phải có ít nhất 8 ký tự!",
      }),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    const errMessage = error.details[1].message;
    return res.json({
      code: "error",
      message: errMessage,
    });
  }
  next();
};

export { registerPost };
