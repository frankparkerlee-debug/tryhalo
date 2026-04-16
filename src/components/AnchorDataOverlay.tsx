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

/* ─── PERFORMANCE — Line graph with real data points ────────── */

// 12 data points (90-day testosterone progression) — polyline, no smoothing.
// Starts low-left around y=210 (baseline), climbs to y=30 at the top-right.
const PERFORMANCE_POINTS: Array<[number, number]> = [
  [0, 210],
  [45, 205],
  [90, 190],
  [135, 175],
  [180, 160],
  [225, 140],
  [270, 115],
  [315, 105],
  [360, 85],
  [405, 70],
  [450, 55],
  [495, 40],
  [540, 30],
];

const PERFORMANCE_POLYLINE = PERFORMANCE_POINTS.map(([x, y]) => `${x},${y}`).join(" ");
const PERFORMANCE_AREA_PATH = `M ${PERFORMANCE_POLYLINE.replace(/ /g, " L ")} L 540 260 L 0 260 Z`;

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
      {/* Line graph: polyline connecting 90-day data points */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        viewBox="0 0 540 260"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Fill gradient under the line — fades from accent to transparent */}
          <linearGradient id="perf-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </linearGradient>
          {/* Line stroke gradient — faint on the left, strong on the right */}
          <linearGradient id="perf-line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Horizontal grid reference lines — subtle baseline context */}
        {[60, 130, 200].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="540"
            y2={y}
            stroke={accentColor}
            strokeOpacity="0.08"
            strokeWidth="0.75"
            strokeDasharray="2 4"
          />
        ))}

        {/* Area fill under the polyline */}
        <path d={PERFORMANCE_AREA_PATH} fill="url(#perf-area-grad)" />

        {/* The line graph itself — straight segments, no smoothing */}
        <polyline
          points={PERFORMANCE_POLYLINE}
          fill="none"
          stroke="url(#perf-line-grad)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data point nodes — every 3rd point visible so it reads as a real chart */}
        {PERFORMANCE_POINTS.filter((_, i) => i % 3 === 0).map(([x, y], i) => (
          <g key={`pt-${i}`}>
            <circle
              cx={x}
              cy={y}
              r="3"
              fill="white"
              stroke={accentColor}
              strokeWidth="1.5"
            />
          </g>
        ))}

        {/* Prominent current-value marker at the final point */}
        <circle cx="540" cy="30" r="4" fill={accentColor} />
        <circle cx="540" cy="30" r="9" fill={accentColor} fillOpacity="0.25" />
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

/* ─── RESTORATION — Distributed chips only ────────────────── */

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
