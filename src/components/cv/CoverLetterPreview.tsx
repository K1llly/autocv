"use client";

import type { GeneratedCoverLetter, ContactInfo } from "@/types";

interface CoverLetterPreviewProps {
  coverLetter: GeneratedCoverLetter;
  contact: ContactInfo;
  onDownload: () => void;
  onBack: () => void;
  downloading: boolean;
}

export default function CoverLetterPreview({
  coverLetter,
  contact,
  onDownload,
  onBack,
  downloading,
}: CoverLetterPreviewProps) {
  const paragraphs = coverLetter.body.split("\n").filter((p) => p.trim());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:bg-gray-50"
          >
            ← Back to CV
          </button>
          <h2 className="text-lg font-semibold">Cover Letter</h2>
        </div>
        <button
          onClick={onDownload}
          disabled={downloading}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {downloading ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>

      <div className="flex justify-center">
        <div
          id="cover-letter-content"
          className="w-[210mm] min-h-[297mm] bg-white shadow-lg"
          style={{
            padding: "25mm 25mm",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "11pt",
            lineHeight: "1.6",
            color: "#000",
          }}
        >
          {/* Sender Info */}
          <div style={{ marginBottom: "20px" }}>
            <strong>{contact.fullName}</strong>
            <br />
            {contact.email}
            <br />
            {contact.phone}
            {contact.linkedin && (
              <>
                <br />
                {contact.linkedin}
              </>
            )}
          </div>

          {/* Date */}
          <div style={{ marginBottom: "20px" }}>
            {new Date().toLocaleDateString(
              coverLetter.language === "tr" ? "tr-TR" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </div>

          {/* Recipient */}
          <div style={{ marginBottom: "20px" }}>
            Dear {coverLetter.recipientName},
            <br />
            {coverLetter.companyName}
          </div>

          {/* Subject */}
          <div style={{ marginBottom: "20px" }}>
            <strong>
              Re: Application for {coverLetter.jobTitle} Position
            </strong>
          </div>

          {/* Body */}
          {paragraphs.map((paragraph, i) => (
            <p key={i} style={{ marginBottom: "12px" }}>
              {paragraph}
            </p>
          ))}

          {/* Closing */}
          <div style={{ marginTop: "30px" }}>
            <p>Sincerely,</p>
            <p style={{ marginTop: "20px" }}>
              <strong>{contact.fullName}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
