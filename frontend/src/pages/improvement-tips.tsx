import { useState } from "react";
import Link from "next/link";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { ISugestion, ISugestionResponse } from "@/types/types";
import { useJobContext } from "@/context/JobContext";

const ResumeImprovementTipsPage = () => {
  const { jobDescription, setJobDescription, resume, setResume } =
    useJobContext();
  const [suggestedImprovements, setSuggestedImprovements] = useState<
    ISugestion[] | null
  >(null);
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
    if (!jobDescription.trim()) {
      setSuggestedImprovements(null);
      setError("Please enter a job description.");
      return;
    }
    if (!resume) {
      setSuggestedImprovements(null);
      setError("Please upload your resume.");
      return;
    }
    setError(null);
    setSuggestedImprovements(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/resume-improvements`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data: ISugestionResponse = await response.json();
      if (data.status === "error") {
        setSuggestedImprovements(null);
        setError(data.message || "There was an error! Try again");
      } else {
        if (data.payload) {
          setError(null);
          setSuggestedImprovements(data.payload);
        }
      }
    } catch (error) {
      console.error("Error analyzing job description", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Resume Keyword Suggestion
        </h1>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 text-gray-800"
          rows={6}
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
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        <button
          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700  disabled:cursor-not-allowed"
          onClick={handleMatchResume}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Suggest Keywords"}
        </button>

        {suggestedImprovements && suggestedImprovements.length > 0 && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900">
              Suggested Improvements:
            </h2>
            <ul className="list-disc list-inside mt-2">
              {suggestedImprovements.map((suggestedImprovement, index) => (
                <li key={index} className="text-gray-700 bg-gray-100 border-1">
                  <p className="my-1">
                    <span className="font-semibold mr-1">Missing</span>:
                    {suggestedImprovement.missing}
                  </p>
                  <p>
                    <span className="font-semibold mr-1">Suggestion</span>:
                    {suggestedImprovement.suggestion}
                  </p>
                  <p>
                    <span className="font-semibold mr-1">Section</span>:
                    {suggestedImprovement.section}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="w-full mt-4 flex flex-col md:flex-row items-center gap-2 text-sm text-blue-600 justify-center">
          <Link href="/cover-letter" className="hover:underline">
            → Generate Cover Letter
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

export default ResumeImprovementTipsPage;
