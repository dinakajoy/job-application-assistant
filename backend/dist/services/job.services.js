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
const jobDescriptionAnalyzer = (description) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const prompt = `Extract key skills and responsibilities from this job description:\n${description}`;
    const response = yield openai.completions.create({
        model: "gpt-4",
        prompt,
        max_tokens: 200,
    });
    return ((_a = response.choices[0].text) === null || _a === void 0 ? void 0 : _a.trim()) || "";
});
exports.jobDescriptionAnalyzer = jobDescriptionAnalyzer;
const resumeForJobDescriptionAnalyzer = (jobDescription, resumeText) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = `
    You are an AI that calculates a match percentage between a job description and a resume.
    - Analyze the job description and extract required skills.
    - Analyze the resume and extract listed skills and experience.
    - Compare both and return a match percentage (0-100%).
  
    Job Description:
    ${jobDescription}
  
    Resume:
    ${resumeText}
  
    Output format:
    { "matchPercentage": 75 } (example)
    `;
    const response = yield openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
    });
    const matchData = JSON.parse(response.choices[0].message.content || "{}");
    return matchData.matchPercentage || 0;
});
exports.resumeForJobDescriptionAnalyzer = resumeForJobDescriptionAnalyzer;
const getResumeImprovements = (jobDescription, resumeText) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const prompt = `
      Analyze the following resume and job description.
      Identify missing keywords or skills from the job description that should be in the resume.
      Suggest specific improvements.

      Job Description:
      ${jobDescription}

      Resume:
      ${resumeText}

      Provide a list of missing keywords and a short improvement suggestion.
    `;
    const response = yield openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
    });
    return ((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "No suggestions available";
});
exports.getResumeImprovements = getResumeImprovements;
const getCoverLetter = (applicantName, description) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const prompt = `Generate a professional cover letter for ${applicantName} applying for this job:\n\n"${description}"\n\n The cover letter should be formal and engaging.`;
    const response = yield openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
    });
    const coverLetter = ((_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim()) ||
        "Failed to generate cover letter.";
    return coverLetter;
});
exports.getCoverLetter = getCoverLetter;
