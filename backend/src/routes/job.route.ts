import { Router } from "express";
import upload from "../middlewares/upload";
import { analyzeJob, analyzeResumeForJob } from "../controllers/job.controller";
import {
  jobValidation,
  matchResumeValidation,
  validate,
} from "../validations/job.validation";

const router = Router();

router.post("/analyze", jobValidation(), validate, analyzeJob);

router.post(
  "/match-resume",
  upload.single("resume"),
  matchResumeValidation(),
  validate,
  analyzeResumeForJob
);

export default router;
