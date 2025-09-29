import { create } from "zustand";
import { getPreparedData, savePreparedData } from "@/utils/indexedDb";
import { IPreparedData } from "@/types";

interface JobDataStore {
  applicantName: string;
  setApplicantName: (value: string) => void;

  jobDescription: string;
  setJobDescription: (value: string) => void;

  resume: File | null;
  setResume: (value: File | null) => void;

  preparedData: IPreparedData | null;
  setPreparedData: (value: IPreparedData | null) => void;

  loadPreparedData: () => Promise<void>;
}

export const useJobDataStore = create<JobDataStore>((set) => ({
  applicantName: "",
  setApplicantName: (value) => set({ applicantName: value }),

  jobDescription: "",
  setJobDescription: (value) => set({ jobDescription: value }),

  resume: null,
  setResume: (value) => set({ resume: value }),

  preparedData: null,
  setPreparedData: (value) => {
    if (value) savePreparedData(value); // persist
    set({ preparedData: value });
  },

  loadPreparedData: async () => {
    const stored = await getPreparedData();
    if (stored) {
      set({ preparedData: stored });
    }
  },
}));
