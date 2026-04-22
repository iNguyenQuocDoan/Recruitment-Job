import { Router } from "express";
import * as cityController from "../controllers/city.controller";

const router = Router();

router.get("/list", cityController.listCityController);

export default router;
