import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { RESPONSE_CODE } from "../constants/http.constant";

const submitPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    jobId: Joi.string()
      .regex(/^[a-f\d]{24}$/i)
      .required()
      .messages({
        "string.empty": "Please provide the job id!",
        "string.pattern.base": "Invalid job id!",
      }),
    fullName: Joi.string().min(3).max(50).required().messages({
      "string.empty": "Please enter your full name!",
      "string.min": "Full name must be at least 3 characters!",
      "string.max": "Full name must be under 50 characters!",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "Please enter your email!",
      "string.email": "Please enter a valid email address!",
    }),
    phone: Joi.string().min(10).max(15).required().messages({
      "string.empty": "Please enter your phone number!",
      "string.min": "Phone number must be at least 10 characters!",
      "string.max": "Phone number must not exceed 15 characters!",
    }),
  }).unknown(true);

  const { error } = schema.validate(req.body);
  if (error) {
    const errMessage = error.details[0].message;
    return res.json({
      code: RESPONSE_CODE.ERROR,
      message: errMessage,
    });
  }
  next();
};

export { submitPost };
