import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Screenshot } from "../types/content";
import ScreenshotStrip from "./ScreenshotStrip";

interface ProjectMediaModalProps {
  title: string;
  video: string;
  poster?: string;
  screenshots?: Screenshot[];
  onClose: () => void;
}

// Room kept below the video for the title row, the screenshot strip and the
// overlay padding, so everything fits on screen without scrolling.
const RESERVED_HEIGHT = "26rem";

// A dimmed overlay with a project's promo video and, below it, a horizontal
// strip of its screenshots. The video starts muted; sound comes on only when
// the viewer unmutes it in the controls. Closes on Escape, on a click outside
// the content, or with the close button, and hands focus back to whatever
// opened it.
export default function ProjectMediaModal({
  title,
  video,
  poster,
  screenshots,
  onClose,
}: ProjectMediaModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // React doesn't reliably apply the `muted` attribute, so set the property
    // before playback starts.
    const element = videoRef.current;
    if (element) element.muted = true;
  }, []);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      root.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} promo video and screenshots`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
        className="flex w-full flex-col gap-4"
        style={{ maxWidth: `min(64rem, calc((100svh - ${RESERVED_HEIGHT}) * 16 / 9))` }}
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full border border-white/20 p-2 text-white transition-colors hover:border-white/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <video
          ref={videoRef}
          src={video}
          poster={poster}
          controls
          autoPlay
          muted
          playsInline
          className="aspect-video w-full rounded-xl bg-black shadow-2xl"
        />

        {screenshots && screenshots.length > 0 && (
          <ScreenshotStrip name={title} screenshots={screenshots} />
        )}
      </motion.div>
    </motion.div>
  );
}
