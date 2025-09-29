import JobAnalysis from "@/components/JobAnalysis";
import ResumeMatch from "@/components/ResumeMatch";
import ResumeImprovementTips from "@/components/ResumeImprovementTips";
import ResumeRewrite from "@/components/ResumeRewrite";
import CoverLetterGenerator from "@/components/CoverLetterGenerator";
import EmailContentGenerator from "@/components/EmailContentGenerator";
import { Option } from "@/types";

export const OPTIONS_MAP = {
  JobAnalysis: "job-analysis",
  ResumeMatch: "resume-match",
  ResumeImprovementTips: "resume-improvement-tips",
  ResumeReWrite: "resume-rewrite",
  CoverLetter: "cover-letter",
  EmailContent: "email-content",
} as const;

export const OPTIONS: Option[] = [
  { label: "Job Analysis", value: OPTIONS_MAP.JobAnalysis },
  { label: "Resume Match", value: OPTIONS_MAP.ResumeMatch },
  {
    label: "Resume Improvement Tips",
    value: OPTIONS_MAP.ResumeImprovementTips,
  },
  { label: "Resume Re-Write", value: OPTIONS_MAP.ResumeReWrite },
  { label: "Cover Letter Generator", value: OPTIONS_MAP.CoverLetter },
  { label: "Email Content Generator", value: OPTIONS_MAP.EmailContent },
];

export const MatchOptionsToComponent = {
  [OPTIONS_MAP.JobAnalysis]: JobAnalysis,
  [OPTIONS_MAP.ResumeMatch]: ResumeMatch,
  [OPTIONS_MAP.ResumeImprovementTips]: ResumeImprovementTips,
  [OPTIONS_MAP.ResumeReWrite]: ResumeRewrite,
  [OPTIONS_MAP.CoverLetter]: CoverLetterGenerator,
  [OPTIONS_MAP.EmailContent]: EmailContentGenerator,
};
