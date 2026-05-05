/**
 * LegalDocument — shared brand-v2.0 wrapper for legal pages.
 *
 * Used by /notice-of-privacy-practices, /terms-of-use, and any other
 * long-form legal page going forward. Renders a clean, scannable
 * editorial layout: eyebrow + headline + dek + effective-date strip +
 * prose body. Children compose the content via <Section>, <SubSection>,
 * <Definition>, etc. — small helpers exported here.
 *
 * Visual language matches the brief articles: serif headlines, sans-serif
 * body, sage system accent. No gold-accent v1 styling.
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ACCENT = "#5A6B82"; // slate — same persona used on /contact

interface LegalDocumentProps {
  eyebrow: string;
  title: string;
  dek?: string;
  effectiveDate: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export default function LegalDocument({
  eyebrow,
  title,
  dek,
  effectiveDate,
  lastUpdated,
  children,
}: LegalDocumentProps) {
  return (
    <article className="bg-white">
      {/* Hero */}
      <header className="pt-28 md:pt-36 pb-10 md:pb-14 px-6 section-light">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-halo-charcoal/45 hover:text-halo-charcoal/80 transition-colors mb-10"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Halo
          </Link>

          <p
            className="text-[10px] font-semibold uppercase tracking-[0.24em] mb-6"
            style={{ color: ACCENT }}
          >
            Legal &middot; {eyebrow}
          </p>

          <h1
            className="font-serif font-light text-halo-charcoal leading-[1.05] tracking-tight mb-6"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              letterSpacing: "-0.025em",
            }}
          >
            {title}
          </h1>

          {dek && (
            <p className="text-[16px] md:text-[17px] text-halo-charcoal/70 leading-[1.55] font-light max-w-[58ch] mb-8">
              {dek}
            </p>
          )}

          <div className="pt-5 border-t border-halo-charcoal/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-halo-charcoal/55">
            <span className="inline-flex items-center gap-2">
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: ACCENT }}
              />
              <span className="font-semibold uppercase tracking-[0.18em]">
                Effective {effectiveDate}
              </span>
            </span>
            {lastUpdated && <span>Last updated {lastUpdated}</span>}
          </div>
        </div>
      </header>

      {/* Accent stripe */}
      <div className="h-[2px] w-full" style={{ background: `${ACCENT}33` }}>
        <div
          className="h-full max-w-3xl mx-auto"
          style={{ background: ACCENT }}
        />
      </div>

      {/* Body */}
      <div className="py-12 md:py-16 px-6 section-light">
        <div className="max-w-3xl mx-auto">
          <div className="legal-prose">{children}</div>
        </div>
      </div>

      {/* Prose styles — declared inline so the wrapper stays self-contained */}
      <style>{`
        .legal-prose > section + section { margin-top: 2.5em; }
        .legal-prose p {
          font-size: 15px;
          line-height: 1.7;
          color: rgba(28, 30, 32, 0.78);
        }
        @media (min-width: 768px) {
          .legal-prose p { font-size: 16px; line-height: 1.72; }
        }
        .legal-prose p + p { margin-top: 1em; }
        .legal-prose h2 {
          font-family: var(--font-playfair, serif);
          font-weight: 400;
          font-size: clamp(1.375rem, 2.4vw, 1.625rem);
          line-height: 1.2;
          letter-spacing: -0.015em;
          color: #1c1e20;
          margin-bottom: 0.6em;
          padding-bottom: 0.4em;
          border-bottom: 1px solid rgba(28, 30, 32, 0.08);
        }
        .legal-prose h3 {
          font-family: var(--font-inter, sans-serif);
          font-weight: 600;
          font-size: 14px;
          line-height: 1.4;
          color: #1c1e20;
          letter-spacing: 0.02em;
          margin-top: 1.6em;
          margin-bottom: 0.4em;
        }
        .legal-prose ul,
        .legal-prose ol {
          padding-left: 0;
          margin-top: 0.8em;
          margin-bottom: 0.4em;
          list-style: none;
        }
        .legal-prose ul li,
        .legal-prose ol li {
          padding-left: 1.4em;
          position: relative;
          font-size: 15px;
          line-height: 1.65;
          color: rgba(28, 30, 32, 0.78);
          margin-top: 0.55em;
        }
        @media (min-width: 768px) {
          .legal-prose ul li,
          .legal-prose ol li { font-size: 16px; }
        }
        .legal-prose ul li::before {
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: ${ACCENT};
          position: absolute;
          left: 2px;
          top: 0.7em;
        }
        .legal-prose ol {
          counter-reset: legal-ol;
        }
        .legal-prose ol li {
          counter-increment: legal-ol;
        }
        .legal-prose ol li::before {
          content: counter(legal-ol) ".";
          color: ${ACCENT};
          font-weight: 600;
          font-size: 13px;
          position: absolute;
          left: 0;
          top: 0.05em;
        }
        .legal-prose strong { font-weight: 600; color: #1c1e20; }
        .legal-prose a {
          color: ${ACCENT};
          text-decoration: none;
          border-bottom: 1px solid ${ACCENT}55;
          transition: border-color 150ms ease;
        }
        .legal-prose a:hover { border-bottom-color: ${ACCENT}; }
        .legal-prose .legal-callout {
          margin: 1.4em 0;
          padding: 1.2em 1.4em;
          border-radius: 12px;
          background: ${ACCENT}0E;
          border: 1px solid ${ACCENT}26;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(28, 30, 32, 0.82);
        }
        .legal-prose .legal-callout strong { color: #1c1e20; }
        .legal-prose .legal-shout {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          line-height: 1.55;
          text-transform: uppercase;
          color: rgba(28, 30, 32, 0.85);
          padding: 1em 1.2em;
          background: rgba(28, 30, 32, 0.04);
          border-radius: 10px;
          margin: 1.4em 0;
        }
        .legal-prose dl {
          margin-top: 1em;
          display: grid;
          grid-template-columns: max-content 1fr;
          gap: 0.5em 1.5em;
          font-size: 14px;
        }
        .legal-prose dt {
          font-weight: 600;
          color: #1c1e20;
          white-space: nowrap;
        }
        .legal-prose dd {
          color: rgba(28, 30, 32, 0.78);
          margin: 0;
        }
      `}</style>
    </article>
  );
}
