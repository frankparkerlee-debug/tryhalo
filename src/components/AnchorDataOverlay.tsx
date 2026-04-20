/**
 * AnchorDataOverlay — 2 intentional chips per anchor card
 * ─────────────────────────────────────────────────────────────────────
 * Two chips per card, placed diagonally (top-right + bottom-left)
 * instead of filling all four corners. Reads as annotation on a
 * photograph, not as a dashboard UI framing the image.
 *
 * Each chip: short label + directional symbol (↑ ↓ ↻ +).
 * Restoration variant (HRT): Mood + Sleep — the felt outcomes.
 * Performance variant (TRT): Drive + Recovery — the capability lifts.
 */

import {
  ArrowUp,
  Plus,
  Check,
  Sparkles,
  Activity,
  Moon,
  Zap,
  RotateCw,
  Waves,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ChipIconKey =
  | "up"
  | "plus"
  | "check"
  | "sparkles"
  | "pulse"
  | "moon"
  | "bolt"
  | "rotate"
  | "waves";

const ICON_MAP: Record<ChipIconKey, LucideIcon> = {
  up: ArrowUp,
  plus: Plus,
  check: Check,
  sparkles: Sparkles,
  pulse: Activity,
  moon: Moon,
  bolt: Zap,
  rotate: RotateCw,
  waves: Waves,
};

interface Chip {
  label: string;
  iconKey: ChipIconKey;
  accent?: string;
}

interface SharedProps {
  accentColor: string;
  atmosphereTint?: string;
}

interface RestorationProps extends SharedProps {
  variant: "restoration";
  chips: Chip[];
}

interface PerformanceProps extends SharedProps {
  variant: "performance";
  chips: Chip[];
}

type AnchorDataOverlayProps = RestorationProps | PerformanceProps;

/* ─── Helper: image-tinted glassmorphic chip background ─── */
function computeChipBg(atmosphereTint?: string, intensity = 30) {
  if (!atmosphereTint) return "rgba(255, 255, 255, 0.78)";
  return `color-mix(in srgb, ${atmosphereTint} ${intensity}%, white ${100 - intensity}%)`;
}

/* ─── Symbolic chip primitive ─────────────────────────────── */

function SymbolicChip({
  label,
  iconKey,
  accent,
  background,
  positionClasses,
}: {
  label: string;
  iconKey: ChipIconKey;
  accent: string;
  background: string;
  positionClasses: string;
}) {
  const Icon = ICON_MAP[iconKey];
  return (
    <div
      className={`${positionClasses} absolute inline-flex items-center gap-1.5 md:gap-2 rounded-full backdrop-blur-sm border shadow-[0_6px_18px_rgba(0,0,0,0.08)] px-3 py-1.5 md:px-3.5 md:py-2`}
      style={{
        background,
        borderColor: "rgba(255, 255, 255, 0.6)",
      }}
    >
      <span className="text-[10px] md:text-[11px] font-semibold text-halo-charcoal/85 whitespace-nowrap tracking-tight">
        {label}
      </span>
      <Icon
        className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0"
        strokeWidth={2.5}
        style={{ color: accent }}
      />
    </div>
  );
}

/* ─── Overlay: 2 chips, diagonal (top-right + bottom-left) ─ */

export default function AnchorDataOverlay({
  chips,
  accentColor,
  atmosphereTint,
}: AnchorDataOverlayProps) {
  const chipBg = computeChipBg(atmosphereTint, 32);
  const [first, second] = chips;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 select-none"
      aria-hidden="true"
    >
      {first && (
        <SymbolicChip
          label={first.label}
          iconKey={first.iconKey}
          accent={first.accent || accentColor}
          background={chipBg}
          positionClasses="top-3 right-3 md:top-5 md:right-5"
        />
      )}
      {second && (
        <SymbolicChip
          label={second.label}
          iconKey={second.iconKey}
          accent={second.accent || accentColor}
          background={chipBg}
          positionClasses="bottom-3 left-3 md:bottom-5 md:left-5"
        />
      )}
    </div>
  );
}
