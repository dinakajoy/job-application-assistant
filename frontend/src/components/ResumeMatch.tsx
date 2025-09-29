import { useEffect, useState } from "react";
import { useJobDataStore } from "@/context/useJobDataStore";
import { useAssistantResultStore } from "@/context/useAssistantResultStore";
import { IResumeMatch, IResumeMatchResponse } from "@/types";
import { OPTIONS_MAP } from "@/constants";
import MarkdownRenderer from "./MarkdownRenderer";
import PageLoader from "./PageLoader";

const ResumeMatch = () => {
  const { preparedData, loadPreparedData } = useJobDataStore();
  const { results, setResult, loadResult } = useAssistantResultStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const jobDescription = preparedData?.jobDescription || "";
  const resumeText = preparedData?.resumeText || null;
  const matchResult =
    (results[OPTIONS_MAP.ResumeMatch] as IResumeMatch) || null;

  const handleMatchResume = async () => {
    // check cache first
    const cached = await loadResult(OPTIONS_MAP.ResumeMatch);
    if (cached) {
      setLoading(false);
      return;
    }

    setResult(OPTIONS_MAP.ResumeMatch, null);

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/match-resume`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobDescription, resumeText }),
        }
      );
      const data: IResumeMatchResponse = await response.json();
      if (data.status === "error") {
        setResult(OPTIONS_MAP.ResumeMatch, null);
        setError(data.message || "There was an error! Try again");
      } else {
        if (data.payload) {
          setError(null);
          setResult(OPTIONS_MAP.ResumeMatch, data.payload);
        }
        if (!data.payload && data.message) {
          setError(data.message);
        }
      }
    } catch {
      setError("Error getting resume match results");
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchMatchResume = async () => {
      await handleMatchResume();
    };
    fetchMatchResume();
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
            Resume Match Score...
          </h1>
          <PageLoader />
        </>
      )}

      {matchResult !== null &&
        (Number(matchResult.score) < 50 ? (
          <>
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
              <h3 className="text-xl font-semibold mt-2">Resume Match Score</h3>
              <p className="text-2xl font-bold">{matchResult.score}%</p>
            </div>
            <div className="prose max-w-none mt-4 text-sm">
              <MarkdownRenderer content={matchResult.explanation} />
            </div>
          </>
        ) : (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Resume Match Score</h3>
            <p className="text-2xl font-bold">{matchResult.score}%</p>
            <div className="prose max-w-none mt-4 text-sm">
              <MarkdownRenderer content={matchResult.explanation} />
            </div>
          </div>
        ))}
    </div>
  );
};

export default ResumeMatch;
