import { motion } from "framer-motion";
import { Code2, Server, Smartphone, Wrench } from "lucide-react";
import { skills } from "../data/content";
import type { SkillCategory } from "../types/content";
import Card from "../components/Card";
import ProficiencyBar from "../components/ProficiencyBar";

const categoryIcons: Record<SkillCategory["icon"], typeof Code2> = {
  code: Code2,
  smartphone: Smartphone,
  server: Server,
  wrench: Wrench,
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-36 bg-paper-dim pl-10 pr-8 pt-8 pb-20 sm:pl-10 sm:pr-10 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="max-w-2xl text-base text-ink-soft">
          A comprehensive look at my technical stack for building high-performance mobile and web applications.
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {skills.map((category) => {
            const Icon = categoryIcons[category.icon];
            return (
              <motion.div key={category.name} variants={item}>
                <Card className="h-full bg-paper p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink/5 text-ink">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {category.name}
                    </h3>
                  </div>

                  {category.icon === "code" ? (
                    <ul className="flex flex-col gap-4">
                      {category.items.map((skill) => (
                        <li key={skill.name}>
                          <div className="mb-1.5">
                            <span className="text-sm font-medium text-ink">
                              {skill.name}
                            </span>
                          </div>
                          <ProficiencyBar level={skill.level} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {category.items.map((skill) => (
                        <li
                          key={skill.name}
                          className="rounded-xl border border-ink/10 px-3 py-2.5"
                        >
                          <p className="text-sm font-medium text-ink">
                            {skill.name}
                          </p>
                          <p className="text-xs text-ink-soft">{skill.detail}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
