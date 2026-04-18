/**
 * HormoneBalanceChart — reusable brand illustration.
 *
 * Two panels side-by-side showing hormones out of rhythm (chaotic)
 * vs. in balance (phase-aligned).
 *
 * Accepts 1-3 hormones. Supports a `compact` mode for narrow spaces
 * (quiz gate inline use) vs. full mode for standalone display.
 */

interface Hormone {
  name: string;
  color: string;
}

interface HormoneBalanceChartProps {
  /** Hormones to plot. 1-3 items. Defaults to women's HRT trio. */
  hormones?: Hormone[];
  /** Label beneath left panel. */
  outOfRhythmLabel?: string;
  /** Label beneath right panel. */
  inBalanceLabel?: string;
  /** Compact mode for narrow inline use (smaller viewBox, tighter labels). */
  compact?: boolean;
  /** Show the legend under the chart (default: true for full, false for compact). */
  showLegend?: boolean;
  /** Extra classes. */
  className?: string;
}

const DEFAULT_HORMONES: Hormone[] = [
  { name: "Estradiol", color: "#D4836B" },
  { name: "Progesterone", color: "#B87060" },
  { name: "Testosterone", color: "#C8A96E" },
];

// Chaotic curve paths — scale to panel width so there's margin inside each panel
// Leaves ~10% padding on each side so curves don't crash into the panel edges
const chaoticPath1 = (w: number): string => {
  const pad = w * 0.06;
  const usable = w - pad * 2;
  return `M ${pad} 75 Q ${pad + usable * 0.08} 35 ${pad + usable * 0.17} 70 T ${pad + usable * 0.33} 55 Q ${pad + usable * 0.42} 90 ${pad + usable * 0.5} 60 T ${pad + usable * 0.67} 75 Q ${pad + usable * 0.75} 30 ${pad + usable * 0.83} 65 T ${pad + usable} 55`;
};

const chaoticPath2 = (w: number): string => {
  const pad = w * 0.06;
  const usable = w - pad * 2;
  return `M ${pad} 55 Q ${pad + usable * 0.13} 90 ${pad + usable * 0.25} 65 T ${pad + usable * 0.5} 80 Q ${pad + usable * 0.63} 45 ${pad + usable * 0.75} 75 T ${pad + usable} 65`;
};

const chaoticPath3 = (w: number): string => {
  const pad = w * 0.06;
  const usable = w - pad * 2;
  return `M ${pad} 90 Q ${pad + usable * 0.1} 55 ${pad + usable * 0.21} 85 T ${pad + usable * 0.42} 70 Q ${pad + usable * 0.54} 95 ${pad + usable * 0.65} 65 T ${pad + usable * 0.88} 85 T ${pad + usable} 75`;
};

const CHAOTIC_PATH_GENERATORS = [chaoticPath1, chaoticPath2, chaoticPath3];

// Balanced curve y-positions adjust based on how many hormones
const BALANCED_Y_POSITIONS: Record<number, number[]> = {
  1: [70],
  2: [55, 85],
  3: [50, 70, 90],
};

const balancedPath = (y: number, width: number): string => {
  const pad = width * 0.06;
  const usable = width - pad * 2;
  return `M ${pad} ${y} Q ${pad + usable * 0.125} ${y - 6} ${pad + usable * 0.25} ${y} T ${pad + usable * 0.5} ${y} T ${pad + usable * 0.75} ${y} T ${pad + usable} ${y}`;
};

export default function HormoneBalanceChart({
  hormones = DEFAULT_HORMONES,
  outOfRhythmLabel = "OUT OF RHYTHM",
  inBalanceLabel = "IN BALANCE",
  compact = false,
  showLegend,
  className = "",
}: HormoneBalanceChartProps) {
  const trimmed = hormones.slice(0, 3);
  const numHormones = trimmed.length;
  const showLegendResolved = showLegend !== undefined ? showLegend : !compact;

  // Dimensions shift in compact mode
  // Gap between panels generously spaced so the curves don't visually crowd the divider
  const vb = compact
    ? { w: 520, h: 180, panelW: 220, gap: 60, labelY: 158, strokeW: 1.5, labelSize: 12, legendSize: 12 }
    : { w: 620, h: 240, panelW: 260, gap: 80, labelY: 192, strokeW: 2, labelSize: 14, legendSize: 13 };

  const panelRightX = vb.panelW + vb.gap;
  const balancedYs = BALANCED_Y_POSITIONS[numHormones] || BALANCED_Y_POSITIONS[3];

  return (
    <svg
      viewBox={`0 0 ${vb.w} ${vb.h + (showLegendResolved ? 40 : 0)}`}
      className={`w-full h-auto ${className}`}
      aria-label={`${trimmed.map((h) => h.name).join(", ")}: out of rhythm vs. in balance`}
      role="img"
    >
      {/* ─── LEFT PANEL: OUT OF RHYTHM ─── */}
      <g transform="translate(10, 10)">
        <rect
          width={vb.panelW}
          height={vb.h - 30}
          fill="rgba(28, 28, 30, 0.025)"
          rx="4"
        />
        {trimmed.map((h, i) => (
          <path
            key={`chaotic-${i}`}
            d={CHAOTIC_PATH_GENERATORS[i](vb.panelW)}
            fill="none"
            stroke={h.color}
            strokeWidth={vb.strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={1 - i * 0.05}
          />
        ))}
        <text
          x={vb.panelW / 2}
          y={vb.labelY}
          textAnchor="middle"
          fontSize={vb.labelSize}
          fontWeight="600"
          letterSpacing="2.2"
          fill="rgba(28, 28, 30, 0.6)"
        >
          {outOfRhythmLabel}
        </text>
      </g>

      {/* Divider — centered in the gap */}
      <line
        x1={10 + vb.panelW + vb.gap / 2}
        y1="30"
        x2={10 + vb.panelW + vb.gap / 2}
        y2={vb.h - 20}
        stroke={trimmed[0].color}
        strokeWidth="0.5"
        opacity="0.25"
      />

      {/* ─── RIGHT PANEL: IN BALANCE ─── */}
      <g transform={`translate(${panelRightX + 10}, 10)`}>
        <rect
          width={vb.panelW}
          height={vb.h - 30}
          fill={`${trimmed[0].color}0F`}
          rx="4"
        />
        {trimmed.map((h, i) => (
          <path
            key={`balanced-${i}`}
            d={balancedPath(balancedYs[i] || 70, vb.panelW)}
            fill="none"
            stroke={h.color}
            strokeWidth={vb.strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={1 - i * 0.05}
          />
        ))}
        <text
          x={vb.panelW / 2}
          y={vb.labelY}
          textAnchor="middle"
          fontSize={vb.labelSize}
          fontWeight="600"
          letterSpacing="2.2"
          fill={trimmed[0].color}
        >
          {inBalanceLabel}
        </text>
      </g>

      {/* ─── Legend ─── */}
      {showLegendResolved && (
        <g transform={`translate(${vb.w / 2}, ${vb.h + 28})`}>
          {trimmed.map((h, i) => {
            const spacing = vb.w / (numHormones + 1);
            const offset = (i - (numHormones - 1) / 2) * spacing;
            return (
              <g key={`legend-${i}`} transform={`translate(${offset}, 0)`}>
                <circle cx="-4" cy="-4" r="3.5" fill={h.color} />
                <text
                  x="6"
                  y="0"
                  fontSize={vb.legendSize}
                  fontStyle="italic"
                  fill="rgba(28, 28, 30, 0.7)"
                >
                  {h.name}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
