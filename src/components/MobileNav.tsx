import { motion } from "framer-motion";
import type { NavLink } from "../types/content";
import { scrollToId } from "../utils/scrollTo";
import Button from "./Button";

interface MobileNavProps {
  links: NavLink[];
  resumeHref: string;
  onClose: () => void;
}

export default function MobileNav({ links, resumeHref, onClose }: MobileNavProps) {
  const handleClick = (href: string) => {
    scrollToId(href.replace("#", ""));
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className="absolute left-0 top-full w-full border-b border-ink/10 bg-paper/95 backdrop-blur-md md:hidden"
    >
      <nav className="flex flex-col gap-1 px-4 py-4">
        {links.map((link) => (
          <button
            key={link.href}
            onClick={() => handleClick(link.href)}
            className="rounded-lg px-3 py-3 text-left text-base font-medium text-ink hover:bg-paper-dim"
          >
            {link.label}
          </button>
        ))}
        <Button
          as="a"
          href={resumeHref}
          download
          variant="primary"
          className="mt-2 w-full"
          onClick={onClose}
        >
          Download Resume
        </Button>
      </nav>
    </motion.div>
  );
}
