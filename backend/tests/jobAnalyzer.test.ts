import request from "supertest";
import app from "../src/app";

describe("Job Analyzer API", () => {
  it("should return extracted job details", async () => {
    const response = await request(app)
      .post("/api/jobs/analyze")
      .send({ description: "Looking for a React developer with Node.js experience." });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("payload");
  });

  it("should return 400 if description is missing", async () => {
    const response = await request(app).post("/api/jobs/analyze").send({});
    expect(response.status).toBe(422);
  });
});
