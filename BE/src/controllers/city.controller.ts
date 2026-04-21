import { Request, Response } from "express";
import { listCitiesService } from "../services/city.service";

const list = async (req: Request, res: Response) => {
  const result = await listCitiesService();
  return res.status(result.statusCode).json(result.body);
};

export { list };
