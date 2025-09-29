import { create } from "zustand";
import {
  saveResult as idbSaveResult,
  clearResults as idbClearResults,
  getResult as idbGetResult,
} from "@/utils/indexedDb";
import { OPTIONS_MAP } from "@/constants";
import {
  IJobAnalysis,
  IResumeMatch,
  IResumeRewrite,
  IResumeTips,
} from "@/types";

export interface AssistantResult {
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
  loadResult: <K extends keyof AssistantResult>(
    type: K
  ) => Promise<AssistantResult[K] | null>;
  clearResults: () => void;
}

export const useAssistantResultStore = create<AssistantStore>((set) => ({
  results: {},

  setResult: (type, content) => {
    // persist to IndexedDB
    idbSaveResult(type, content);
    set((state) => ({
      results: {
        ...state.results,
        [type]: content,
      },
    }));
  },

  loadResult: async (type) => {
    const cached = await idbGetResult(type);
    if (cached) {
      set((state) => ({
        results: { ...state.results, [type]: cached },
      }));
      return cached;
    }
    return null;
  },

  clearResults: () => {
    idbClearResults();
    set({ results: {} });
  },
}));
