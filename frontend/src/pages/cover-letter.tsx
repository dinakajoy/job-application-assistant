import Link from "next/link";
import { useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { useJobContext } from "@/context/JobContext";

const CoverLetterGeneratorPage = () => {
  const { jobDescription, setJobDescription, resume, setResume } =
    useJobContext();
  const [applicantName, setApplicantName] = useState("");
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      setCoverLetter(null);
      setError("Please enter a job description.");
      return;
    }
    if (!resume) {
      setCoverLetter(null);
      setError("Please upload your resume.");
      return;
    }
    setError(null);
    setCoverLetter(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume", resume);
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
        setCoverLetter(null);
        setError(data.message || "There was an error! Try again");
      } else {
        if (data.payload) {
          setError(null);
          setCoverLetter(data.payload);
        }
      }
    } catch {
      setError("Error generating cover letter");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Cover Letter Generator
        </h1>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 text-gray-800"
          placeholder="Enter your name..."
          value={applicantName}
          onChange={(e) => setApplicantName(e.target.value)}
        />
        <p className="mb-2 text-xs text-gray-700">Optional</p>
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
        <textarea
          className="w-full mt-4 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 text-gray-800"
          rows={4}
          id="jobDescription"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        ></textarea>
        {resume && (
          <p className="mt-2 text-sm text-gray-600">Uploaded: {resume.name}</p>
        )}
        <p className="mb-2 text-xs text-gray-700">
          <span className="text-red-400">Optional</span> - However, including a
          resume allows the AI to tailor the cover letter more specifically to
          the applicant’s skills and experience, making it stronger.
        </p>

        {error && (
          <div className="mt-2 p-2 text-red-700 text-center">{error}</div>
        )}

        <button
          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed"
          onClick={handleGenerateCoverLetter}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Cover Letter"}
        </button>
        {coverLetter && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="mt-2 text-gray-700 whitespace-pre-line">
              {coverLetter}
            </p>
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

export default CoverLetterGeneratorPage;
