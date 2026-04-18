"use client";

import React from "react";

interface MarqueePair {
  symptom: string;
  outcome: string;
}

interface HaloMarqueeProps {
  /** Array of symptom→outcome pairs. Defaults to the canonical Halo set. */
  items?: MarqueePair[];
  /** Background color of the strip. Defaults to warm cream. */
  background?: string;
  /** Scroll speed in seconds for one full loop. Lower = faster. Default: 45s. */
  duration?: number;
  /** Extra classes for the wrapper. */
  className?: string;
}

const DEFAULT_ITEMS: MarqueePair[] = [
  { symptom: "Low Energy", outcome: "Vitality" },
  { symptom: "Brain Fog", outcome: "Clarity" },
  { symptom: "Poor Sleep", outcome: "Deep Rest" },
  { symptom: "Hot Flashes", outcome: "Balance" },
  { symptom: "Muscle Loss", outcome: "Strength" },
  { symptom: "Low Libido", outcome: "Drive" },
  { symptom: "Weight Gain", outcome: "Composition" },
  { symptom: "Mood Shifts", outcome: "Calm" },
  { symptom: "Slow Recovery", outcome: "Resilience" },
];

/**
 * Halo signature marquee — horizontally scrolling strip of symptom → outcome pairs.
 * The symptom keyword captures search intent; the outcome lands the brand promise.
 * Reusable across sections — pass custom items or defaults.
 */
export default function HaloMarquee({
  items = DEFAULT_ITEMS,
  background = "#F3EADA",
  duration = 45,
  className = "",
}: HaloMarqueeProps) {
  // Duplicate for a seamless infinite loop
  const doubled = [...items, ...items];

  return (
    <div
      className={`relative w-full border-y border-halo-charcoal/10 overflow-hidden ${className}`}
      style={{ background }}
      aria-hidden="true"
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `halo-marquee-scroll ${duration}s linear infinite`,
          width: "max-content",
        }}
      >
        {doubled.map((pair, i) => (
          <span
            key={i}
            className="inline-flex items-baseline gap-3 py-3.5 md:py-4 px-6 font-serif text-[17px] md:text-[19px] leading-none"
          >
            <span className="italic text-halo-charcoal/55 font-light">{pair.symptom}</span>
            <span className="text-halo-charcoal/30 font-light" aria-hidden="true">—</span>
            <span className="italic text-halo-charcoal font-normal">{pair.outcome}</span>
            <span className="text-[#C8A96E]/40 pl-3" aria-hidden="true">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
