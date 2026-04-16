/**
 * AnchorDataOverlay — two visual variants for the anchor hero cards
 * ─────────────────────────────────────────────────────────────────
 * PERFORMANCE variant (TRT) — large arcing sparkline as a background
 *   element with a single strong metric value. Feels like "trajectory."
 *
 * RESTORATION variant (HRT) — several small glassmorphic chips layered
 *   around the subject, telling a wholeness story (hormone + mood +
 *   sleep + clarity). Feels like "return to self."
 *
 * All overlays are code-rendered SVG + typography. Never AI graphics.
 */

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface RestorationChip {
  label: string;
  value: string;
  accent?: string;
}

interface SharedProps {
  /** Brand accent color for graph stroke and accent dots */
  accentColor: string;
}

interface PerformanceProps extends SharedProps {
  variant: "performance";
  /** Metric label, e.g. "Testosterone" */
  label: string;
  /** Current value, e.g. "742" */
  value: string;
  /** Unit, e.g. "ng/dL" */
  unit: string;
  /** Optional change indicator, e.g. "+38% / 90 days" */
  trend?: string;
  /** Which corner to anchor to */
  position?: Position;
}

interface RestorationProps extends SharedProps {
  variant: "restoration";
  /** Multiple small status chips surrounding the subject */
  chips: RestorationChip[];
}

type AnchorDataOverlayProps = PerformanceProps | RestorationProps;

/* ─── PERFORMANCE — Arcing trajectory + big metric ────────────── */

const ARC_PATH =
  "M 0 110 Q 80 105, 160 85 T 340 40 T 540 10";

const POSITION_CLASSES: Record<Position, string> = {
  "top-left": "top-4 left-4 md:top-5 md:left-5",
  "top-right": "top-4 right-4 md:top-5 md:right-5",
  "bottom-left": "bottom-4 left-4 md:bottom-5 md:left-5",
  "bottom-right": "bottom-4 right-4 md:bottom-5 md:right-5",
};

function PerformanceOverlay({
  label,
  value,
  unit,
  trend,
  accentColor,
  position = "bottom-left",
}: PerformanceProps) {
  return (
    <>
      {/* Background — arcing performance trajectory line spans most of the frame */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        viewBox="0 0 540 300"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="perf-arc-grad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
            <stop offset="50%" stopColor={accentColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.9" />
          </linearGradient>
          <filter id="perf-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Subtle axis ticks along the baseline */}
        {[60, 160, 260, 360, 460].map((x) => (
          <line
            key={x}
            x1={x}
            y1="260"
            x2={x}
            y2="268"
            stroke={accentColor}
            strokeOpacity="0.2"
            strokeWidth="1"
          />
        ))}
        {/* Arcing trajectory */}
        <path
          d={ARC_PATH}
          stroke="url(#perf-arc-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#perf-glow)"
        />
        {/* Peak marker */}
        <circle cx="540" cy="10" r="5" fill={accentColor} />
        <circle cx="540" cy="10" r="10" fill={accentColor} fillOpacity="0.25" />
      </svg>

      {/* Metric card */}
      <div
        className={`absolute ${POSITION_CLASSES[position]} z-10 pointer-events-none select-none`}
        aria-hidden="true"
      >
        <div className="rounded-xl backdrop-blur-md bg-white/75 border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.1)] px-3.5 py-2.5 min-w-[150px]">
          <p className="text-[9px] uppercase tracking-wider text-halo-charcoal/55 font-semibold leading-tight">
            {label}
          </p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-bold text-halo-charcoal leading-tight tracking-tight">
              {value}
            </span>
            <span className="text-[11px] text-halo-charcoal/55 font-medium">
              {unit}
            </span>
          </div>
          {trend && (
            <p
              className="text-[10px] font-semibold mt-0.5"
              style={{ color: accentColor }}
            >
              ↗ {trend}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── RESTORATION — Multiple layered chips ────────────────────── */

function RestorationOverlay({ chips, accentColor }: RestorationProps) {
  // Anchor each chip to a different zone so they don't stack.
  // Positions chosen to leave the subject's face unobstructed.
  const positions = [
    "top-4 right-4 md:top-6 md:right-6",
    "top-[42%] right-6 md:right-10",
    "bottom-6 right-8 md:bottom-10 md:right-14",
    "bottom-4 left-4 md:bottom-6 md:left-6",
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none" aria-hidden="true">
      {chips.slice(0, 4).map((chip, i) => (
        <div
          key={chip.label}
          className={`absolute ${positions[i]} rounded-full backdrop-blur-md bg-white/75 border border-white/60 shadow-[0_6px_18px_rgba(0,0,0,0.08)] px-3 py-1.5 inline-flex items-center gap-2`}
          style={{
            animationDelay: `${i * 120}ms`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: chip.accent || accentColor }}
          />
          <span className="text-[10px] font-semibold text-halo-charcoal/75 whitespace-nowrap">
            {chip.label}
          </span>
          <span className="text-[10px] text-halo-charcoal/55 whitespace-nowrap">
            {chip.value}
          </span>
        </div>
      ))}

      {/* Soft wave underneath, like a settling rhythm */}
      <svg
        className="absolute bottom-0 left-0 w-full h-24 opacity-70"
        viewBox="0 0 540 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="rest-wave-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <path
          d="M 0 60 Q 135 40, 270 50 T 540 45 L 540 100 L 0 100 Z"
          fill="url(#rest-wave-grad)"
        />
        <path
          d="M 0 60 Q 135 40, 270 50 T 540 45"
          stroke={accentColor}
          strokeOpacity="0.35"
          strokeWidth="1.25"
          fill="none"
        />
      </svg>
    </div>
  );
}

/* ─── Dispatcher ──────────────────────────────────────────────── */

export default function AnchorDataOverlay(props: AnchorDataOverlayProps) {
  if (props.variant === "performance") {
    return <PerformanceOverlay {...props} />;
  }
  return <RestorationOverlay {...props} />;
}
