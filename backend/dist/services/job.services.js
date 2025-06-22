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
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are an AI job coach. Extract the key skills, responsibilities, and required experience from the following job description.",
            },
            {
                role: "user",
                content: jobDescription,
            },
        ],
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
        model: "gpt-4-turbo",
        messages: [
            {
                role: "system",
                content: "You are a professional resume coach helping job seekers improve their resumes to match job descriptions. Carefully analyze both the job description and resume. Think step by step, and return specific, actionable improvement suggestions in JSON format.",
            },
            {
                role: "user",
                content: `
        Here is the job description:
        
        ${jobDescription}
        
        Here is the user's resume:
        
        ${resumeText}
        
        Step by step:
        1. Identify important skills, tools, or experiences required by the job.
        2. Review the resume and note missing or under-emphasized items.
        3. Suggest 3–5 specific changes or additions to improve alignment with the job.
        4. Provide your suggestions clearly with explanations.
        
        Return your response in the following JSON format:
        
        "improvements\": [\n    {\n      \"missing\": \"Name of missing skill/requirement\",\n      \"suggestion\": \"How to add or emphasize it in the resume\",\n      \"section\": \"Recommended resume section (e.g. Experience, Skills,  Projects)\"\n    },\n    ...\n  ]\n}"
        
        Do not rewrite the resume, just provide actionable improvement hints.
        `,
            },
        ],
    });
    const result = JSON.parse(((_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim()) || "");
    return result.improvements || [];
});
exports.getResumeImprovements = getResumeImprovements;
const getCoverLetter = (applicantName, jobDescription, resume) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const userPrompt = `
    ${applicantName ? `The applicant's name is ${applicantName.trim()}.` : ""}
    Here is the job description:
    ${jobDescription}

    Here is the applicant's resume:
    ${resume}

    Please generate a professional, personalized cover letter tailored to this job. 
    Follow this format:
    1. Brief introduction and expression of interest
    2. Paragraph summarizing relevant experience and skills
    3. Paragraph showing alignment with the job description
    4. Closing with enthusiasm and invitation to connect

    Do not include markdown or formatting instructions. Just return the plain cover letter.
    `;
    const response = yield openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            {
                role: "system",
                content: "You are a senior career coach and professional writer. You craft personalized, persuasive cover letters that align a candidate’s experience and skills with the job description. Follow modern formatting and tone, and highlight key qualifications naturally.",
            },
            {
                role: "user",
                content: userPrompt,
            },
        ],
        max_tokens: 600,
    });
    return (((_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim()) ||
        "Failed to generate cover letter.");
});
exports.getCoverLetter = getCoverLetter;
