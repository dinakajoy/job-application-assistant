import { useEffect, useState, useCallback } from "react";
import { useJobDataStore } from "@/context/useJobDataStore";
import { useAssistantResultStore } from "@/context/useAssistantResultStore";
import { OPTIONS_MAP } from "@/constants";
import PageLoader from "./PageLoader";

const EmailContentGenerator = () => {
  const { preparedData, loadPreparedData } = useJobDataStore();
  const { results, setResult, loadResult } = useAssistantResultStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailContent = (results[OPTIONS_MAP.EmailContent] as string) || null;

  const handleGenerateEmailContent = useCallback(async () => {
    // check cache first
    const cached = await loadResult(OPTIONS_MAP.EmailContent);
    if (cached) {
      setLoading(false);
      return;
    }

    setResult(OPTIONS_MAP.EmailContent, null);

    if (!preparedData?.jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/generate-email-content`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...preparedData,
          }),
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
  }, [preparedData, setResult, loadResult]);

  useEffect(() => {
    handleGenerateEmailContent();
  }, [handleGenerateEmailContent]);

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
