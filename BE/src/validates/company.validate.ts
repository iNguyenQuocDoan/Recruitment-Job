import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const registerPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    companyName: Joi.string().min(5).max(50).required().messages({
      "string.empty": "Please enter the company name!",
      "string.min": "Company name must be at least 5 characters!",
      "string.max": "Company name must be under 50 characters!",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "Please enter your email!",
      "string.email": "Please enter a valid email address!",
    }),
    password: Joi.string()
      .required()
      .min(8)
      .custom((value, helpers) => {
        if (!/[A-Z]/.test(value)) {
          throw new Error("Password must contain at least one uppercase letter!");
        }

        if (!/[a-z]/.test(value)) {
          throw new Error("Password must contain at least one lowercase letter!");
        }

        if (!/\d/.test(value)) {
          throw new Error("Password must contain at least one number!");
        }

        if (!/[@$!%*?&]/.test(value)) {
          throw new Error("Password must contain at least one special character!");
        }

        return value;
      })
      .messages({
        "string.empty": "Please enter your password!",
        "string.min": "Password must be at least 8 characters!",
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
      "string.empty": "Please enter your email!",
      "string.email": "Please enter a valid email address!",
    }),
    password: Joi.string()
      .required()
      .min(8)
      .custom((value, helpers) => {
        if (!/[A-Z]/.test(value)) {
          throw new Error("Password must contain at least one uppercase letter!");
        }

        if (!/[a-z]/.test(value)) {
          throw new Error("Password must contain at least one lowercase letter!");
        }

        if (!/\d/.test(value)) {
          throw new Error("Password must contain at least one number!");
        }

        if (!/[@$!%*?&]/.test(value)) {
          throw new Error("Password must contain at least one special character!");
        }

        return value;
      })
      .messages({
        "string.empty": "Please enter your password!",
        "string.min": "Password must be at least 8 characters!",
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
      "string.empty": "Please enter the company name!",
      "string.min": "Company name must be at least 3 characters!",
      "string.max": "Company name must be under 50 characters!",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "Please enter your email!",
      "string.email": "Please enter a valid email address!",
    }),
    phone: Joi.string().min(10).max(15).optional().allow("").messages({
      "string.min": "Phone number must be at least 10 characters!",
      "string.max": "Phone number must not exceed 15 characters!",
    }),
    city: Joi.string().optional().allow(""),
    address: Joi.string().min(5).required().messages({
      "string.empty": "Please enter the address!",
      "string.min": "Address must be at least 5 characters!",
    }),
    companyModel: Joi.string().required().messages({
      "string.empty": "Please enter the company model!",
    }),
    companyEmployees: Joi.string().required().messages({
      "string.empty": "Please enter the company size!",
    }),
    workingTime: Joi.string().required().messages({
      "string.empty": "Please enter the working time!",
    }),
    workOvertime: Joi.string().optional().allow(""),
    description: Joi.string().min(20).required().messages({
      "string.empty": "Please enter a detailed description!",
      "string.min": "Description must be at least 20 characters!",
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
