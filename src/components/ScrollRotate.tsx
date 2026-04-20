"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * ScrollRotate — rotates a child element on the Y-axis as the user scrolls.
 *
 * Rotation is linked to the scroll position of the containing viewport. The
 * element starts at 0° at the top of the page and reaches `maxDeg` by
 * `scrollExtent` pixels of scroll (default 800px = ~one screen).
 *
 * Respects prefers-reduced-motion: falls back to a static element.
 */
export default function ScrollRotate({
  children,
  maxDeg = 25,
  scrollExtent = 800,
  axis = "y",
  className = "",
}: {
  children: ReactNode;
  /** Maximum rotation in degrees reached by scrollExtent */
  maxDeg?: number;
  /** Scroll distance (px) at which maxDeg is reached */
  scrollExtent?: number;
  /** Rotation axis — y = horizontal flip, x = vertical flip, z = spin */
  axis?: "x" | "y" | "z";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    if (reduced || typeof window === "undefined") return;
    let raf = 0;
    const update = () => {
      const y = window.scrollY;
      const clamped = Math.max(0, Math.min(scrollExtent, y));
      const pct = clamped / scrollExtent;
      setRotation(pct * maxDeg);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced, maxDeg, scrollExtent]);

  const transformAxis =
    axis === "x" ? "rotateX" : axis === "z" ? "rotateZ" : "rotateY";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `${transformAxis}(${rotation}deg)`,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
