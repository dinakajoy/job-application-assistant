import Link from "next/link";
import { useState } from "react";
import { useUserOptionsContext } from "@/context/UserOptionsContext";
import { Header } from "@/components/Header";
import { MatchOptionsToComponent, OPTIONS } from "@/constants";

type OptionKey = keyof typeof MatchOptionsToComponent;

const Dashboard = () => {
  const { options } = useUserOptionsContext();
  const [active, setActive] = useState<OptionKey | null>(null);

  const handleClick = (value: string) => {
    setActive((prev) => (prev === value ? null : value as OptionKey));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <Header />
      {/* Home Page Link */}
      <div className="mt-6 text-center">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Go to Home Page
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {OPTIONS.map((opt) =>
          options.includes(opt.value) ? (
            <div key={opt.value}>
              <button
                onClick={() => handleClick(opt.value)}
                className="block w-full text-lg font-medium text-center text-blue-700 hover:text-blue-400 underline"
              >
                {opt.label}
              </button>
            </div>
          ) : (
            <div
              key={opt.value}
              className="text-lg font-medium text-center text-gray-500 cursor-not-allowed underline"
            >
              {opt.label}
            </div>
          )
        )}
      </div>

      {active && (
        <div className="w-full max-w-full sm:max-w-xl md:max-w-[80%] lg:max-w-[65%] xl:max-w-3xl rounded-lg mt-3 p-3 border bg-white text-sm text-gray-700">
          {(() => {
            const Component = MatchOptionsToComponent[active];
            return Component ? <Component /> : null;
          })()}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
