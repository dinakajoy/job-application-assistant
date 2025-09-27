import { OPTIONS_MAP } from "@/constants";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type UserOptionsType = {
  options: string[];
  setOptions: React.Dispatch<React.SetStateAction<string[]>>;
  requiresResume: boolean;
};

const UserOptionsContext = createContext<UserOptionsType | undefined>(
  undefined
);

export const UserOptionsProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState<string[]>([]);
  const [requiresResume, setRequiresResume] = useState<boolean>(false);

  useEffect(() => {
    setRequiresResume(
      options.some((option) =>
        [
          OPTIONS_MAP.ResumeMatch,
          OPTIONS_MAP.ResumeImprovementTips,
          OPTIONS_MAP.ResumeReWrite,
        ].includes(option as typeof OPTIONS_MAP.ResumeMatch | typeof OPTIONS_MAP.ResumeImprovementTips | typeof OPTIONS_MAP.ResumeReWrite)
      )
    );
  }, [options]);

  return (
    <UserOptionsContext.Provider
      value={{ options, setOptions, requiresResume }}
    >
      {children}
    </UserOptionsContext.Provider>
  );
};

export const useUserOptionsContext = (): UserOptionsType => {
  const context = useContext(UserOptionsContext);
  if (!context) {
    throw new Error(
      "UseUserOptionsContext must be used within a UserOptionsProvider"
    );
  }
  return context;
};
