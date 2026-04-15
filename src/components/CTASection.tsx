import { ArrowRight } from "lucide-react";
import Link from "next/link";
import AnimateOnScroll from "./AnimateOnScroll";

interface CTASectionProps {
  headline: string;
  subtext?: string;
  ctaText: string;
  ctaHref?: string;
  belowCta?: string;
}

export default function CTASection({
  headline,
  subtext,
  ctaText,
  ctaHref = "/#founding-circle",
  belowCta,
}: CTASectionProps) {
  return (
    <section className="py-20 px-6 section-dark">
      <AnimateOnScroll>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            {headline}
          </h2>
          {subtext && (
            <p className="text-lg text-white/50 mb-10 leading-relaxed">
              {subtext}
            </p>
          )}
          <Link href={ctaHref} className="btn-gold-filled">
            {ctaText}
            <ArrowRight className="w-4 h-4 btn-arrow" />
          </Link>
          {belowCta && (
            <p className="mt-5 text-sm text-white/30">{belowCta}</p>
          )}
        </div>
      </AnimateOnScroll>
    </section>
  );
}
