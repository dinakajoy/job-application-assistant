import { useEffect, useState } from "react";
import { useJobContext } from "@/context/JobContext";
import { useAssistantResult } from "@/context/useAssistantResult";
import { IResumeTips, IResumeTipsResponse } from "@/types";
import ResumeInsights from "./ResumeInsights";
import { OPTIONS_MAP } from "@/constants";
import PageLoader from "./PageLoader";

const ResumeImprovementTips = () => {
  const { jobDescription, resume } = useJobContext();
  const { results, setResult } = useAssistantResult();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const suggestedImprovements =
    (results[OPTIONS_MAP.ResumeImprovementTips] as IResumeTips) || null;

  const handleResumeImprovements = async () => {
    setResult(OPTIONS_MAP.ResumeImprovementTips, null);

    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }
    if (!resume) {
      setError("Please upload your resume.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/resume-improvements`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data: IResumeTipsResponse = await response.json();
      if (data.status === "error") {
        setResult(OPTIONS_MAP.ResumeImprovementTips, null);
        setError(data.message || "There was an error! Try again");
      } else {
        if (data.payload) {
          setError(null);
          setResult(OPTIONS_MAP.ResumeImprovementTips, data.payload);
        }
      }
    } catch {
      setError("Error getting resume improvement suggestions");
    }
    setLoading(false);
  };

  useEffect(() => {
    handleResumeImprovements();
  }, []);

  return (
    <div className="w-full text-gray-60 mx-auto">
      {error && (
        <div className="mt-2 p-2 text-red-700 text-center">{error}</div>
      )}

      {loading && (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Resume Improvement Suggestion...
          </h1>
          <PageLoader />
        </>
      )}

      {suggestedImprovements && (
        <div className="mt-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900">
            Suggested Improvements:
          </h2>
          <ResumeInsights {...suggestedImprovements} />
        </div>
      )}
    </div>
  );
};

export default ResumeImprovementTips;
