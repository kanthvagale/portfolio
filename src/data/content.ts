import type {
  EducationItem,
  ExperienceItem,
  NavLink,
  Profile,
  Project,
  SkillCategory,
} from "../types/content";

export const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export const profile: Profile = {
  name: "Kanth Vagale",
  title: "Mobile App Developer",
  tagline: "React Native & Expo specialist",
  intro:
    "Mobile App Developer with nearly 3 years of experience building, shipping, and maintaining production applications. I specialize in React Native/Expo and TypeScript, with experience in real-time systems, push notifications, state management, and cross-platform releases — and I'm also comfortable across the stack with React and modern backend technologies.",
  email: "kanthvagale3@gmail.com",
  phone: "+91 80885 51431",
  location: "Bengaluru, Karnataka",
  availability: "Open to opportunities",
  github: "https://github.com/kanthvagale",
  linkedin: "https://linkedin.com/in/kanthvagale",
  resumeHref: "resume.pdf",
};

export const techPills: string[] = [
  "React Native",
  "TypeScript",
  "Expo",
  "Node",
  "Bun",
  "Hono",
  "React Query",
  "WebSockets",
];

export const experience: ExperienceItem[] = [
  {
    role: "Mobile App Developer",
    company: "Sparkwave Infotech Pvt Ltd",
    location: "Remote",
    dates: "Mar 2026 – Present",
    bullets: [
      "Develop and maintain mobile applications, handling feature implementation, debugging, performance optimization, and Android/iOS deployments.",
      "Build end-to-end features involving WebSockets for real-time communication, OneSignal notifications, and offline-first functionality.",
      "Optimize server-state management with React Query caching, mutations, and query invalidation, improving app responsiveness and UX by 50%.",
    ],
  },
  {
    role: "React Native Developer",
    company: "Techasoft Pvt Ltd",
    location: "Bengaluru",
    dates: "Jun 2024 – Dec 2025",
    bullets: [
      "Developed mobile applications from scratch, owning app architecture, versioning, maintenance, and Play Store/App Store deployments.",
      "Maintained 15+ React Native applications, handling production debugging, native module upgrades, and compliance with evolving store guidelines.",
      "Built animation-rich interfaces using RN Skia, achieving 2x FPS rendering, and shipped OTA updates via CodePush/Revopush.",
    ],
  },
  {
    role: "Software Developer Intern",
    company: "Nano Robotics Embedded Technologies",
    location: "Bengaluru",
    dates: "Dec 2023 – May 2024",
    bullets: [
      "Developed responsive React.js applications and RESTful APIs using Node.js, Express.js, and MongoDB.",
      "Collaborated with senior developers on debugging, API integration, and improving application reliability.",
    ],
  },
];

export const education: EducationItem = {
  degree: "B.E. in Computer Science and Engineering",
  school: "HKBK College of Engineering, Bengaluru",
  location: "Bengaluru",
  years: "2019 – 2023",
  coursework:
    "Data Structures & Algorithms, OOP, Databases, Operating Systems, Computer Networks, Machine Learning",
};

export const skills: SkillCategory[] = [
  {
    name: "Languages",
    icon: "code",
    items: [
      { name: "JavaScript", detail: "ES6+, Async/Await", level: 85 },
      { name: "TypeScript", detail: "Strong Typing, Generics", level: 80 },
      { name: "Dart", detail: "Null Safety, Isolates", level: 60 },
      { name: "Java", detail: "OOP, Native Modules", level: 60 },
    ],
  },
  {
    name: "Mobile Development",
    icon: "smartphone",
    items: [
      { name: "React Native", detail: "Primary framework, 3+ years", level: 90 },
      { name: "Expo", detail: "Managed & bare workflow", level: 90 },
      { name: "Flutter", detail: "Dart, cross-platform UI", level: 65 },
      { name: "Skia", detail: "2D graphics, animations", level: 75 },
    ],
  },
  {
    name: "Web & Backend",
    icon: "server",
    items: [
      { name: "React", detail: "Web Frontend", level: 85 },
      { name: "Node", detail: "Runtime & tooling", level: 80 },
      { name: "Express", detail: "REST middleware & Web Server", level: 70 },
      { name: "Bun", detail: "Modern JS runtime & routing", level: 65 },
      { name: "Hono", detail: "Modern Web Server", level: 65 },
      { name: "REST APIs", detail: "Design & integration", level: 85 },
      { name: "Firebase", detail: "Auth, Firestore, FCM", level: 75 },
    ],
  },
  {
    name: "Libraries & Tools",
    icon: "wrench",
    items: [
      { name: "React Query", detail: "Server-state caching", level: 85 },
      { name: "Redux / Zustand", detail: "Client state management", level: 80 },
      { name: "WebSockets", detail: "Real-time communication", level: 75 },
      { name: "OneSignal", detail: "Push notifications", level: 75 },
      { name: "MongoDB / Turso", detail: "NoSQL & edge SQL", level: 70 },
      { name: "Drizzle ORM", detail: "Type-safe queries", level: 65 },
      { name: "Git", detail: "Version control", level: 85 },
      { name: "Postman", detail: "API testing", level: 85 },
    ],
  },
];

export const projects: Project[] = [
  {
    name: "NoteAI",
    description:
      "An AI-assisted note-taking app designed around local-first use and offline support. Uses text and image vector embeddings with a CLIP model to make note content retrievable as contextual information.",
    tech: ["Expo", "Local-first", "RAG", "CLIP embeddings"],
    timeframe: "2026 – Present",
  },
  {
    name: "VishnuPriyaSilks",
    description:
      "A product showcase experience with a polished mobile UI/UX and inventory-management functionality for store administration. Integrates WebSockets for customer-to-store-manager chat and OneSignal for promotional and chat notifications.",
    tech: ["Expo", "Bun", "Hono", "WebSockets", "OneSignal"],
    timeframe: "2026 – Present",
  },
  {
    name: "AsciiCam",
    description:
      "A side project that converts live camera video feed and uploaded images into ASCII-character artwork. Supports capturing and saving photos to the gallery and adjusting output resolution.",
    tech: ["Expo", "Mobile camera", "Image processing"],
    timeframe: "2026 – Present",
  },
  // Add a new project by appending another object here — Projects.tsx maps
  // over this array with zero per-project markup. demoUrl / sourceUrl are
  // optional and only render a link when present.
];

export const formspreeEndpoint = "https://formspree.io/f/xqppgkdy";
