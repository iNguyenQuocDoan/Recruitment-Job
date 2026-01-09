import { Request, Response } from "express";

const registerPostController = (req: Request, res: Response) => {
  console.log("Received registration data:", req.body);

  return res.json({ message: "User registered successfully" });
};

export { registerPostController };
