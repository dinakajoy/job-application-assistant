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
function getEmbedding(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
        });
        return response.data[0].embedding;
    });
}
function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}
const jobDescriptionAnalyzer = (jobDescription) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const tools = {
        name: "extract_job_insights",
        description: "Extracts the key skills, responsibilities, and experience from a job description.",
        parameters: {
            type: "object",
            properties: {
                skills: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of key skills required for the job",
                },
                responsibilities: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of responsibilities for the job",
                },
                experience: {
                    type: "array",
                    items: { type: "string" },
                    description: "Experience or qualifications required for the job",
                },
            },
            required: ["skills", "responsibilities", "experience"],
            additionalProperties: false,
        },
        strict: true,
    };
    const response = yield openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            {
                role: "system",
                content: "You are an AI job coach.",
            },
            {
                role: "user",
                content: `Extract the key skills, responsibilities, and required experience from the following job description:\n\n${jobDescription}`,
            },
        ],
        tools: [
            {
                type: "function",
                function: tools,
            },
        ],
        store: true,
    });
    const functionArgs = (_g = (_f = (_e = (_d = (_c = (_b = (_a = response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.tool_calls) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.function) === null || _f === void 0 ? void 0 : _f.arguments) !== null && _g !== void 0 ? _g : "{}";
    return JSON.parse(functionArgs) || {};
});
exports.jobDescriptionAnalyzer = jobDescriptionAnalyzer;
const resumeForJobDescriptionAnalyzer = (jobDescription, resumeText) => __awaiter(void 0, void 0, void 0, function* () {
    const [resumeEmbedding, jobEmbedding] = yield Promise.all([
        getEmbedding(resumeText),
        getEmbedding(jobDescription),
    ]);
    const score = cosineSimilarity(resumeEmbedding, jobEmbedding);
    let explanation = "";
    let prompt;
    if (score >= 0.7) {
        prompt = `Does the following resume match the job description? Highlight why or why not.`;
    }
    else {
        prompt = `Why is the following resume not a good match for the job description? Be specific and suggest improvements.`;
    }
    const response = yield openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "You are an expert recruiter that compares a resume against a job description based on skill relevance.",
            },
            {
                role: "user",
                content: `${prompt}\n\nJob Description:\n${jobDescription}\n\nResume:\n${resumeText}`,
            },
        ],
    });
    explanation = response.choices[0].message.content || "";
    return { score: Number((score * 100).toFixed(2)), explanation };
});
exports.resumeForJobDescriptionAnalyzer = resumeForJobDescriptionAnalyzer;
const getResumeImprovements = (jobDescription, resumeText) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const functionSchema = {
        name: "suggest_resume_improvements",
        description: "Suggest improvements to a resume for a given job description",
        parameters: {
            type: "object",
            properties: {
                missing_skills: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of important skills missing in the resume based on the job description",
                },
                formatting_tips: {
                    type: "array",
                    items: { type: "string" },
                    description: "Suggestions to improve readability, structure, or style of the resume",
                },
                keyword_optimization: {
                    type: "array",
                    items: { type: "string" },
                    description: "Recommendations to align resume keywords with the job description",
                },
            },
            required: ["missing_skills", "formatting_tips", "keyword_optimization"],
            additionalProperties: false,
        },
        strict: true,
    };
    const response = yield openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            {
                role: "system",
                content: "You are a professional resume coach helping job seekers improve their resumes to match job descriptions. Carefully analyze both the job description and resume.",
            },
            {
                role: "user",
                content: `Given the following job description and resume, suggest improvements in terms of missing skills, formatting, and keyword relevance.
  
        Job Description:
        ${jobDescription}
        
        Resume:
        ${resumeText}

        Do not rewrite the resume, just provide actionable improvement hints.
        `,
            },
        ],
        tools: [
            {
                type: "function",
                function: functionSchema,
            },
        ],
        store: true,
    });
    const functionArgs = (_g = (_f = (_e = (_d = (_c = (_b = (_a = response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.tool_calls) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.function) === null || _f === void 0 ? void 0 : _f.arguments) !== null && _g !== void 0 ? _g : "{}";
    return JSON.parse(functionArgs) || {};
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

    Do not include markdown or formatting instructions. Just return the plain cover letter with no address, just salutation.
    Each paragraph should not be more than 3 sentences.
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
        temperature: 0.5,
    });
    return (((_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim()) ||
        "Failed to generate cover letter.");
});
exports.getCoverLetter = getCoverLetter;
