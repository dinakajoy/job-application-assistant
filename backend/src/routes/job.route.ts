import { Router } from "express";
import upload from "../middlewares/upload";
import {
  jobDescriptionValidation,
  optionalResumeAndJobDescriptionValidation,
  resumeAndJobDescriptionValidation,
  rewriteResumeForJobValidation,
  validate,
} from "../validations/job.validation";
import {
  analyzeJobDescription,
  analyzeResumeForJob,
  generateCoverLetter,
  generateEmailContent,
  prepareJobData,
  rewriteResumeForJob,
  suggestResumeImprovements,
} from "../controllers/job.controller";

const router = Router();

router.post(
  "/prepare",
  upload.single("resume"),
  optionalResumeAndJobDescriptionValidation(),
  validate,
  prepareJobData
);

router.post(
  "/analyze",
  jobDescriptionValidation(),
  validate,
  analyzeJobDescription
);

router.post(
  "/match-resume",
  resumeAndJobDescriptionValidation(),
  validate,
  analyzeResumeForJob
);

router.post(
  "/resume-improvements",
  resumeAndJobDescriptionValidation(),
  validate,
  suggestResumeImprovements
);

router.post(
  "/rewrite-resume",
  rewriteResumeForJobValidation(),
  validate,
  rewriteResumeForJob
);

router.post(
  "/generate-cover-letter",
  optionalResumeAndJobDescriptionValidation(),
  validate,
  generateCoverLetter
);

router.post(
  "/generate-email-content",
  optionalResumeAndJobDescriptionValidation(),
  validate,
  generateEmailContent
);

export default router;
