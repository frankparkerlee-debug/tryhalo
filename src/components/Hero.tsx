import { ArrowRight } from "lucide-react";

interface HeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaHref?: string;
  trustLine: string;
}

export default function Hero({
  headline,
  subheadline,
  ctaText,
  ctaHref = "/#founding-circle",
  trustLine,
}: HeroProps) {
  const trustParts = trustLine.split("·").map((s) => s.trim());

  return (
    <section className="py-20 px-6 section-dark relative overflow-hidden">
      <div
        className="absolute top-[10%] right-[10%] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{
          background: "#6B7B6E",
          filter: "blur(150px)",
          opacity: 0.1,
        }}
      />
      <div className="max-w-4xl mx-auto text-center relative z-10 pt-24 pb-8">
        <h1 className="headline-hero text-4xl md:text-5xl lg:text-6xl mb-8 text-white">
          {headline}
        </h1>
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          {subheadline}
        </p>
        <a href={ctaHref} className="btn-gold-filled">
          {ctaText}
          <ArrowRight className="w-4 h-4 btn-arrow" />
        </a>
        <p className="mt-8 text-sm text-white/35 flex items-center justify-center gap-3 flex-wrap">
          {trustParts.map((part, i) => (
            <span key={i} className="flex items-center gap-3">
              {i > 0 && <span className="w-1 h-1 rounded-full bg-white/30" />}
              {part}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
