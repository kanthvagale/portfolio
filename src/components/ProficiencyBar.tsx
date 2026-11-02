import { motion } from "framer-motion";

export default function ProficiencyBar({ level }: { level: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
      <motion.div
        className="h-full rounded-full bg-accent"
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}
