import { Router } from "express";

import {
  detailCompanyPublicController,
  detailJobController,
  listCompanyPublicController,
  listJobController,
} from "../controllers/job.controller";

const router = Router();

router.get("/list", listJobController);
router.get("/detail/:id", detailJobController);
router.get("/company/list", listCompanyPublicController);
router.get("/company/detail/:id", detailCompanyPublicController);

export default router;
