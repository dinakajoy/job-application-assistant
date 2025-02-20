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

describe("POST /cover-letter/generate", () => {
  const apiUrl = "/api/jobs/generate-cover-letter";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate a cover letter with valid inputs", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content:
              "Dear Hiring Manager, I am excited to apply for this role...",
          },
        },
      ],
    };

    // Mock OpenAI response
    (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValue(
      mockResponse
    );

    const res = await request(app).post(apiUrl).send({
      jobDescription:
        "We are looking for a Full Stack Developer skilled in React and Node.js.",
      applicantName: "John Doe",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("coverLetter");
    expect(res.body.coverLetter).toContain("Dear Hiring Manager");
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app).post(apiUrl).send({ jobDescription: "" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      errors: [
        {
          msg: "Job description is required",
          param: "jobDescription",
          location: "body",
        },
      ],
    });
  });

  it("should return 500 if OpenAI API fails", async () => {
    (mockOpenAI.chat.completions.create as jest.Mock).mockRejectedValue(
      new Error("API error")
    );

    const res = await request(app).post(apiUrl).send({
      jobDescription: "Looking for a Software Engineer...",
      applicantName: "Jane Doe",
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to generate cover letter" });
  });
});
