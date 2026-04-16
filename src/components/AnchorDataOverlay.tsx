/**
 * AnchorDataOverlay — integrated overlay variants for anchor hero cards
 * ─────────────────────────────────────────────────────────────────────
 * Approach: overlays read as *part of the scene* not a dashboard HUD.
 *
 * PERFORMANCE (TRT) — an arcing sparkline traced across the frame like a
 *   light trail + one clean metric card. The line glows softly in the
 *   image's own color world so it feels atmospheric, not applied.
 *
 * RESTORATION (HRT) — a constellation of small tinted chips floating
 *   around the subject + a soft settling wave at the base. Chips carry
 *   a faint image-world tint so they feel like part of the photograph.
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
  /** Hex tone of the image's background atmosphere — chips pick this up softly */
  atmosphereTint?: string;
}

interface PerformanceProps extends SharedProps {
  variant: "performance";
  label: string;
  value: string;
  unit: string;
  trend?: string;
  position?: Position;
}

interface RestorationProps extends SharedProps {
  variant: "restoration";
  chips: RestorationChip[];
}

type AnchorDataOverlayProps = PerformanceProps | RestorationProps;

/* ─── PERFORMANCE — Integrated arc + single metric ──────────── */

const ARC_PATH =
  "M 0 190 Q 120 170, 220 130 T 380 70 T 540 30";

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
  atmosphereTint,
  position = "bottom-left",
}: PerformanceProps) {
  const chipBg = atmosphereTint
    ? `color-mix(in srgb, ${atmosphereTint} 35%, white 65%)`
    : "rgba(255, 255, 255, 0.65)";

  return (
    <>
      {/* Arcing performance trajectory — glowing light trail */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        viewBox="0 0 540 260"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Gradient: faint on the left, strong on the right (implying progress) */}
          <linearGradient id="perf-arc-grad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
            <stop offset="45%" stopColor={accentColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.95" />
          </linearGradient>
          {/* Soft bloom around the line — makes it feel atmospheric, not UI */}
          <filter id="perf-bloom" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft underglow layer */}
        <path
          d={ARC_PATH}
          stroke={accentColor}
          strokeOpacity="0.25"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          filter="url(#perf-bloom)"
        />
        {/* Primary line */}
        <path
          d={ARC_PATH}
          stroke="url(#perf-arc-grad)"
          strokeWidth="2.25"
          strokeLinecap="round"
          fill="none"
        />
        {/* Peak marker — subtle double dot */}
        <circle cx="540" cy="30" r="4" fill={accentColor} />
        <circle cx="540" cy="30" r="10" fill={accentColor} fillOpacity="0.2" />
      </svg>

      {/* Single tinted metric card */}
      <div
        className={`absolute ${POSITION_CLASSES[position]} z-10 pointer-events-none select-none`}
        aria-hidden="true"
      >
        <div
          className="rounded-xl backdrop-blur-sm border shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-3.5 py-2.5 min-w-[150px]"
          style={{
            background: chipBg,
            borderColor: "rgba(255, 255, 255, 0.55)",
          }}
        >
          <p className="text-[9px] uppercase tracking-wider text-halo-charcoal/60 font-semibold leading-tight">
            {label}
          </p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-bold text-halo-charcoal leading-tight tracking-tight">
              {value}
            </span>
            <span className="text-[11px] text-halo-charcoal/60 font-medium">
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

/* ─── RESTORATION — Distributed chips + settling wave ───────── */

function RestorationOverlay({
  chips,
  accentColor,
  atmosphereTint,
}: RestorationProps) {
  // Chips placed to surround the subject without covering the face
  const positions = [
    "top-5 right-5 md:top-6 md:right-8",
    "top-[38%] right-4 md:right-6",
    "bottom-[28%] right-10 md:right-12",
    "top-8 left-5 md:top-10 md:left-6",
  ];

  const chipBg = atmosphereTint
    ? `color-mix(in srgb, ${atmosphereTint} 30%, white 70%)`
    : "rgba(255, 255, 255, 0.7)";

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 select-none"
      aria-hidden="true"
    >
      {chips.slice(0, 4).map((chip, i) => (
        <div
          key={chip.label}
          className={`absolute ${positions[i]} rounded-full backdrop-blur-sm border shadow-[0_6px_18px_rgba(0,0,0,0.06)] px-3 py-1.5 inline-flex items-center gap-2`}
          style={{
            background: chipBg,
            borderColor: "rgba(255, 255, 255, 0.55)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: chip.accent || accentColor }}
          />
          <span className="text-[10px] font-semibold text-halo-charcoal/80 whitespace-nowrap">
            {chip.label}
          </span>
          <span className="text-[10px] text-halo-charcoal/60 whitespace-nowrap">
            {chip.value}
          </span>
        </div>
      ))}

      {/* Soft settling wave along the bottom — like a rhythm returning */}
      <svg
        className="absolute bottom-0 left-0 w-full h-20 opacity-80"
        viewBox="0 0 540 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="rest-wave-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.22" />
          </linearGradient>
          <filter id="rest-bloom" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M 0 60 Q 135 40, 270 50 T 540 45 L 540 100 L 0 100 Z"
          fill="url(#rest-wave-grad)"
        />
        <path
          d="M 0 60 Q 135 40, 270 50 T 540 45"
          stroke={accentColor}
          strokeOpacity="0.4"
          strokeWidth="1.25"
          fill="none"
          filter="url(#rest-bloom)"
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
