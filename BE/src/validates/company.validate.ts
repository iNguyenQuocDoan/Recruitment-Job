import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const registerPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    companyName: Joi.string().min(5).max(50).required().messages({
      "string.empty": "Vui lòng nhập tên công ty!",
      "string.min": "Vui lòng nhập tên công ty ít nhất 5 ký tự!",
      "string.max": "Vui lòng nhập tên công ty dưới 50 ký tự",
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

const loginPost = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
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

const profilePatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    companyName: Joi.string().min(3).max(50).required().messages({
      "string.empty": "Vui lòng nhập tên công ty!",
      "string.min": "Vui lòng nhập tên công ty ít nhất 3 ký tự!",
      "string.max": "Vui lòng nhập tên công ty dưới 50 ký tự",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "Vui lòng nhập email",
      "string.email": "Vui lòng nhập đúng định dạng email",
    }),
    phone: Joi.string().min(10).max(15).optional().allow("").messages({
      "string.min": "Số điện thoại phải có ít nhất 10 ký tự",
      "string.max": "Số điện thoại không được vượt quá 15 ký tự",
    }),
    city: Joi.string().optional().allow(""),
    address: Joi.string().min(5).required().messages({
      "string.empty": "Vui lòng nhập địa chỉ!",
      "string.min": "Địa chỉ phải có ít nhất 5 ký tự",
    }),
    companyModel: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập mô hình công ty!",
    }),
    companyEmployees: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập quy mô công ty!",
    }),
    workingTime: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập thời gian làm việc!",
    }),
    workOvertime: Joi.string().optional().allow(""),
    description: Joi.string().min(20).required().messages({
      "string.empty": "Vui lòng nhập mô tả chi tiết!",
      "string.min": "Mô tả chi tiết phải có ít nhất 20 ký tự",
    }),
  }).unknown(true);
  const { error } = schema.validate(req.body);
  if (error) {
    const errMessage = error.details[0].message;
    return res.json({
      code: "error",
      message: errMessage,
    });
  }
  next();
};

export { registerPost, loginPost, profilePatch };
