import { Request, Response } from "express";
import pdf from "pdf-parse";
import {
  jobDescriptionAnalyzer,
  resumeForJobDescriptionAnalyzer,
  getCoverLetter,
  getResumeImprovements,
  getEmailContent,
  getRewrittenResume,
} from "../services/job.services";
import logger from "../utils/logger";

export const prepareJobData = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { applicantName, jobDescription } = req.body;

  let applicant = applicantName || "Applicant";
  if (!jobDescription) {
    res
      .status(400)
      .json({ status: "error", message: "Job description is required" });
    return;
  }

  const resumeFile = req.file;
  let resumeText = "";
  if (resumeFile) {
    const pdfText = await pdf(resumeFile.buffer);
    resumeText = pdfText.text;
  }

  const jobDataAsJson = {
    applicantName: applicant,
    jobDescription,
    resumeText,
  };

  res.status(200).json({
    status: "success",
    payload: jobDataAsJson,
  });
  return;
};

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
    const { jobDescription, resumeText } = req.body;
    if (!jobDescription) {
      res
        .status(400)
        .json({ status: "error", message: "Job description is required" });
      return;
    }
    if (!resumeText) {
      res
        .status(400)
        .json({ status: "error", message: "Resume file is required" });
      return;
    }

    const result = await resumeForJobDescriptionAnalyzer(
      jobDescription,
      resumeText
    );

    res.status(200).json({
      status: "success",
      payload: { ...result },
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
    const { jobDescription, resumeText } = req.body;
    if (!jobDescription) {
      res
        .status(400)
        .json({ status: "error", message: "Job description is required" });
      return;
    }
    if (!resumeText) {
      res
        .status(400)
        .json({ status: "error", message: "Resume file is required" });
      return;
    }

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

export const rewriteResumeForJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { jobAnalysis, resumeMatch, resumeTips, resumeText } = req.body;
    if (!jobAnalysis || !resumeMatch || !resumeTips) {
      res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
      return;
    }

    if (!resumeText) {
      res
        .status(400)
        .json({ status: "error", message: "Resume file is required" });
      return;
    }

    const resumeJson = await getRewrittenResume(
      resumeText,
      jobAnalysis,
      resumeMatch,
      resumeTips
    );

    res.status(200).json({
      status: "success",
      payload: resumeJson,
    });
    return;
  } catch (error: any) {
    logger.error(`rewriteResumeForJob Controller Error: ${error.message}`);
    res
      .status(500)
      .json({ status: "error", message: "Failed to rewrite resume" });
    return;
  }
};

export const generateCoverLetter = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { applicantName, jobDescription, resumeText } = req.body;
    if (!jobDescription) {
      res
        .status(400)
        .json({ status: "error", message: "Job description is required" });
      return;
    }

    const payload = await getCoverLetter(
      applicantName,
      jobDescription,
      resumeText || ""
    );
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

export const generateEmailContent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { applicantName, jobDescription, resumeText } = req.body;
    if (!jobDescription) {
      res
        .status(400)
        .json({ status: "error", message: "Job description is required" });
      return;
    }

    const resumeFile = req.file;
    let resume = "";

    if (resumeFile) {
      // Extract text from the uploaded PDF
      const pdfText = await pdf(resumeFile.buffer);
      resume = pdfText.text;
    }

    const payload = await getEmailContent(
      applicantName,
      jobDescription,
      resumeText || ""
    );
    res.status(200).json({ status: "success", payload });
    return;
  } catch (error: any) {
    logger.error(`  generateEmailContent Controller Error: ${error.message}`);
    res
      .status(500)
      .json({ status: "error", message: "Failed to generate email content" });
    return;
  }
};
