import React, { useState } from "react";
import Link from "next/link";
import { useJobContext } from "@/context/JobContext";
import { IJobAnalysis, IJobAnalysisResponse } from "@/types/types";
import JobInsights from "@/components/JobInsights";

const JobAnalysisPage = () => {
  const { jobDescription, setJobDescription } = useJobContext();
  const [analysisResult, setAnalysisResult] = useState<IJobAnalysis | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
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
        setError(data.message || "There was an error! Try again");
      } else {
        if (data.payload) {
          setAnalysisResult(data.payload);
        }
        if (!data.payload && data.message) {
          setError(data.message);
        }
      }
    } catch {
      setError("Error analyzing job description");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-60">
      <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-md  text-gray-60">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Job Description Analysis
        </h1>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 text-gray-800"
          required
          rows={10}
          id="jobDescription"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        ></textarea>
        {error && (
          <div className="mt-2 p-2 text-red-700 text-center">{error}</div>
        )}
        <button
          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Job Description"}
        </button>

        {analysisResult && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-gray-800">
            <h1 className="text-3xl font-bold mb-6">
              Job Description Insights
            </h1>
            <JobInsights {...analysisResult} />
          </div>
        )}

        <div className="w-full mt-4 flex flex-col md:flex-row items-center gap-2 text-sm text-blue-600 justify-center">
          <Link href="/resume-match" className="hover:underline">
            → Match Resume
          </Link>
        </div>

        {/* Home Page Link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Go to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobAnalysisPage;
