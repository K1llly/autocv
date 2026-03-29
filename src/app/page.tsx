"use client";

import { useState } from "react";
import type {
  AppStep,
  UserProfile,
  JobListing,
  GeneratedCV,
  GeneratedCoverLetter,
} from "@/types";
import { createEmptyProfile } from "@/lib/empty-profile";
import { downloadElementAsPdf } from "@/lib/pdf";
import StepIndicator from "@/components/common/StepIndicator";
import ProfileForm from "@/components/profile/ProfileForm";
import JobInput from "@/components/job/JobInput";
import CVPreview from "@/components/cv/CVPreview";
import CoverLetterPreview from "@/components/cv/CoverLetterPreview";

const EMPTY_JOB: JobListing = {
  company: "",
  title: "",
  location: "",
  description: "",
  requirements: "",
  sourceUrl: "",
};

export default function Home() {
  const [step, setStep] = useState<AppStep>("profile");
  const [profile, setProfile] = useState<UserProfile>(createEmptyProfile());
  const [job, setJob] = useState<JobListing>(EMPTY_JOB);
  const [generatedCV, setGeneratedCV] = useState<GeneratedCV | null>(null);
  const [coverLetter, setCoverLetter] = useState<GeneratedCoverLetter | null>(null);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, job, language }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate CV");
      }

      const cvData = await res.json();
      setGeneratedCV({
        ...cvData,
        includePhoto: !!profile.contact.photoUrl,
        language,
      });
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateCoverLetter() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, job, language }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate cover letter");
      }

      const data = await res.json();
      setCoverLetter({ ...data, language });
      setStep("cover-letter");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadCV() {
    setDownloading(true);
    try {
      await downloadElementAsPdf(
        "cv-content",
        `CV_${profile.contact.fullName.replace(/\s+/g, "_")}_${job.company}.pdf`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  }

  async function handleDownloadCoverLetter() {
    setDownloading(true);
    try {
      await downloadElementAsPdf(
        "cover-letter-content",
        `Cover_Letter_${profile.contact.fullName.replace(/\s+/g, "_")}_${job.company}.pdf`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">
              Auto<span className="text-primary">CV</span>
            </h1>
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm"
              >
                <option value="en">English</option>
                <option value="tr">Türkçe</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6">
        <StepIndicator currentStep={step} onStepClick={setStep} />

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 font-medium hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <main className="pb-12">
          {step === "profile" && (
            <ProfileForm
              profile={profile}
              onChange={setProfile}
              onNext={() => setStep("job")}
            />
          )}

          {step === "job" && (
            <JobInput
              job={job}
              onChange={setJob}
              onGenerate={handleGenerate}
              onBack={() => setStep("profile")}
              loading={loading}
            />
          )}

          {step === "preview" && generatedCV && (
            <CVPreview
              cv={generatedCV}
              onChange={setGeneratedCV}
              onDownload={handleDownloadCV}
              onCoverLetter={handleGenerateCoverLetter}
              onBack={() => setStep("job")}
              downloading={downloading}
            />
          )}

          {step === "cover-letter" && coverLetter && (
            <CoverLetterPreview
              coverLetter={coverLetter}
              contact={profile.contact}
              onDownload={handleDownloadCoverLetter}
              onBack={() => setStep("preview")}
              downloading={downloading}
            />
          )}
        </main>
      </div>
    </div>
  );
}
