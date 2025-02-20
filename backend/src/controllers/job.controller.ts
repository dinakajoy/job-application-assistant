import { Request, Response } from "express";
import { analyzeJobDescription } from "../services/job.services";

export const analyzeJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { description } = req.body;
    if (!description) {
      res
        .status(400)
        .json({ status: "error", message: "Job description is required" });
      return;
    }

    const payload = await analyzeJobDescription(description);
    res.status(200).json({ status: "error", payload });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to analyze job description" });
    return;
  }
};
