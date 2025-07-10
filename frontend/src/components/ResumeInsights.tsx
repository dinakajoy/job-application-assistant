import { IResumeTips } from "@/types/types";

export default function ResumeInsights({ missing_skills, formatting_tips, keyword_optimization }: IResumeTips) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Skills Section */}
      <Section title="🧠 Missing Skills" items={missing_skills} />

      {/* Formatting Tips Section */}
      <Section title="📌 Formatting Tips" items={formatting_tips} />

      {/* Keyword Optimization Section */}
      <Section title="📈 Keyword Optimization" items={keyword_optimization} />
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-700">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm">{item}</li>
        ))}
      </ul>
    </div>
  );
}
