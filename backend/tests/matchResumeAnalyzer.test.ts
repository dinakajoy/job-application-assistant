import { OpenAI } from "openai";
import { resumeForJobDescriptionAnalyzer } from "../src/services/job.services";

// Mock the OpenAI constructor and its methods
jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [{ message: { content: JSON.stringify({ score: 85 }) } }],
      }),
    },
  }));
});

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

    const result = await resumeForJobDescriptionAnalyzer(
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
      resumeForJobDescriptionAnalyzer(
        "Job description here",
        "Resume text here"
      )
    ).rejects.toThrow("Failed to analyze resume");
  });
});
