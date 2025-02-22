import Link from "next/link";
import { useState } from "react";

const CoverLetterGeneratorPage = () => {
  const [applicantName, setApplicantName] = useState("");
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      setCoverLetter(null);
      setError("Please enter a job description.");
      return;
    }
    setError(null);
    setCoverLetter(null);
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/generate-cover-letter`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ applicantName, resume, jobDescription }),
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
    } catch (error) {
      console.error("Error generating cover letter:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Cover Letter Generator
        </h1>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 text-gray-800"
          placeholder="(Optional) Enter your name..."
          value={applicantName}
          onChange={(e) => setApplicantName(e.target.value)}
        />
        <p className="mb-2 text-xs text-red-500">Optional</p>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 text-gray-800"
          rows={4}
          placeholder="(Optional) Paste your resume here..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        ></textarea>
        <p className="mb-2 text-xs text-red-500">
          Optional - However, including a resume allows the AI to tailor the
          cover letter more specifically to the applicant’s skills and
          experience, making it stronger.
        </p>
        <textarea
          className="w-full mt-4 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 text-gray-800"
          rows={4}
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
          onClick={handleGenerateCoverLetter}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Cover Letter"}
        </button>
        {coverLetter && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold">Generated Cover Letter:</h2>
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
