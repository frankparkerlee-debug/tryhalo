"use client";

import Link from "next/link";
import { ArrowRight, Check, X, Plus } from "lucide-react";
import { useState } from "react";
import FAQ from "@/components/FAQ";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import HaloPattern from "@/components/HaloPattern";
import HaloMarquee from "@/components/HaloMarquee";
import {
  applyFoundingDiscount,
  formatPrice,
  getProgram,
} from "@/lib/programs";

const TRT_PRICING = getProgram("trt")!.pricing;
const TRT_STD = formatPrice(TRT_PRICING.monthly);
const TRT_FOUNDING = formatPrice(applyFoundingDiscount(TRT_PRICING.monthly));

// Bundled-fee billing — three cadences derived from the canonical pricing data.
// Effective monthly = founding-discounted total / months. Quarterly currently
// matches monthly per-month rate (convenience play); annual carries a real
// per-month discount.
const TRT_MONTHLY_TOTAL = applyFoundingDiscount(TRT_PRICING.monthly);
const TRT_QUARTERLY_TOTAL = applyFoundingDiscount(TRT_PRICING.quarterly!);
const TRT_YEARLY_TOTAL = applyFoundingDiscount(TRT_PRICING.yearly!);
const TRT_QUARTERLY_PER_MO = Math.round(TRT_QUARTERLY_TOTAL / 3);
const TRT_YEARLY_PER_MO = Math.round(TRT_YEARLY_TOTAL / 12);
const TRT_YEARLY_SAVINGS_PCT = Math.round(
  (1 - TRT_YEARLY_PER_MO / TRT_MONTHLY_TOTAL) * 100
);

/* ==============================
   PERSONA — TRT = steel blue
   ============================== */
const PERSONA = "#4A7AB8";
const PERSONA_SOFT = "#8DA1B8";
const PERSONA_DEEP = "#3A5F94";

/* ==============================
   DATA
   ============================== */

const treatmentFormats = [
  {
    name: "Injection",
    desc: "Weekly subcutaneous",
    body: "The gold standard. Most precise dosing. Most studied. A small needle, once a week.",
    image: "/trt/format-injection.png",
    badge: "Most prescribed",
    bullets: [
      "Most consistent blood levels",
      "Once-weekly routine",
      "Needle-based",
    ],
  },
  {
    name: "Cream",
    desc: "Daily transdermal",
    body: "Applied to shoulders or upper arms. Smooth levels, no needles. Absorbs in minutes.",
    image: "/trt/format-cream.png",
    bullets: [
      "No needles",
      "Daily application",
      "Smooth 24-hour delivery",
    ],
  },
  {
    name: "Pill",
    desc: "Daily oral capsule",
    body: "Simple routine. No needles. A steady daily format that moves with your life.",
    image: "/trt/format-pill.png",
    bullets: [
      "No needles",
      "Pocketable daily capsule",
      "Fertility-preserving option",
    ],
  },
];

const impactStats = [
  {
    numberText: "25%",
    label: "decline in male testosterone since 1980.",
    source: "Travison et al., JCEM, 2007",
  },
  {
    numberText: "1 in 4",
    label: "men over 30. Hypogonadal. Most don\u2019t know.",
    source: "Araujo et al., JCEM, 2007",
  },
  {
    numberText: "5+ yrs",
    label: "average wait from symptom onset to first lab.",
    source: "Endocrine Society Statement, 2020",
  },
];

const outcomes = [
  {
    stat: "790",
    label: "Drive & libido",
    claim: "men studied. Significant improvements in sexual activity, desire, and erectile function on testosterone therapy over 12 months.",
    source: "Snyder et al., NEJM, 2016 (Testosterone Trials)",
    image: "/trt/life-drive.png",
  },
  {
    stat: "+4 lbs",
    label: "Body composition",
    claim: "lean mass gain (and ~6.6 lbs fat mass loss) in men with low testosterone over 3 years.",
    source: "Snyder et al., JCEM, 1999",
    image: "/trt/life-recovery.png",
  },
  {
    stat: "Up to 54%",
    label: "Anemia corrected",
    claim: "of anemic men with low testosterone had their anemia corrected after 12 months of therapy.",
    source: "Roy et al., JAMA Internal Medicine, 2017 (TTrials Anemia Trial)",
    image: "/trt/life-energy.png",
  },
];

const trtSteps = [
  {
    day: "Day 1",
    title: "Profile",
    desc: "Short intake. Symptoms, goals, history. Two minutes.",
  },
  {
    day: "Day 2\u20135",
    title: "Labs",
    desc: "Order sent to Quest or Labcorp. Walk in anytime.",
  },
  {
    day: "Day 6\u201310",
    title: "Consult",
    desc: "Video visit. Your physician walks the panel and designs your protocol.",
  },
  {
    day: "Day 11\u201314",
    title: "Delivery",
    desc: "Shipped from a US-licensed 503A pharmacy. Everything in one box.",
  },
];

/* Halo vs typical care comparison */
const comparisonRows = [
  { label: "Time to first physician visit", halo: "Under 10 days", typical: "4\u20138 weeks" },
  { label: "Hormone panel depth", halo: "12+ biomarkers", typical: "Total T only" },
  { label: "Protocol personalization", halo: "Calibrated to your labs", typical: "One-size protocol" },
  { label: "Follow-up monitoring", halo: "Labs at 90 days", typical: "Annual if requested" },
  { label: "Physician specialty", halo: "Hormone-trained", typical: "General practice" },
  { label: "Async physician access", halo: "Included", typical: "Not available" },
  { label: "Cancellation", halo: "Anytime, no contract", typical: "Referrals + insurance delays" },
];

/* Full biomarker panel — scrolling marquee */
const biomarkers = [
  "Total Testosterone",
  "Free Testosterone",
  "SHBG",
  "Estradiol",
  "LH",
  "FSH",
  "Prolactin",
  "DHEA-S",
  "Cortisol",
  "IGF-1",
  "HbA1c",
  "hs-CRP",
  "Ferritin",
  "Vitamin D",
  "TSH",
  "Free T3",
  "Free T4",
  "PSA",
  "Total Cholesterol",
  "HDL",
  "LDL",
  "Triglycerides",
  "CBC",
  "CMP",
];

/* Physician board — placeholder, swap with real profiles */
/* Featured physician — mirrors HRT pattern using existing home-page profile */
const featuredPhysician = {
  name: "Dr. James Rivera, DO",
  title: "Family Medicine · Men\u2019s Health",
  image: "/providers/james-rivera.png",
};

const faqItems = [
  {
    question: "Who is testosterone therapy for?",
    answer:
      "Men with clinically low testosterone, typically ages 30 to 65. Hypogonadism doesn\u2019t announce itself. Fatigue, low drive, poor recovery, brain fog, disrupted sleep, loss of strength. If you\u2019re feeling several of these, a full hormone panel is the first step.",
  },
  {
    question: "Will TRT shut down my natural production?",
    answer:
      "Exogenous testosterone suppresses LH and FSH signaling, which can reduce your body\u2019s own production. Some protocols include HCG to preserve testicular function. Your physician will walk the tradeoffs before you start.",
  },
  {
    question: "What about fertility?",
    answer:
      "Testosterone alone can reduce sperm production. If fertility matters, your physician may add HCG, or prescribe Enclomiphene, which stimulates your own production. First visit.",
  },
  {
    question: "Is TRT forever?",
    answer:
      "For most men with clinically low testosterone, yes. Stopping returns you to baseline. Protocols can be adjusted or tapered under physician supervision. You\u2019re never locked in.",
  },
  {
    question: "What do you test?",
    answer:
      "Total testosterone, free testosterone, SHBG, estradiol, LH, FSH, prolactin, CBC, CMP, lipid panel, PSA, thyroid. Follow-up at 90 days. Every adjustment is based on bloodwork.",
  },
  {
    question: "How fast will I feel it?",
    answer:
      "Energy and drive usually shift in 2\u20134 weeks. Body composition, strength, and recovery catch up over 8\u201312 weeks as levels stabilize.",
  },
  {
    question: "Can I switch formats later?",
    answer:
      "Yes. Injection to cream, cream to injection, any time. Same medicine, different delivery.",
  },
  {
    question: "Cancel anytime?",
    answer:
      "Yes. No contracts. Cancel through your member portal or by emailing your care team. Your prescription continues through the current shipment cycle.",
  },
];

const trtMarqueeItems = [
  { symptom: "Low Drive", outcome: "Motivation" },
  { symptom: "3pm Crash", outcome: "Sustained Energy" },
  { symptom: "Brain Fog", outcome: "Clarity" },
  { symptom: "Poor Recovery", outcome: "Rebuilt Strength" },
  { symptom: "Disrupted Sleep", outcome: "Deep Rest" },
  { symptom: "Low Libido", outcome: "Drive Back" },
];

/* ==============================
   BIOMARKER SCROLL — fluid motion element
   ============================== */

function BiomarkerScroll() {
  // duplicate list for seamless loop
  const items = [...biomarkers, ...biomarkers];
  return (
    <div
      className="relative overflow-hidden py-10 md:py-14"
      style={{ background: "#0F1217" }}
    >
      <div className="text-center mb-8 px-6">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3"
          style={{ color: PERSONA_SOFT }}
        >
          What we test
        </p>
        <h3 className="font-serif text-2xl md:text-3xl text-white leading-[1.15] tracking-tight max-w-2xl mx-auto">
          Every protocol starts with a full hormone panel.{" "}
          <span className="italic text-white/55">
            Not total T alone.
          </span>
        </h3>
      </div>

      {/* Scrolling row 1 */}
      <div className="relative mb-4 marquee-mask">
        <div className="marquee-track-right flex gap-3 md:gap-4 whitespace-nowrap">
          {items.map((m, i) => (
            <span
              key={`r1-${i}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] md:text-[12px] font-medium text-white/75 flex-shrink-0"
              style={{ borderColor: "rgba(141,161,184,0.25)", background: "rgba(74,122,184,0.06)" }}
            >
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: PERSONA }}
              />
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Scrolling row 2, offset direction */}
      <div className="relative marquee-mask">
        <div className="marquee-track-left flex gap-3 md:gap-4 whitespace-nowrap">
          {items.map((m, i) => (
            <span
              key={`r2-${i}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] md:text-[12px] font-medium flex-shrink-0"
              style={{
                background: "rgba(74,122,184,0.12)",
                color: PERSONA_SOFT,
              }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-mask {
          mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
        }
        .marquee-track-right {
          animation: scroll-right 60s linear infinite;
          width: max-content;
        }
        .marquee-track-left {
          animation: scroll-left 75s linear infinite;
          width: max-content;
        }
        @keyframes scroll-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-left {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track-right,
          .marquee-track-left {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/* ==============================
   OUTCOME PICKER — interactive cross-sell
   ============================== */

const trtOutcomePicks = [
  {
    id: "energy",
    label: "Energy through the day",
    sub: "Mornings that don't take 30 minutes to start. No 3pm crash.",
    image: "/trt/life-energy.png",
    biomarkers: ["Free testosterone", "Cortisol", "Ferritin", "TSH"],
  },
  {
    id: "recovery",
    label: "Recovery in 24 hours",
    sub: "Training hard without paying for it for a week.",
    image: "/trt/life-recovery.png",
    biomarkers: ["IGF-1", "hs-CRP", "Creatine kinase", "Hematocrit"],
  },
  {
    id: "composition",
    label: "A body that responds again",
    sub: "Strength returning. Composition shifting.",
    image: "/trt/life-drive.png",
    biomarkers: ["Lean mass", "Body fat", "HbA1c", "ApoB"],
  },
];

function OutcomePicker() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hasInteracted, setHasInteracted] = useState(false);

  const toggle = (id: string) => {
    setHasInteracted(true);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const picks = trtOutcomePicks.filter((o) => selected.has(o.id));
  const biomarkerSet = Array.from(new Set(picks.flatMap((o) => o.biomarkers)));
  const hasPicks = selected.size > 0;
  const quizHref = hasPicks
    ? `/quiz/trt?outcomes=${Array.from(selected).join(",")}`
    : "/quiz/trt";

  return (
    <div>
      <style jsx>{`
        @keyframes haloOutcomePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(74,122,184,0.55); }
          50% { transform: scale(1.08); box-shadow: 0 0 0 10px rgba(74,122,184,0); }
        }
        .halo-outcome-pulse {
          animation: haloOutcomePulse 2.2s ease-in-out infinite;
        }
        .halo-outcome-tile:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 40px -22px rgba(58,95,148,0.35);
        }
        @media (prefers-reduced-motion: reduce) {
          .halo-outcome-pulse { animation: none; }
          .halo-outcome-tile:hover { transform: none; }
        }
      `}</style>

      {/* Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {trtOutcomePicks.map((o, idx) => {
          const isSelected = selected.has(o.id);
          const shouldPulse = !hasInteracted && idx === 0;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => toggle(o.id)}
              aria-pressed={isSelected}
              className="halo-outcome-tile group overflow-hidden text-left rounded-[20px]"
              style={{
                background: isSelected ? "#1F2940" : "#FFFFFF",
                color: isSelected ? "#F8F8FA" : "#1C1C1E",
                border: isSelected
                  ? `1px solid ${PERSONA_DEEP}`
                  : "1px solid rgba(28,28,30,0.08)",
                cursor: "pointer",
                boxShadow: isSelected
                  ? `0 12px 32px -16px rgba(58,95,148,0.45)`
                  : "0 2px 8px -2px rgba(0,0,0,0.04)",
                transform: isSelected ? "translateY(-2px)" : "translateY(0)",
                transition:
                  "transform 250ms ease, box-shadow 250ms ease, background 250ms ease",
              }}
            >
              <div className="relative aspect-[5/4] bg-halo-charcoal/[0.04]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={o.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    filter: isSelected
                      ? "contrast(1.05) saturate(0.7) brightness(0.85)"
                      : "none",
                    transition: "filter 250ms",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                {isSelected && (
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(155deg, rgba(74,122,184,0.35) 0%, rgba(15,17,21,0.15) 60%)`,
                      mixBlendMode: "multiply",
                    }}
                  />
                )}
                {/* Add / Check pill */}
                <span
                  className={`halo-outcome-pill ${shouldPulse ? "halo-outcome-pulse" : ""}`}
                  style={{
                    position: "absolute",
                    top: "0.875rem",
                    right: "0.875rem",
                    minWidth: "44px",
                    height: "40px",
                    padding: isSelected ? "0" : "0 0.875rem",
                    borderRadius: "999px",
                    background: isSelected ? PERSONA : "rgba(255,255,255,0.96)",
                    color: isSelected ? "#fff" : "#1C1C1E",
                    border: isSelected
                      ? `1px solid ${PERSONA}`
                      : `1px solid rgba(28,28,30,0.10)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.375rem",
                    backdropFilter: "blur(6px)",
                    boxShadow: "0 4px 16px -4px rgba(15,17,21,0.18)",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {isSelected ? (
                    <Check className="w-4 h-4" style={{ color: "#fff" }} strokeWidth={3} />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" strokeWidth={2.5} />
                      <span>Add</span>
                    </>
                  )}
                </span>
              </div>
              <div className="px-5 py-5 md:px-6 md:py-6">
                <h3
                  className="font-serif leading-tight tracking-tight mb-1.5"
                  style={{
                    fontSize: "clamp(1.125rem, 1.4vw, 1.375rem)",
                  }}
                >
                  {o.label}
                </h3>
                <p
                  className="text-[13px] md:text-[14px] leading-relaxed mb-4"
                  style={{
                    color: isSelected ? "rgba(248,248,250,0.65)" : "rgba(28,28,30,0.55)",
                  }}
                >
                  {o.sub}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {o.biomarkers.map((b) => (
                    <span
                      key={b}
                      style={{
                        fontSize: "0.6875rem",
                        color: isSelected ? PERSONA_SOFT : PERSONA,
                        background: isSelected
                          ? "rgba(141,161,184,0.15)"
                          : `${PERSONA}10`,
                        border: `1px solid ${
                          isSelected ? "rgba(141,161,184,0.30)" : `${PERSONA}25`
                        }`,
                        padding: "0.25rem 0.625rem",
                        borderRadius: "999px",
                        fontWeight: 500,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Response panel */}
      <div
        className="mt-6 rounded-[20px] transition-all"
        style={{
          background: hasPicks
            ? `linear-gradient(155deg, ${PERSONA_DEEP} 0%, #1F2940 100%)`
            : "#FFFFFF",
          color: hasPicks ? "#F8F8FA" : "rgba(28,28,30,0.55)",
          border: hasPicks
            ? "1px solid transparent"
            : "1px solid rgba(28,28,30,0.08)",
          padding: hasPicks ? "1.75rem" : "1.25rem 1.5rem",
          boxShadow: hasPicks
            ? "0 24px 60px -32px rgba(58,95,148,0.35)"
            : "none",
        }}
      >
        {!hasPicks ? (
          <p className="text-[13px] md:text-[14px] leading-relaxed">
            Tap an outcome above to see which biomarkers Halo would prioritize for you — and your protocol&rsquo;s starting point.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_auto] gap-5 md:gap-8 items-start">
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3"
                style={{ color: PERSONA_SOFT }}
              >
                Halo would prioritize
              </p>
              <div className="flex flex-wrap gap-1.5">
                {biomarkerSet.map((b) => (
                  <span
                    key={b}
                    style={{
                      fontSize: "0.75rem",
                      color: "#F8F8FA",
                      background: "rgba(141,161,184,0.20)",
                      border: `1px solid rgba(141,161,184,0.34)`,
                      padding: "0.3125rem 0.75rem",
                      borderRadius: "999px",
                      fontWeight: 500,
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href={quizHref}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 self-center justify-self-start md:justify-self-end whitespace-nowrap"
              style={{ background: "#F8F8FA", color: "#1C1C1E", letterSpacing: "0.01em" }}
            >
              Continue with these
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==============================
   TESTOSTERONE DECLINE CHART
   ============================== */

function TestosteroneChart() {
  const ages = ["25", "35", "40", "45", "50", "55"];
  const natural = [92, 80, 68, 55, 42, 30];

  const W = 620;
  const H = 320;
  const px = 56;
  const pyTop = 52;
  const pyBot = 60;
  const plotW = W - px * 2;
  const plotH = H - pyTop - pyBot;

  const points = natural.map((val, i) => ({
    x: px + (i / (natural.length - 1)) * plotW,
    y: pyTop + ((100 - val) / 100) * plotH,
    val,
  }));

  const rangeTop = pyTop + ((100 - 75) / 100) * plotH;
  const rangeBot = pyTop + ((100 - 55) / 100) * plotH;

  const smoothPath = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const cpx = (prev.x + p.x) / 2;
      return `C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
    })
    .join(" ");

  const areaPath = `${smoothPath} L ${points[points.length - 1].x} ${pyTop + plotH} L ${points[0].x} ${pyTop + plotH} Z`;

  return (
    <div className="w-full">
      <div
        className="relative rounded-[20px] border border-halo-charcoal/[0.08] p-6 md:p-8"
        style={{
          background: "linear-gradient(180deg, #F7FAFC 0%, #E8EFF7 100%)",
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" aria-label="Testosterone decline with age and therapeutic range">
          <defs>
            <linearGradient id="range-band-trt" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={PERSONA} stopOpacity="0.22" />
              <stop offset="100%" stopColor={PERSONA} stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="decline-fill-trt" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#6F6355" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#6F6355" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((frac) => {
            const y = pyTop + plotH * frac;
            return (
              <line key={frac} x1={px} y1={y} x2={W - px} y2={y} stroke="rgba(28,28,30,0.04)" strokeWidth="1" />
            );
          })}

          <rect x={px} y={rangeTop} width={plotW} height={rangeBot - rangeTop} fill="url(#range-band-trt)" rx="3" />
          <text x={W - px - 8} y={rangeTop + (rangeBot - rangeTop) / 2 + 4} textAnchor="end" fontSize="11" fontWeight="700" letterSpacing="2.5" fill={PERSONA}>
            TRT THERAPEUTIC RANGE
          </text>
          <circle cx={px} cy={(rangeTop + rangeBot) / 2} r="3" fill={PERSONA} opacity="0.8" />
          <line x1={px + 4} y1={(rangeTop + rangeBot) / 2} x2={px + 18} y2={(rangeTop + rangeBot) / 2} stroke={PERSONA} strokeWidth="1" opacity="0.4" />

          <path d={areaPath} fill="url(#decline-fill-trt)" />
          <path d={smoothPath} fill="none" stroke="#6F6355" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="8" fill="#6F6355" opacity="0.12" />
              <circle cx={p.x} cy={p.y} r="4.5" fill="white" stroke="#6F6355" strokeWidth="2" />
            </g>
          ))}

          <text x={points[0].x + 14} y={points[0].y - 14} fontSize="11" fontWeight="700" letterSpacing="2" fill="#5A5145">
            NATURAL DECLINE
          </text>

          {ages.map((age, i) => {
            const x = px + (i / (ages.length - 1)) * plotW;
            return (
              <g key={age}>
                <line x1={x} y1={H - pyBot + 4} x2={x} y2={H - pyBot + 8} stroke="rgba(28,28,30,0.2)" strokeWidth="1" />
                <text x={x} y={H - pyBot + 24} textAnchor="middle" fontSize="12" fontWeight="500" fill="rgba(28,28,30,0.65)">
                  {age}
                </text>
              </g>
            );
          })}

          <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="10" fontWeight="600" letterSpacing="2.5" fill="rgba(28,28,30,0.45)">
            AGE
          </text>
          <text x={px} y={pyTop - 20} fontSize="10" fontWeight="600" letterSpacing="2.5" fill="rgba(28,28,30,0.55)">
            TOTAL TESTOSTERONE
          </text>
        </svg>

        <p className="text-[11px] italic text-halo-charcoal/45 mt-5 leading-relaxed">
          Clinical reference ranges for total serum testosterone. Therapeutic targets vary by patient. &mdash; Bhasin et al., Endocrine Society Guidelines, 2018.
        </p>
      </div>
    </div>
  );
}

/* ==============================
   FORMAT CARD — with pricing + bullets + badge
   ============================== */

/* ==============================
   FORMAT ACCORDION — split-screen, image swaps with selection
   ============================== */

function FormatAccordion() {
  const [expanded, setExpanded] = useState<string>(treatmentFormats[0].name);
  const [imageFailed, setImageFailed] = useState<Record<string, boolean>>({});
  const active = treatmentFormats.find((f) => f.name === expanded) ?? treatmentFormats[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 rounded-[22px] overflow-hidden border border-halo-charcoal/[0.08] bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.18)]">
      {/* LEFT — image panel that swaps with the expanded format */}
      <div
        className="relative min-h-[420px] lg:min-h-[520px] overflow-hidden"
        style={{
          background: `linear-gradient(145deg, #F5F1EA 0%, ${PERSONA_SOFT}40 60%, ${PERSONA}30 100%)`,
        }}
      >
        {treatmentFormats.map((f) => {
          const isActive = f.name === active.name;
          const failed = imageFailed[f.name];
          return (
            <div
              key={f.name}
              className="absolute inset-0 transition-opacity duration-500"
              style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? "auto" : "none" }}
              aria-hidden={!isActive}
            >
              {!failed && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={f.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => setImageFailed((s) => ({ ...s, [f.name]: true }))}
                />
              )}
            </div>
          );
        })}
        {/* Bottom gradient + label overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, transparent 55%, rgba(15,17,21,0.55) 100%)",
          }}
        />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5"
            style={{ color: PERSONA_SOFT }}
          >
            {active.desc}
          </p>
          <h3 className="font-serif text-[28px] md:text-[32px] leading-tight tracking-tight">
            {active.name}
          </h3>
          {active.badge && (
            <span
              className="inline-block mt-3 text-[9px] font-semibold uppercase tracking-[0.22em] px-2.5 py-1 rounded-full"
              style={{ background: PERSONA, color: "white" }}
            >
              {active.badge}
            </span>
          )}
        </div>
      </div>

      {/* RIGHT — accordion stack */}
      <div className="bg-white">
        {treatmentFormats.map((f, idx) => {
          const isExpanded = expanded === f.name;
          const isLast = idx === treatmentFormats.length - 1;
          return (
            <div
              key={f.name}
              style={{
                borderBottom: isLast ? "none" : "1px solid rgba(28,28,30,0.08)",
                background: isExpanded ? "#FAF8F4" : "white",
                transition: "background 200ms",
              }}
            >
              <button
                type="button"
                onClick={() => setExpanded(f.name)}
                aria-expanded={isExpanded}
                className="w-full text-left flex items-center gap-4"
                style={{
                  padding: "1.375rem 1.75rem",
                  cursor: isExpanded ? "default" : "pointer",
                  background: "transparent",
                  border: "none",
                }}
              >
                <span
                  className="font-mono text-[12px] tracking-[0.16em] font-semibold flex-shrink-0"
                  style={{ color: PERSONA, width: "32px" }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-serif text-[20px] md:text-[22px] leading-tight tracking-tight text-halo-charcoal">
                  {f.name}
                </span>
                <span
                  className="hidden sm:inline font-mono text-[10px] tracking-[0.14em] uppercase font-semibold flex-shrink-0"
                  style={{ color: "rgba(28,28,30,0.55)" }}
                >
                  {f.desc}
                </span>
                <span
                  className="flex items-center justify-center flex-shrink-0 rounded-full"
                  style={{
                    width: "26px",
                    height: "26px",
                    background: isExpanded ? PERSONA : "transparent",
                    border: isExpanded ? `1px solid ${PERSONA}` : "1px solid rgba(28,28,30,0.18)",
                    color: isExpanded ? "#fff" : "rgba(28,28,30,0.55)",
                    transition: "all 200ms",
                  }}
                >
                  {isExpanded ? (
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="3" y1="3" x2="11" y2="11" />
                      <line x1="11" y1="3" x2="3" y2="11" />
                    </svg>
                  ) : (
                    <Plus className="w-3 h-3" />
                  )}
                </span>
              </button>

              {isExpanded && (
                <div style={{ padding: "0 1.75rem 1.5rem 4.25rem" }}>
                  <p className="text-[14px] text-halo-charcoal/70 leading-relaxed mb-4">
                    {f.body}
                  </p>
                  <ul className="m-0 p-0 list-none mb-4">
                    {f.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2.5 mb-2 text-[13px] text-halo-charcoal/85 leading-relaxed"
                      >
                        <Check
                          className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                          style={{ color: PERSONA }}
                          strokeWidth={2.5}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div
                    className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full"
                    style={{
                      background: `${PERSONA}10`,
                      color: PERSONA_DEEP,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: PERSONA }} />
                    Full lab panel included
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FormatCard({ format }: { format: (typeof treatmentFormats)[number] }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <div className="group relative rounded-[20px] border border-halo-charcoal/[0.08] bg-white overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.22)] hover:-translate-y-1">
      {/* Badge */}
      {format.badge && (
        <span
          className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-[0.18em]"
          style={{
            background: PERSONA,
            color: "white",
          }}
        >
          <span className="w-1 h-1 rounded-full bg-white" />
          {format.badge}
        </span>
      )}

      {/* Image */}
      <div
        className="relative aspect-[4/5] flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(145deg, #F5F1EA 0%, ${PERSONA_SOFT}40 60%, ${PERSONA}30 100%)`,
        }}
      >
        {!imageFailed && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={format.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setImageFailed(true)}
          />
        )}
        {imageFailed && (
          <div className="flex flex-col items-center gap-2 opacity-40" aria-hidden="true">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: PERSONA_DEEP }}>
              Halo
            </span>
            <span className="font-serif text-[22px] italic" style={{ color: PERSONA_DEEP }}>
              {format.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        <div className="mb-1">
          <h3 className="font-serif text-[22px] text-halo-charcoal leading-tight tracking-tight">
            {format.name}
          </h3>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: PERSONA }}>
          {format.desc}
        </p>

        <ul className="space-y-2 mb-5">
          {format.bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 text-[13px] text-halo-charcoal/70 leading-snug"
            >
              <Check
                className="w-3.5 h-3.5 flex-shrink-0 mt-[3px]"
                strokeWidth={2.5}
                style={{ color: PERSONA }}
              />
              {b}
            </li>
          ))}
        </ul>

        <div
          className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] px-3 py-2 rounded-full mb-5"
          style={{
            background: `${PERSONA}10`,
            color: PERSONA_DEEP,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: PERSONA }}
          />
          Full lab panel included
        </div>

        <Link
          href="/quiz/trt"
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-halo-charcoal/20 text-halo-charcoal font-semibold text-[13px] hover:border-halo-charcoal/50 transition-colors"
        >
          Get started
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

/* ==============================
   OUTCOME CARD — with life-moment image
   ============================== */

function OutcomeCard({ outcome }: { outcome: (typeof outcomes)[number] }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <div className="flex flex-col">
      <div
        className="relative aspect-[4/5] rounded-[20px] overflow-hidden mb-6"
        style={{
          background: `linear-gradient(145deg, #F5F1EA 0%, ${PERSONA_SOFT}60 100%)`,
        }}
      >
        {!imageFailed && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={outcome.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>

      <div>
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-3"
          style={{ color: PERSONA }}
        >
          {outcome.label}
        </p>
        <div className="flex items-baseline gap-3 mb-3">
          <span
            className="font-serif text-[56px] md:text-[64px] font-light leading-none tracking-tight"
            style={{ color: PERSONA_DEEP }}
          >
            {outcome.stat}
          </span>
          <span
            className="w-8 h-px"
            style={{ background: PERSONA, opacity: 0.4 }}
            aria-hidden="true"
          />
        </div>
        <p className="text-[14px] text-halo-charcoal/70 leading-relaxed">
          {outcome.claim}
        </p>
        <p className="text-[11px] italic text-halo-charcoal/40 mt-3">
          {outcome.source}
        </p>
      </div>
    </div>
  );
}

/* ==============================
   COMPARISON TABLE — Halo vs typical
   ============================== */

/* Champagne accent — used ONLY for the literal halo metaphor on this
   comparison table. Not a system color. */
const HALO_GOLD = "#C9A862";
const HALO_GOLD_SOFT = "#E5D49C";

function ComparisonTable() {
  return (
    <div className="relative" style={{ paddingTop: "22px" }}>
      {/* Halo crown — champagne pill above the Halo column header */}
      <div
        aria-hidden
        className="absolute z-20 pointer-events-none"
        style={{
          top: "0",
          left: "calc(1.3fr / (1.3fr + 1fr + 1fr) * 100%)", // visual placeholder; overridden by inline left below
          // Above values are illustrative — actual centering handled via flex
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Center the badge over the Halo column area: column starts at 1.3/3.3 ≈ 39.4%, ends at 2.3/3.3 ≈ 69.7%, so center ≈ 54.5% */}
        <div
          style={{
            position: "absolute",
            left: "54.5%",
            transform: "translateX(-50%)",
            top: 0,
          }}
        >
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-[0.28em] whitespace-nowrap rounded-full"
            style={{
              padding: "0.5rem 1rem",
              color: "#1F2940",
              background: `linear-gradient(135deg, ${HALO_GOLD_SOFT} 0%, ${HALO_GOLD} 100%)`,
              boxShadow: `0 0 0 4px rgba(201,168,98,0.18), 0 12px 28px -10px rgba(201,168,98,0.6)`,
              border: `1px solid ${HALO_GOLD}`,
            }}
          >
            ◯ The Halo treatment
          </span>
        </div>
      </div>

      {/* Ambient champagne glow strip behind Halo column */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "10px",
          bottom: "-8px",
          left: "calc((1.3 / 3.3) * 100%)",
          width: "calc((1 / 3.3) * 100%)",
          background: `radial-gradient(120% 50% at 50% 0%, rgba(201,168,98,0.30) 0%, rgba(201,168,98,0) 70%), linear-gradient(180deg, rgba(201,168,98,0.12) 0%, rgba(201,168,98,0.02) 50%, rgba(201,168,98,0.10) 100%)`,
          filter: "blur(8px)",
          zIndex: 0,
        }}
      />

      <div
        className="relative rounded-[22px] overflow-hidden border border-halo-charcoal/[0.08] bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.12)]"
        style={{ zIndex: 1 }}
      >
        {/* Column headers */}
        <div className="grid grid-cols-[1.3fr_1fr_1fr] border-b border-halo-charcoal/[0.08]">
          <div className="p-4 md:p-5 flex items-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/40">
              Compare
            </span>
          </div>
          <div
            className="p-4 md:p-6 flex items-center justify-center text-center relative"
            style={{
              background: `${PERSONA}14`,
              borderTop: `3px solid ${HALO_GOLD}`,
              borderLeft: `3px solid ${HALO_GOLD}`,
              borderRight: `3px solid ${HALO_GOLD}`,
              boxShadow: `0 -10px 28px -8px rgba(201,168,98,0.32), inset 0 1.5px 0 rgba(229,212,156,0.35)`,
            }}
          >
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{
                    background: HALO_GOLD,
                    boxShadow: `0 0 10px ${HALO_GOLD}`,
                  }}
                  aria-hidden
                />
                <p className="font-serif text-[18px] md:text-[20px] font-semibold leading-tight tracking-tight" style={{ color: PERSONA_DEEP }}>
                  Halo
                </p>
              </div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em]" style={{ color: PERSONA }}>
                Your protocol
              </p>
            </div>
          </div>
          <div className="p-4 md:p-5 flex items-center justify-center text-center">
            <div>
              <p className="font-serif text-[16px] md:text-[18px] text-halo-charcoal/70 leading-tight tracking-tight">
                Typical care
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/40">
                PCP / urgent care
              </p>
            </div>
          </div>
        </div>

        {/* Rows */}
        {comparisonRows.map((row, i) => {
          const isLast = i === comparisonRows.length - 1;
          return (
            <div
              key={row.label}
              className={`grid grid-cols-[1.3fr_1fr_1fr] ${
                !isLast ? "border-b border-halo-charcoal/[0.06]" : ""
              }`}
            >
              <div className="p-4 md:p-5 text-[13px] md:text-[14px] text-halo-charcoal/80 font-medium">
                {row.label}
              </div>
              <div
                className="p-4 md:p-5 text-center text-[13px] md:text-[14px] font-semibold"
                style={{
                  background: i % 2 === 0 ? "rgba(201,168,98,0.10)" : "rgba(201,168,98,0.06)",
                  color: PERSONA_DEEP,
                  borderLeft: `3px solid ${HALO_GOLD}`,
                  borderRight: `3px solid ${HALO_GOLD}`,
                  borderBottom: isLast ? `3px solid ${HALO_GOLD}` : "none",
                  boxShadow: isLast ? `0 12px 36px -8px rgba(201,168,98,0.4)` : "none",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <span className="inline-flex items-center gap-1.5 justify-center">
                  <Check className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} style={{ color: PERSONA }} />
                  {row.halo}
                </span>
              </div>
              <div className="p-4 md:p-5 text-center text-[13px] md:text-[14px] text-halo-charcoal/55">
                <span className="inline-flex items-center gap-1.5 justify-center">
                  <X className="w-3.5 h-3.5 flex-shrink-0 text-halo-charcoal/30" strokeWidth={2.5} />
                  {row.typical}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==============================
   PAGE
   ============================== */

type Cadence = "monthly" | "quarterly" | "yearly";

export default function TestosteroneTherapyPage() {
  const [selectedCadence, setSelectedCadence] = useState<Cadence>("quarterly");
  const quizHref = `/quiz/trt?cadence=${selectedCadence}`;

  return (
    <>
      {/* ═══════════════════════════════════════════════
          1 · HERO — Portrait + content
          ═══════════════════════════════════════════════ */}
      <section className="relative section-light overflow-hidden">
        {/* Subtle radial wash — depth without color noise */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(80% 60% at 70% 30%, ${PERSONA}14 0%, transparent 60%), radial-gradient(60% 40% at 20% 20%, rgba(107,139,130,0.08) 0%, transparent 50%)`,
          }}
        />

        {/* Bento hero — 4 cards: hero text · portrait · data point · informational */}
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-10 md:pt-14 lg:pt-16 pb-10">
          <div
            className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4"
          >
            {/* HERO TEXT CARD — top-left, dominant */}
            <div
              className="lg:col-span-7 lg:row-span-1 rounded-[24px] bg-white border border-halo-charcoal/[0.06] p-7 md:p-10 lg:p-12 flex flex-col justify-end"
              style={{ minHeight: "380px" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="block w-8 h-px"
                  style={{ background: PERSONA }}
                  aria-hidden
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: PERSONA }}>
                  Testosterone Therapy
                </span>
              </div>

              <h1
                className="headline-hero text-halo-charcoal leading-[0.95] tracking-tight mb-5"
                style={{
                  fontSize: "clamp(2.5rem, 5.2vw, 4.25rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                Back to your peak.
              </h1>

              <p className="text-[16px] md:text-[17px] leading-relaxed mb-7 max-w-lg" style={{ color: "rgba(28,28,30,0.65)" }}>
                For men 35&ndash;65 who feel the difference. A physician designs the protocol around your actual labs and recalibrates every quarter.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
                <Link
                  href="/quiz/trt"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-medium text-sm transition-all hover:brightness-95"
                  style={{
                    backgroundColor: "#1C1C1E",
                    letterSpacing: "0.01em",
                  }}
                >
                  See where you stand
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#protocol"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-halo-charcoal"
                  style={{ borderBottom: `1px solid #1C1C1E`, paddingBottom: "2px" }}
                >
                  Read what&rsquo;s in the protocol
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* PORTRAIT CARD — right column, spans full bento height */}
            <div
              className="lg:col-span-5 lg:row-span-2 relative overflow-hidden rounded-[24px]"
              style={{
                background: PERSONA_DEEP,
                minHeight: "380px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/trt/hero-portrait.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectPosition: "center 25%",
                  filter: "contrast(1.05) saturate(0.7) brightness(0.92)",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(155deg, ${PERSONA}3D 0%, rgba(15,17,21,0.05) 45%, rgba(15,17,21,0.45) 100%)`,
                  mixBlendMode: "multiply",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(120% 90% at 50% 30%, transparent 55%, rgba(15,17,21,0.4) 100%)",
                }}
              />
            </div>

            {/* DATA POINT CARD — bottom-left, charcoal */}
            <div
              className="lg:col-span-3 rounded-[24px] p-6 md:p-7 flex flex-col justify-between text-white relative overflow-hidden"
              style={{
                background: `linear-gradient(155deg, #2A2826 0%, #1C1817 100%)`,
                minHeight: "200px",
              }}
            >
              <div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                  style={{ color: PERSONA_SOFT }}
                >
                  To felt change
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5 mb-1.5">
                  <span
                    className="font-serif font-light leading-none text-white"
                    style={{
                      fontSize: "clamp(3.5rem, 6vw, 5rem)",
                      letterSpacing: "-0.04em",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    3
                  </span>
                  <span
                    className="text-[14px] md:text-[16px]"
                    style={{ color: PERSONA_SOFT }}
                  >
                    weeks
                  </span>
                </div>
                <p className="text-[12px] text-white/65 leading-snug">
                  Energy, drive, and sleep respond first. Saad et al · J Andrology 2011.
                </p>
              </div>
            </div>

            {/* INFORMATIONAL CARD — bottom-middle, cream */}
            <div
              className="lg:col-span-4 rounded-[24px] p-6 md:p-7 flex flex-col justify-between"
              style={{
                background: "#F0EBE0",
                minHeight: "200px",
              }}
            >
              <div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                  style={{ color: PERSONA }}
                >
                  What we measure
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span
                    className="font-serif font-light leading-none text-halo-charcoal"
                    style={{
                      fontSize: "clamp(3rem, 5vw, 4.25rem)",
                      letterSpacing: "-0.035em",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    60+
                  </span>
                  <span className="text-[14px] md:text-[16px] text-halo-charcoal/55">
                    biomarkers
                  </span>
                </div>
                <p className="text-[12px] text-halo-charcoal/65 leading-snug">
                  Across hormonal, metabolic, cardiovascular, and inflammatory systems &mdash; every quarterly draw.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip — full-bleed below the bento */}
        <div className="relative border-t border-halo-charcoal/[0.08] bg-white/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/60">
            <span>Board-certified physicians</span>
            <span className="text-halo-charcoal/20">&middot;</span>
            <span>US-licensed 503A pharmacy</span>
            <span className="text-halo-charcoal/20">&middot;</span>
            <span>HIPAA secure</span>
            <span className="text-halo-charcoal/20">&middot;</span>
            <span>Ships in 48 hours</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2 · MARQUEE — symptom → outcome pairs
          ═══════════════════════════════════════════════ */}
      <HaloMarquee items={trtMarqueeItems} />

      {/* ═══════════════════════════════════════════════
          3 · THE TREATMENT GAP — stats with inline citations
          ═══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 px-6 section-light">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-8 md:mb-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                What hasn&rsquo;t been measured
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                Most men wait{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  five years.
                </span>
                <br className="hidden md:block" />{" "}
                Nobody asks the right question.
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 max-w-xl mx-auto mt-5 leading-relaxed">
                You&rsquo;ve been told it&rsquo;s aging. Offered coffee instead of bloodwork. That&rsquo;s not medicine. It&rsquo;s a shrug.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10 lg:gap-x-10">
              {impactStats.map((stat, i) => (
                <div key={i} className="aos-child text-center md:text-left flex flex-col">
                  <p className="font-serif text-[48px] md:text-[64px] lg:text-[72px] font-light leading-[0.95] mb-3 tracking-tight" style={{ color: PERSONA }}>
                    {stat.numberText}
                  </p>
                  <div className="w-10 h-px mb-3 md:mx-0 mx-auto" style={{ background: PERSONA, opacity: 0.4 }} />
                  <p className="text-[14px] md:text-[15px] text-halo-charcoal/80 leading-snug mb-3">
                    {stat.label}
                  </p>
                  <p className="text-[11px] italic text-halo-charcoal/40 mt-auto">
                    {stat.source}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4 · BIOMARKER SCROLL — fluid motion, signals depth
          ═══════════════════════════════════════════════ */}
      <BiomarkerScroll />

      {/* ═══════════════════════════════════════════════
          5 · OUTCOME PICKER — interactive cross-sell
          ═══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 px-6 section-light">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-8 md:mb-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                Where this shows up in your day
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.08] max-w-2xl mx-auto">
                Tap what matters.{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  Halo responds.
                </span>
              </h2>
              <p className="text-[14px] md:text-[15px] text-halo-charcoal/55 max-w-lg mx-auto mt-5 leading-relaxed">
                The biomarkers your physician prioritizes shift with what you&rsquo;re actually trying to change.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <OutcomePicker />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6 · THE DECLINE
          ═══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 px-6" style={{ background: "#F7F3EC" }}>
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-10 md:mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                The decline
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1] max-w-3xl mx-auto">
                Testosterone runs{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  more
                </span>{" "}
                than libido.
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 max-w-xl mx-auto mt-5 leading-relaxed">
                Recovery. Muscle. Focus. Mood. Sleep. Metabolism. When testosterone drops, all of it drops with it.{" "}
                <span className="italic text-halo-charcoal/45">
                  Bhasin et al., Endocrine Society, 2018.
                </span>
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <TestosteroneChart />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7 · THREE FORMATS — with pricing + bullets + badge
          ═══════════════════════════════════════════════ */}
      <section id="protocol" className="py-12 md:py-16 px-6 scroll-mt-24" style={{ background: "#F0EBE0" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-8 md:mb-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                The treatment
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                Three formats.{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  One protocol.
                </span>
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 max-w-xl mx-auto mt-5 leading-relaxed">
                Same medicine. Pick the format that fits your life. Lab panel included with every format.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <FormatAccordion />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8 · COMPARISON TABLE — Halo vs typical care
          ═══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 px-6 section-light" style={{ background: "#FAF8F4" }}>
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                The difference
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1] max-w-3xl mx-auto">
                Testosterone done{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  on purpose.
                </span>
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 max-w-xl mx-auto mt-5 leading-relaxed">
                What you&rsquo;d get at a typical practice vs. what you get at Halo.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <ComparisonTable />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9 · 14-DAY TIMELINE
          ═══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 px-6" style={{ background: "#1C1817" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-8 md:mb-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA_SOFT }}>
                Your first 14 days
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-white leading-[1.1]">
                Intake to medication.{" "}
                <span className="italic text-white/70">Two weeks.</span>
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 lg:gap-8 relative">
              <div
                className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px pointer-events-none"
                style={{ background: `${PERSONA}50` }}
                aria-hidden="true"
              />
              {trtSteps.map((step) => (
                <div key={step.day} className="aos-child relative">
                  <div
                    className="relative w-12 h-12 rounded-full mb-5 flex items-center justify-center mx-auto"
                    style={{
                      background: "#1C1817",
                      border: `1.5px solid ${PERSONA}`,
                    }}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ background: PERSONA }} />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2 text-center" style={{ color: PERSONA_SOFT }}>
                    {step.day}
                  </p>
                  <h3 className="font-serif text-[22px] md:text-[24px] text-white leading-tight tracking-tight mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-white/65 leading-relaxed text-center">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          10 · 90-DAY OUTCOMES
          ═══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-8 md:mb-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                90 days in
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1] max-w-3xl mx-auto">
                Your numbers.{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  And everything they carry.
                </span>
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
              {outcomes.map((o) => (
                <div key={o.label} className="aos-child">
                  <OutcomeCard outcome={o} />
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <p className="text-center text-[11px] italic text-halo-charcoal/40 mt-10 max-w-2xl mx-auto">
              Sources cited per outcome card above. Individual response varies. Not all patients experience the magnitude or timeframe shown in published trials.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          11 · PHYSICIAN — specialist credibility strip (mirrors HRT)
          ═══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 px-6 section-light">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div
              className="rounded-[20px] p-6 md:p-8 lg:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center"
              style={{ background: "#EBF0F7" }}
            >
              {/* Physician photo */}
              <div
                className="relative w-[140px] h-[180px] md:w-[160px] md:h-[200px] rounded-[16px] overflow-hidden flex-shrink-0"
                style={{
                  background: `linear-gradient(145deg, #FFFFFF 0%, ${PERSONA_SOFT}60 100%)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredPhysician.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3"
                  style={{ color: PERSONA }}
                >
                  Your physician
                </p>
                <h3 className="headline-section text-2xl md:text-3xl text-halo-charcoal leading-[1.15] mb-3">
                  A men&rsquo;s health{" "}
                  <span className="italic text-halo-charcoal/70">
                    specialist.
                  </span>
                  <br className="hidden md:block" />
                  Not a GP who treats TRT on the side.
                </h3>
                <p className="text-[14px] text-halo-charcoal/60 leading-relaxed max-w-lg md:mx-0 mx-auto">
                  Halo physicians are board-certified with fellowship training
                  in men&rsquo;s health and sports medicine. They&rsquo;ve spent a
                  decade learning what most GPs weren&rsquo;t taught.
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          12 · PRICING + FAQ
          ═══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 px-6 section-light" style={{ background: "#FAF8F4" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                One price &middot; all-in
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                Medication, labs, and your physician —{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  together.
                </span>
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 max-w-2xl mx-auto mt-5 leading-relaxed">
                Halo isn&rsquo;t a membership stacked with à-la-carte fees. One bundled price covers your prescription, the quarterly lab panel, and the physician who reads it. Pay how it fits your life.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 md:gap-12 items-start">
            <AnimateOnScroll>
              <div className="rounded-[24px] bg-white border border-halo-charcoal/[0.08] p-7 md:p-9 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.15)] lg:sticky lg:top-24">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/50 mb-4">
                  Choose your billing cadence
                </p>

                {/* Three cadence cards — selectable */}
                <div className="space-y-2.5 mb-7">
                  {/* Monthly */}
                  {(() => {
                    const isSelected = selectedCadence === "monthly";
                    return (
                      <button
                        type="button"
                        onClick={() => setSelectedCadence("monthly")}
                        aria-pressed={isSelected}
                        className="w-full text-left rounded-[14px] p-4 md:p-5 transition-all"
                        style={{
                          background: isSelected ? "#FAF8F4" : "white",
                          border: isSelected
                            ? `2px solid ${PERSONA}`
                            : "1px solid rgba(28,28,30,0.10)",
                          boxShadow: isSelected
                            ? `0 8px 22px -10px ${PERSONA}40`
                            : "none",
                          padding: isSelected ? "calc(1rem - 1px) calc(1.25rem - 1px)" : "1rem 1.25rem",
                          cursor: "pointer",
                        }}
                      >
                        <div className="flex items-baseline justify-between flex-wrap gap-2">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/55 mb-1.5 flex items-center gap-2">
                              <span
                                aria-hidden
                                className="inline-block rounded-full"
                                style={{
                                  width: "12px",
                                  height: "12px",
                                  border: `1.5px solid ${isSelected ? PERSONA : "rgba(28,28,30,0.25)"}`,
                                  background: isSelected ? PERSONA : "transparent",
                                  position: "relative",
                                }}
                              >
                                {isSelected && (
                                  <span
                                    aria-hidden
                                    style={{
                                      position: "absolute",
                                      inset: "2px",
                                      borderRadius: "50%",
                                      background: "white",
                                    }}
                                  />
                                )}
                              </span>
                              Monthly
                            </p>
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-serif text-[34px] md:text-[40px] font-light leading-none text-halo-charcoal">
                                {TRT_FOUNDING}
                              </span>
                              <span className="text-[13px] text-halo-charcoal/55">
                                /mo
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-halo-charcoal/55">
                            Billed monthly
                          </p>
                        </div>
                      </button>
                    );
                  })()}

                  {/* Quarterly */}
                  {(() => {
                    const isSelected = selectedCadence === "quarterly";
                    return (
                      <button
                        type="button"
                        onClick={() => setSelectedCadence("quarterly")}
                        aria-pressed={isSelected}
                        className="w-full text-left rounded-[14px] p-4 md:p-5 transition-all"
                        style={{
                          background: isSelected ? "#FAF8F4" : "white",
                          border: isSelected
                            ? `2px solid ${PERSONA}`
                            : "1px solid rgba(28,28,30,0.10)",
                          boxShadow: isSelected
                            ? `0 8px 22px -10px ${PERSONA}40`
                            : "none",
                          padding: isSelected ? "calc(1rem - 1px) calc(1.25rem - 1px)" : "1rem 1.25rem",
                          cursor: "pointer",
                        }}
                      >
                        <div className="flex items-baseline justify-between flex-wrap gap-2">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/55 mb-1.5 flex items-center gap-2">
                              <span
                                aria-hidden
                                className="inline-block rounded-full"
                                style={{
                                  width: "12px",
                                  height: "12px",
                                  border: `1.5px solid ${isSelected ? PERSONA : "rgba(28,28,30,0.25)"}`,
                                  background: isSelected ? PERSONA : "transparent",
                                  position: "relative",
                                }}
                              >
                                {isSelected && (
                                  <span
                                    aria-hidden
                                    style={{
                                      position: "absolute",
                                      inset: "2px",
                                      borderRadius: "50%",
                                      background: "white",
                                    }}
                                  />
                                )}
                              </span>
                              Quarterly
                            </p>
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-serif text-[34px] md:text-[40px] font-light leading-none text-halo-charcoal">
                                {formatPrice(TRT_QUARTERLY_PER_MO)}
                              </span>
                              <span className="text-[13px] text-halo-charcoal/55">
                                /mo equiv.
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-halo-charcoal/55">
                            {formatPrice(TRT_QUARTERLY_TOTAL)} every 90 days
                          </p>
                        </div>
                      </button>
                    );
                  })()}

                  {/* Annually — best value */}
                  {(() => {
                    const isSelected = selectedCadence === "yearly";
                    return (
                      <button
                        type="button"
                        onClick={() => setSelectedCadence("yearly")}
                        aria-pressed={isSelected}
                        className="relative w-full text-left rounded-[14px] p-4 md:p-5 text-white transition-all"
                        style={{
                          background: `linear-gradient(155deg, #2A2826 0%, #1C1817 100%)`,
                          border: isSelected
                            ? `2px solid ${HALO_GOLD}`
                            : "2px solid transparent",
                          boxShadow: isSelected
                            ? `0 18px 40px -22px rgba(201,168,98,0.45), 0 0 0 4px rgba(201,168,98,0.12)`
                            : `0 18px 40px -22px rgba(28,24,23,0.55)`,
                          padding: "calc(1rem - 1px) calc(1.25rem - 1px)",
                          cursor: "pointer",
                        }}
                      >
                        <span
                          className="absolute top-3 right-4 text-[9px] font-semibold uppercase tracking-[0.22em]"
                          style={{ color: isSelected ? HALO_GOLD_SOFT : PERSONA_SOFT }}
                        >
                          Best value
                        </span>
                        <div className="flex items-baseline justify-between flex-wrap gap-2 mt-1">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5 flex items-center gap-2" style={{ color: PERSONA_SOFT }}>
                              <span
                                aria-hidden
                                className="inline-block rounded-full"
                                style={{
                                  width: "12px",
                                  height: "12px",
                                  border: `1.5px solid ${isSelected ? HALO_GOLD : "rgba(248,248,250,0.35)"}`,
                                  background: isSelected ? HALO_GOLD : "transparent",
                                  position: "relative",
                                }}
                              >
                                {isSelected && (
                                  <span
                                    aria-hidden
                                    style={{
                                      position: "absolute",
                                      inset: "2px",
                                      borderRadius: "50%",
                                      background: "white",
                                    }}
                                  />
                                )}
                              </span>
                              Annually
                            </p>
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-serif text-[34px] md:text-[40px] font-light leading-none text-white">
                                {formatPrice(TRT_YEARLY_PER_MO)}
                              </span>
                              <span className="text-[13px]" style={{ color: PERSONA_SOFT }}>
                                /mo equiv.
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className="inline-block text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-0.5 rounded-full"
                              style={{
                                background: isSelected ? `${HALO_GOLD}40` : `${PERSONA}25`,
                                color: "#fff",
                              }}
                            >
                              &minus;{TRT_YEARLY_SAVINGS_PCT}%
                            </span>
                            <p className="text-[11px] mt-1.5" style={{ color: PERSONA_SOFT }}>
                              {formatPrice(TRT_YEARLY_TOTAL)} once a year
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })()}
                </div>

                <div className="border-t border-halo-charcoal/[0.08] pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-halo-charcoal/50 mb-4">
                    What&rsquo;s included
                  </p>
                  <ul className="space-y-2.5 mb-7">
                    {[
                      "Compounded testosterone (503A pharmacy)",
                      "Quarterly comprehensive labs (60+ biomarkers)",
                      "Physician oversight + dose adjustments",
                      "Async physician access · 48-hour response",
                      "Fertility-preservation adjuncts when indicated",
                      "Founding rate · 10% off, locked for life",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[13px] text-halo-charcoal/80 leading-snug">
                        <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: PERSONA }} strokeWidth={2.5} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-[11px] text-halo-charcoal/45 mb-3">
                  Standard rate {TRT_STD}/mo &middot; founding members lock in {TRT_FOUNDING}/mo for life.
                </p>

                <Link
                  href={quizHref}
                  className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold text-sm transition-all hover:brightness-95"
                  style={{
                    backgroundColor: PERSONA,
                    boxShadow: `0 8px 28px ${PERSONA}45`,
                  }}
                >
                  Continue with{" "}
                  {selectedCadence === "monthly"
                    ? "monthly"
                    : selectedCadence === "quarterly"
                    ? "quarterly"
                    : "annual"}{" "}
                  billing
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-[11px] text-halo-charcoal/45 italic mt-4">
                  Cancel any time &middot; founding rate locked once you&rsquo;re in.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll stagger>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                  Questions
                </p>
                <h3 className="headline-section text-2xl md:text-3xl text-halo-charcoal leading-[1.15] mb-8">
                  Everything worth asking.
                </h3>
                <FAQ items={faqItems} categories={[]} />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          13 · FINAL CTA
          ═══════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-12 md:py-16 px-6"
        style={{ background: "#1C1817" }}
      >
        <HaloPattern
          variant="default"
          intensity={1.8}
          color={PERSONA}
          showCore={false}
          className="absolute inset-0 w-full h-full"
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-5" style={{ color: PERSONA_SOFT }}>
              Know your numbers
            </p>
            <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-white leading-[1.1] mb-6">
              Stop wondering.{" "}
              <span className="italic" style={{ color: PERSONA_SOFT }}>
                Start knowing.
              </span>
            </h2>
            <p className="text-[15px] md:text-base text-white/60 leading-relaxed mb-10 max-w-xl mx-auto">
              First lab panel is free for founding members. No commitment until your physician reviews the numbers.
            </p>
            <Link
              href="/quiz/trt"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[#1C1817] font-semibold text-sm transition-all hover:brightness-95"
              style={{ backgroundColor: "white" }}
            >
              Start my assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="py-6 px-6 section-light border-t border-halo-charcoal/[0.05]">
        <p className="text-center text-[11px] text-halo-charcoal/35 max-w-3xl mx-auto leading-relaxed">
          Halo is a technology platform that connects patients with licensed healthcare providers. All clinical decisions are made by independent licensed providers. Individual results vary. Not medical advice. Compounded drug products are not FDA-approved or evaluated. Testosterone is a controlled substance. Rx required. Not available in all 50 states.
        </p>
      </div>
    </>
  );
}
