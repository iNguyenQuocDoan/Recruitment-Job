import jwt from "jsonwebtoken";

export const generateToken = (payload: {
  id: string;
  email: string;
  role?: "user" | "company" | "admin";
}): string => {
  return jwt.sign(payload, `${process.env.JWT_SECRET}`, {
    expiresIn: "7d",
  });
};
