import { Mail } from "lucide-react";
import { profile } from "../data/content";
import { GithubIcon, LinkedinIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="bg-ink dark:border-t dark:border-ink/10 dark:bg-paper-dim px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-paper/60 dark:text-ink-soft sm:flex-row">
        <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href={`mailto:${profile.email}`} aria-label="Email" className="hover:text-paper dark:hover:text-ink">
            <Mail className="h-4 w-4" />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-paper dark:hover:text-ink">
            <LinkedinIcon className="h-4 w-4" />
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-paper dark:hover:text-ink">
            <GithubIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
