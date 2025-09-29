import { useEffect, useState, useCallback } from "react";
import { useJobContext } from "@/context/JobContext";
import { useAssistantResult } from "@/context/useAssistantResult";
import { OPTIONS_MAP } from "@/constants";
import PageLoader from "./PageLoader";

const EmailContentGenerator = () => {
  const { applicantName, jobDescription, resume } = useJobContext();
  const { results, setResult } = useAssistantResult();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailContent = (results[OPTIONS_MAP.EmailContent] as string) || null;

  const handleGenerateEmailContent = useCallback(async () => {
    setResult(OPTIONS_MAP.EmailContent, null);

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/generate-email-content`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.status === "error") {
        setResult(OPTIONS_MAP.EmailContent, null);
        setError(data.message || "There was an error! Try again");
      } else {
        if (data.payload) {
          setError(null);
          setResult(OPTIONS_MAP.EmailContent, data.payload);
        }
      }
    } catch {
      setError("Error generating email content");
    }
    setLoading(false);
  }, [applicantName, jobDescription, resume, setResult]);

  useEffect(() => {
    handleGenerateEmailContent();
  }, [handleGenerateEmailContent]);

  return (
    <div className="w-full text-gray-60 mx-auto">
      {error && (
        <div className="mt-2 p-2 text-red-700 text-center">{error}</div>
      )}

      {loading && (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Email Content Generator...
          </h1>
          <PageLoader />
        </>
      )}

      {emailContent && (
        <div className="mt-6 p-4 rounded-lg">
          <p className="mt-2 text-gray-700 whitespace-pre-line">
            {emailContent}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailContentGenerator;
