import OpenAI from "openai";
import config from "config";

const apiKey = config.get("environment.apiKey") as string;

const openai = new OpenAI({ apiKey });

// Using prompting => Instruction-Tuned
export const jobDescriptionAnalyzer = async (jobDescription: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an AI job coach. Extract the key skills, responsibilities, and required experience from the following job description.",
      },
      {
        role: "user",
        content: jobDescription,
      },
    ],
  });

  return response.choices[0]?.message?.content?.trim() || "";
};

// Using Chain-of-Thought prompting => Instruction-Tuned + Reasoning
export const resumeForJobDescriptionAnalyzer = async (
  jobDescription: string,
  resumeText: string
): Promise<number> => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a career assistant helping job seekers evaluate their fit for job postings based on their resumes. Think step-by-step before giving your final judgment.",
      },
      {
        role: "user",
        content: `
    Here is a job description:
    
    ${jobDescription}
    
    And here is the resume:
    
    ${resumeText}
    
    Please:
    1. Extract the key required skills and qualifications from the job description.
    2. Extract the candidate's skills, qualifications, and experiences from the resume.
    3. Compare both sets and reason about matches and gaps.
    4. Determine how well the candidate fits this job and why.
    5. Suggest 2–3 improvements to the resume to increase alignment.
    `,
      },
    ],
  });

  const matchData = JSON.parse(response.choices[0].message.content || "");

  return matchData.matchPercentage || 0;
};

// Suggest Improvements Based on mismatch/gaps => Reasoning => GPT output + hints
export const getResumeImprovements = async (
  jobDescription: string,
  resumeText: string
): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: "You are a professional resume coach helping job seekers improve their resumes to match job descriptions. Carefully analyze both the job description and resume. Think step by step, and return specific, actionable improvement suggestions in JSON format."
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
  const result = JSON.parse(
    response.choices[0]?.message?.content?.trim() || ""
  );

  return result.improvements || [];
};

export const getCoverLetter = async (
  applicantName: string,
  jobDescription: string,
  resume: string
): Promise<string> => {
  let userPrompt = `Write a professional cover letter for the following job description:\n${jobDescription}`;

  if (applicantName) {
    userPrompt += `The applicant's name is ${applicantName}.\n` + userPrompt;
  }

  if (resume) {
    userPrompt += `\nHere is the applicant's resume:\n${resume}`;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a professional career assistant that writes tailored, impactful cover letters based on (optional a user's resume and) a job description.",
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
