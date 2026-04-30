/**
 * PillPattern — decorative scatter of the three transparent compounded
 * pills (purple / orange / green) used as a quiet visual texture behind
 * sections. Inspired by the Hims pill-decoration pattern, tuned to our
 * brand: low opacity, organic angles, varied scales.
 *
 * Usage:
 *   <section className="relative">
 *     <PillPattern density="medium" tone="warm" />
 *     <div className="relative z-10">...content...</div>
 *   </section>
 *
 * The container needs `position: relative`. The pattern absolute-positions
 * itself behind whatever content sits above it (z-10).
 *
 * Density presets:
 *   - light   = 5 pills, generous spacing
 *   - medium  = 9 pills (default)
 *   - dense   = 13 pills, busier sections
 *
 * Tone presets:
 *   - warm    = higher opacity on the page surface (default for light bg)
 *   - quiet   = lower opacity (default for dark bg)
 *   - bright  = full opacity for hero / feature sections
 */

interface PillItem {
  src: string;
  /** percentage from left edge */
  left: string;
  /** percentage from top edge */
  top: string;
  /** rotation in degrees */
  rotate: number;
  /** size in px (width; pills auto-scale height) */
  size: number;
  /** opacity 0–1 */
  opacity: number;
  /** flip horizontally to add asymmetric variety */
  flip?: boolean;
}

const SCATTERS: Record<"light" | "medium" | "dense", PillItem[]> = {
  light: [
    { src: "/pill-purple.png", left: "8%", top: "20%", rotate: -22, size: 80, opacity: 0.32 },
    { src: "/pill-orange.png", left: "82%", top: "12%", rotate: 14, size: 70, opacity: 0.28 },
    { src: "/pill-green.png",  left: "18%", top: "78%", rotate: 38, size: 90, opacity: 0.30, flip: true },
    { src: "/pill-orange.png", left: "76%", top: "72%", rotate: -18, size: 60, opacity: 0.26 },
    { src: "/pill-purple.png", left: "50%", top: "50%", rotate: 8,  size: 50, opacity: 0.22 },
  ],
  medium: [
    { src: "/pill-purple.png", left: "6%",  top: "12%", rotate: -28, size: 92,  opacity: 0.34 },
    { src: "/pill-orange.png", left: "88%", top: "8%",  rotate: 18,  size: 76,  opacity: 0.30 },
    { src: "/pill-green.png",  left: "14%", top: "62%", rotate: 42,  size: 102, opacity: 0.32, flip: true },
    { src: "/pill-orange.png", left: "70%", top: "78%", rotate: -22, size: 68,  opacity: 0.28 },
    { src: "/pill-purple.png", left: "44%", top: "30%", rotate: 12,  size: 56,  opacity: 0.24 },
    { src: "/pill-green.png",  left: "92%", top: "48%", rotate: -8,  size: 54,  opacity: 0.22 },
    { src: "/pill-purple.png", left: "62%", top: "16%", rotate: 24,  size: 44,  opacity: 0.20, flip: true },
    { src: "/pill-orange.png", left: "26%", top: "44%", rotate: -34, size: 38,  opacity: 0.18 },
    { src: "/pill-green.png",  left: "54%", top: "82%", rotate: 16,  size: 64,  opacity: 0.26 },
  ],
  dense: [
    { src: "/pill-purple.png", left: "4%",  top: "10%", rotate: -28, size: 92,  opacity: 0.36 },
    { src: "/pill-orange.png", left: "90%", top: "6%",  rotate: 22,  size: 78,  opacity: 0.32 },
    { src: "/pill-green.png",  left: "10%", top: "58%", rotate: 42,  size: 104, opacity: 0.34, flip: true },
    { src: "/pill-orange.png", left: "72%", top: "78%", rotate: -22, size: 70,  opacity: 0.30 },
    { src: "/pill-purple.png", left: "44%", top: "30%", rotate: 12,  size: 58,  opacity: 0.26 },
    { src: "/pill-green.png",  left: "94%", top: "48%", rotate: -8,  size: 56,  opacity: 0.24 },
    { src: "/pill-purple.png", left: "62%", top: "16%", rotate: 24,  size: 46,  opacity: 0.22, flip: true },
    { src: "/pill-orange.png", left: "26%", top: "44%", rotate: -34, size: 40,  opacity: 0.20 },
    { src: "/pill-green.png",  left: "54%", top: "82%", rotate: 16,  size: 66,  opacity: 0.28 },
    { src: "/pill-orange.png", left: "34%", top: "8%",  rotate: 8,   size: 48,  opacity: 0.22 },
    { src: "/pill-purple.png", left: "82%", top: "32%", rotate: -16, size: 52,  opacity: 0.24, flip: true },
    { src: "/pill-green.png",  left: "38%", top: "68%", rotate: 28,  size: 42,  opacity: 0.20 },
    { src: "/pill-orange.png", left: "8%",  top: "82%", rotate: -42, size: 60,  opacity: 0.26 },
  ],
};

const TONE_MULTIPLIER: Record<"warm" | "quiet" | "bright", number> = {
  warm: 1.0,
  quiet: 0.6,
  bright: 1.4,
};

interface PillPatternProps {
  density?: "light" | "medium" | "dense";
  tone?: "warm" | "quiet" | "bright";
  /** Override the entire opacity multiplier (0–1.5). */
  opacityMultiplier?: number;
  /** Pin the pattern to a different z-index. Default 0 (behind content at z>=1). */
  zIndex?: number;
  className?: string;
}

export default function PillPattern({
  density = "medium",
  tone = "warm",
  opacityMultiplier,
  zIndex = 0,
  className = "",
}: PillPatternProps) {
  const items = SCATTERS[density];
  const multiplier = opacityMultiplier ?? TONE_MULTIPLIER[tone];

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex }}
    >
      {items.map((p, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${p.src}-${i}`}
          src={p.src}
          alt=""
          aria-hidden
          draggable={false}
          loading="lazy"
          decoding="async"
          style={{
            position: "absolute",
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: "auto",
            opacity: Math.min(1, p.opacity * multiplier),
            transform: `translate(-50%, -50%) rotate(${p.rotate}deg)${p.flip ? " scaleX(-1)" : ""}`,
            filter: "drop-shadow(0 6px 14px rgba(15, 17, 21, 0.08))",
          }}
        />
      ))}
    </div>
  );
}
