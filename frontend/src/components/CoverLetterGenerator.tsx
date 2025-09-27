import { useEffect, useState, useCallback } from "react";
import { useJobContext } from "@/context/JobContext";
import { useAssistantResult } from "@/context/useAssistantResult";
import { OPTIONS_MAP } from "@/constants";
import PageLoader from "./PageLoader";

const CoverLetterGenerator = () => {
  const { applicantName, jobDescription, resume } = useJobContext();
  const { results, setResult } = useAssistantResult();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const coverLetter = (results[OPTIONS_MAP.CoverLetter] as string) || null;

  const handleGenerateCoverLetter = useCallback(async () => {
    setResult(OPTIONS_MAP.CoverLetter, null);

    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      if (resume) {
        formData.append("resume", resume);
      }
      formData.append("jobDescription", jobDescription);
      formData.append("applicantName", applicantName);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/generate-cover-letter`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.status === "error") {
        setResult(OPTIONS_MAP.CoverLetter, null);
        setError(data.message || "There was an error! Try again");
      } else {
        if (data.payload) {
          setError(null);
          setResult(OPTIONS_MAP.CoverLetter, data.payload);
        }
      }
    } catch {
      setError("Error generating cover letter");
    }
    setLoading(false);
  }, [applicantName, jobDescription, resume, setResult]);

  useEffect(() => {
    handleGenerateCoverLetter();
  }, [handleGenerateCoverLetter]);

  return (
    <div className="w-full text-gray-60 mx-auto">
      {error && (
        <div className="mt-2 p-2 text-red-700 text-center">{error}</div>
      )}

      {loading && (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Cover Letter Generator...
          </h1>
          <PageLoader />
        </>
      )}

      {coverLetter && (
        <div className="mt-6 p-4 rounded-lg">
          <p className="mt-2 text-gray-700 whitespace-pre-line">
            {coverLetter}
          </p>
        </div>
      )}
    </div>
  );
};

export default CoverLetterGenerator;
