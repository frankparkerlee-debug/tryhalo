"use client";

import { useEffect, useRef, useState } from "react";

interface HeroVideoProps {
  /** Path to the video file (e.g., "/hero-video.mp4") */
  src?: string;
  /** Fallback poster image while video loads */
  poster?: string;
  /** Optional CSS class for the container */
  className?: string;
}

/**
 * Full-viewport background video for the hero section.
 * - Autoplays, loops, muted (required for autoplay)
 * - Loads lazily — only starts when in viewport
 * - Falls back to a gradient if no src provided
 * - Respects reduced motion preference
 */
export default function HeroVideo({ src, poster, className = "" }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || prefersReducedMotion) return;

    // IntersectionObserver to lazy-load video
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.src = src;
          video.load();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src, prefersReducedMotion]);

  // No video src — render gradient placeholder
  if (!src || prefersReducedMotion) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 60% 30%, rgba(200,169,110,0.08) 0%, transparent 50%), linear-gradient(180deg, #0c0c0c 0%, #111 100%)",
          }}
        />
        {poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        )}
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        onCanPlay={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? "opacity-50" : "opacity-0"
        }`}
      />
      {/* Gradient overlay for text readability — always present */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/60 to-[#0c0c0c]/30" />
      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(12,12,12,0.6) 100%)",
        }}
      />
    </div>
  );
}
