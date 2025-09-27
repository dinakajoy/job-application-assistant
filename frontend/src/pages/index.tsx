import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserOptionsContext } from "@/context/UserOptionsContext";
import Feature from "@/components/Feature";
import { Header } from "@/components/Header";
import UsersOptions from "@/components/UsersOptions";

const Home = () => {
  const router = useRouter();
  const { options } = useUserOptionsContext();

  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setError(null);
    if (options.length === 0) {
      setError("Please select at least one option.");
      return;
    }
    router.push("/get-started");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <Header />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <Feature
          title="📄 Job Analysis"
          description="Extracts key skills from job descriptions."
        />
        <Feature
          title="✅ Resume Match"
          description="Compares your resume and provides a match score."
        />
        <Feature
          title="🚀 Improvement Tips"
          description="Suggests keywords to enhance your resume."
        />
        <Feature
          title="📋 Resume Generator"
          description="Generate new resume to match job description."
        />
        <Feature
          title="📝 Cover Letter Generator"
          description="Creates a tailored cover letter for job applications."
        />
        <Feature
          title="📩 Email Generator"
          description="Creates a tailored email content for job applications."
        />
      </div>

      <div className="mt-6 p-6 text-left">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          Choose what you want to do:
        </h2>
        <UsersOptions editable={true} />
        {error && (
          <div className="mt-2 p-2 text-red-700 text-center">{error}</div>
        )}
        <div className="flex items-center justify-center mt-6">
          <button
            onClick={handleStart}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-lg shadow-md hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
