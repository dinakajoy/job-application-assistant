import Feature from "@/components/Feature";
import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Smart Job Application Assistant
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          AI-powered tool to analyze job descriptions, match resumes, and
          generate tailored cover letters.
        </p>
        <Link href="/job-analysis">
          <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:bg-blue-700">
            Get Started
          </button>
        </Link>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <Feature
          title="📄 Job Analysis"
          description="Extracts key skills from job descriptions."
          link="/job-analysis"
        />
        <Feature
          title="✅ Resume Match"
          description="Compares your resume and provides a match score."
          link="/resume-match"
        />
        <Feature
          title="🚀 Improvement Tips"
          description="Suggests keywords to enhance your resume."
          link="/improvement-tips"
        />
        <Feature
          title="📝 Cover Letter Generator"
          description="Creates a tailored cover letter for job applications."
          link="/cover-letter"
        />
      </div>
    </div>
  );
};

export default Home;
