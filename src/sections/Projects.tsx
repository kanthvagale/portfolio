import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, ImageOff, Play } from "lucide-react";
import { projects } from "../data/content";
import type { Project } from "../types/content";
import Card from "../components/Card";
import Badge from "../components/Badge";
import ProjectMediaModal from "../components/ProjectMediaModal";
import { GithubIcon } from "../components/icons";
import { assetUrl } from "../utils/assetUrl";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function Projects() {
  const [showing, setShowing] = useState<Project | null>(null);
  const closeMedia = useCallback(() => setShowing(null), []);

  return (
    <section id="projects" className="scroll-mt-36 pl-10 pr-8 pt-8 pb-20 sm:pl-10 sm:pr-10 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="max-w-2xl text-base text-ink-soft">
          A selection of my recent work across mobile, web, and backend systems.
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {projects.map((project) => (
            <motion.div key={project.name} variants={item}>
              <Card className="flex h-full flex-col">
                <div className="relative flex aspect-[2/1] items-center justify-center bg-paper-dim">
                  {project.thumbnail ? (
                    <img
                      src={assetUrl(project.thumbnail)}
                      alt={`${project.name} preview`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageOff className="h-8 w-8 text-ink-soft/40" aria-hidden />
                  )}

                  {project.video && (
                    <button
                      type="button"
                      onClick={() => setShowing(project)}
                      className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-black/85"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" aria-hidden />
                      Watch promo
                    </button>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl font-semibold text-ink">
                      {project.name}
                    </h3>
                    <span className="text-xs font-medium text-ink-soft">
                      {project.timeframe}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-ink-soft">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>

                  {(project.demoUrl || project.sourceUrl) && (
                    <div className="mt-auto flex items-center gap-4 pt-2 text-sm font-medium text-ink">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 hover:text-accent"
                        >
                          <ExternalLink className="h-4 w-4" aria-hidden />
                          Demo
                        </a>
                      )}
                      {project.sourceUrl && (
                        <a
                          href={project.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 hover:text-accent"
                        >
                          <GithubIcon className="h-4 w-4" />
                          Source
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {showing?.video && (
          <ProjectMediaModal
            title={showing.name}
            video={assetUrl(showing.video)}
            poster={showing.thumbnail && assetUrl(showing.thumbnail)}
            screenshots={showing.screenshots}
            onClose={closeMedia}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
