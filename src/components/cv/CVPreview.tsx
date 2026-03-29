"use client";

import type { GeneratedCV } from "@/types";

interface CVPreviewProps {
  cv: GeneratedCV;
  onChange: (cv: GeneratedCV) => void;
  onDownload: () => void;
  onCoverLetter: () => void;
  onBack: () => void;
  downloading: boolean;
}

export default function CVPreview({
  cv,
  onChange,
  onDownload,
  onCoverLetter,
  onBack,
  downloading,
}: CVPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:bg-gray-50"
          >
            ← Back
          </button>
          <h2 className="text-lg font-semibold">CV Preview</h2>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={cv.includePhoto}
              onChange={(e) => onChange({ ...cv, includePhoto: e.target.checked })}
              className="rounded"
            />
            Include Photo
          </label>
          <select
            value={cv.language}
            onChange={(e) => onChange({ ...cv, language: e.target.value })}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          >
            <option value="en">English</option>
            <option value="tr">Turkish</option>
          </select>
          <button
            onClick={onDownload}
            disabled={downloading}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {downloading ? "Generating PDF..." : "Download PDF"}
          </button>
          <button
            onClick={onCoverLetter}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            Generate Cover Letter →
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div
          id="cv-content"
          className="w-[210mm] min-h-[297mm] bg-white shadow-lg"
          style={{
            padding: "15mm 20mm",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "10pt",
            lineHeight: "1.4",
            color: "#000",
          }}
        >
          {/* Header */}
          <div className="text-center mb-1">
            {cv.includePhoto && cv.contact.photoUrl && (
              <div className="float-left mr-4 mb-2">
                <img
                  src={cv.contact.photoUrl}
                  alt="Profile"
                  className="h-24 w-20 object-cover"
                />
              </div>
            )}
            <h1 style={{ fontSize: "22pt", fontWeight: "bold", marginBottom: "4px" }}>
              {cv.contact.fullName}
            </h1>
            <div style={{ fontSize: "9pt", color: "#333" }}>
              {[cv.contact.phone, cv.contact.email, cv.contact.linkedin, cv.contact.github, cv.contact.website]
                .filter(Boolean)
                .join("    ")}
            </div>
          </div>

          <div style={{ clear: "both" }} />

          {/* Summary */}
          {cv.summary && (
            <Section title={cv.language === "tr" ? "Özet" : "Summary"}>
              <p>{cv.summary}</p>
            </Section>
          )}

          {/* Education */}
          {cv.education.length > 0 && (
            <Section title={cv.language === "tr" ? "Eğitim" : "Education"}>
              {cv.education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between">
                    <div>
                      <strong>{edu.institution}</strong>
                      <br />
                      <em>{edu.field}{edu.degree ? ` — ${edu.degree}` : ""}</em>
                    </div>
                    <div className="text-right" style={{ fontSize: "9pt" }}>
                      <div>{edu.location}</div>
                      <em>{edu.startDate} - {edu.endDate}</em>
                    </div>
                  </div>
                  {edu.description && (
                    <ul style={{ paddingLeft: "18px", marginTop: "4px" }}>
                      <li>{edu.description}</li>
                    </ul>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Extracurriculars */}
          {cv.extracurriculars.length > 0 && (
            <Section title={cv.language === "tr" ? "Ders Dışı Faaliyetler" : "Extracurricular Activities"}>
              {cv.extracurriculars.map((ext) => (
                <div key={ext.id} className="mb-2">
                  <strong>{ext.role} – {ext.organization}</strong>
                  {ext.description && (
                    <ul style={{ paddingLeft: "18px", marginTop: "4px" }}>
                      <li>{ext.description}</li>
                    </ul>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Skills */}
          {(cv.skills.programming.length > 0 || cv.skills.tools.length > 0 || cv.skills.soft.length > 0) && (
            <Section title={cv.language === "tr" ? "Yetenekler" : "Skills"}>
              <table style={{ width: "100%", fontSize: "9.5pt" }}>
                <tbody>
                  {cv.skills.programming.length > 0 && (
                    <tr>
                      <td style={{ fontWeight: "bold", width: "160px", verticalAlign: "top", paddingBottom: "4px" }}>
                        {cv.language === "tr" ? "Programlama Dilleri:" : "Programming Skills:"}
                      </td>
                      <td style={{ paddingBottom: "4px" }}>{cv.skills.programming.join(", ")}</td>
                    </tr>
                  )}
                  {cv.skills.tools.length > 0 && (
                    <tr>
                      <td style={{ fontWeight: "bold", verticalAlign: "top", paddingBottom: "4px" }}>
                        {cv.language === "tr" ? "Araçlar:" : "Tools:"}
                      </td>
                      <td style={{ paddingBottom: "4px" }}>{cv.skills.tools.join(", ")}</td>
                    </tr>
                  )}
                  {cv.skills.soft.length > 0 && (
                    <tr>
                      <td style={{ fontWeight: "bold", verticalAlign: "top", paddingBottom: "4px" }}>
                        {cv.language === "tr" ? "Sosyal Beceriler:" : "Soft Skills:"}
                      </td>
                      <td style={{ paddingBottom: "4px" }}>{cv.skills.soft.join(", ")}</td>
                    </tr>
                  )}
                  {cv.skills.languages.length > 0 && (
                    <tr>
                      <td style={{ fontWeight: "bold", verticalAlign: "top", paddingBottom: "4px" }}>
                        {cv.language === "tr" ? "Diller:" : "Languages:"}
                      </td>
                      <td style={{ paddingBottom: "4px" }}>
                        {cv.skills.languages.map((l) => `${l.language} (${l.level})`).join(", ")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Section>
          )}

          {/* Experience */}
          {cv.experience.length > 0 && (
            <Section title={cv.language === "tr" ? "İş Deneyimi" : "Work Experience"}>
              {cv.experience.map((exp) => (
                <div key={exp.id} className="mb-3">
                  <div className="flex justify-between">
                    <div>
                      <strong>{exp.position}</strong> – {exp.company}
                    </div>
                    <div className="text-right" style={{ fontSize: "9pt" }}>
                      <div>{exp.location}</div>
                      <em>{exp.startDate} - {exp.endDate}</em>
                    </div>
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul style={{ paddingLeft: "18px", marginTop: "4px" }}>
                      {exp.bullets.map((bullet, i) => (
                        <li key={i} style={{ marginBottom: "2px" }}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Projects */}
          {cv.projects.length > 0 && (
            <Section title={cv.language === "tr" ? "Projeler" : "Projects"}>
              {cv.projects.map((proj) => (
                <div key={proj.id} className="mb-3">
                  <strong>{proj.name}</strong>
                  {proj.role && <span> - {proj.role}</span>}
                  {proj.description && (
                    <ul style={{ paddingLeft: "18px", marginTop: "4px" }}>
                      <li>{proj.description}</li>
                    </ul>
                  )}
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: "10px" }}>
      <h2
        style={{
          fontSize: "13pt",
          fontWeight: "bold",
          borderBottom: "1.5px solid #000",
          paddingBottom: "2px",
          marginBottom: "6px",
        }}
      >
        {title}:
      </h2>
      {children}
    </div>
  );
}
