import { IJobAnalysis } from "@/types/types";

export default function JobInsights({ skills, responsibilities, experience }: IJobAnalysis) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Skills Section */}
      <Section title="🧠 Skills" items={skills} />

      {/* Responsibilities Section */}
      <Section title="📌 Responsibilities" items={responsibilities} />

      {/* Experience Section */}
      <Section title="📈 Experience" items={experience} />
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-700">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm">{item}</li>
        ))}
      </ul>
    </div>
  );
}
