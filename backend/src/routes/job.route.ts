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
  rewriteResumeForJob,
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
  "/rewrite-resume",
  upload.single("resume"),
  // rewriteResumeForJobValidation(),
  // validate,
  rewriteResumeForJob
);

router.post(
  "/generate-cover-letter",
  upload.single("resume"),
  optionalResumeAndJobDescriptionValidation(),
  validate,
  generateCoverLetter
);

router.post(
  "/generate-email-content",
  upload.single("resume"),
  optionalResumeAndJobDescriptionValidation(),
  validate,
  generateEmailContent
);

export default router;
