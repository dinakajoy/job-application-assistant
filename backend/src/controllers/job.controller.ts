import { NextFunction, Request, Response } from "express";
import pdf from "pdf-parse";
import {
  jobDescriptionAnalyzer,
  resumeForJobDescriptionAnalyzer,
  getCoverLetter,
  getResumeImprovements,
} from "../services/job.services";
import logger from "../utils/logger";

export const analyzeJobDescription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) {
      res
        .status(400)
        .json({ status: "error", message: "Job description is required" });
      return;
    }

    const payload = await jobDescriptionAnalyzer(jobDescription);
    res.status(200).json({ status: "success", payload });
    return;
  } catch (error: any) {
    logger.error(`analyzeJobDescription Controller Error: ${error.message}`);
    res
      .status(500)
      .json({ status: "error", message: "Failed to analyze job description" });
    return;
  }
};

export const analyzeResumeForJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) {
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
    const matchScore = await resumeForJobDescriptionAnalyzer(
      jobDescription,
      resumeText
    );

    res.status(200).json({
      status: "success",
      payload: `${matchScore}`,
    });
    return;
  } catch (error: any) {
    logger.error(`analyzeResumeForJob Controller Error: ${error.message}`);
    res
      .status(500)
      .json({ status: "error", message: "Failed to analyze resume" });
    return;
  }
};

export const suggestResumeImprovements = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) {
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
    const suggestedKeywords = await getResumeImprovements(
      jobDescription,
      resumeText
    );

    res.status(200).json({
      status: "success",
      payload: suggestedKeywords,
    });
    return;
  } catch (error: any) {
    logger.error(
      `suggestResumeImprovements Controller Error: ${error.message}`
    );
    res.status(500).json({
      status: "error",
      message: "Failed to suggest resume improvements",
    });
    return;
  }
};

export const generateCoverLetter = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { applicantName, jobDescription } = req.body;
    if (!jobDescription) {
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
    const resume = pdfText.text;

    const payload = await getCoverLetter(applicantName, jobDescription, resume);
    res.status(200).json({ status: "success", payload });
    return;
  } catch (error: any) {
    logger.error(`generateCoverLetter Controller Error: ${error.message}`);
    res
      .status(500)
      .json({ status: "error", message: "Failed to generate cover letter" });
    return;
  }
};
