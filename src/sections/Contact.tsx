import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";
import { formspreeEndpoint, profile } from "../data/content";
import Card from "../components/Card";
import Button from "../components/Button";
import { GithubIcon, LinkedinIcon } from "../components/icons";

type SubmitState = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<SubmitState>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");

    try {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="scroll-mt-36 bg-paper-dim pl-10 pr-8 pt-8 pb-20 sm:pl-10 sm:pr-10 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="max-w-2xl text-base text-ink-soft">
          Let's discuss your next project, idea, or opportunity.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <p className="text-base leading-relaxed text-ink-soft">
              I&apos;m currently {profile.availability.toLowerCase()} in React
              Native mobile development and full-stack web projects. Whether
              you have a question, a proposal, or just want to say hello, feel
              free to reach out.
            </p>

            <Card className="flex items-center gap-4 bg-paper p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink/5 text-ink">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                  Email
                </p>
                <a href={`mailto:${profile.email}`} className="text-base font-semibold text-ink hover:text-accent">
                  {profile.email}
                </a>
              </div>
            </Card>

            <Card className="flex items-center gap-4 bg-paper p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink/5 text-ink">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                  Location
                </p>
                <p className="text-base font-semibold text-ink">{profile.location}</p>
              </div>
            </Card>

            <div>
              <p className="mb-3 text-sm font-semibold text-ink">Connect on Social</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-4 py-2 text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:border-ink/30"
                >
                  <LinkedinIcon className="h-4 w-4" />
                  LinkedIn
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-4 py-2 text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:border-ink/30"
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-paper p-6">
              <div className="mb-5 flex items-center gap-2">
                <Send className="h-4 w-4 text-accent" aria-hidden />
                <h3 className="font-display text-lg font-semibold text-ink">
                  Send a Message
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-sm font-medium text-ink">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="John Doe"
                      className="rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-ink">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-sm font-medium text-ink">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="Project Inquiry"
                    className="rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-medium text-ink">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell me about your project..."
                    className="resize-none rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none"
                  />
                </div>

                <Button type="submit" variant="primary" disabled={status === "sending"} className="w-full">
                  {status === "sending" ? "Sending..." : "Send Message"}
                </Button>

                {status === "success" && (
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Thanks for reaching out — I&apos;ll get back to you soon.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    Something went wrong. Please try emailing me directly.
                  </p>
                )}
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
