/**
 * AnchorDataOverlay — symbolic chips for anchor hero cards
 * ─────────────────────────────────────────────────────────────────────
 * Minimal, iconic chips: each shows a short label + a directional symbol
 * (↑ arrow, + plus, ↻ rotate, etc). Reads instantly at any size, stays
 * out of the way of the photograph's subject.
 *
 * HRT (Restoration) — 4 corner chips on desktop, 2 on mobile
 * TRT (Performance) — 3 chips on desktop (primary + 2 corners), 2 on mobile
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
  if (!atmosphereTint) return "rgba(255, 255, 255, 0.7)";
  return `color-mix(in srgb, ${atmosphereTint} ${intensity}%, white ${100 - intensity}%)`;
}

/* ─── Compact symbolic chip primitive ─────────────────────── */

function SymbolicChip({
  label,
  iconKey,
  accent,
  background,
  className = "",
}: {
  label: string;
  iconKey: ChipIconKey;
  accent: string;
  background: string;
  className?: string;
}) {
  const Icon = ICON_MAP[iconKey];
  return (
    <div
      className={`${className} absolute rounded-full backdrop-blur-sm border shadow-[0_6px_18px_rgba(0,0,0,0.06)] px-2.5 py-1 md:px-3 md:py-1.5 items-center gap-1.5 md:gap-2`}
      style={{
        background,
        borderColor: "rgba(255, 255, 255, 0.55)",
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

/* ─── RESTORATION — 4 corner chips (2 on mobile) ─────────── */

function RestorationOverlay({
  chips,
  accentColor,
  atmosphereTint,
}: RestorationProps) {
  // On mobile we show only chips 0 and 3 (top-right + bottom-left),
  // positioned to flank the subject's face without touching it:
  //   Chip 0: top-right (above her shoulder)
  //   Chip 3: bottom-left (below her torso, on the left)
  // On desktop all 4 chips show at the four corners.
  const positions = [
    // Chip 0 — mobile: top-right; desktop: top-left
    "top-3 right-3 md:top-5 md:left-5 md:right-auto flex",
    // Chip 1 — hidden on mobile; desktop: top-right
    "hidden md:flex md:top-5 md:right-5",
    // Chip 2 — hidden on mobile; desktop: bottom-left
    "hidden md:flex md:bottom-5 md:left-5",
    // Chip 3 — mobile: bottom-left; desktop: bottom-right
    "bottom-3 left-3 md:bottom-5 md:right-5 md:left-auto flex",
  ];

  const chipBg = computeChipBg(atmosphereTint, 30);

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 select-none"
      aria-hidden="true"
    >
      {chips.slice(0, 4).map((chip, i) => (
        <SymbolicChip
          key={chip.label}
          label={chip.label}
          iconKey={chip.iconKey}
          accent={chip.accent || accentColor}
          background={chipBg}
          className={positions[i]}
        />
      ))}
    </div>
  );
}

/* ─── PERFORMANCE — 3 chips (2 on mobile), with a featured primary ─ */

function PerformanceOverlay({
  chips,
  accentColor,
  atmosphereTint,
}: PerformanceProps) {
  const chipBgStrong = computeChipBg(atmosphereTint, 35);
  const chipBgLight = computeChipBg(atmosphereTint, 22);

  const [primary, ...rest] = chips;
  const PrimaryIcon = primary ? ICON_MAP[primary.iconKey] : null;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 select-none"
      aria-hidden="true"
    >
      {/* Primary chip — featured, top-left corner. Always visible. */}
      {primary && PrimaryIcon && (
        <div
          className="absolute top-3 left-3 md:top-5 md:left-5 flex rounded-full backdrop-blur-md border shadow-[0_8px_22px_rgba(0,0,0,0.1)] px-3 py-1.5 md:px-4 md:py-2 items-center gap-2"
          style={{
            background: chipBgStrong,
            borderColor: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <span className="text-[11px] md:text-[13px] font-bold text-halo-charcoal whitespace-nowrap tracking-tight">
            {primary.label}
          </span>
          <PrimaryIcon
            className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0"
            strokeWidth={2.75}
            style={{ color: primary.accent || accentColor }}
          />
        </div>
      )}

      {/* Secondary chip (Recovery) — DESKTOP ONLY. Hidden on mobile to
          prevent crowding around the primary Strength chip. */}
      {rest[0] && (
        <SymbolicChip
          label={rest[0].label}
          iconKey={rest[0].iconKey}
          accent={rest[0].accent || accentColor}
          background={chipBgLight}
          className="hidden md:flex md:top-5 md:right-5"
        />
      )}

      {/* Third chip (Drive) — mobile: bottom-right (diagonal from primary).
          Desktop: bottom-left so it anchors the other corner. */}
      {rest[1] && (
        <SymbolicChip
          label={rest[1].label}
          iconKey={rest[1].iconKey}
          accent={rest[1].accent || accentColor}
          background={chipBgLight}
          className="bottom-3 right-3 md:bottom-5 md:left-5 md:right-auto flex"
        />
      )}
    </div>
  );
}

/* ─── Dispatcher ────────────────────────────────────────────── */

export default function AnchorDataOverlay(props: AnchorDataOverlayProps) {
  if (props.variant === "performance") {
    return <PerformanceOverlay {...props} />;
  }
  return <RestorationOverlay {...props} />;
}
