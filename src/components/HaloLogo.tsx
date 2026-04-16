interface HaloLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 18, iconH: 15, text: 16, gap: 3 },
  md: { icon: 26, iconH: 22, text: 22, gap: 4 },
  lg: { icon: 34, iconH: 28, text: 30, gap: 5 },
  xl: { icon: 50, iconH: 42, text: 44, gap: 7 },
};

export default function HaloLogo({
  size = "md",
  variant = "dark",
  showText = true,
  className = "",
}: HaloLogoProps) {
  const s = sizes[size];
  const textColor = variant === "dark" ? "#ffffff" : "#1C1C1E";

  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ gap: s.gap }}
    >
      <svg
        width={s.icon}
        height={s.iconH}
        viewBox="0 0 42 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`halo-grad-${size}-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8D4A0" />
            <stop offset="50%" stopColor="#C8A96E" />
            <stop offset="100%" stopColor="#A07838" />
          </linearGradient>
        </defs>
        <ellipse
          cx="21"
          cy="18"
          rx="18"
          ry="14"
          fill="none"
          stroke={`url(#halo-grad-${size}-${variant})`}
          strokeWidth="3.2"
          transform="rotate(-12, 21, 18)"
        />
      </svg>
      {showText && (
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: s.text,
            color: textColor,
            letterSpacing: "0.02em",
            lineHeight: 1,
          }}
        >
          Halo
        </span>
      )}
    </span>
  );
}
