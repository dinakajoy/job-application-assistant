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
exports.getCoverLetter = exports.getResumeImprovements = exports.resumeForJobDescriptionAnalyzer = exports.jobDescriptionAnalyzer = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("config"));
const apiKey = config_1.default.get("environment.apiKey");
const openai = new openai_1.default({ apiKey });
const jobDescriptionAnalyzer = (jobDescription) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const response = yield openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "You are an AI assistant that extracts key skills and responsibilities from job descriptions.",
            },
            {
                role: "user",
                content: `Extract key skills and responsibilities from this job description:\n${jobDescription}`,
            },
        ],
        max_tokens: 200,
    });
    return ((_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim()) || "";
});
exports.jobDescriptionAnalyzer = jobDescriptionAnalyzer;
const resumeForJobDescriptionAnalyzer = (jobDescription, resumeText) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "You are an AI assistant that compares a resume against a job description and provides a match percentage based on skill relevance.",
            },
            {
                role: "user",
                content: `Compare this resume to the job description and return a match percentage from 0% to 100% based on skills and experience relevance.\n\nResume:\n${resumeText}\n\nJob Description:\n${jobDescription}\n\nRespond in the format: {"matchPercentage": number}`,
            },
        ],
        max_tokens: 100,
    });
    const matchData = JSON.parse(response.choices[0].message.content || "");
    return matchData.matchPercentage || 0;
});
exports.resumeForJobDescriptionAnalyzer = resumeForJobDescriptionAnalyzer;
const getResumeImprovements = (jobDescription, resumeText) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const response = yield openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "You are an AI assistant that suggests missing keywords in a resume based on a given job description to improve its relevance.",
            },
            {
                role: "user",
                content: `Analyze the following resume and job description. Suggest missing keywords or phrases that the resume should include to better match the job description.\n\nResume:\n${resumeText}\n\nJob Description:\n${jobDescription}\n\nRespond in JSON format: { "suggestedKeywords": ["keyword1", "keyword2", ...] }`,
            },
        ],
        max_tokens: 150,
    });
    const result = JSON.parse(((_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim()) || "");
    return result.suggestedKeywords || [];
});
exports.getResumeImprovements = getResumeImprovements;
const getCoverLetter = (applicantName, jobDescription, resume) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let userPrompt = `Write a professional cover letter for the following job description:\n${jobDescription}`;
    if (applicantName) {
        userPrompt = `The applicant's name is ${applicantName}.\n` + userPrompt;
    }
    if (resume) {
        userPrompt += `\nHere is the applicant's resume:\n${resume}`;
    }
    const response = yield openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "You are an AI assistant that generates tailored cover letters based on job descriptions.",
            },
            {
                role: "user",
                content: userPrompt,
            },
        ],
        max_tokens: 300,
    });
    const coverLetter = ((_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim()) ||
        "Failed to generate cover letter.";
    return coverLetter;
});
exports.getCoverLetter = getCoverLetter;
