import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const jobDescriptionValidation = () => [
  body("description")
    .not()
    .isEmpty()
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Job description must be at least 10 characters long"),
];

export const resumeAndJobDescriptionValidation = () => [
  body("description")
    .not()
    .isEmpty()
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Job description must be at least 10 characters long"),
  body("resume").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Resume file is required");
    }
    if (req.file.mimetype !== "application/pdf") {
      throw new Error("Only PDF format is allowed");
    }
    return true;
  }),
];

export const coverLetterValidation = () => [
  body("applicantName")
    .notEmpty()
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Applicant name is required"),
  body("description")
    .not()
    .isEmpty()
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Job description must be at least 10 characters long"),
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
