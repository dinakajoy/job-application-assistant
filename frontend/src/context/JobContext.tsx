import React, { createContext, useContext, useState, ReactNode } from "react";

type JobContextType = {
  applicantName: string;
  setApplicantName: (value: string) => void;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  resume: File | null;
  setResume: (value: File | null) => void;
};

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [applicantName, setApplicantName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  return (
    <JobContext.Provider
      value={{
        applicantName,
        setApplicantName,
        jobDescription,
        setJobDescription,
        resume,
        setResume,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = (): JobContextType => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobContext must be used within a JobProvider");
  }
  return context;
};
