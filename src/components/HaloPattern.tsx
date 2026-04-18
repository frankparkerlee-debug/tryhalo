"use client";

import React from "react";

type Variant = "default" | "compact" | "minimal";

interface HaloPatternProps {
  /** Visual density of the pattern.
   *  - "default": full 5-orbit composition for large backgrounds (hero, manifesto)
   *  - "compact": 3-orbit composition for mid-size panels (cards, callouts)
   *  - "minimal": single orbit + core for small accents (badges, labels)
   */
  variant?: Variant;
  /** Extra classes for positioning/sizing. Typically pairs with `absolute inset-0 w-full h-full`. */
  className?: string;
  /** Base color of the pattern. Defaults to Halo gold. */
  color?: string;
  /** Multiplier for the pattern's visibility (1 = default opacity, 0.5 = half, 1.5 = stronger). */
  intensity?: number;
  /** Disables the breathing pulse on the central core. */
  staticCore?: boolean;
  /** Hide the central core (dot + aura + highlight) entirely.
   *  Useful when content is placed at the center of the pattern. */
  showCore?: boolean;
}

/**
 * The Halo signature pattern — orbital halos with a central core.
 * Reusable brand mark. Uses unique IDs per instance so multiple can coexist on a page.
 */
export default function HaloPattern({
  variant = "default",
  className = "",
  color = "#C8A96E",
  intensity = 1,
  staticCore = false,
  showCore = true,
}: HaloPatternProps) {
  const uid = React.useId().replace(/:/g, "");
  const glowId = `halo-glow-${uid}`;
  const blurId = `halo-blur-${uid}`;

  // Opacity helper — scaled by intensity
  const op = (base: number) => Math.min(1, base * intensity);

  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={color} stopOpacity={op(0.14)} />
          <stop offset="50%" stopColor={color} stopOpacity={op(0.04)} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Soft radial warmth backdrop */}
      <rect width="1200" height="600" fill={`url(#${glowId})`} />

      {/* Orbital halos — varies by variant */}
      <g stroke={color} fill="none" strokeWidth="1" strokeLinecap="round">
        {variant === "default" && (
          <>
            <ellipse cx="600" cy="300" rx="220" ry="72" transform="rotate(14 600 300)" opacity={op(0.28)} />
            <ellipse cx="600" cy="300" rx="320" ry="104" transform="rotate(-9 600 300)" opacity={op(0.22)} />
            <ellipse cx="600" cy="300" rx="440" ry="138" transform="rotate(22 600 300)" opacity={op(0.16)} />
            <ellipse cx="600" cy="300" rx="580" ry="172" transform="rotate(-15 600 300)" opacity={op(0.11)} />
            <ellipse cx="600" cy="300" rx="760" ry="210" transform="rotate(5 600 300)" opacity={op(0.07)} />
          </>
        )}
        {variant === "compact" && (
          <>
            <ellipse cx="600" cy="300" rx="220" ry="72" transform="rotate(14 600 300)" opacity={op(0.3)} />
            <ellipse cx="600" cy="300" rx="360" ry="118" transform="rotate(-10 600 300)" opacity={op(0.18)} />
            <ellipse cx="600" cy="300" rx="520" ry="160" transform="rotate(20 600 300)" opacity={op(0.1)} />
          </>
        )}
        {variant === "minimal" && (
          <ellipse cx="600" cy="300" rx="200" ry="65" transform="rotate(12 600 300)" opacity={op(0.26)} />
        )}
      </g>

      {/* Orbital marker dots — default and compact only */}
      {variant !== "minimal" && (
        <g fill={color}>
          <circle cx="808" cy="276" r="3" opacity={op(0.55)} />
          <circle cx="292" cy="328" r="2.5" opacity={op(0.4)} />
          {variant === "default" && (
            <>
              <circle cx="730" cy="190" r="2" opacity={op(0.45)} />
              <circle cx="498" cy="388" r="2.5" opacity={op(0.35)} />
              <circle cx="1050" cy="340" r="2" opacity={op(0.25)} />
              <circle cx="220" cy="210" r="1.5" opacity={op(0.3)} />
              <circle cx="612" cy="248" r="1.5" opacity={op(0.5)} />
              <circle cx="420" cy="372" r="1.5" opacity={op(0.3)} />
            </>
          )}
        </g>
      )}

      {/* Core + aura + highlight — only when showCore is true.
          Hide these when placing content at the center (e.g., a counter). */}
      {showCore && (
        <>
          {/* Soft aura behind core — adds luminous depth */}
          <circle
            cx="600"
            cy="300"
            r="18"
            fill={color}
            opacity={op(0.12)}
            filter={`url(#${blurId})`}
          />

          {/* Central core — breathing pulse by default */}
          <circle
            cx="600"
            cy="300"
            r="5"
            fill={color}
            className={staticCore ? "" : "halo-core-pulse"}
          />

          {/* Inner highlight on the core for dimension */}
          <circle cx="599" cy="298" r="1.5" fill="#F5F1EA" opacity={op(0.7)} />
        </>
      )}
    </svg>
  );
}
