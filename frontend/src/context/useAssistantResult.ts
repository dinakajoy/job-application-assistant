import { create } from "zustand";
import { IJobAnalysis, IResumeMatch, IResumeRewrite, IResumeTips } from "@/types";
import { OPTIONS_MAP } from "@/constants";

interface AssistantResult {
  [OPTIONS_MAP.JobAnalysis]?: IJobAnalysis | null;
  [OPTIONS_MAP.ResumeMatch]?: IResumeMatch | null;
  [OPTIONS_MAP.ResumeImprovementTips]?: IResumeTips | null;
  [OPTIONS_MAP.ResumeReWrite]?: IResumeRewrite | null;
  [OPTIONS_MAP.CoverLetter]?: string | null;
  [OPTIONS_MAP.EmailContent]?: string | null;
}

interface AssistantStore {
  results: AssistantResult;
  setResult: <K extends keyof AssistantResult>(
    type: K,
    content: AssistantResult[K]
  ) => void;
  clearResults: () => void;
}

export const useAssistantResult = create<AssistantStore>((set) => ({
  results: {},

  setResult: (type, content) =>
    set((state) => ({
      results: {
        ...state.results,
        [type]: content,
      },
    })),

  clearResults: () => set({ results: {} }),
}));
