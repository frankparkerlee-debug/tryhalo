"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpNumberProps {
  target: number;
  start?: number;
  duration?: number;
  className?: string;
}

export default function CountUpNumber({
  target,
  start = 0,
  duration = 2000,
  className,
}: CountUpNumberProps) {
  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setCount(target);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            observer.unobserve(el);

            const startTime = performance.now();
            const range = target - start;

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic for natural deceleration
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(start + range * eased);
              setCount(current);

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [target, start, duration, hasAnimated]);

  return (
    <span
      ref={ref}
      className={
        className ||
        "text-5xl md:text-6xl font-bold text-halo-gold tracking-tight"
      }
    >
      {count}
    </span>
  );
}
