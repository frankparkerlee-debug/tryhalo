/**
 * BriefArticle — shared editorial wrapper for /brief/* article pages.
 *
 * Layout:
 *   - Pre-hero breadcrumb back to /brief index
 *   - Eyebrow (category · subcategory) + title + dek
 *   - Metadata strip (read time · published · last updated)
 *   - Optional accent stripe matching the brief's color
 *   - Article body slot (children) — author writes their own sections
 *   - "Continue reading" footer with up to 2 related briefs
 *
 * Keep prose components consistent across briefs; export them as helpers
 * (BriefH2, BriefBody, Pullquote, DataCallout) so individual pages stay
 * declarative.
 */

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

type RelatedBrief = {
  href: string;
  eyebrow: string;
  title: string;
  dek: string;
  accentColor?: string;
};

type BriefCTA = {
  /** Destination — usually /quiz/[program] or a specific program page. */
  href: string;
  /** Eyebrow label sitting above the CTA headline. */
  eyebrow: string;
  /** Editorial headline — keep to one line, serif voice. */
  headline: string;
  /** Supporting line under the headline (1–2 sentences). */
  body: string;
  /** Button label — imperative, short. */
  buttonLabel: string;
  /** Optional secondary link (e.g. "Learn more about the program"). */
  secondaryHref?: string;
  secondaryLabel?: string;
};

interface BriefArticleProps {
  eyebrow: string;
  title: string;
  dek: string;
  readTime: string;
  publishedAt: string;
  accentColor: string;
  category: "Data" | "Primer" | "Current event" | "Field note";
  related: RelatedBrief[];
  cta: BriefCTA;
  children: React.ReactNode;
}

export default function BriefArticle({
  eyebrow,
  title,
  dek,
  readTime,
  publishedAt,
  accentColor,
  category,
  related,
  cta,
  children,
}: BriefArticleProps) {
  return (
    <article className="bg-white">
      {/* Hero */}
      <header className="pt-28 md:pt-36 pb-12 md:pb-16 px-6 section-light">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/brief"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-halo-charcoal/45 hover:text-halo-charcoal/80 transition-colors mb-10"
          >
            <ArrowLeft className="w-3 h-3" />
            The Brief
          </Link>

          <p
            className="text-[10px] font-semibold uppercase tracking-[0.24em] mb-6"
            style={{ color: accentColor }}
          >
            {category} &middot; {eyebrow}
          </p>

          <h1
            className="font-serif font-light text-halo-charcoal leading-[1.05] tracking-tight mb-6"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              letterSpacing: "-0.025em",
            }}
          >
            {title}
          </h1>

          <p className="text-[17px] md:text-[19px] text-halo-charcoal/70 leading-[1.5] font-light max-w-[58ch]">
            {dek}
          </p>

          <div className="mt-10 pt-6 border-t border-halo-charcoal/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-halo-charcoal/55">
            <span className="inline-flex items-center gap-2">
              <span className="w-1 h-1 rounded-full" style={{ background: accentColor }} />
              <span className="font-semibold uppercase tracking-[0.18em]">
                {readTime}
              </span>
            </span>
            <span>Published {publishedAt}</span>
            <span className="text-halo-charcoal/35">
              By the Halo editorial team
            </span>
          </div>
        </div>
      </header>

      {/* Accent stripe — visual handoff between hero and body */}
      <div className="h-[2px] w-full" style={{ background: `${accentColor}33` }}>
        <div
          className="h-full max-w-3xl mx-auto"
          style={{ background: accentColor }}
        />
      </div>

      {/* Body */}
      <div className="py-14 md:py-20 px-6 section-light">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <div className="brief-prose">{children}</div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* CTA — end-of-article conversion. The accent color carries through
          from the article so the handoff feels coherent rather than tacked on. */}
      <section className="px-6 pb-16 md:pb-20 section-light">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <div
              className="relative overflow-hidden rounded-[24px] p-8 md:p-12"
              style={{
                background: `linear-gradient(140deg, ${accentColor}10 0%, ${accentColor}22 60%, ${accentColor}30 100%)`,
                border: `1px solid ${accentColor}33`,
              }}
            >
              {/* Decorative corner accent */}
              <div
                aria-hidden
                className="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none"
                style={{
                  background: accentColor,
                  filter: "blur(80px)",
                  opacity: 0.18,
                }}
              />

              <div className="relative">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.24em] mb-5"
                  style={{ color: accentColor }}
                >
                  {cta.eyebrow}
                </p>
                <h2
                  className="font-serif font-light text-halo-charcoal leading-[1.1] tracking-tight mb-4"
                  style={{
                    fontSize: "clamp(1.625rem, 3.4vw, 2.25rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {cta.headline}
                </h2>
                <p className="text-[15px] md:text-[16px] text-halo-charcoal/70 leading-relaxed mb-7 max-w-[52ch]">
                  {cta.body}
                </p>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link
                    href={cta.href}
                    className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[13px] font-semibold text-white transition-all hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.35)] hover:-translate-y-0.5"
                    style={{ background: accentColor }}
                  >
                    {cta.buttonLabel}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  {cta.secondaryHref && cta.secondaryLabel && (
                    <Link
                      href={cta.secondaryHref}
                      className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-halo-charcoal/75 hover:text-halo-charcoal border-b border-halo-charcoal/30 hover:border-halo-charcoal/70 pb-0.5 transition-colors"
                    >
                      {cta.secondaryLabel}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Related briefs */}
      {related.length > 0 && (
        <section className="py-16 md:py-20 px-6 section-light border-t border-halo-charcoal/[0.08]">
          <div className="max-w-5xl mx-auto">
            <p className="label-accent mb-3">Continue reading</p>
            <h2 className="headline-section text-2xl md:text-3xl text-halo-charcoal leading-tight mb-10 max-w-xl">
              More from The Brief.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group flex flex-col rounded-[20px] bg-white border border-halo-charcoal/[0.08] p-7 md:p-8 hover:border-halo-charcoal/20 hover:shadow-[0_18px_44px_-22px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all"
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-5"
                    style={{ color: r.accentColor ?? accentColor }}
                  >
                    {r.eyebrow}
                  </p>
                  <h3
                    className="font-serif font-light text-halo-charcoal leading-tight mb-3"
                    style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.75rem)", letterSpacing: "-0.02em" }}
                  >
                    {r.title}
                  </h3>
                  <p className="text-[14px] text-halo-charcoal/60 leading-relaxed flex-1">
                    {r.dek}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-semibold text-halo-charcoal/85 self-start border-b border-halo-charcoal/30 group-hover:border-halo-charcoal/60 pb-0.5 transition-colors">
                    Read the brief
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brief-prose typographic system — declared inline so the component
          stays self-contained. Tuned for editorial readability at 16-19px. */}
      <style>{`
        .brief-prose > * + * { margin-top: 1.4em; }
        .brief-prose p {
          font-size: 17px;
          line-height: 1.7;
          color: rgba(28, 30, 32, 0.85);
          letter-spacing: -0.005em;
        }
        @media (min-width: 768px) {
          .brief-prose p { font-size: 18px; line-height: 1.72; }
        }
        .brief-prose h2 {
          font-family: var(--font-playfair, serif);
          font-weight: 300;
          font-size: clamp(1.625rem, 3vw, 2.125rem);
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #1c1e20;
          margin-top: 2.4em;
          margin-bottom: 0.4em;
        }
        .brief-prose h3 {
          font-family: var(--font-playfair, serif);
          font-weight: 400;
          font-size: clamp(1.125rem, 1.8vw, 1.375rem);
          line-height: 1.25;
          color: #1c1e20;
          margin-top: 1.8em;
          margin-bottom: 0.3em;
        }
        .brief-prose ul {
          padding-left: 0;
          list-style: none;
        }
        .brief-prose ul li {
          padding-left: 1.5em;
          position: relative;
          font-size: 17px;
          line-height: 1.65;
          color: rgba(28, 30, 32, 0.82);
          margin-top: 0.75em;
        }
        .brief-prose ul li::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: ${accentColor};
          position: absolute;
          left: 0;
          top: 0.7em;
        }
        .brief-prose blockquote {
          border-left: 3px solid ${accentColor};
          padding: 0.4em 0 0.4em 1.5em;
          margin: 2em 0;
          font-family: var(--font-playfair, serif);
          font-weight: 300;
          font-size: clamp(1.25rem, 2.4vw, 1.625rem);
          line-height: 1.4;
          color: #1c1e20;
          letter-spacing: -0.015em;
        }
        .brief-prose blockquote cite {
          display: block;
          margin-top: 0.8em;
          font-family: var(--font-inter, sans-serif);
          font-size: 12px;
          font-weight: 600;
          font-style: normal;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(28, 30, 32, 0.5);
        }
        .brief-prose .data-callout {
          margin: 2em 0;
          padding: 1.6em 1.8em;
          border-radius: 18px;
          background: ${accentColor}10;
          border: 1px solid ${accentColor}33;
        }
        .brief-prose .data-callout .stat {
          font-family: var(--font-playfair, serif);
          font-weight: 300;
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1;
          letter-spacing: -0.03em;
          color: ${accentColor};
          display: block;
        }
        .brief-prose .data-callout .label {
          margin-top: 0.5em;
          font-size: 14px;
          line-height: 1.55;
          color: rgba(28, 30, 32, 0.75);
        }
        .brief-prose .data-callout .source {
          margin-top: 0.8em;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(28, 30, 32, 0.4);
        }
        .brief-prose strong { font-weight: 600; color: #1c1e20; }
        .brief-prose em { font-style: italic; }
        .brief-prose a {
          color: ${accentColor};
          text-decoration: none;
          border-bottom: 1px solid ${accentColor}55;
          transition: border-color 150ms ease;
        }
        .brief-prose a:hover { border-bottom-color: ${accentColor}; }
        .brief-prose .footnotes {
          margin-top: 3em;
          padding-top: 1.5em;
          border-top: 1px solid rgba(28, 30, 32, 0.1);
        }
        .brief-prose .footnotes p,
        .brief-prose .footnotes li {
          font-size: 13px;
          color: rgba(28, 30, 32, 0.55);
          line-height: 1.55;
        }
      `}</style>
    </article>
  );
}
