/**
 * AnchorDataOverlay — purpose-built overlay per program
 * ─────────────────────────────────────────────────────────────────────
 * Each anchor program has its own overlay *layout* tuned to its story:
 *
 * HRT (Restoration) — 4 chips in a scattered constellation around the
 *   subject's face. Feels like facets of wholeness returning at once.
 *
 * TRT (Performance) — 3 chips in an asymmetric vertical stack, each
 *   with a punchier feel. The first chip is larger/primary, the other
 *   two reinforce beneath it. Masculine minimalism, not a dashboard.
 *
 * Both share visual DNA (glassmorphic, image-tinted) but never look
 * identical.
 */

interface Chip {
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

interface RestorationProps extends SharedProps {
  variant: "restoration";
  chips: Chip[];
}

interface PerformanceProps extends SharedProps {
  variant: "performance";
  chips: Chip[];
}

type AnchorDataOverlayProps = RestorationProps | PerformanceProps;

/* ─── Helper: compute a soft image-tinted chip background ─── */

function computeChipBg(atmosphereTint?: string, intensity = 30) {
  if (!atmosphereTint) return "rgba(255, 255, 255, 0.7)";
  return `color-mix(in srgb, ${atmosphereTint} ${intensity}%, white ${100 - intensity}%)`;
}

/* ─── RESTORATION — Constellation of 4 chips around the subject ─── */

function RestorationOverlay({
  chips,
  accentColor,
  atmosphereTint,
}: RestorationProps) {
  // Positions chosen to hug the corners/edges and stay clear of the central
  // subject area (face, shoulders, chest). HRT image: woman center-right,
  // so chips live top-left, top-right (above head), bottom-left, bottom-right.
  const positions = [
    "top-4 left-4 md:top-5 md:left-5",       // top-left corner
    "top-4 right-4 md:top-5 md:right-5",     // top-right corner
    "bottom-4 left-4 md:bottom-5 md:left-5", // bottom-left corner
    "bottom-4 right-4 md:bottom-5 md:right-5", // bottom-right corner
  ];

  const chipBg = computeChipBg(atmosphereTint, 30);

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

/* ─── PERFORMANCE — 3 chips in an asymmetric vertical stack ─── */

function PerformanceOverlay({
  chips,
  accentColor,
  atmosphereTint,
}: PerformanceProps) {
  const chipBgStrong = computeChipBg(atmosphereTint, 35);
  const chipBgLight = computeChipBg(atmosphereTint, 20);

  const [primary, ...rest] = chips;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 select-none"
      aria-hidden="true"
    >
      {/* Primary chip — bigger, featured, top-left to anchor the eye */}
      {primary && (
        <div
          className="absolute top-5 left-5 md:top-7 md:left-7 rounded-2xl backdrop-blur-md border shadow-[0_10px_28px_rgba(0,0,0,0.1)] px-4 py-3 flex flex-col"
          style={{
            background: chipBgStrong,
            borderColor: "rgba(255, 255, 255, 0.6)",
            minWidth: "132px",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: primary.accent || accentColor }}
            />
            <span className="text-[9px] uppercase tracking-wider text-halo-charcoal/55 font-bold">
              {primary.label}
            </span>
          </div>
          <span className="text-base font-bold text-halo-charcoal leading-tight tracking-tight">
            {primary.value}
          </span>
        </div>
      )}

      {/* Secondary chip — bottom-left, well clear of the subject area */}
      {rest[0] && (
        <div
          className="absolute bottom-4 left-4 md:bottom-5 md:left-5 rounded-full backdrop-blur-sm border shadow-[0_6px_18px_rgba(0,0,0,0.06)] px-3 py-1.5 inline-flex items-center gap-2"
          style={{
            background: chipBgLight,
            borderColor: "rgba(255, 255, 255, 0.55)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: rest[0].accent || accentColor }}
          />
          <span className="text-[10px] font-semibold text-halo-charcoal/80 whitespace-nowrap">
            {rest[0].label}
          </span>
          <span className="text-[10px] text-halo-charcoal/60 whitespace-nowrap">
            {rest[0].value}
          </span>
        </div>
      )}

      {/* Third chip — top-right corner, clear of the subject */}
      {rest[1] && (
        <div
          className="absolute top-4 right-4 md:top-5 md:right-5 rounded-full backdrop-blur-sm border shadow-[0_6px_18px_rgba(0,0,0,0.06)] px-3 py-1.5 inline-flex items-center gap-2"
          style={{
            background: chipBgLight,
            borderColor: "rgba(255, 255, 255, 0.55)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: rest[1].accent || accentColor }}
          />
          <span className="text-[10px] font-semibold text-halo-charcoal/80 whitespace-nowrap">
            {rest[1].label}
          </span>
          <span className="text-[10px] text-halo-charcoal/60 whitespace-nowrap">
            {rest[1].value}
          </span>
        </div>
      )}
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
