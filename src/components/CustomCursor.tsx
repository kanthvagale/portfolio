import { useEffect, useRef, useState } from "react";

// Replaces the mouse cursor with a circle: a ring while the pointer moves
// (active) that shrinks back to a dot shortly after it stops (inactive).
// Only on devices with a precise, hovering pointer; touchscreens are untouched.
const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const SIZE = 36;
// How long the pointer must rest before the circle goes inactive.
const IDLE_DELAY = 140;
// Text fields keep the native cursor so the text caret stays easy to find.
const NATIVE_CURSOR_TARGETS = 'input, textarea, select, [contenteditable="true"]';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(() => window.matchMedia(FINE_POINTER).matches);
  const positionRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia(FINE_POINTER);
    const onChange = () => setEnabled(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const position = positionRef.current;
    const circle = circleRef.current;
    if (!enabled || !position || !circle) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor");
    let idleTimer = 0;

    const setActive = (active: boolean) => {
      circle.dataset.state = active ? "active" : "inactive";
    };

    const setVisible = (visible: boolean) => {
      position.style.opacity = visible ? "1" : "0";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        setVisible(false);
        return;
      }

      position.style.transform = `translate3d(${event.clientX - SIZE / 2}px, ${
        event.clientY - SIZE / 2
      }px, 0)`;
      const overTextField =
        event.target instanceof Element && event.target.closest(NATIVE_CURSOR_TARGETS);
      setVisible(!overTextField);

      setActive(true);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setActive(false), IDLE_DELAY);
    };

    const onPointerOut = (event: PointerEvent) => {
      // Leaving the window entirely.
      if (!event.relatedTarget) setVisible(false);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut);

    return () => {
      window.clearTimeout(idleTimer);
      root.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={positionRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] opacity-0 mix-blend-difference transition-opacity duration-150"
      style={{ width: SIZE, height: SIZE }}
    >
      {/* Growing into the ring eases out; settling back to the dot eases in. */}
      <div
        ref={circleRef}
        data-state="inactive"
        className="h-full w-full rounded-full border-2 border-white transition-[scale,background-color] motion-reduce:transition-none data-[state=active]:scale-100 data-[state=active]:bg-transparent data-[state=active]:duration-200 data-[state=active]:ease-out data-[state=inactive]:scale-[0.28] data-[state=inactive]:bg-white data-[state=inactive]:duration-500 data-[state=inactive]:ease-in"
      />
    </div>
  );
}
