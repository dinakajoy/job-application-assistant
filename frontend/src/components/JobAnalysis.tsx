import React, { useEffect, useState, useCallback } from "react";
import { useJobDataStore } from "@/context/useJobDataStore";
import { useAssistantResultStore } from "@/context/useAssistantResultStore";
import { IJobAnalysis, IJobAnalysisResponse } from "@/types";
import { OPTIONS_MAP } from "@/constants";
import JobInsights from "./JobInsights";
import PageLoader from "./PageLoader";

const JobAnalysis = () => {
  const { preparedData, loadPreparedData } = useJobDataStore();
  const { results, setResult, loadResult } = useAssistantResultStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const jobDescription = preparedData?.jobDescription || "";
  const analysisResult =
    (results[OPTIONS_MAP.JobAnalysis] as IJobAnalysis) || null;

  const handleAnalyze = useCallback(async () => {
    // check cache first
    const cached = await loadResult(OPTIONS_MAP.JobAnalysis);
    if (cached) {
      setResult(OPTIONS_MAP.JobAnalysis, cached);
      setLoading(false);
      return;
    }

    setResult(OPTIONS_MAP.JobAnalysis, null);

    if (!jobDescription.trim()) {
      setError("Please add job description");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/analyze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobDescription }),
        }
      );
      const data: IJobAnalysisResponse = await response.json();
      if (data.status === "error") {
        setResult(OPTIONS_MAP.JobAnalysis, null);
        setError(data.message || "There was an error! Try again");
      } else {
        if (data.payload) {
          setError(null);
          setResult(OPTIONS_MAP.JobAnalysis, data.payload);
        }
        if (!data.payload && data.message) {
          setError(data.message);
        }
      }
    } catch {
      setError("Error analyzing job description");
    }
    setLoading(false);
  }, [jobDescription, setResult, loadResult]);

  useEffect(() => {
    handleAnalyze();
  }, [handleAnalyze]);

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
            Job Description Analysis...
          </h1>
          <PageLoader />
        </>
      )}

      {analysisResult && (
        <div className="mt-6 p-4 rounded-lg text-gray-800">
          <h1 className="text-3xl font-bold mb-6">Job Description Insights</h1>
          <JobInsights {...analysisResult} />
        </div>
      )}
    </div>
  );
};

export default JobAnalysis;
