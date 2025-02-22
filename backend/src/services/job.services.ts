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

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
  });

  return response.choices[0]?.message?.content || "No suggestions available";
};

export const getCoverLetter = async (
  applicantName: string,
  jobDescription: string
): Promise<string> => {
  const prompt = `Generate a professional cover letter for ${applicantName} applying for this job:\n\n"${jobDescription}"\n\n The cover letter should be formal and engaging.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
  });

  const coverLetter =
    response.choices[0]?.message?.content?.trim() ||
    "Failed to generate cover letter.";

  return coverLetter;
};
