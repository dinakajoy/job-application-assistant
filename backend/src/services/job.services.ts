import OpenAI from "openai";
import config from "config";

const apiKey = config.get("environment.apiKey") as string;

const openai = new OpenAI({ apiKey });

export const analyzeJobDescription = async (description: string) => {
  const prompt = `Extract key skills and responsibilities from this job description:\n${description}`;

  const response = await openai.completions.create({
    model: "gpt-4",
    prompt,
    max_tokens: 200,
  });

  return response.choices[0].text?.trim();
};

export const analyzeResumeForJobDescription = async (
  jobDescription: string,
  resumeText: string
): Promise<number> => {
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

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 100,
  });

  const matchData = JSON.parse(response.choices[0].message.content || "{}");
  return matchData.matchPercentage || 0;
};
