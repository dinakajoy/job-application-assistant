import PDFDocument from "pdfkit";
import fs from "fs";

export const generateResumePDF = async (resumeJson: any, filePath: string) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  // Summary
  doc.fontSize(14).text("Summary", { underline: true });
  doc.fontSize(12).text(resumeJson.summary).moveDown();

  // Skills
  doc.fontSize(14).text("Skills", { underline: true });
  doc.fontSize(12).list(resumeJson.skills_section).moveDown();

  // Experience
  doc.fontSize(14).text("Experience", { underline: true });
  resumeJson.experience_section.forEach((exp: any) => {
    doc.fontSize(12).text(`${exp.title} - ${exp.company} (${exp.dates})`);
    doc.list(exp.description).moveDown();
  });

  // Improvements
  doc.fontSize(14).text("Improvements Applied", { underline: true });
  doc.list(resumeJson.improvements_applied);

  doc.end();
};
