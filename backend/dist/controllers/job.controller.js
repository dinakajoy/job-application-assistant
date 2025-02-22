"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCoverLetter = exports.suggestResumeImprovements = exports.analyzeResumeForJob = exports.analyzeJobDescription = void 0;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const job_services_1 = require("../services/job.services");
const logger_1 = __importDefault(require("../utils/logger"));
const analyzeJobDescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobDescription } = req.body;
        if (!jobDescription) {
            res
                .status(400)
                .json({ status: "error", message: "Job description is required" });
            return;
        }
        const payload = yield (0, job_services_1.jobDescriptionAnalyzer)(jobDescription);
        res.status(200).json({ status: "success", payload });
        return;
    }
    catch (error) {
        logger_1.default.error(`analyzeJobDescription Controller Error: ${error.message}`);
        res
            .status(500)
            .json({ status: "error", message: "Failed to analyze job description" });
        return;
    }
});
exports.analyzeJobDescription = analyzeJobDescription;
const analyzeResumeForJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobDescription } = req.body;
        if (!jobDescription) {
            res
                .status(400)
                .json({ status: "error", message: "Job description is required" });
            return;
        }
        const resumeFile = req.file;
        if (!resumeFile) {
            res
                .status(400)
                .json({ status: "error", message: "Resume file is required" });
            return;
        }
        const pdfText = yield (0, pdf_parse_1.default)(resumeFile.buffer);
        const resumeText = pdfText.text;
        const matchScore = yield (0, job_services_1.resumeForJobDescriptionAnalyzer)(jobDescription, resumeText);
        res.status(200).json({
            status: "success",
            payload: `${matchScore}`,
        });
        return;
    }
    catch (error) {
        logger_1.default.error(`analyzeResumeForJob Controller Error: ${error.message}`);
        res
            .status(500)
            .json({ status: "error", message: "Failed to analyze resume" });
        return;
    }
});
exports.analyzeResumeForJob = analyzeResumeForJob;
const suggestResumeImprovements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobDescription } = req.body;
        if (!jobDescription) {
            res
                .status(400)
                .json({ status: "error", message: "Job description is required" });
            return;
        }
        const resumeFile = req.file;
        if (!resumeFile) {
            res
                .status(400)
                .json({ status: "error", message: "Resume file is required" });
            return;
        }
        const pdfText = yield (0, pdf_parse_1.default)(resumeFile.buffer);
        const resumeText = pdfText.text;
        const suggestedKeywords = yield (0, job_services_1.getResumeImprovements)(jobDescription, resumeText);
        res.status(200).json({
            status: "success",
            payload: suggestedKeywords,
        });
        return;
    }
    catch (error) {
        logger_1.default.error(`suggestResumeImprovements Controller Error: ${error.message}`);
        res.status(500).json({
            status: "error",
            message: "Failed to suggest resume improvements",
        });
        return;
    }
});
exports.suggestResumeImprovements = suggestResumeImprovements;
const generateCoverLetter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { applicantName, jobDescription, resume } = req.body;
        if (!jobDescription) {
            res
                .status(400)
                .json({ status: "error", message: "Job description is required" });
            return;
        }
        const payload = yield (0, job_services_1.getCoverLetter)(applicantName, jobDescription, resume);
        res.status(200).json({ status: "success", payload });
        return;
    }
    catch (error) {
        logger_1.default.error(`generateCoverLetter Controller Error: ${error.message}`);
        res
            .status(500)
            .json({ status: "error", message: "Failed to generate cover letter" });
        return;
    }
});
exports.generateCoverLetter = generateCoverLetter;
