import { useEffect, useState } from "react";
import { useJobContext } from "@/context/JobContext";
import { useAssistantResult } from "@/context/useAssistantResult";
import { IResumeMatch, IResumeMatchResponse } from "@/types";
import MarkdownRenderer from "./MarkdownRenderer";
import { OPTIONS_MAP } from "@/constants";
import PageLoader from "./PageLoader";

const ResumeMatch = () => {
  const { jobDescription, resume } = useJobContext();
  const { results, setResult } = useAssistantResult();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const matchResult =
    (results[OPTIONS_MAP.ResumeMatch] as IResumeMatch) || null;

  const handleMatchResume = async () => {
    setResult(OPTIONS_MAP.ResumeMatch, null);

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/match-resume`,
        {
          method: "POST",
          body: formData,
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
    handleMatchResume();
  }, []);

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
