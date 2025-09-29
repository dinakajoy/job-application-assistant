import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { useUserOptionsContext } from "@/context/UserOptionsContext";
import { useJobContext } from "@/context/JobContext";
import { Header } from "@/components/Header";
import UsersOptions from "@/components/UsersOptions";

const GetStarted = () => {
  const router = useRouter();
  const { requiresResume } = useUserOptionsContext();
  const {
    applicantName,
    setApplicantName,
    jobDescription,
    setJobDescription,
    resume,
    setResume,
  } = useJobContext();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!jobDescription.trim()) {
      setError("Please paste the job description.");
      return;
    }

    if (requiresResume && !resume) {
      setError("Resume is required for selected options.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <Header />
      <div className="p-6 text-left">
        <UsersOptions editable={false} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl w-full bg-white p-8 rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Let&apos;s Get Started
        </h2>

        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-800"
          placeholder="Enter your name..."
          value={applicantName}
          onChange={(e) => setApplicantName(e.target.value)}
        />
        <p className="mb-2 text-xs text-gray-700">Optional</p>

        <label className="block mb-2 text-gray-700 font-medium">
          Paste Job Description (required)
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="e.g. We are looking for a full-stack engineer..."
          className="w-full border p-3 rounded resize-none text-gray-600"
          rows={10}
        />

        {requiresResume && (
          <div className="mt-6">
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
              <p className="mt-2 text-sm text-gray-600">
                Uploaded: {resume.name}
              </p>
            )}
          </div>
        )}

        {error && <div className="mt-2 text-red-700">{error}</div>}

        <div className="mt-6 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Go to Home Page
          </Link>
          <button
            type="submit"
            className="mt-6 bg-blue-600 text-white px-3 py-1 rounded-lg text-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default GetStarted;
