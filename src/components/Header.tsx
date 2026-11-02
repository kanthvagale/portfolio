import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CodeXml, Menu, X } from "lucide-react";
import { navLinks, profile } from "../data/content";
import { useActiveSection } from "../hooks/useActiveSection";
import { scrollToId } from "../utils/scrollTo";
import Button from "./Button";
import MobileNav from "./MobileNav";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection(navLinks.map((link) => link.href.replace("#", "")));
  const resumeHref = `${import.meta.env.BASE_URL}${profile.resumeHref}`;
  const headerRef = useRef<HTMLElement>(null);

  // Share the header's height so the hero can fill exactly the rest of the screen.
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const publish = () =>
      document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    scrollToId(href.replace("#", ""));
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-ink/5 bg-paper/70 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            handleNavClick("#home");
          }}
          className="flex items-center gap-2 font-display text-lg font-bold text-ink"
        >
          <CodeXml className="h-5 w-5" aria-hidden />
          Kanth Vagale
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = id === activeId;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => {
                  event.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`text-sm font-medium transition-colors ${
                  isActive ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />

          <div className="hidden md:block">
            <Button as="a" href={resumeHref} download variant="primary">
              Download Resume
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-ink md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <MobileNav
              links={navLinks}
              resumeHref={resumeHref}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
