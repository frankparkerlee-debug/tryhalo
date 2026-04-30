import Link from "next/link";
import { ArrowRight, TrendingDown } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata = {
  title: "The Brief — Halo",
  description:
    "Quick reads from the science of feeling better, longer. Data, primers, and current-event briefings from the Halo editorial team.",
};

const briefs = [
  {
    href: "/brief/nad-decline",
    eyebrow: "Data · Cellular energy",
    title: "Why NAD+ falls 50% by age 70.",
    dek: "Tissue NAD+ decline from age 30 to 70 — and the floor below which mitochondrial output stops keeping up.",
    accentColor: "#7B6B8F",
    readTime: "4 min read",
    isData: true,
  },
  {
    href: "/brief/biological-age",
    eyebrow: "Primer · Methodology",
    title: "Biological age, explained.",
    dek: "The methylation, phenotypic, and pace-of-aging clocks behind longevity intelligence — and which one Halo uses to project where you actually stand.",
    accentColor: "#8F7438",
    readTime: "90 second read",
  },
  {
    href: "/brief/fda-peptide-review",
    eyebrow: "Current event · Regulatory",
    title: "The 2026 FDA peptide review.",
    dek: "PCAC convenes July 23–24 to reclassify seven peptides — including BPC-157, KPV, and TB-500. What changes for your protocol when the verdict lands.",
    accentColor: "#C8A96E",
    readTime: "6 min read",
  },
];

export default function BriefIndexPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-12 md:pb-20 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <p className="label-accent mb-4">The Brief</p>
            <h1
              className="font-serif font-light text-halo-charcoal leading-[0.98] tracking-tight max-w-4xl"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "-0.03em" }}
            >
              What we&rsquo;re tracking.
            </h1>
            <p className="mt-6 text-[17px] md:text-[19px] text-halo-charcoal/60 leading-[1.5] font-light max-w-2xl">
              Quick reads from the science of feeling better, longer — pulled
              from the data we look at every quarter, the methodology we
              build on, and the regulatory shifts shaping what&rsquo;s next.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="section-divider" />

      {/* Brief grid */}
      <section className="py-16 md:py-20 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {briefs.map((b) => (
                <Link
                  key={b.href}
                  href={b.href}
                  className="aos-child group flex flex-col rounded-[20px] bg-white border border-halo-charcoal/[0.08] p-7 md:p-8 hover:border-halo-charcoal/20 hover:shadow-[0_18px_44px_-22px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all"
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-6"
                    style={{ color: b.accentColor }}
                  >
                    {b.eyebrow}
                  </p>
                  <div className="flex-1 flex flex-col">
                    <h2
                      className="font-serif font-light text-halo-charcoal leading-tight mb-3 inline-flex items-baseline gap-3"
                      style={{
                        fontSize: "clamp(1.5rem, 2.4vw, 1.875rem)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {b.isData && (
                        <TrendingDown
                          className="flex-shrink-0 self-center"
                          style={{
                            width: "0.75em",
                            height: "0.75em",
                            color: b.accentColor,
                          }}
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      )}
                      <span>{b.title}</span>
                    </h2>
                    <p className="text-[14px] text-halo-charcoal/65 leading-relaxed">
                      {b.dek}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-halo-charcoal/45">
                      {b.readTime}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-halo-charcoal/85 border-b border-halo-charcoal/30 group-hover:border-halo-charcoal/60 pb-0.5 transition-colors">
                      Read
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Editorial note */}
      <section className="py-16 md:py-24 px-6 section-light border-t border-halo-charcoal/[0.08]">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <p className="label-accent mb-3">Editorial note</p>
            <p className="font-serif font-light text-[20px] md:text-[24px] text-halo-charcoal/85 leading-[1.45] tracking-tight">
              The Brief publishes quarterly. We don&rsquo;t cover everything
              — only what changes the protocol. New issue when the data
              warrants it.
            </p>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
