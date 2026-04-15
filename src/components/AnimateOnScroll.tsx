"use client";

import { useEffect, useRef } from "react";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  staggerDelay?: number;
}

export default function AnimateOnScroll({
  children,
  className = "",
  stagger = false,
  staggerDelay = 100,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const makeVisible = () => {
      if (stagger) {
        const staggerChildren = el.querySelectorAll(".aos-child");
        staggerChildren.forEach((child, i) => {
          (child as HTMLElement).style.transitionDelay = `${i * staggerDelay}ms`;
          child.classList.add("aos-child-visible");
        });
      }
      el.classList.add("aos-visible");
    };

    if (prefersReducedMotion) {
      makeVisible();
      return;
    }

    // Check if element is already in viewport on load
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      makeVisible();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            makeVisible();
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(el);

    // Fallback: make visible after 2 seconds regardless
    const fallback = setTimeout(() => {
      makeVisible();
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [stagger, staggerDelay]);

  return (
    <div ref={ref} className={`aos ${className}`}>
      {children}
    </div>
  );
}
