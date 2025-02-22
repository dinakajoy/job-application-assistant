import OpenAI from "openai";
import config from "config";

const apiKey = config.get("environment.apiKey") as string;

const openai = new OpenAI({ apiKey });

// export const jobDescriptionAnalyzer = async (jobDescription: string) => {
//   const prompt = `Extract key skills and responsibilities from this job description:\n${jobDescription}`;

//   const response = await openai.chat.completions.create({
//     model: "gpt-4",
//     messages: [{ role: "user", content: prompt }],
//     max_tokens: 200,
//   });

//   return response.choices[0].text?.trim() || "";
// };

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
  console.log("==================== response", response.choices[0]?.message);

  return response.choices[0]?.message?.content?.trim() || "";
};

export const resumeForJobDescriptionAnalyzer = async (
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
