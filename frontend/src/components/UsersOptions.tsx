import React from "react";
import { useUserOptionsContext } from "@/context/UserOptionsContext";
import { UsersOptionsProps } from "@/types";
import { OPTIONS, OPTIONS_MAP } from "@/constants";

const UsersOptions: React.FC<UsersOptionsProps> = ({ editable = true }) => {
  const { options, setOptions } = useUserOptionsContext();

  const OPTION_DEPENDENCIES: Record<string, string[]> = {
    [OPTIONS_MAP.ResumeReWrite]: [
      OPTIONS_MAP.JobAnalysis,
      OPTIONS_MAP.ResumeMatch,
      OPTIONS_MAP.ResumeImprovementTips,
    ],
  };

  const toggleOption = (value: string) => {
    if (!editable || !setOptions) return;
    setOptions((prev) => {
      // If enabling ResumeRewrite, add its dependencies
      if (value === OPTIONS_MAP.ResumeReWrite) {
        if (!prev.includes(value)) {
          return [...new Set([...prev, value, ...OPTION_DEPENDENCIES[value]])];
        } else {
          // Unticking ResumeRewrite should not untick dependencies
          return prev.filter((opt) => opt !== value);
        }
      }
      // otherwise normal toggle
      if (prev.includes(value)) {
        return prev.filter((opt) => opt !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {OPTIONS.map((opt) => (
        <div key={opt.value} className="flex items-center">
          <input
            type="checkbox"
            id={opt.value}
            checked={options.includes(opt.value)}
            onChange={() => toggleOption(opt.value)}
            className="mr-2"
            disabled={!editable}
          />
          <label
            htmlFor={opt.value}
            className={`text-gray-700 ${!editable && "opacity-60"}`}
          >
            {opt.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default UsersOptions;
