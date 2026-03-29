import type { UserProfile } from "@/types";

export function createEmptyProfile(): UserProfile {
  return {
    contact: {
      fullName: "",
      phone: "",
      email: "",
      linkedin: "",
      github: "",
      website: "",
      photoUrl: "",
    },
    summary: "",
    education: [],
    experience: [],
    projects: [],
    extracurriculars: [],
    skills: {
      programming: [],
      tools: [],
      soft: [],
      languages: [],
    },
  };
}
