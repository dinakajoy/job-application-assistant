import { Router } from "express";
import { analyzeJob } from "../controllers/job.controller";
import { jobValidation, validate } from "../validations/job.validation";

const router = Router();

router.post("/analyze", jobValidation(), validate, analyzeJob);

export default router;
