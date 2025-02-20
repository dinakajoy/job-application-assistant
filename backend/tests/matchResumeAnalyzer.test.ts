import { OpenAI } from "openai";
import { analyzeResumeForJobDescription } from "../src/services/job.services"; // Adjust the path based on your project structure

jest.mock("openai");

const mockOpenAI = new OpenAI({ apiKey: "test-key" });

describe("analyzeResume", () => {
  it("should return parsed AI response when OpenAI API succeeds", async () => {
    const mockResponse = {
      choices: [{ message: { content: JSON.stringify({ match: 85 }) } }],
    };

    // Mocking the OpenAI API response
    (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValue(
      mockResponse
    );

    const result = await analyzeResumeForJobDescription(
      "Job description here",
      "Resume text here"
    );
    expect(result).toEqual({ match: 85 });
  });

  it("should handle OpenAI API errors", async () => {
    (mockOpenAI.chat.completions.create as jest.Mock).mockRejectedValue(
      new Error("API error")
    );

    await expect(
      analyzeResumeForJobDescription("Job description here", "Resume text here")
    ).rejects.toThrow("Failed to analyze resume");
  });
});
