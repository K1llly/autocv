"use client";

import { useState } from "react";
import type { UserProfile, Education, WorkExperience, Project, Extracurricular, LanguageSkill } from "@/types";
import { generateId } from "@/lib/id";
import FormField from "@/components/common/FormField";
import { Plus, Trash2, GitFork } from "lucide-react";

interface ProfileFormProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
  onNext: () => void;
}

type ProfileSection = "contact" | "education" | "experience" | "projects" | "extracurriculars" | "skills";

const SECTIONS: { key: ProfileSection; label: string }[] = [
  { key: "contact", label: "Contact Info" },
  { key: "education", label: "Education" },
  { key: "experience", label: "Work Experience" },
  { key: "projects", label: "Projects" },
  { key: "extracurriculars", label: "Extracurriculars" },
  { key: "skills", label: "Skills" },
];

export default function ProfileForm({ profile, onChange, onNext }: ProfileFormProps) {
  const [activeSection, setActiveSection] = useState<ProfileSection>("contact");
  const [githubUsername, setGithubUsername] = useState("");
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [skillInput, setSkillInput] = useState({ programming: "", tools: "", soft: "" });
  const [languageInput, setLanguageInput] = useState<LanguageSkill>({ language: "", level: "" });

  function updateContact(field: string, value: string) {
    onChange({
      ...profile,
      contact: { ...profile.contact, [field]: value },
    });
  }

  function addEducation() {
    const entry: Education = {
      id: generateId(),
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    onChange({ ...profile, education: [...profile.education, entry] });
  }

  function updateEducation(id: string, field: string, value: string) {
    onChange({
      ...profile,
      education: profile.education.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  }

  function removeEducation(id: string) {
    onChange({
      ...profile,
      education: profile.education.filter((e) => e.id !== id),
    });
  }

  function addExperience() {
    const entry: WorkExperience = {
      id: generateId(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      bullets: [""],
    };
    onChange({ ...profile, experience: [...profile.experience, entry] });
  }

  function updateExperience(id: string, field: string, value: string | string[]) {
    onChange({
      ...profile,
      experience: profile.experience.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  }

  function removeExperience(id: string) {
    onChange({
      ...profile,
      experience: profile.experience.filter((e) => e.id !== id),
    });
  }

  function updateBullet(expId: string, bulletIndex: number, value: string) {
    onChange({
      ...profile,
      experience: profile.experience.map((e) => {
        if (e.id !== expId) return e;
        const bullets = [...e.bullets];
        bullets[bulletIndex] = value;
        return { ...e, bullets };
      }),
    });
  }

  function addBullet(expId: string) {
    onChange({
      ...profile,
      experience: profile.experience.map((e) =>
        e.id === expId ? { ...e, bullets: [...e.bullets, ""] } : e
      ),
    });
  }

  function removeBullet(expId: string, bulletIndex: number) {
    onChange({
      ...profile,
      experience: profile.experience.map((e) => {
        if (e.id !== expId) return e;
        return { ...e, bullets: e.bullets.filter((_, i) => i !== bulletIndex) };
      }),
    });
  }

  function addProject() {
    const entry: Project = {
      id: generateId(),
      name: "",
      role: "",
      description: "",
      technologies: [],
      url: "",
    };
    onChange({ ...profile, projects: [...profile.projects, entry] });
  }

  function updateProject(id: string, field: string, value: string | string[]) {
    onChange({
      ...profile,
      projects: profile.projects.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
  }

  function removeProject(id: string) {
    onChange({
      ...profile,
      projects: profile.projects.filter((p) => p.id !== id),
    });
  }

  function addExtracurricular() {
    const entry: Extracurricular = {
      id: generateId(),
      organization: "",
      role: "",
      description: "",
    };
    onChange({ ...profile, extracurriculars: [...profile.extracurriculars, entry] });
  }

  function updateExtracurricular(id: string, field: string, value: string) {
    onChange({
      ...profile,
      extracurriculars: profile.extracurriculars.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  }

  function removeExtracurricular(id: string) {
    onChange({
      ...profile,
      extracurriculars: profile.extracurriculars.filter((e) => e.id !== id),
    });
  }

  function addSkill(category: "programming" | "tools" | "soft") {
    const value = skillInput[category].trim();
    if (!value) return;
    if (profile.skills[category].includes(value)) return;

    onChange({
      ...profile,
      skills: {
        ...profile.skills,
        [category]: [...profile.skills[category], value],
      },
    });
    setSkillInput((prev) => ({ ...prev, [category]: "" }));
  }

  function removeSkill(category: "programming" | "tools" | "soft", skill: string) {
    onChange({
      ...profile,
      skills: {
        ...profile.skills,
        [category]: profile.skills[category].filter((s) => s !== skill),
      },
    });
  }

  function addLanguage() {
    if (!languageInput.language.trim() || !languageInput.level.trim()) return;
    onChange({
      ...profile,
      skills: {
        ...profile.skills,
        languages: [...profile.skills.languages, { ...languageInput }],
      },
    });
    setLanguageInput({ language: "", level: "" });
  }

  function removeLanguage(index: number) {
    onChange({
      ...profile,
      skills: {
        ...profile.skills,
        languages: profile.skills.languages.filter((_, i) => i !== index),
      },
    });
  }

  async function importFromGithub() {
    if (!githubUsername.trim()) return;
    setLoadingGithub(true);

    try {
      const res = await fetch(`/api/github?username=${encodeURIComponent(githubUsername)}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const repos: { name: string; description: string; language: string; url: string; topics: string[] }[] = await res.json();

      const newProjects: Project[] = repos.slice(0, 10).map((repo) => ({
        id: generateId(),
        name: repo.name,
        role: "Developer",
        description: repo.description,
        technologies: [repo.language, ...repo.topics].filter(Boolean),
        url: repo.url,
      }));

      onChange({
        ...profile,
        projects: [...profile.projects, ...newProjects],
      });
    } catch {
      alert("Could not fetch GitHub repos. Check the username and try again.");
    } finally {
      setLoadingGithub(false);
    }
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateContact("photoUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex gap-6">
      <nav className="w-48 shrink-0">
        <div className="sticky top-4 space-y-1">
          {SECTIONS.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                activeSection === section.key
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-gray-100"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex-1 space-y-6">
        {activeSection === "contact" && (
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Full Name" value={profile.contact.fullName} onChange={(v) => updateContact("fullName", v)} required placeholder="Alperen Gökay Göktaş" />
              <FormField label="Phone" value={profile.contact.phone} onChange={(v) => updateContact("phone", v)} placeholder="+90 554 690 91 63" />
              <FormField label="Email" value={profile.contact.email} onChange={(v) => updateContact("email", v)} type="email" required placeholder="email@example.com" />
              <FormField label="LinkedIn" value={profile.contact.linkedin} onChange={(v) => updateContact("linkedin", v)} placeholder="linkedin.com/in/username" />
              <FormField label="GitHub" value={profile.contact.github} onChange={(v) => updateContact("github", v)} placeholder="github.com/username" />
              <FormField label="Website" value={profile.contact.website} onChange={(v) => updateContact("website", v)} placeholder="yoursite.com" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Photo (optional)</label>
              <div className="flex items-center gap-4">
                {profile.contact.photoUrl && (
                  <img src={profile.contact.photoUrl} alt="Profile" className="h-16 w-16 rounded-lg object-cover" />
                )}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-sm" />
                {profile.contact.photoUrl && (
                  <button onClick={() => updateContact("photoUrl", "")} className="text-sm text-danger hover:underline">
                    Remove
                  </button>
                )}
              </div>
            </div>

            <FormField label="Professional Summary" value={profile.summary} onChange={(v) => onChange({ ...profile, summary: v })} multiline rows={4} placeholder="Passionate computer engineer with around two years of practical experience..." />
          </div>
        )}

        {activeSection === "education" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Education</h2>
              <button onClick={addEducation} className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm text-white hover:bg-primary-hover">
                <Plus size={16} /> Add Education
              </button>
            </div>
            {profile.education.map((edu) => (
              <div key={edu.id} className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex justify-end">
                  <button onClick={() => removeEducation(edu.id)} className="text-danger hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Institution" value={edu.institution} onChange={(v) => updateEducation(edu.id, "institution", v)} required placeholder="Ankara Bilim University" />
                  <FormField label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, "degree", v)} placeholder="Bachelor's" />
                  <FormField label="Field of Study" value={edu.field} onChange={(v) => updateEducation(edu.id, "field", v)} placeholder="Computer Engineering" />
                  <FormField label="Location" value={edu.location} onChange={(v) => updateEducation(edu.id, "location", v)} placeholder="Ankara, Turkiye" />
                  <FormField label="Start Date" value={edu.startDate} onChange={(v) => updateEducation(edu.id, "startDate", v)} placeholder="2022" />
                  <FormField label="End Date" value={edu.endDate} onChange={(v) => updateEducation(edu.id, "endDate", v)} placeholder="Present" />
                </div>
                <FormField label="Description" value={edu.description} onChange={(v) => updateEducation(edu.id, "description", v)} multiline placeholder="Studied a combination of engineering, management, and computer science..." />
              </div>
            ))}
            {profile.education.length === 0 && (
              <p className="text-center text-muted py-8">No education added yet. Click &quot;Add Education&quot; to start.</p>
            )}
          </div>
        )}

        {activeSection === "experience" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Work Experience</h2>
              <button onClick={addExperience} className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm text-white hover:bg-primary-hover">
                <Plus size={16} /> Add Experience
              </button>
            </div>
            {profile.experience.map((exp) => (
              <div key={exp.id} className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex justify-end">
                  <button onClick={() => removeExperience(exp.id)} className="text-danger hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Company" value={exp.company} onChange={(v) => updateExperience(exp.id, "company", v)} required placeholder="Google" />
                  <FormField label="Position" value={exp.position} onChange={(v) => updateExperience(exp.id, "position", v)} required placeholder="Software Engineer" />
                  <FormField label="Location" value={exp.location} onChange={(v) => updateExperience(exp.id, "location", v)} placeholder="San Francisco, CA" />
                  <div />
                  <FormField label="Start Date" value={exp.startDate} onChange={(v) => updateExperience(exp.id, "startDate", v)} placeholder="Jan 2023" />
                  <FormField label="End Date" value={exp.endDate} onChange={(v) => updateExperience(exp.id, "endDate", v)} placeholder="Present" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Bullet Points</label>
                  {exp.bullets.map((bullet, i) => (
                    <div key={i} className="mb-2 flex items-start gap-2">
                      <span className="mt-2.5 text-muted">•</span>
                      <textarea
                        value={bullet}
                        onChange={(e) => updateBullet(exp.id, i, e.target.value)}
                        rows={2}
                        className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Describe what you did, the impact, and technologies used..."
                      />
                      {exp.bullets.length > 1 && (
                        <button onClick={() => removeBullet(exp.id, i)} className="mt-2 text-danger hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addBullet(exp.id)} className="text-sm text-primary hover:underline">
                    + Add bullet point
                  </button>
                </div>
              </div>
            ))}
            {profile.experience.length === 0 && (
              <p className="text-center text-muted py-8">No experience added yet. Click &quot;Add Experience&quot; to start.</p>
            )}
          </div>
        )}

        {activeSection === "projects" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Projects</h2>
              <div className="flex gap-2">
                <button onClick={addProject} className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm text-white hover:bg-primary-hover">
                  <Plus size={16} /> Add Project
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <GitFork size={18} className="text-muted" />
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="GitHub username"
                  className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                  onKeyDown={(e) => e.key === "Enter" && importFromGithub()}
                />
                <button
                  onClick={importFromGithub}
                  disabled={loadingGithub}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {loadingGithub ? "Importing..." : "Import from GitHub"}
                </button>
              </div>
            </div>

            {profile.projects.map((proj) => (
              <div key={proj.id} className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex justify-end">
                  <button onClick={() => removeProject(proj.id)} className="text-danger hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Project Name" value={proj.name} onChange={(v) => updateProject(proj.id, "name", v)} required placeholder="stoicMind" />
                  <FormField label="Your Role" value={proj.role} onChange={(v) => updateProject(proj.id, "role", v)} placeholder="Project Lead" />
                  <FormField label="URL" value={proj.url} onChange={(v) => updateProject(proj.id, "url", v)} placeholder="github.com/user/project" />
                  <FormField
                    label="Technologies (comma separated)"
                    value={proj.technologies.join(", ")}
                    onChange={(v) => updateProject(proj.id, "technologies", v.split(",").map((t) => t.trim()).filter(Boolean))}
                    placeholder="React, Python, Docker"
                  />
                </div>
                <FormField label="Description" value={proj.description} onChange={(v) => updateProject(proj.id, "description", v)} multiline placeholder="Describe what you built and the impact..." />
              </div>
            ))}
            {profile.projects.length === 0 && (
              <p className="text-center text-muted py-8">No projects added yet. Add manually or import from GitHub.</p>
            )}
          </div>
        )}

        {activeSection === "extracurriculars" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Extracurricular Activities</h2>
              <button onClick={addExtracurricular} className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm text-white hover:bg-primary-hover">
                <Plus size={16} /> Add Activity
              </button>
            </div>
            {profile.extracurriculars.map((ext) => (
              <div key={ext.id} className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex justify-end">
                  <button onClick={() => removeExtracurricular(ext.id)} className="text-danger hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Organization" value={ext.organization} onChange={(v) => updateExtracurricular(ext.id, "organization", v)} required placeholder="Data Plus Student Club" />
                  <FormField label="Role" value={ext.role} onChange={(v) => updateExtracurricular(ext.id, "role", v)} placeholder="President" />
                </div>
                <FormField label="Description" value={ext.description} onChange={(v) => updateExtracurricular(ext.id, "description", v)} multiline placeholder="Describe your role and contributions..." />
              </div>
            ))}
            {profile.extracurriculars.length === 0 && (
              <p className="text-center text-muted py-8">No activities added yet. Click &quot;Add Activity&quot; to start.</p>
            )}
          </div>
        )}

        {activeSection === "skills" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Skills</h2>

            {(["programming", "tools", "soft"] as const).map((category) => (
              <div key={category} className="rounded-xl border border-border bg-card p-6 space-y-3">
                <h3 className="text-sm font-semibold capitalize">
                  {category === "programming" ? "Programming Skills" : category === "tools" ? "Tools" : "Soft Skills"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills[category].map((skill) => (
                    <span key={skill} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                      {skill}
                      <button onClick={() => removeSkill(category, skill)} className="ml-1 text-primary/50 hover:text-danger">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput[category]}
                    onChange={(e) => setSkillInput((prev) => ({ ...prev, [category]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && addSkill(category)}
                    placeholder={`Add ${category} skill...`}
                    className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <button onClick={() => addSkill(category)} className="rounded-lg bg-primary px-3 py-2 text-sm text-white hover:bg-primary-hover">
                    Add
                  </button>
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <h3 className="text-sm font-semibold">Languages</h3>
              <div className="space-y-2">
                {profile.skills.languages.map((lang, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                      {lang.language} ({lang.level})
                    </span>
                    <button onClick={() => removeLanguage(i)} className="text-danger/50 hover:text-danger text-sm">
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={languageInput.language}
                  onChange={(e) => setLanguageInput((prev) => ({ ...prev, language: e.target.value }))}
                  placeholder="Language (e.g. English)"
                  className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <input
                  type="text"
                  value={languageInput.level}
                  onChange={(e) => setLanguageInput((prev) => ({ ...prev, level: e.target.value }))}
                  placeholder="Level (e.g. C1)"
                  className="w-32 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                  onKeyDown={(e) => e.key === "Enter" && addLanguage()}
                />
                <button onClick={addLanguage} className="rounded-lg bg-primary px-3 py-2 text-sm text-white hover:bg-primary-hover">
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            onClick={onNext}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary-hover"
          >
            Next: Job Details →
          </button>
        </div>
      </div>
    </div>
  );
}
