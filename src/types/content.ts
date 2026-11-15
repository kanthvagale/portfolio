export interface NavLink {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  intro: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  github: string;
  linkedin: string;
  resumeHref: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
}

export interface SkillItem {
  name: string;
  detail: string;
  level: number; // 0-100, used for the proficiency bar
}

export interface SkillCategory {
  name: string;
  icon: "code" | "smartphone" | "server" | "wrench";
  items: SkillItem[];
}

export interface Screenshot {
  src: string; // image path in public/
  alt: string;
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  timeframe: string;
  thumbnail?: string; // optional image path in public/ — falls back to a placeholder when absent
  video?: string; // optional promo video path in public/ — adds a "Watch promo" button
  screenshots?: Screenshot[]; // optional app screenshots, shown in a strip under the promo video
  demoUrl?: string;
  sourceUrl?: string;
}

export interface EducationItem {
  degree: string;
  school: string;
  location: string;
  years: string;
  coursework: string;
}
