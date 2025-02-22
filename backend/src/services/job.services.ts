import OpenAI from "openai";
import config from "config";

const apiKey = config.get("environment.apiKey") as string;

const openai = new OpenAI({ apiKey });

export const jobDescriptionAnalyzer = async (jobDescription: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant that extracts key skills and responsibilities from job descriptions.",
      },
      {
        role: "user",
        content: `Extract key skills and responsibilities from this job description:\n${jobDescription}`,
      },
    ],
    max_tokens: 200,
  });

  return response.choices[0]?.message?.content?.trim() || "";
};

export const resumeForJobDescriptionAnalyzer = async (
  jobDescription: string,
  resumeText: string
): Promise<number> => {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant that compares a resume against a job description and provides a match percentage based on skill relevance.",
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
};

export const getResumeImprovements = async (
  jobDescription: string,
  resumeText: string
): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant that suggests missing keywords in a resume based on a given job description to improve its relevance.",
      },
      {
        role: "user",
        content: `Analyze the following resume and job description. Suggest missing keywords or phrases that the resume should include to better match the job description.\n\nResume:\n${resumeText}\n\nJob Description:\n${jobDescription}\n\nRespond in JSON format: { "suggestedKeywords": ["keyword1", "keyword2", ...] }`,
      },
    ],
    max_tokens: 150,
  });
  const result = JSON.parse(
    response.choices[0]?.message?.content?.trim() || ""
  );

  return result.suggestedKeywords || [];
};

export const getCoverLetter = async (
  applicantName: string,
  jobDescription: string,
  resume: string
): Promise<string> => {
  let userPrompt = `Write a professional cover letter for the following job description:\n${jobDescription}`;

  if (applicantName) {
    userPrompt = `The applicant's name is ${applicantName}.\n` + userPrompt;
  }

  if (resume) {
    userPrompt += `\nHere is the applicant's resume:\n${resume}`;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant that generates tailored cover letters based on job descriptions.",
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    max_tokens: 300,
  });

  const coverLetter =
    response.choices[0]?.message?.content?.trim() ||
    "Failed to generate cover letter.";

  return coverLetter;
};
