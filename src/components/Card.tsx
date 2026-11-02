import type { ReactNode } from "react";
import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 30px -12px rgba(18,18,18,0.18)" }}
      transition={{ duration: 0.2 }}
      className={`overflow-hidden rounded-2xl border border-ink/10 bg-paper ${className}`}
    >
      {children}
    </motion.div>
  );
}
