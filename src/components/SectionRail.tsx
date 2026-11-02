import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { NavLink } from "../types/content";
import { useActiveSection } from "../hooks/useActiveSection";

interface SectionRailProps {
  links: NavLink[];
}

// The track runs up the rail on the left edge, turns a rounded corner into
// the title area, then runs left-to-right along it. Arc length 0 is where the
// corner starts; negative values are further down the rail.
const TITLE_HEIGHT = 64;
const RAIL_INSET = 20;
const CORNER_RADIUS = 56;
const CORNER_LENGTH = (Math.PI * CORNER_RADIUS) / 2;

const RAIL_SCALE = 0.45;
const TITLE_GAP = 6;
const TITLE_LEFT = RAIL_INSET + CORNER_RADIUS + TITLE_GAP;
// The title sits on a paper-coloured wash that fades out past the end of the
// title and below it, so it has no visible edge.
const PANEL_FADE_X = 120;
const PANEL_FADE_Y = 48;
const PANEL_BACKGROUND = `linear-gradient(to bottom, color-mix(in srgb, var(--color-paper) 88%, transparent) ${
  TITLE_HEIGHT - 8
}px, transparent)`;
const PANEL_MASK = `linear-gradient(to right, black calc(100% - ${PANEL_FADE_X}px), transparent)`;
const STACK_GAP = 16;
const BOTTOM_PAD = 24;

// A section's label lands as its top reaches the landing line just under the
// title panel (where nav links scroll it to), and leaves as its bottom moves
// from EXIT_FROM of the viewport up to that line.
const LAND_OFFSET = 16;
const EXIT_FROM = 0.6;
const EXIT_GAP = 24;

// The ruler on the right edge doubles as a draggable scrollbar. Ticks over
// the active section's stretch of the ruler are darker, and ticks swell a
// little around the thumb.
const TICK_SPACING = 20;
const TICK_FALLOFF = 28;
const TICK_BUMP = 0.5;
const TICK_BUMP_SPREAD = 24;

interface Geometry {
  width: number;
  height: number;
  headerHeight: number;
  maxScroll: number;
  sections: { top: number; bottom: number }[];
}

interface SectionState {
  enter: number;
  exit: number;
  weight: number;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (t: number) => t * t * (3 - 2 * t);

function pointAt(s: number, railX: number, topY: number) {
  const railTop = topY + CORNER_RADIUS;
  if (s <= 0) return { x: railX, y: railTop - s, angle: -90 };
  if (s <= CORNER_LENGTH) {
    const theta = s / CORNER_RADIUS;
    return {
      x: railX + CORNER_RADIUS - CORNER_RADIUS * Math.cos(theta),
      y: railTop - CORNER_RADIUS * Math.sin(theta),
      angle: (theta * 180) / Math.PI - 90,
    };
  }
  return { x: railX + CORNER_RADIUS + (s - CORNER_LENGTH), y: topY, angle: 0 };
}

// Top and travel of the ruler, shared by drawing and dragging.
function rulerSpan(g: Geometry) {
  const top = g.headerHeight + TITLE_HEIGHT + 8;
  return { top, travel: Math.max(1, g.height - top - BOTTOM_PAD) };
}

// How far each section's label is through landing and leaving, and how much
// it currently owns the title (0 = not shown, 1 = the active title).
function sectionStates(g: Geometry, scrollY: number): SectionState[] {
  const landY = g.headerHeight + TITLE_HEIGHT + LAND_OFFSET;
  const exitFrom = Math.max(g.height * EXIT_FROM, landY + 1);
  const last = g.sections.length - 1;

  return g.sections.map((section, i) => {
    const top = section.top - scrollY;
    const bottom = section.bottom - scrollY;
    const enter = clamp01((g.height - top) / (g.height - landY));
    const exit = i === last ? 0 : clamp01((exitFrom - bottom) / (exitFrom - landY));
    return { enter, exit, weight: smoothstep(enter) * (1 - exit) };
  });
}

export default function SectionRail({ links }: SectionRailProps) {
  const ids = links.map((link) => link.href.replace("#", ""));
  const activeId = useActiveSection(ids);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [headerHeight, setHeaderHeight] = useState(0);
  const [tickCount, setTickCount] = useState(0);
  const [dragging, setDragging] = useState(false);

  const letterRefs = useRef<(HTMLSpanElement | null)[][]>([]);
  const tickRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const geometry = useRef<Geometry | null>(null);
  const widths = useRef<number[][]>([]);
  const letterHeight = useRef(0);
  const draggingRef = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let frame = 0;
    let lastScrollY = window.scrollY;
    // Set after measuring so letters redraw even if the scroll position hasn't moved.
    let dirty = true;

    const updateLetters = (g: Geometry, states: SectionState[]) => {
      const railX = RAIL_INSET;
      const topY = g.headerHeight + TITLE_HEIGHT / 2;
      const railTop = topY + CORNER_RADIUS;
      const lengths = widths.current.map((row) => row.reduce((sum, w) => sum + w, 0));
      let panelWeight = 0;
      let panelWidth = 0;

      lengths.forEach((length, i) => {
        const state = states[i];
        if (!state) return;
        const { enter, exit, weight } = state;

        // Waiting labels stack up from the bottom of the rail, in page order.
        const stackBelow = lengths
          .slice(i + 1)
          .reduce((sum, next) => sum + next * RAIL_SCALE + STACK_GAP, 0);
        const waitStart = railTop - (g.height - BOTTOM_PAD) + stackBelow;
        const titleStart = CORNER_LENGTH + TITLE_GAP;

        const eased = smoothstep(enter);
        const scale = RAIL_SCALE + (1 - RAIL_SCALE) * eased;
        // Slide far enough right to clear the next title as it lands.
        const exitShift = (lengths[i + 1] ?? 0) + EXIT_GAP;
        const start = waitStart + (titleStart - waitStart) * eased + exit * exitShift;
        const opacity = (0.4 + 0.6 * eased) * (1 - exit) ** 2;

        // The corner panel eases between the widths of the titles it holds.
        panelWeight += weight;
        panelWidth += weight * (TITLE_LEFT + length + PANEL_FADE_X);

        let offset = 0;
        widths.current[i].forEach((width, j) => {
          const el = letterRefs.current[i]?.[j];
          if (!el) return;
          const point = pointAt(start + (offset + width / 2) * scale, railX, topY);
          offset += width;
          el.style.transform = `translate3d(${point.x - width / 2}px, ${
            point.y - letterHeight.current / 2
          }px, 0) rotate(${point.angle}deg) scale(${scale})`;
          el.style.opacity = String(opacity);
        });
      });

      if (panelRef.current && panelWeight > 0) {
        panelRef.current.style.width = `${panelWidth / panelWeight}px`;
      }
    };

    const updateRuler = (g: Geometry, scrollY: number, states: SectionState[]) => {
      const { top, travel } = rulerSpan(g);
      const toRuler = (scroll: number) =>
        top + (g.maxScroll > 0 ? clamp01(scroll / g.maxScroll) : 0) * travel;
      const thumbY = toRuler(scrollY);

      if (thumbRef.current) {
        thumbRef.current.style.transform = `translateY(${thumbY}px)`;
      }

      // Each section owns the stretch of ruler scrolled through while it is
      // the active title; blend those stretches by how active each one is.
      const landY = g.headerHeight + TITLE_HEIGHT + LAND_OFFSET;
      const spans = g.sections.map((section) => [
        toRuler(section.top - landY),
        toRuler(section.bottom - landY),
      ]);
      const totalWeight = states.reduce((sum, state) => sum + state.weight, 0);

      tickRefs.current.forEach((tick, k) => {
        if (!tick) return;
        const y = top + k * TICK_SPACING;
        let envelope = 0;
        states.forEach((state, i) => {
          const [start, end] = spans[i];
          const distance = Math.max(start - y, y - end, 0);
          envelope += state.weight * clamp01(1 - distance / TICK_FALLOFF);
        });
        envelope /= Math.max(1, totalWeight);

        const bump = TICK_BUMP * Math.exp(-(((y - thumbY) / TICK_BUMP_SPREAD) ** 2));
        tick.style.transform = `translateY(${y}px) scaleX(${1 + bump})`;
        tick.style.opacity = String(0.3 + 0.5 * envelope);
      });
    };

    const update = () => {
      frame = 0;
      const g = geometry.current;
      if (!g) return;
      const scrollY = window.scrollY;
      const states = sectionStates(g, scrollY);

      // The panel fades out where no section owns the title, such as the hero.
      if (panelRef.current) {
        const shown = states.reduce((sum, state) => sum + state.weight, 0);
        panelRef.current.style.opacity = String(clamp01(shown));
      }

      if (!reducedMotion && (scrollY !== lastScrollY || dirty)) updateLetters(g, states);
      dirty = false;
      lastScrollY = scrollY;
      updateRuler(g, scrollY, states);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const measure = () => {
      const header = document.querySelector("header");
      const nextHeaderHeight = header?.getBoundingClientRect().height ?? 0;
      setHeaderHeight(nextHeaderHeight);

      const g: Geometry = {
        width: document.documentElement.clientWidth,
        height: window.innerHeight,
        headerHeight: nextHeaderHeight,
        maxScroll: Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
        sections: ids.map((id) => {
          const rect = document.getElementById(id)?.getBoundingClientRect();
          return rect
            ? { top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY }
            : { top: Infinity, bottom: Infinity };
        }),
      };
      geometry.current = g;
      setTickCount(Math.floor(rulerSpan(g).travel / TICK_SPACING) + 1);

      widths.current = letterRefs.current.map((row) => row.map((el) => el?.offsetWidth ?? 0));
      letterHeight.current = letterRefs.current[0]?.[0]?.offsetHeight ?? 0;
      dirty = true;
      schedule();
    };

    measure();
    document.fonts.ready.then(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", schedule, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", schedule);
    };
    // ids is derived from links, which is static content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // Re-run the ruler once new ticks have mounted.
  useEffect(() => {
    window.dispatchEvent(new Event("scroll"));
  }, [tickCount]);

  const scrollToPointer = (clientY: number) => {
    const g = geometry.current;
    if (!g) return;
    const { top, travel } = rulerSpan(g);
    window.scrollTo({ top: clamp01((clientY - top) / travel) * g.maxScroll, behavior: "instant" });
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    setDragging(true);
    scrollToPointer(event.clientY);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) scrollToPointer(event.clientY);
  };

  const endDrag = () => {
    draggingRef.current = false;
    setDragging(false);
  };

  const rulerTop = headerHeight + TITLE_HEIGHT + 8;
  const active = links.find((link) => link.href === `#${activeId}`);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <div
        ref={panelRef}
        className="absolute left-0"
        style={{
          top: headerHeight,
          height: TITLE_HEIGHT + PANEL_FADE_Y,
          width: reducedMotion ? "auto" : TITLE_LEFT + PANEL_FADE_X,
          paddingLeft: reducedMotion ? TITLE_LEFT : undefined,
          paddingRight: reducedMotion ? PANEL_FADE_X : undefined,
          backgroundImage: PANEL_BACKGROUND,
          maskImage: PANEL_MASK,
          WebkitMaskImage: PANEL_MASK,
        }}
      >
        {reducedMotion && (
          <span
            className="flex items-center font-display text-[32px] font-bold uppercase leading-none text-ink sm:text-[40px]"
            style={{ height: TITLE_HEIGHT }}
          >
            {active?.label}
          </span>
        )}
      </div>

      <div
        className={`pointer-events-auto absolute bottom-0 right-0 w-7 touch-none select-none ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ top: rulerTop }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="absolute inset-y-0 right-1.5 w-px bg-ink/10" />
      </div>
      {Array.from({ length: tickCount }, (_, k) => (
        <div
          key={k}
          ref={(el) => {
            tickRefs.current[k] = el;
          }}
          className="absolute right-1.5 top-0 h-px w-2 origin-right bg-ink opacity-30"
        />
      ))}
      <div
        ref={thumbRef}
        className={`absolute right-0 top-0 -mt-0.5 h-1 rounded-full bg-accent transition-[width] duration-150 ${
          dragging ? "w-6" : "w-4"
        }`}
      />

      {!reducedMotion &&
        links.map((link, i) =>
          link.label.split("").map((char, j) => (
            <span
              key={`${link.href}-${j}`}
              ref={(el) => {
                letterRefs.current[i] ??= [];
                letterRefs.current[i][j] = el;
              }}
              className="absolute left-0 top-0 whitespace-pre font-display text-[32px] font-bold uppercase leading-none text-ink opacity-0 will-change-transform sm:text-[40px]"
            >
              {char}
            </span>
          )),
        )}
    </div>
  );
}
