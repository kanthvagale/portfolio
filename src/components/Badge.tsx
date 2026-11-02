import type { ReactNode } from "react";

export default function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-ink/10 bg-paper-dim px-3 py-1 text-xs font-medium text-ink-soft">
      {children}
    </span>
  );
}
