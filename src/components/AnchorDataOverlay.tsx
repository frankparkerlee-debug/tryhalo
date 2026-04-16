/**
 * AnchorDataOverlay
 * ─────────────────────────────────────────────────────────────────
 * A glassmorphic data card overlay designed to sit on top of the
 * anchor hero card photograph (HRT / TRT editorial portraits).
 *
 * Conveys the "we track your biology" story with real typography
 * and a pixel-perfect upward-trending sparkline — never rendered
 * by an image model, always crisp.
 */

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface AnchorDataOverlayProps {
  /** Metric label, e.g. "Estradiol" or "Testosterone" */
  label: string;
  /** Current value, e.g. "82" or "742" */
  value: string;
  /** Unit, e.g. "pg/mL" or "ng/dL" */
  unit: string;
  /** Change indicator, e.g. "+18% / 90 days" */
  trend?: string;
  /** Brand accent color for the sparkline stroke */
  accentColor: string;
  /** Corner to anchor to */
  position?: Position;
  /** Optional second chip underneath (e.g., sleep score) */
  secondary?: {
    label: string;
    value: string;
  };
}

// Fake but plausible sparkline path — trending upward over time
const SPARKLINE_PATH =
  "M 0 32 L 8 30 L 16 28 L 24 30 L 32 26 L 40 24 L 48 20 L 56 22 L 64 18 L 72 14 L 80 10 L 88 12 L 96 8 L 100 6";

const POSITION_CLASSES: Record<Position, string> = {
  "top-left": "top-3 left-3 md:top-4 md:left-4",
  "top-right": "top-3 right-3 md:top-4 md:right-4",
  "bottom-left": "bottom-3 left-3 md:bottom-4 md:left-4",
  "bottom-right": "bottom-3 right-3 md:bottom-4 md:right-4",
};

export default function AnchorDataOverlay({
  label,
  value,
  unit,
  trend,
  accentColor,
  position = "top-right",
  secondary,
}: AnchorDataOverlayProps) {
  return (
    <div
      className={`absolute ${POSITION_CLASSES[position]} z-10 flex flex-col gap-1.5 pointer-events-none select-none`}
      aria-hidden="true"
    >
      {/* Primary metric card */}
      <div className="rounded-xl backdrop-blur-md bg-white/70 border border-white/50 shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-3 py-2.5 flex items-center gap-3 min-w-[160px]">
        {/* Metric text */}
        <div className="flex-1 min-w-0">
          <p className="text-[9px] uppercase tracking-wider text-halo-charcoal/55 font-semibold leading-tight">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-halo-charcoal leading-tight">
              {value}
            </span>
            <span className="text-[10px] text-halo-charcoal/50 font-medium">
              {unit}
            </span>
          </div>
          {trend && (
            <p
              className="text-[9px] font-medium mt-0.5"
              style={{ color: accentColor }}
            >
              {trend}
            </p>
          )}
        </div>

        {/* Sparkline */}
        <svg
          width="48"
          height="28"
          viewBox="0 0 100 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          {/* Subtle gradient fill under the line */}
          <defs>
            <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Area */}
          <path
            d={`${SPARKLINE_PATH} L 100 40 L 0 40 Z`}
            fill={`url(#spark-${label})`}
          />
          {/* Line */}
          <path
            d={SPARKLINE_PATH}
            stroke={accentColor}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* End dot */}
          <circle cx="100" cy="6" r="2.5" fill={accentColor} />
        </svg>
      </div>

      {/* Secondary chip */}
      {secondary && (
        <div className="rounded-full backdrop-blur-md bg-white/70 border border-white/50 shadow-[0_4px_12px_rgba(0,0,0,0.06)] px-3 py-1.5 inline-flex items-center gap-2 self-start">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: accentColor }}
          />
          <span className="text-[10px] font-semibold text-halo-charcoal/70">
            {secondary.label}
          </span>
          <span className="text-[10px] text-halo-charcoal/50">
            {secondary.value}
          </span>
        </div>
      )}
    </div>
  );
}
