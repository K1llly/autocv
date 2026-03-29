"use client";

import type { AppStep } from "@/types";

interface StepIndicatorProps {
  currentStep: AppStep;
  onStepClick: (step: AppStep) => void;
}

const STEPS: { key: AppStep; label: string; number: number }[] = [
  { key: "profile", label: "Your Profile", number: 1 },
  { key: "job", label: "Job Details", number: 2 },
  { key: "preview", label: "CV Preview", number: 3 },
  { key: "cover-letter", label: "Cover Letter", number: 4 },
];

export default function StepIndicator({
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = step.key === currentStep;

        return (
          <div key={step.key} className="flex items-center gap-2">
            <button
              onClick={() => onStepClick(step.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isCurrent
                  ? "bg-primary text-white"
                  : isCompleted
                    ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                    : "bg-gray-100 text-muted cursor-pointer hover:bg-gray-200"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  isCurrent
                    ? "bg-white text-primary"
                    : isCompleted
                      ? "bg-primary text-white"
                      : "bg-gray-300 text-white"
                }`}
              >
                {isCompleted ? "✓" : step.number}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={`h-px w-8 ${
                  index < currentIndex ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
