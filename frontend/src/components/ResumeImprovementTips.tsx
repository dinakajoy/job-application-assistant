import { useEffect, useState } from "react";
import { useJobDataStore } from "@/context/useJobDataStore";
import { useAssistantResultStore } from "@/context/useAssistantResultStore";
import { IResumeTips, IResumeTipsResponse } from "@/types";
import { OPTIONS_MAP } from "@/constants";
import PageLoader from "./PageLoader";
import ResumeInsights from "./ResumeInsights";

const ResumeImprovementTips = () => {
  const { preparedData, loadPreparedData } = useJobDataStore();
  const { results, setResult, loadResult } = useAssistantResultStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const jobDescription = preparedData?.jobDescription || "";
  const resumeText = preparedData?.resumeText || null;
  const suggestedImprovements =
    (results[OPTIONS_MAP.ResumeImprovementTips] as IResumeTips) || null;

  const handleResumeImprovements = async () => {
    // check cache first
    const cached = await loadResult(OPTIONS_MAP.ResumeImprovementTips);
    if (cached) {
      setLoading(false);
      return;
    }

    setResult(OPTIONS_MAP.ResumeImprovementTips, null);

    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }
    if (!resumeText) {
      setError("Please upload your resume.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/resume-improvements`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobDescription, resumeText }),
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
    const fetchImprovements = async () => {
      await handleResumeImprovements();
    };
    fetchImprovements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // hydrate from IndexedDB on mount
    loadPreparedData();
  }, [loadPreparedData]);

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
