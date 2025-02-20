"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = __importDefault(require("../middlewares/upload"));
const job_validation_1 = require("../validations/job.validation");
const job_controller_1 = require("../controllers/job.controller");
const router = (0, express_1.Router)();
router.post("/analyze", (0, job_validation_1.jobDescriptionValidation)(), job_validation_1.validate, job_controller_1.analyzeJobDescription);
router.post("/match-resume", upload_1.default.single("resume"), (0, job_validation_1.resumeAndJobDescriptionValidation)(), job_validation_1.validate, job_controller_1.analyzeResumeForJob);
router.post("/resume-improvements", (0, job_validation_1.resumeAndJobDescriptionValidation)(), job_validation_1.validate, job_controller_1.suggestResumeImprovements);
router.post("/generate-cover-letter", (0, job_validation_1.coverLetterValidation)(), job_validation_1.validate, job_controller_1.generateCoverLetter);
exports.default = router;
