import React, { useState } from "react";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { IResponse } from "@/types/types";

const JobAnalysisPage = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:1337/api/jobs/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });
      const data: IResponse = await response.json();
      if (data.status === "error") {
        setError(data.message || "There was an error! Try again");
        return;
      }
      if (data.payload) {
        setAnalysisResult(data.payload);
        return;
      }
      if (data.message) {
        setAnalysisResult(data.message);
        return;
      }
    } catch (error) {
      console.error("Error analyzing job description", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Job Description Analysis
        </h1>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 text-gray-800"
          rows={10}
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        ></textarea>
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
        <button
          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Job Description"}
        </button>

        {analysisResult && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-gray-800">
            <h2 className="text-2xl font-semibold text-center">
              Key Data Extracted
            </h2>
            <MarkdownRenderer content={analysisResult} />
          </div>
        )}

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
