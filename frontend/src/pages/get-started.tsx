import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { useUserOptionsStore } from "@/context/useUserOptionsStore";
import { useJobDataStore } from "@/context/useJobDataStore";
import { useAssistantResultStore } from "@/context/useAssistantResultStore";
import { Header } from "@/components/Header";
import UsersOptions from "@/components/UsersOptions";
import {
  getJobData,
  saveJobData,
  clearJobData,
  clearPreparedData,
} from "@/utils/indexedDb";
import { IPreparedDataResponse, JobData } from "@/types";

const GetStarted = () => {
  const router = useRouter();
  const { requiresResume } = useUserOptionsStore();
  const { setPreparedData } = useJobDataStore();
  const { clearResults } = useAssistantResultStore();

  const [jobData, setJobData] = useState<JobData>({
    applicantName: "",
    jobDescription: "",
    resume: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [newJobdata, setNewJobData] = useState(true);

  // Load initial data from indexedDb
  useEffect(() => {
    const fetchJobData = async () => {
      const data = await getJobData();
      if (data) {
        setJobData({
          applicantName: data.applicantName || "",
          jobDescription: data.jobDescription || "",
          resume: data.resume || null,
        });
        setNewJobData(false);
      }
    };
    fetchJobData();
  }, []);

  const handleReset = async () => {
    await clearJobData();
    await clearPreparedData();
    clearResults();
    setJobData({
      applicantName: "",
      jobDescription: "",
      resume: null,
    });
    setNewJobData(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a PDF document.");
      setJobData({ ...jobData, resume: null });
      return;
    }
    setError(null);
    setJobData({ ...jobData, resume: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!jobData.jobDescription.trim()) {
      setError("Please paste the job description.");
      return;
    }

    if (requiresResume && !jobData.resume) {
      setError("Resume is required for selected options.");
      return;
    }

    try {
      let data: IPreparedDataResponse | null = null;
      if (requiresResume && jobData.resume) {
        const formData = new FormData();
        formData.append("resume", jobData.resume);
        formData.append("jobDescription", jobData.jobDescription);
        formData.append("applicantName", jobData.applicantName);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/prepare`,
          {
            method: "POST",
            body: formData,
          }
        );
        data = await response.json();
      } else {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/prepare`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jobData),
          }
        );
        data = await response.json();
      }

      if (data && data.status === "error") {
        setPreparedData(null);
        setError(data.message || "There was an error! Try again");
      } else if (data) {
        if (data.payload) {
          setError(null);
          await saveJobData(jobData);
          setPreparedData(data.payload);
          router.push("/dashboard");
        }
        if (!data.payload && data.message) {
          setError(data.message);
        }
      }
    } catch {
      setError("Error analyzing job description");
    }
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
          value={jobData.applicantName}
          onChange={(e) =>
            setJobData({ ...jobData, applicantName: e.target.value })
          }
        />
        <p className="mb-2 text-xs text-gray-700">Optional</p>

        <label className="block mb-2 text-gray-700 font-medium">
          Paste Job Description (required)
        </label>
        <textarea
          value={jobData.jobDescription}
          onChange={(e) =>
            setJobData({ ...jobData, jobDescription: e.target.value })
          }
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
            {jobData.resume && (
              <p className="mt-2 text-sm text-gray-600">
                Uploaded: {jobData.resume.name}
              </p>
            )}
          </div>
        )}

        {error && <div className="mt-2 text-red-700">{error}</div>}

        <div className="mt-6 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Go to Home Page
          </Link>
          <div>
            {!newJobdata ? (
              <>
                <button
                  onClick={handleReset}
                  className="mt-6 bg-gray-200 text-blue-600 px-3 py-1 rounded-lg text-lg hover:bg-gray-300 mr-4"
                >
                  Reset
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="mt-6 bg-blue-600 text-white px-3 py-1 rounded-lg text-lg hover:bg-blue-700"
                >
                  Continue
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="mt-6 bg-blue-600 text-white px-3 py-1 rounded-lg text-lg hover:bg-blue-700"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default GetStarted;
