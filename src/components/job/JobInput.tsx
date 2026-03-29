"use client";

import type { JobListing } from "@/types";
import FormField from "@/components/common/FormField";

interface JobInputProps {
  job: JobListing;
  onChange: (job: JobListing) => void;
  onGenerate: () => void;
  onBack: () => void;
  loading: boolean;
}

export default function JobInput({ job, onChange, onGenerate, onBack, loading }: JobInputProps) {
  function updateField(field: keyof JobListing, value: string) {
    onChange({ ...job, [field]: value });
  }

  const canGenerate = job.title.trim() && job.description.trim();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Job Details</h2>
        <p className="text-sm text-muted">
          Paste the job listing details below. The AI will tailor your CV to match this specific role.
        </p>

        <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4">
          <p className="text-sm text-primary font-medium mb-2">Chrome Extension Coming Soon</p>
          <p className="text-xs text-muted">
            Soon you&apos;ll be able to import job listings directly from LinkedIn, Indeed, and other
            platforms with one click using our Chrome extension.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Job Title"
            value={job.title}
            onChange={(v) => updateField("title", v)}
            required
            placeholder="Software Engineer"
          />
          <FormField
            label="Company"
            value={job.company}
            onChange={(v) => updateField("company", v)}
            placeholder="Google"
          />
        </div>

        <FormField
          label="Location"
          value={job.location}
          onChange={(v) => updateField("location", v)}
          placeholder="San Francisco, CA / Remote"
        />

        <FormField
          label="Job Description"
          value={job.description}
          onChange={(v) => updateField("description", v)}
          multiline
          rows={8}
          required
          placeholder="Paste the full job description here..."
        />

        <FormField
          label="Requirements (optional, if separate from description)"
          value={job.requirements}
          onChange={(v) => updateField("requirements", v)}
          multiline
          rows={5}
          placeholder="Paste specific requirements or qualifications here..."
        />

        <FormField
          label="Source URL (optional)"
          value={job.sourceUrl}
          onChange={(v) => updateField("sourceUrl", v)}
          placeholder="https://linkedin.com/jobs/..."
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="rounded-lg border border-border px-6 py-3 font-medium text-muted hover:bg-gray-50"
        >
          ← Back to Profile
        </button>
        <button
          onClick={onGenerate}
          disabled={!canGenerate || loading}
          className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating CV..." : "Generate Tailored CV"}
        </button>
      </div>
    </div>
  );
}
