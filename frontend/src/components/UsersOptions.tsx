import React, { useEffect } from "react";
import { useUserOptionsStore } from "@/context/useUserOptionsStore";
import { OPTIONS, OPTIONS_MAP } from "@/constants";
import { UsersOptionsProps } from "@/types";

const UsersOptions: React.FC<UsersOptionsProps> = ({ editable = true }) => {
  const { options, setOptions, loadOptions, clearOptions } = useUserOptionsStore();

  const OPTION_DEPENDENCIES: Record<string, string[]> = {
    [OPTIONS_MAP.ResumeReWrite]: [
      OPTIONS_MAP.JobAnalysis,
      OPTIONS_MAP.ResumeMatch,
      OPTIONS_MAP.ResumeImprovementTips,
    ],
  };

  useEffect(() => {
    // hydrate from IndexedDB on mount
    loadOptions();
  }, [loadOptions]);

  const toggleOption = async (value: string) => {
    if (!editable) return;

    await clearOptions();
    let newOptions = options;

    if (value === OPTIONS_MAP.ResumeReWrite) {
      if (!options.includes(value)) {
        newOptions = [
          ...new Set([...options, value, ...OPTION_DEPENDENCIES[value]]),
        ];
      } else {
        newOptions = options.filter((opt) => opt !== value);
      }
    } else if (options.includes(value)) {
      newOptions = options.filter((opt) => opt !== value);
    } else {
      newOptions = [...options, value];
    }

    setOptions(newOptions);
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
