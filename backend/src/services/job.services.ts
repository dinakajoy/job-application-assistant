import OpenAI from "openai";
import config from "config";

const apiKey = config.get("environment.apiKey") as string;

const openai = new OpenAI({ apiKey });

async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

function cosineSimilarity(vecA: number[], vecB: number[]) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Function Calling with LLM - OpenAI, JSON schema
export const jobDescriptionAnalyzer = async (jobDescription: string) => {
  const tools = {
    name: "extract_job_insights",
    description:
      "Extracts the key skills, responsibilities, and experience from a job description.",
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

  const response = await openai.chat.completions.create({
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

  const functionArgs =
    response.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments ??
    "{}";

  return JSON.parse(functionArgs) || {};
};

// Embedding similarity + LLM natural explanation - OpenAI, calculations
export const resumeForJobDescriptionAnalyzer = async (
  jobDescription: string,
  resumeText: string
) => {
  const [resumeEmbedding, jobEmbedding] = await Promise.all([
    getEmbedding(resumeText),
    getEmbedding(jobDescription),
  ]);

  const score = cosineSimilarity(resumeEmbedding, jobEmbedding);

  let explanation = "";
  let prompt;
  if (score >= 0.7) {
    prompt = `Does the following resume match the job description? Highlight why or why not.`;
  } else {
    prompt = `Why is the following resume not a good match for the job description? Be specific and suggest improvements.`;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are an expert recruiter that compares a resume against a job description based on skill relevance.",
      },
      {
        role: "user",
        content: `${prompt}\n\nJob Description:\n${jobDescription}\n\nResume:\n${resumeText}`,
      },
    ],
  });
  explanation = response.choices[0].message.content || "";

  return { score: Number((score * 100).toFixed(2)), explanation };
};

// Function Calling with LLM feedback - OpenAI, structured prompt
export const getResumeImprovements = async (
  jobDescription: string,
  resumeText: string
): Promise<string> => {
  const functionSchema = {
    name: "suggest_resume_improvements",
    description: "Suggest improvements to a resume for a given job description",
    parameters: {
      type: "object",
      properties: {
        missing_skills: {
          type: "array",
          items: { type: "string" },
          description:
            "List of important skills missing in the resume based on the job description",
        },
        formatting_tips: {
          type: "array",
          items: { type: "string" },
          description:
            "Suggestions to improve readability, structure, or style of the resume",
        },
        keyword_optimization: {
          type: "array",
          items: { type: "string" },
          description:
            "Recommendations to align resume keywords with the job description",
        },
      },
      required: ["missing_skills", "formatting_tips", "keyword_optimization"],
      additionalProperties: false,
    },
    strict: true,
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content:
          "You are a professional resume coach helping job seekers improve their resumes to match job descriptions. Carefully analyze both the job description and resume.",
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

  const functionArgs =
    response.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments ??
    "{}";

  return JSON.parse(functionArgs) || {};
};

// Prompting via template with resume and job description - OpenAI, prompt templates
export const getCoverLetter = async (
  applicantName: string,
  jobDescription: string,
  resume: string
): Promise<string> => {
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

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a senior career coach and professional writer. You craft personalized, persuasive cover letters that align a candidate’s experience and skills with the job description. Follow modern formatting and tone, and highlight key qualifications naturally.",
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    max_tokens: 600,
    temperature: 0.5,
  });

  return (
    response.choices[0]?.message?.content?.trim() ||
    "Failed to generate cover letter."
  );
};
