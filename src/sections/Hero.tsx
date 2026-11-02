import { motion } from "framer-motion";
import { profile, techPills } from "../data/content";
import { scrollToId } from "../utils/scrollTo";
import Badge from "../components/Badge";
import Button from "../components/Button";
import ParticleField from "../components/ParticleField";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100svh-var(--header-height,4.5rem))] scroll-mt-36 flex-col justify-center overflow-hidden pl-10 pr-8 py-16 sm:pl-10 sm:pr-10 lg:px-12"
    >
      <ParticleField />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper-dim px-4 py-1.5 text-xs font-medium text-ink-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {profile.availability}
        </span>

        <h1 className="font-display text-4xl font-bold text-ink sm:text-6xl">
          {profile.name}
        </h1>

        <p className="font-display text-xl font-medium text-accent sm:text-2xl">
          {profile.tagline}
        </p>

        <p className="max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
          {profile.intro}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => scrollToId("projects")} variant="primary">
            View Projects
          </Button>
          <Button onClick={() => scrollToId("contact")} variant="secondary">
            Contact Me
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {techPills.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
