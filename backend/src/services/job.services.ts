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

// Using prompting => Instruction-Tuned
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
        content:
          "You are a professional resume coach helping job seekers improve their resumes to match job descriptions. Carefully analyze both the job description and resume. Think step by step, and return specific, actionable improvement suggestions in JSON format.",
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

// Using Chain-of-Thought prompting => Instruction-Tuned + Reasoning
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

    Do not include markdown or formatting instructions. Just return the plain cover letter.
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
  });

  return (
    response.choices[0]?.message?.content?.trim() ||
    "Failed to generate cover letter."
  );
};
