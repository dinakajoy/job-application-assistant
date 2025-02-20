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

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors: any = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  res.status(422).json({
    status: "error",
    error: `Invalid value for ${errors.array()[0].path}`,
  });
};
