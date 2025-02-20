import { NextFunction, Request, Response } from "express";
import pdf from "pdf-parse";
import {
  analyzeJobDescription,
  analyzeResumeForJobDescription,
} from "../services/job.services";

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
    res.status(200).json({ status: "success", payload });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to analyze job description" });
    return;
  }
};

export const analyzeResumeForJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { description } = req.body;
    if (!description) {
      res
        .status(400)
        .json({ status: "error", message: "Job description is required" });
      return;
    }

    const resumeFile = req.file;
    if (!resumeFile) {
      res
        .status(400)
        .json({ status: "error", message: "Resume file is required" });
      return;
    }

    // Extract text from the uploaded PDF
    const pdfText = await pdf(resumeFile.buffer);
    const resumeText = pdfText.text;
    const matchScore = await analyzeResumeForJobDescription(
      description,
      resumeText
    );

    res.status(200).json({
      status: "success",
      message: "Resume analyzed successfully",
      matchScore: `${matchScore}%`,
    });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to analyze job description" });
    return;
  }
};
