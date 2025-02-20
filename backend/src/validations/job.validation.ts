import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const jobValidation = () => [
  body("description")
    .not()
    .isEmpty()
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Job description must be at least 10 characters long"),
];

export const matchResumeValidation = () => [
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
