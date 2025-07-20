import { useState } from "react";
import Link from "next/link";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { IResumeMatch, IResumeMatchResponse } from "@/types/types";
import { useJobContext } from "@/context/JobContext";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const ResumeMatchPage = () => {
  const { jobDescription, setJobDescription, resume, setResume } =
    useJobContext();
  const [matchResult, setMatchResult] = useState<IResumeMatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a PDF document.");
      setResume(null);
      return;
    }
    setError(null);
    setResume(file);
  };

  const handleMatchResume = async () => {
    setMatchResult(null);
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
        setMatchResult(null);
        setError(data.message || "There was an error! Try again");
      } else {
        if (data.payload) {
          setError(null);
          setMatchResult(data.payload);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Resume Match Score
        </h1>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 text-gray-800"
          rows={6}
          id="jobDescription"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        ></textarea>

        <div className="mt-4 border-2 border-dashed border-gray-400 rounded-lg p-2 text-center cursor-pointer bg-gray-50 hover:bg-gray-100">
          <label htmlFor="resume-upload" className="cursor-pointer">
            <ArrowUpTrayIcon className="w-5 h-5 mx-auto text-blue-500" />
            <p className="text-sm text-gray-600">
              Click to upload your resume (PDF)
            </p>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        {resume && (
          <p className="mt-2 text-sm text-gray-600">Uploaded: {resume.name}</p>
        )}

        {error && (
          <div className="mt-2 p-2 text-red-700 text-center">{error}</div>
        )}

        <button
          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed"
          onClick={handleMatchResume}
          disabled={loading}
        >
          {loading ? "Matching..." : "Get Match Score"}
        </button>

        {matchResult !== null &&
          (Number(matchResult.score) < 50 ? (
            <>
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
                <h3 className="text-xl font-semibold mt-2">
                  Resume Match Score
                </h3>
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

        <div className="w-full mt-4 flex flex-col md:flex-row items-center gap-2 text-sm text-blue-600 justify-center">
          <Link href="/improvement-tips" className="hover:underline">
            → Resume Improvement Tips
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

export default ResumeMatchPage;
