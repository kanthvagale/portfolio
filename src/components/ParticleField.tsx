import { useEffect, useRef } from "react";

// A drifting constellation: dots wander slowly, nearby dots are joined by
// faint lines, and the pointer gently pushes dots away. Each dot has a depth:
// far dots are smaller and fainter, lag behind when the page scrolls and
// barely follow the pointer, which gives the field a little parallax.
// Fills its parent.
const AREA_PER_PARTICLE = 9000;
const MAX_PARTICLES = 90;
const NARROW_WIDTH = 640;
const LINK_DISTANCE = 120;
const LINK_DISTANCE_NARROW = 90;
const MAX_LINK_ALPHA = 0.15;
const DOT_ALPHA = 0.45;
const ACCENT_DOT_ALPHA = 0.8;
const ACCENT_RATIO = 1 / 8;
const DRIFT_SPEED = 0.25;
const REPEL_RADIUS = 110;
const REPEL_FORCE = 0.6;
const EASE_BACK = 0.04;
const EDGE_MARGIN = 10;
const DEPTH_MIN = 0.35;
// Share of the scroll distance the farthest dots lag behind the content.
const SCROLL_PARALLAX = 0.6;
// How far (px) the nearest dots shift against the pointer, and how quickly
// that shift catches up.
const POINTER_PARALLAX = 18;
const POINTER_SMOOTHING = 0.06;
// Resizes smaller than this (like a phone's address bar hiding) keep the
// existing particles instead of reseeding.
const RESEED_THRESHOLD = 80;

const FADE_MASK = "linear-gradient(to bottom, black 70%, transparent)";

interface Particle {
  // Position in the field, before parallax.
  x: number;
  y: number;
  // Where the dot is drawn this frame, after parallax.
  drawX: number;
  drawY: number;
  depth: number;
  vx: number;
  vy: number;
  driftX: number;
  driftY: number;
  radius: number;
  accent: boolean;
}

function readColors() {
  const styles = getComputedStyle(document.documentElement);
  return {
    ink: styles.getPropertyValue("--color-ink").trim() || "#121212",
    accent: styles.getPropertyValue("--color-accent").trim() || "#4f46e5",
  };
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let colors = readColors();
    let frame = 0;
    let visible = true;
    const pointer = { x: -Infinity, y: -Infinity };
    const tilt = { x: 0, y: 0 };

    const seed = () => {
      const count = Math.min(MAX_PARTICLES, Math.round((width * height) / AREA_PER_PARTICLE));
      particles = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = DRIFT_SPEED * (0.4 + Math.random() * 0.6);
        const depth = DEPTH_MIN + Math.random() * (1 - DEPTH_MIN);
        const driftX = Math.cos(angle) * speed * depth;
        const driftY = Math.sin(angle) * speed * depth;
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x,
          y,
          drawX: x,
          drawY: y,
          depth,
          vx: driftX,
          vy: driftY,
          driftX,
          driftY,
          radius: 0.6 + depth * 1.6,
          accent: Math.random() < ACCENT_RATIO,
        };
      });
    };

    // Wrap a drawn position into the field so parallax never leaves gaps.
    const wrap = (value: number, size: number) => {
      const span = size + EDGE_MARGIN * 2;
      return ((((value + EDGE_MARGIN) % span) + span) % span) - EDGE_MARGIN;
    };

    const project = () => {
      const scrolled = reducedMotion ? 0 : window.scrollY;
      particles.forEach((p) => {
        const lag = scrolled * SCROLL_PARALLAX * (1 - p.depth);
        p.drawX = wrap(p.x + tilt.x * p.depth, width);
        p.drawY = wrap(p.y + lag + tilt.y * p.depth, height);
      });
    };

    const draw = () => {
      project();
      ctx.clearRect(0, 0, width, height);
      const linkDistance = width < NARROW_WIDTH ? LINK_DISTANCE_NARROW : LINK_DISTANCE;

      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.ink;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const distance = Math.hypot(a.drawX - b.drawX, a.drawY - b.drawY);
          if (distance >= linkDistance) continue;
          const depth = Math.min(a.depth, b.depth);
          ctx.globalAlpha = MAX_LINK_ALPHA * (1 - distance / linkDistance) * (0.4 + 0.6 * depth);
          ctx.beginPath();
          ctx.moveTo(a.drawX, a.drawY);
          ctx.lineTo(b.drawX, b.drawY);
          ctx.stroke();
        }
      }

      particles.forEach((p) => {
        ctx.globalAlpha = (p.accent ? ACCENT_DOT_ALPHA : DOT_ALPHA) * (0.4 + 0.6 * p.depth);
        ctx.fillStyle = p.accent ? colors.accent : colors.ink;
        ctx.beginPath();
        ctx.arc(p.drawX, p.drawY, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const step = () => {
      // Ease the pointer tilt towards the pointer's offset from the centre.
      // Clamped, since the pointer can be well outside the hero once scrolled.
      const hasPointer = Number.isFinite(pointer.x);
      const offset = (position: number, size: number) =>
        Math.max(-1, Math.min(1, (position / size - 0.5) * 2));
      const targetX = hasPointer ? -offset(pointer.x, width) * POINTER_PARALLAX : 0;
      const targetY = hasPointer ? -offset(pointer.y, height) * POINTER_PARALLAX : 0;
      tilt.x += (targetX - tilt.x) * POINTER_SMOOTHING;
      tilt.y += (targetY - tilt.y) * POINTER_SMOOTHING;

      particles.forEach((p) => {
        // Push away from the pointer based on where the dot is drawn.
        const dx = p.drawX - pointer.x;
        const dy = p.drawY - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < REPEL_RADIUS && distance > 0) {
          const force = (1 - distance / REPEL_RADIUS) * REPEL_FORCE;
          p.vx += (dx / distance) * force;
          p.vy += (dy / distance) * force;
        }

        // Ease back towards the particle's own slow drift.
        p.vx += (p.driftX - p.vx) * EASE_BACK;
        p.vy += (p.driftY - p.vy) * EASE_BACK;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around the edges so the field never empties.
        if (p.x < -EDGE_MARGIN) p.x = width + EDGE_MARGIN;
        else if (p.x > width + EDGE_MARGIN) p.x = -EDGE_MARGIN;
        if (p.y < -EDGE_MARGIN) p.y = height + EDGE_MARGIN;
        else if (p.y > height + EDGE_MARGIN) p.y = -EDGE_MARGIN;
      });
    };

    const loop = () => {
      frame = 0;
      step();
      draw();
      schedule();
    };

    const schedule = () => {
      if (!frame && visible && !reducedMotion) frame = requestAnimationFrame(loop);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const reseed =
        particles.length === 0 ||
        Math.abs(rect.width - width) > RESEED_THRESHOLD ||
        Math.abs(rect.height - height) > RESEED_THRESHOLD;

      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reseed) seed();
      draw();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const clearPointer = () => {
      pointer.x = -Infinity;
      pointer.y = -Infinity;
    };

    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) clearPointer();
    };

    const onPointerUp = (event: PointerEvent) => {
      // A finger lifting shouldn't leave an invisible "cursor" behind.
      if (event.pointerType !== "mouse") clearPointer();
    };

    resize();
    schedule();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Only animate while the hero is on screen.
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        schedule();
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    visibilityObserver.observe(canvas);

    // Pick up the new ink and accent colours when the theme changes.
    const themeObserver = new MutationObserver(() => {
      colors = readColors();
      draw();
    });
    themeObserver.observe(document.documentElement, { attributeFilter: ["data-theme"] });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", clearPointer);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", clearPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
    />
  );
}
