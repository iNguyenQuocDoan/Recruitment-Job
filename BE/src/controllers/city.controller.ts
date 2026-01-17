import { Request, Response } from "express";
import City from "../models/city.model";

const list = async (req: Request, res: Response) => {
  const cities = await City.find({});

  return res.json({ code: "success", cityList: cities });
};

export { list };
