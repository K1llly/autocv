import type { UserProfile, JobListing } from "@/types";

export function buildCVPrompt(
  profile: UserProfile,
  job: JobListing,
  language: string
): string {
  return `You are an expert CV writer specializing in Harvard/ATS-optimized resumes.

Given the candidate's full profile and a specific job listing, create a tailored CV that:
1. Selects the most relevant experiences, projects, and skills for THIS specific role
2. Rewrites bullet points to naturally incorporate keywords from the job description
3. Prioritizes and reorders sections based on relevance to the role
4. Writes a targeted summary paragraph specific to this job
5. Keeps only the most relevant projects (max 4)
6. Keeps only the most relevant extracurriculars (max 3)
7. Filters skills to highlight those mentioned in the job listing first

The CV must be in ${language === "tr" ? "Turkish" : "English"}.

CANDIDATE PROFILE:
${JSON.stringify(profile, null, 2)}

JOB LISTING:
Company: ${job.company}
Title: ${job.title}
Location: ${job.location}
Description: ${job.description}
Requirements: ${job.requirements}

Respond with ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "contact": { same as input profile contact },
  "summary": "tailored summary string",
  "education": [{ "id": "string", "institution": "string", "degree": "string", "field": "string", "location": "string", "startDate": "string", "endDate": "string", "description": "tailored description" }],
  "experience": [{ "id": "string", "company": "string", "position": "string", "location": "string", "startDate": "string", "endDate": "string", "bullets": ["tailored bullet 1", "tailored bullet 2"] }],
  "projects": [{ "id": "string", "name": "string", "role": "string", "description": "tailored description", "technologies": ["tech1"], "url": "string" }],
  "extracurriculars": [{ "id": "string", "organization": "string", "role": "string", "description": "tailored description" }],
  "skills": { "programming": ["skill1"], "tools": ["tool1"], "soft": ["soft1"], "languages": [{ "language": "string", "level": "string" }] }
}`;
}

export function buildCoverLetterPrompt(
  profile: UserProfile,
  job: JobListing,
  language: string
): string {
  return `You are an expert cover letter writer.

Write a professional, compelling cover letter for the candidate applying to the specified position.

The cover letter should:
1. Be addressed to the hiring manager at the company
2. Open with a strong hook showing genuine interest in the role
3. Highlight 2-3 most relevant experiences/projects that directly match job requirements
4. Show knowledge of the company and how the candidate can contribute
5. Close with enthusiasm and a call to action
6. Be concise (3-4 paragraphs max)
7. Sound human and authentic, not generic

The cover letter must be in ${language === "tr" ? "Turkish" : "English"}.

CANDIDATE PROFILE:
${JSON.stringify(profile, null, 2)}

JOB LISTING:
Company: ${job.company}
Title: ${job.title}
Location: ${job.location}
Description: ${job.description}
Requirements: ${job.requirements}

Respond with ONLY valid JSON (no markdown, no explanation):
{
  "recipientName": "Hiring Manager",
  "companyName": "${job.company}",
  "jobTitle": "${job.title}",
  "body": "the full cover letter text with \\n for line breaks between paragraphs"
}`;
}
