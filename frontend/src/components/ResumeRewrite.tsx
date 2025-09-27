import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useAssistantResult } from "@/context/useAssistantResult";
import { useJobContext } from "@/context/JobContext";
import { IResumeRewrite, IResumeRewriteResponse } from "@/types";
import { OPTIONS_MAP } from "@/constants";
import PageLoader from "./PageLoader";
import Resume from "./Resume";
import ResumePDF from "./ResumePDF";

const ResumeRewrite = () => {
  const { resume } = useJobContext();
  const { results, setResult } = useAssistantResult();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resumeRewrite =
    (results[OPTIONS_MAP.ResumeReWrite] as IResumeRewrite) || null;

  const handleResumeRewrite = async () => {
    const jobAnalysis = results[OPTIONS_MAP.JobAnalysis];
    const resumeMatch = results[OPTIONS_MAP.ResumeMatch];
    const resumeTips = results[OPTIONS_MAP.ResumeImprovementTips];

    if (!resume) {
      setError("Please upload your resume.");
      return;
    }

    if (!jobAnalysis) {
      setError("Please analyze the job description first.");
      return;
    }
    if (!resumeMatch) {
      setError("Please match your resume to the job description first.");
      return;
    }
    if (!resumeTips) {
      setError("Please get resume improvement tips first.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (jobAnalysis && resumeMatch && resumeTips) {
        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("jobAnalysis", JSON.stringify(jobAnalysis));
        formData.append("resumeMatch", JSON.stringify(resumeMatch));
        formData.append("resumeTips", JSON.stringify(resumeTips));

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/rewrite-resume`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data: IResumeRewriteResponse = await response.json();
        if (data.status === "error") {
          setResult(OPTIONS_MAP.ResumeReWrite, null);
          setError(data.message || "There was an error! Try again");
        } else {
          if (data.payload) {
            setError(null);
            setResult(OPTIONS_MAP.ResumeReWrite, data.payload);
          }
          if (!data.payload && data.message) {
            setError(data.message);
          }
        }
      }
    } catch {
      setError("Error rewriting resume");
    }
    setLoading(false);
  };

  useEffect(() => {
    const run = async () => {
      await handleResumeRewrite();
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full text-gray-60 mx-auto">
      {error && (
        <div className="mt-2 p-2 text-red-700 text-center">{error}</div>
      )}

      {loading && (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Resume Rewrite...
          </h1>
          <PageLoader />
        </>
      )}
      {resumeRewrite && (
        <>
          {/* Improvements */}
          <section className=" rounded-2xl p-6 border border-gray-200 mb-6 bg-gray-100">
            <h2 className="text-xl font-semibold mb-4 shadow-sm">Improvements Applied</h2>
            <ul className="list-disc list-inside ml-4">
              {resumeRewrite.improvements_applied.map((imp: string, i: number) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
          </section>
            <div className="flex justify-end mb-4">
            <PDFDownloadLink
              document={<ResumePDF resumeData={resumeRewrite} />}
              fileName="resume.pdf"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {({ loading }) =>
              loading ? "Loading document..." : "Download PDF"
              }
            </PDFDownloadLink>
            </div>
          <Resume resumeData={resumeRewrite} />
        </>
      )}
    </div>
  );
};

export default ResumeRewrite;
