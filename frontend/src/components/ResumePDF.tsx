import { IResumeRewrite } from "@/types";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontWeight: "normal", lineHeight: 1.5 },
  section: { marginBottom: 10 },
  heading: { fontSize: 12, marginBottom: 4, fontWeight: "bold" },
  lists: { marginRight: 3, marginTop: 3, marginBottom: 3 },
  experience: { marginTop: 5, marginBottom: 5 },
  company: { marginTop: 4, marginBottom: 4, fontWeight: "bold" },
  dates: { fontSize: 8, fontStyle: "italic" },
});

export default function ResumePDF({
  resumeData,
}: {
  resumeData: IResumeRewrite;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.heading}>Summary</Text>
          <Text>{resumeData.summary}</Text>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.heading}>Skills</Text>
          {resumeData.skills_section.map((s, i) => (
            <Text key={i} style={styles.lists}>
              • {s}
            </Text>
          ))}
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.heading}>Experience</Text>
          {resumeData.experience_section.map((exp, i) => (
            <View key={i} style={styles.experience}>
              <Text>
                <Text style={styles.company}>{exp.title}</Text> — {exp.company}{" "}
                <Text style={styles.lists}>({exp.dates})</Text>
              </Text>
              {exp.description?.map((d, j) => (
                <Text key={j} style={styles.lists}>
                  • {d}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
