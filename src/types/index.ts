export interface ContactInfo {
  fullName: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  website: string;
  photoUrl: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Project {
  id: string;
  name: string;
  role: string;
  description: string;
  technologies: string[];
  url: string;
}

export interface Extracurricular {
  id: string;
  organization: string;
  role: string;
  description: string;
}

export interface Skills {
  programming: string[];
  tools: string[];
  soft: string[];
  languages: LanguageSkill[];
}

export interface LanguageSkill {
  language: string;
  level: string;
}

export interface UserProfile {
  contact: ContactInfo;
  summary: string;
  education: Education[];
  experience: WorkExperience[];
  projects: Project[];
  extracurriculars: Extracurricular[];
  skills: Skills;
}

export interface JobListing {
  company: string;
  title: string;
  location: string;
  description: string;
  requirements: string;
  sourceUrl: string;
}

export interface GeneratedCV {
  contact: ContactInfo;
  summary: string;
  education: Education[];
  experience: WorkExperience[];
  projects: Project[];
  extracurriculars: Extracurricular[];
  skills: Skills;
  includePhoto: boolean;
  language: string;
}

export interface GeneratedCoverLetter {
  recipientName: string;
  companyName: string;
  jobTitle: string;
  body: string;
  language: string;
}

export type AppStep = "profile" | "job" | "preview" | "cover-letter";
