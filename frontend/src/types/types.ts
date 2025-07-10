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



export interface IResponse {
  status: string;
  message?: string;
  payload?: string;
}

export type ISugestion = {
  missing: string;
  suggestion: string;
  section: string;
};
export interface ISugestionResponse {
  status: string;
  message?: string;
  payload?: ISugestion[];
}