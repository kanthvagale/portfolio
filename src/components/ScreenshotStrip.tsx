import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Screenshot } from "../types/content";
import { assetUrl } from "../utils/assetUrl";

interface ScreenshotStripProps {
  name: string;
  screenshots: Screenshot[];
}

// Edge fades show only on the sides that have more to scroll to.
const FADE = 28;
// Scroll snapping can stop a few pixels short of either end.
const EDGE_TOLERANCE = 8;

// A horizontally scrolling row of app screenshots. Swipe or trackpad-scroll
// it, use the arrow keys once it has focus, or the arrow buttons on devices
// with a mouse.
export default function ScreenshotStrip({ name, screenshots }: ScreenshotStripProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setAtStart(scroller.scrollLeft <= EDGE_TOLERANCE);
    setAtEnd(
      scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - EDGE_TOLERANCE,
    );
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [updateEdges]);

  const scrollByPage = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * scroller.clientWidth * 0.8, behavior: "smooth" });
  };

  const mask = `linear-gradient(to right, ${atStart ? "black" : "transparent"}, black ${FADE}px, black calc(100% - ${FADE}px), ${
    atEnd ? "black" : "transparent"
  })`;

  const arrowClass =
    "absolute top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-ink/10 bg-paper/90 p-1.5 text-ink shadow-sm transition-opacity hover:border-ink/30 disabled:pointer-events-none disabled:opacity-0 pointer-fine:block";

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onScroll={updateEdges}
        role="region"
        aria-label={`${name} screenshots`}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth rounded-lg [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-scrollbar]:hidden"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        {screenshots.map((shot) => (
          <img
            key={shot.src}
            src={assetUrl(shot.src)}
            alt={shot.alt}
            loading="lazy"
            draggable={false}
            className="aspect-[9/16] w-32 shrink-0 snap-start rounded-lg border border-ink/10 bg-paper-dim object-cover sm:w-36"
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        disabled={atStart}
        aria-label="Previous screenshots"
        className={`${arrowClass} left-1`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => scrollByPage(1)}
        disabled={atEnd}
        aria-label="More screenshots"
        className={`${arrowClass} right-1`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
