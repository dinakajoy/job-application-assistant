"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.coverLetterValidation = exports.resumeAndJobDescriptionValidation = exports.jobDescriptionValidation = void 0;
const express_validator_1 = require("express-validator");
const jobDescriptionValidation = () => [
    (0, express_validator_1.body)("jobDescription")
        .not()
        .isEmpty()
        .trim()
        .isLength({ min: 10 })
        .escape()
        .withMessage("Job description must be at least 10 characters long"),
];
exports.jobDescriptionValidation = jobDescriptionValidation;
const resumeAndJobDescriptionValidation = () => [
    (0, express_validator_1.body)("jobDescription")
        .not()
        .isEmpty()
        .trim()
        .isLength({ min: 10 })
        .escape()
        .withMessage("Job description must be at least 10 characters long"),
    (0, express_validator_1.body)("resume").custom((value, { req }) => {
        if (!req.file) {
            throw new Error("Resume file is required");
        }
        if (req.file.mimetype !== "application/pdf") {
            throw new Error("Only PDF format is allowed");
        }
        return true;
    }),
];
exports.resumeAndJobDescriptionValidation = resumeAndJobDescriptionValidation;
const coverLetterValidation = () => [
    (0, express_validator_1.body)("applicantName").trim().escape(),
    (0, express_validator_1.body)("resume").trim().escape(),
    (0, express_validator_1.body)("jobDescription")
        .not()
        .isEmpty()
        .trim()
        .isLength({ min: 10 })
        .escape()
        .withMessage("Job description must be at least 10 characters long"),
];
exports.coverLetterValidation = coverLetterValidation;
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    res.status(422).json({
        status: "error",
        message: `Invalid value for ${errors.array()[0].path}`,
    });
};
exports.validate = validate;
