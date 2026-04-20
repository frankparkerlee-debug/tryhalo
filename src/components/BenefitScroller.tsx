"use client";

/**
 * BenefitScroller — single-row horizontal auto-scrolling strip.
 *
 * Used for the "Hers-style one-line bento scroll" — a continuous stream of
 * trust/benefit pills scrolling left-to-right. Edge-masked fade for premium
 * finish. Respects prefers-reduced-motion.
 *
 * Usage:
 *   <BenefitScroller
 *     items={["Physician-designed", "Full metabolic panel", ...]}
 *     accent="#C5603D"
 *   />
 */
export default function BenefitScroller({
  items,
  accent,
  background = "#FAF8F4",
  speed = 40,
}: {
  items: string[];
  accent: string;
  background?: string;
  /** Seconds for one full loop. Higher = slower. */
  speed?: number;
}) {
  const duplicated = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden py-5 md:py-6 marquee-edge-mask"
      style={{ background }}
    >
      <div
        className="flex gap-6 md:gap-8 whitespace-nowrap benefit-track"
        style={{ animationDuration: `${speed}s` }}
      >
        {duplicated.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-2.5 text-[12px] md:text-[13px] font-medium text-halo-charcoal/85 tracking-tight flex-shrink-0"
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: accent }}
            />
            {item}
          </span>
        ))}
      </div>

      <style jsx>{`
        .marquee-edge-mask {
          mask-image: linear-gradient(
            90deg,
            transparent 0%,
            black 6%,
            black 94%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent 0%,
            black 6%,
            black 94%,
            transparent 100%
          );
        }
        .benefit-track {
          animation-name: scroll-benefits;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          width: max-content;
        }
        @keyframes scroll-benefits {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .benefit-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
