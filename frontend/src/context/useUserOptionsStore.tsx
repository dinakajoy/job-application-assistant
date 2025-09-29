import { create } from "zustand";
import { clearOptions, getOptions, saveOptions } from "@/utils/indexedDb";
import { OPTIONS_MAP } from "@/constants";

type UserOptionsStore = {
  options: string[];
  setOptions: (options: string[]) => void;
  requiresResume: boolean;
  loadOptions: () => Promise<void>;
  clearOptions: () => void;
};

export const useUserOptionsStore = create<UserOptionsStore>((set) => ({
  options: [],
  requiresResume: false,

  setOptions: (options) => {
    // persist to IndexedDB
    saveOptions(options);
    set({
      options,
      requiresResume: options.some((option) =>
        [
          OPTIONS_MAP.ResumeMatch,
          OPTIONS_MAP.ResumeImprovementTips,
          OPTIONS_MAP.ResumeReWrite,
        ].includes(
          option as
            | typeof OPTIONS_MAP.ResumeMatch
            | typeof OPTIONS_MAP.ResumeImprovementTips
            | typeof OPTIONS_MAP.ResumeReWrite
        )
      ),
    });
  },

  loadOptions: async () => {
    const stored = await getOptions();
    if (stored) {
      set({
        options: stored,
        requiresResume: stored.some((option) =>
          [
            OPTIONS_MAP.ResumeMatch,
            OPTIONS_MAP.ResumeImprovementTips,
            OPTIONS_MAP.ResumeReWrite,
          ].includes(
            option as
              | typeof OPTIONS_MAP.ResumeMatch
              | typeof OPTIONS_MAP.ResumeImprovementTips
              | typeof OPTIONS_MAP.ResumeReWrite
          )
        ),
      });
    }
  },

  clearOptions: () => {
    clearOptions();
    set({ options: [], requiresResume: false });
  },
}));
