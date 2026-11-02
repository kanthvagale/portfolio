import { motion } from "framer-motion";
import { education, experience, profile } from "../data/content";
import Card from "../components/Card";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <section id="about" className="scroll-mt-36 pl-10 pr-8 pt-8 pb-20 sm:pl-10 sm:pr-10 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="max-w-2xl text-base text-ink-soft">
          A quick look at my background, experience, and how I got here.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-5 text-base leading-relaxed text-ink-soft"
          >
            <p>{profile.intro}</p>
            <p>
              My journey started with web development, which gave me a strong
              foundation in JavaScript and frontend technologies. Over the
              years I&apos;ve focused on cross-platform mobile apps with React
              Native, while staying comfortable building and shipping
              full-stack features end to end.
            </p>
            <div className="rounded-2xl border border-ink/10 bg-paper-dim p-5 text-sm text-ink-soft">
              <p className="font-display text-base font-semibold text-ink">
                {education.degree}
              </p>
              <p>
                {education.school} · {education.years}
              </p>
              <p className="mt-1">{education.coursework}</p>
            </div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            {experience.map((job) => (
              <motion.div key={job.company} variants={item}>
                <Card className="flex flex-col gap-2 p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-display text-base font-semibold text-ink">
                      {job.role}
                    </p>
                    <span className="text-xs font-medium text-ink-soft">
                      {job.dates}
                    </span>
                  </div>
                  <p className="text-sm text-ink-soft">
                    {job.company} · {job.location}
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-ink-soft">
                    {job.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
