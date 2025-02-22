import { Router } from "express";
import upload from "../middlewares/upload";
import {
  coverLetterValidation,
  jobDescriptionValidation,
  resumeAndJobDescriptionValidation,
  validate,
} from "../validations/job.validation";
import {
  analyzeJobDescription,
  analyzeResumeForJob,
  generateCoverLetter,
  suggestResumeImprovements,
} from "../controllers/job.controller";

const router = Router();

router.post(
  "/analyze",
  jobDescriptionValidation(),
  validate,
  analyzeJobDescription
);

router.post(
  "/match-resume",
  upload.single("resume"),
  resumeAndJobDescriptionValidation(),
  validate,
  analyzeResumeForJob
);

router.post(
  "/resume-improvements",
  upload.single("resume"),
  resumeAndJobDescriptionValidation(),
  validate,
  suggestResumeImprovements
);

router.post(
  "/generate-cover-letter",
  coverLetterValidation(),
  validate,
  generateCoverLetter
);

export default router;
