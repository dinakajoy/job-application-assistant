import request from "supertest";
import { OpenAI } from "openai";
import app from "../src/app";

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

describe("POST /resume-improvements", () => {
  const apiUrl = "/api/jobs/resume-improvements";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return suggested keywords and improvements when given valid inputs", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              missing_keywords: ["AWS"],
              improvements: "Add AWS experience",
            }),
          },
        },
      ],
    };

    // Mock OpenAI API response
    (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValue(
      mockResponse
    );

    const res = await request(app).post(apiUrl).send({
      resume: "Experienced JavaScript Developer with React and Node.js...",
      jobDescription:
        "Looking for a Full Stack Developer skilled in React, Node.js, and AWS...",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      suggestions: {
        missing_keywords: ["AWS"],
        improvements: "Add AWS experience",
      },
    });
  });

  it("should return 400 if resume or job description is missing", async () => {
    const res = await request(app)
      .post(apiUrl)
      .send({ resume: "Experienced Developer..." });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Resume and job description are required",
    });
  });

  it("should return 500 if OpenAI API fails", async () => {
    (mockOpenAI.chat.completions.create as jest.Mock).mockRejectedValue(
      new Error("API error")
    );

    const res = await request(app).post(apiUrl).send({
      resume: "Experienced Developer...",
      jobDescription: "Looking for a React Developer...",
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to analyze resume" });
  });
});
