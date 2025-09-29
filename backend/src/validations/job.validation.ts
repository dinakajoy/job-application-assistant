import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const jobDescriptionValidation = () => [
  body("jobDescription")
    .not()
    .isEmpty()
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Job description must be at least 10 characters long"),
];

export const resumeAndJobDescriptionValidation = () => [
  body("jobDescription")
    .not()
    .isEmpty()
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Job description must be at least 10 characters long"),
  body("resumeText")
    .not()
    .isEmpty()
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Resume file is requiredg"),
];

export const rewriteResumeForJobValidation = () => [
  body("jobAnalysis").custom((value) => {
    if (typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Job Analysis must be an object");
    }
    const requiredFields = ["experience", "responsibilities", "skills"];
    for (const field of requiredFields) {
      if (!(field in value)) {
        throw new Error(`"Job Analysis must include the field: ${field}`);
      }
    }
    return true;
  }),
  body("resumeMatch").custom((value) => {
    if (typeof value !== "object" || Array.isArray(value)) {
      throw new Error("resumeMatch must be an object");
    }
    const requiredFields = ["explanation", "score"];
    for (const field of requiredFields) {
      if (!(field in value)) {
        throw new Error(`resumeMatch must include the field: ${field}`);
      }
    }
    return true;
  }),
  body("resumeTips").custom((value) => {
    if (typeof value !== "object" || Array.isArray(value)) {
      throw new Error("resumeTips must be an object");
    }
    const requiredFields = [
      "formatting_tips",
      "keyword_optimization",
      "missing_skills",
    ];
    for (const field of requiredFields) {
      if (!(field in value)) {
        throw new Error(`resumeTips must include the field: ${field}`);
      }
    }
    return true;
  }),
  body("resumeText")
    .not()
    .isEmpty()
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Resume file is requiredg"),
];

export const optionalResumeAndJobDescriptionValidation = () => [
  body("applicantName").optional().trim().escape(),
  body("jobDescription")
    .not()
    .isEmpty()
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Job description must be at least 10 characters long"),
  body("resumeText").optional().trim().escape(),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors: any = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  res.status(422).json({
    status: "error",
    message: `Invalid value for ${errors.array()[0].path}`,
  });
};
