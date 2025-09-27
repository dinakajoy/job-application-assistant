import { IResumeRewrite } from "@/types";

export default function Resume({ resumeData }: { resumeData: IResumeRewrite }) {
  return (
    <div className="w-full mx-auto p-6 mt-2">
      <h1 className="text-2xl font-bold mb-4">My Resume</h1>
      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 underline">Summary</h2>
        <p className="text-md text-gray-700">{resumeData.summary}</p>
      </section>

      {/* Skills */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 underline">Skills</h2>
        <ul className="grid grid-cols-2 gap-1 list-disc list-inside">
          {resumeData.skills_section.map((skill: string, i: number) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 underline">Experience</h2>
        {resumeData.experience_section.map((exp, i: number) => (
          <div key={i} className="mb-4">
            <h3 className="text-lg font-medium">
              {exp.title} — <span className="italic">{exp.company}</span>
            </h3>
            <p className="text-sm text-gray-600">{exp.dates}</p>
            <ul className="list-disc list-inside ml-4">
              {exp.description?.map((d: string, j: number) => (
                <li key={j}>{d}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
