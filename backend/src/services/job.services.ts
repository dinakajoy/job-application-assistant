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
