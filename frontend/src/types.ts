export type IJobAnalysis = {
  skills: string[];
  responsibilities: string[];
  experience: string[];
};

export interface IJobAnalysisResponse {
  status: string;
  message?: string;
  payload?: IJobAnalysis;
}

export type IResumeMatch = {
  score: string;
  explanation: string;
};

export interface IResumeMatchResponse {
  status: string;
  message?: string;
  payload?: IResumeMatch;
}

export type IResumeTips = {
  missing_skills: string[];
  formatting_tips: string[];
  keyword_optimization: string[];
};

export interface IResumeTipsResponse {
  status: string;
  message?: string;
  payload?: IResumeTips;
}

export type IResumeRewrite = {
  summary: string;
  skills_section: string[];
  experience_section: {
    title: string;
    company: string;
    dates: string;
    description: string[];
  }[];
  improvements_applied: string[];
};

export interface IResumeRewriteResponse {
  status: string;
  message?: string;
  payload?: IResumeRewrite;
}

export interface ICoverLetterResponse {
  status: string;
  message?: string;
  payload?: string;
}

export interface IEmailContentResponse {
  status: string;
  message?: string;
  payload?: string;
}

export type Option = {
  label: string;
  value: string;
};

export type UsersOptionsProps = {
  editable?: boolean;
};
