"use client";

import Link from "next/link";
import { ArrowRight, Check, X, Plus, Minus } from "lucide-react";
import { useState } from "react";
import FAQ from "@/components/FAQ";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import HaloPattern from "@/components/HaloPattern";
import HaloMarquee from "@/components/HaloMarquee";
import BenefitScroller from "@/components/BenefitScroller";

/* ==============================
   PERSONA — NAD+ = deep sapphire (clinical, longevity)
   ============================== */
const PERSONA = "#3F5A8A";
const PERSONA_SOFT = "#7B8EB3";
const PERSONA_DEEP = "#2A3E62";

/* ==============================
   DATA
   ============================== */

const benefits = [
  "Physician-designed",
  "Lab-monitored",
  "Weekly at home",
  "Paired with Glutathione",
  "503A pharmacy",
  "No IV chair",
  "HSA/FSA eligible",
  "Cancel anytime",
];

const marqueeItems = [
  { symptom: "Slower Recovery", outcome: "Rebuild" },
  { symptom: "Brain Fog", outcome: "Clarity" },
  { symptom: "Low Stamina", outcome: "Sustained Drive" },
  { symptom: "Foggy Mornings", outcome: "Sharp Starts" },
  { symptom: "Oxidative Stress", outcome: "Repair" },
  { symptom: "Mitochondrial Drift", outcome: "Energy Restored" },
];

const costGapStats = [
  {
    numberText: "$600+",
    label: "per session for IV NAD+ at boutique longevity clinics.",
    source: "Next Health published pricing, 2024",
  },
  {
    numberText: "$800/mo",
    label: "average monthly IV NAD+ therapy with bi-weekly dosing.",
    source: "Strut Health pricing index, 2024",
  },
  {
    numberText: "$179/mo",
    label: "Halo. Same molecule. Same pharmacy grade. Shipped monthly.",
    source: "",
  },
];

const impactStats = [
  {
    numberText: "50%",
    label: "decline in tissue NAD+ between ages 30 and 60.",
    source: "Massudi et al., J Biol Chem, 2012",
  },
  {
    numberText: "40%",
    label: "average increase in whole-blood NAD+ with physician-dosed NR therapy.",
    source: "Martens et al., Nature Communications, 2018",
  },
  {
    numberText: "<2%",
    label: "of longevity-curious adults have ever had their NAD+ markers measured.",
    source: "Halo provider network estimate, 2025",
  },
];

const deliveryComparison = [
  { label: "Dose form", iv: "Intravenous drip", halo: "Subcutaneous injection", oral: "Capsule (NR / NMN)" },
  { label: "Bioavailability", iv: "~100%", halo: "~95%", oral: "~30\u201350%" },
  { label: "Time per dose", iv: "2\u20134 hours", halo: "10 seconds", oral: "Daily pill" },
  { label: "Physician oversight", iv: "In-office", halo: "Telehealth, async", oral: "None" },
  { label: "Lab monitoring", iv: "Rarely", halo: "Every 90 days", oral: "None" },
  { label: "Typical monthly cost", iv: "$800", halo: "$179", oral: "$40\u2013$90" },
];

const flipSymptoms = [
  { before: "Foggy mornings", after: "Sharp starts" },
  { before: "Tired by 2pm", after: "Through the afternoon" },
  { before: "Sore for days", after: "Recovered in one" },
  { before: "Sluggish focus", after: "Locked in" },
  { before: "Skipping workouts", after: "Back at it" },
  { before: "Feeling older", after: "Capability restored" },
];

const outcomes = [
  {
    stat: "Energy",
    label: "Sustained",
    claim:
      "Most members report sustained daily energy within 4\u20136 weeks as mitochondrial function improves.",
    image: "/nad/life-energy.jpg",
  },
  {
    stat: "Cognition",
    label: "Clarity",
    claim: "Reduced brain fog and sharper focus typically reported within 8 weeks.",
    image: "/nad/life-clarity.jpg",
  },
  {
    stat: "Recovery",
    label: "Faster",
    claim: "Faster recovery from training and cognitive load. Most members feel it within 30 days.",
    image: "/nad/life-recovery.jpg",
  },
];

const comparisonRows = [
  { label: "Baseline metabolic panel", halo: "Full 16+ biomarkers", typical: "Not included" },
  { label: "Physician consultation", halo: "Within 5 days", typical: "Weeks, if at all" },
  { label: "Dose form", halo: "Subcutaneous injection", typical: "IV drip in clinic" },
  { label: "Time per dose", halo: "10 seconds, at home", typical: "2\u20134 hours in chair" },
  { label: "Follow-up monitoring", halo: "Labs at 90 days", typical: "Not included" },
  { label: "Paired Glutathione", halo: "Included", typical: "Extra $75+/session" },
  { label: "Typical monthly cost", halo: "$179", typical: "$600\u2013$800" },
  { label: "Cancel anytime", halo: "Yes, no contract", typical: "Session packages locked" },
];

const biomarkers = [
  "NAD/NADH ratio",
  "hs-CRP",
  "Homocysteine",
  "Fasting Insulin",
  "HbA1c",
  "ApoB",
  "Vitamin B12",
  "Methylmalonic Acid",
  "Magnesium",
  "IL-6",
  "Cortisol AM",
  "TSH",
  "Free T4",
  "ALT",
  "AST",
  "GGT",
  "Creatinine",
  "eGFR",
  "CBC",
  "Ferritin",
  "Vitamin D",
  "Lipid Panel",
];

const featuredPhysician = {
  name: "Dr. Priya Patel, MD",
  title: "Internal Medicine \u00B7 Peptide & NAD+ Therapy",
  image: "/providers/priya-patel.png",
};

const faqItems = [
  {
    question: "Who is NAD+ therapy for?",
    answer:
      "Adults 30 and over who want to slow cellular aging, improve recovery, and maintain metabolic resilience. It\u2019s not a fatigue treatment \u2014 if your primary complaint is tiredness, your physician will screen for thyroid, iron, sleep, and cortisol first. NAD+ is for people whose labs indicate cellular-energy decline.",
  },
  {
    question: "How is this different from IV NAD+ at a longevity clinic?",
    answer:
      "Same molecule. Same pharmacy grade. Different delivery. IV therapy ties you to 2\u20134 hour sessions at $600\u2013$800 each. Halo sends you a weekly subcutaneous injection you self-administer at home in about 10 seconds. Bioavailability is comparable (~95% vs ~100%). Lab monitoring is included, which IV clinics rarely offer.",
  },
  {
    question: "How is this different from Tru Niagen or oral NAD+ supplements?",
    answer:
      "Oral precursors (NR, NMN) have real research behind them, but bioavailability is roughly 30\u201350% due to first-pass metabolism. Subcutaneous NAD+ bypasses the gut and liver, reaching cellular targets more efficiently. More importantly, Halo runs a full metabolic panel to confirm you\u2019re a candidate and adjusts your protocol based on follow-up labs. Supplement brands can\u2019t.",
  },
  {
    question: "What does the protocol include?",
    answer:
      "NAD+ 100mg subcutaneous weekly, paired with Glutathione 200mg as antioxidant cofactor (NAD+ redox cycling increases oxidative load; Glutathione buffers it). Baseline metabolic panel. Follow-up labs at 90 days. Physician async access throughout. Injection supplies and shipping included.",
  },
  {
    question: "What are the side effects?",
    answer:
      "Most common: mild injection site redness or bruising, occasional headache during the first few doses. Rare: nausea, flushing, sleep disturbance. Not appropriate during active chemotherapy or with known B3-family allergies. Your physician screens for contraindications before prescribing.",
  },
  {
    question: "Is the science real or hype?",
    answer:
      "NAD+ decline with age is well-documented (Massudi et al., J Biol Chem 2012). NR/NMN precursors have been shown to raise whole-blood NAD+ 40\u201360% in healthy adults (Martens et al., Nature Communications 2018). Halo positions NAD+ as metabolic resilience support, not a cure for any disease. We make no lifespan claims.",
  },
  {
    question: "How fast will I feel it?",
    answer:
      "Recovery improvements and mental clarity are typically reported within 2\u20134 weeks. Energy and sleep quality often follow at 6\u20138 weeks. NAD+ is slower than caffeine or testosterone \u2014 it restores systems rather than stimulating them.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. No contracts. Cancel through your member portal or by emailing your care team. Your prescription continues through the current shipment cycle.",
  },
];

/* ==============================
   COMPONENT: BIOMARKER SCROLL (dark section, local)
   ============================== */

function BiomarkerScroll() {
  const items = [...biomarkers, ...biomarkers];
  return (
    <div className="relative overflow-hidden py-10 md:py-14" style={{ background: "#0D1220" }}>
      <div className="text-center mb-8 px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: PERSONA_SOFT }}>
          What we measure before prescribing
        </p>
        <h3 className="font-serif text-2xl md:text-3xl text-white leading-[1.15] tracking-tight max-w-2xl mx-auto">
          Cellular energy is measurable.{" "}
          <span className="italic text-white/55">Most clinics never look.</span>
        </h3>
      </div>

      <div className="relative mb-4 marquee-mask">
        <div className="marquee-track-right flex gap-3 md:gap-4 whitespace-nowrap">
          {items.map((m, i) => (
            <span
              key={`r1-${i}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] md:text-[12px] font-medium text-white/75 flex-shrink-0"
              style={{
                borderColor: "rgba(123,142,179,0.25)",
                background: "rgba(63,90,138,0.08)",
              }}
            >
              <span className="w-1 h-1 rounded-full" style={{ background: PERSONA_SOFT }} />
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="relative marquee-mask">
        <div className="marquee-track-left flex gap-3 md:gap-4 whitespace-nowrap">
          {items.map((m, i) => (
            <span
              key={`r2-${i}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] md:text-[12px] font-medium flex-shrink-0"
              style={{ background: "rgba(63,90,138,0.18)", color: PERSONA_SOFT }}
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
        .marquee-track-right { animation: scroll-right 60s linear infinite; width: max-content; }
        .marquee-track-left { animation: scroll-left 75s linear infinite; width: max-content; }
        @keyframes scroll-right { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes scroll-left { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) { .marquee-track-right, .marquee-track-left { animation: none; } }
      `}</style>
    </div>
  );
}

/* ==============================
   COMPONENT: SCIENCE ACCORDION
   Biohacker-depth expander. Surface is plain-English; expand to
   reveal the mechanistic detail.
   ============================== */

function ScienceAccordion({
  summary,
  children,
}: {
  summary: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6 rounded-[14px] border overflow-hidden" style={{ borderColor: "rgba(63,90,138,0.18)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors"
        style={{ background: open ? `${PERSONA}12` : "transparent" }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: PERSONA }}>
          {summary}
        </span>
        {open ? (
          <Minus className="w-4 h-4" strokeWidth={2.5} style={{ color: PERSONA }} />
        ) : (
          <Plus className="w-4 h-4" strokeWidth={2.5} style={{ color: PERSONA }} />
        )}
      </button>
      {open && (
        <div className="px-5 py-4 text-[13px] md:text-[14px] text-halo-charcoal/75 leading-relaxed" style={{ background: `${PERSONA}06` }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ==============================
   COMPONENT: SYMPTOM FLIP CARDS
   ============================== */

function SymptomFlipCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {flipSymptoms.map((s) => (
        <div
          key={s.before}
          className="flip-card relative h-[120px] md:h-[140px] rounded-[16px] cursor-pointer"
          style={{ perspective: "1000px" }}
        >
          <div className="flip-inner relative w-full h-full transition-transform duration-500" style={{ transformStyle: "preserve-3d" }}>
            <div
              className="flip-front absolute inset-0 flex items-center justify-center rounded-[16px] p-4 border"
              style={{
                background: "#FAF8F4",
                borderColor: "rgba(28,28,30,0.08)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div className="text-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/40 mb-2">Before</p>
                <p className="font-serif text-[18px] md:text-[20px] text-halo-charcoal leading-tight tracking-tight">
                  {s.before}
                </p>
              </div>
            </div>
            <div
              className="flip-back absolute inset-0 flex items-center justify-center rounded-[16px] p-4"
              style={{
                background: PERSONA,
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div className="text-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/65 mb-2">On protocol</p>
                <p className="font-serif italic text-[18px] md:text-[20px] text-white leading-tight tracking-tight">
                  {s.after}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .flip-card:hover .flip-inner, .flip-card:focus-within .flip-inner {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}

/* ==============================
   COMPONENT: DELIVERY COMPARISON TABLE — 3 column
   ============================== */

function DeliveryComparison() {
  return (
    <div className="rounded-[22px] overflow-hidden border border-halo-charcoal/[0.08] bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.12)]">
      <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] border-b border-halo-charcoal/[0.08]">
        <div className="p-4 md:p-5 flex items-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/40">Compare</span>
        </div>
        <div className="p-4 md:p-5 flex items-center justify-center text-center">
          <div>
            <p className="font-serif text-[14px] md:text-[16px] text-halo-charcoal/70 leading-tight">IV Clinic</p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-halo-charcoal/40">In-office drip</p>
          </div>
        </div>
        <div className="p-4 md:p-5 flex items-center justify-center text-center" style={{ background: `${PERSONA}12` }}>
          <div>
            <p className="font-serif text-[14px] md:text-[16px] leading-tight" style={{ color: PERSONA_DEEP }}>Halo</p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em]" style={{ color: PERSONA }}>Weekly at home</p>
          </div>
        </div>
        <div className="p-4 md:p-5 flex items-center justify-center text-center">
          <div>
            <p className="font-serif text-[14px] md:text-[16px] text-halo-charcoal/70 leading-tight">Oral</p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-halo-charcoal/40">NR / NMN capsule</p>
          </div>
        </div>
      </div>

      {deliveryComparison.map((row, i) => (
        <div
          key={row.label}
          className={`grid grid-cols-[1.2fr_1fr_1fr_1fr] ${
            i !== deliveryComparison.length - 1 ? "border-b border-halo-charcoal/[0.06]" : ""
          }`}
        >
          <div className="p-4 md:p-5 text-[12px] md:text-[13px] text-halo-charcoal/80 font-medium">{row.label}</div>
          <div className="p-4 md:p-5 text-center text-[12px] md:text-[13px] text-halo-charcoal/60">{row.iv}</div>
          <div className="p-4 md:p-5 text-center text-[12px] md:text-[13px] font-semibold" style={{ background: `${PERSONA}08`, color: PERSONA_DEEP }}>
            {row.halo}
          </div>
          <div className="p-4 md:p-5 text-center text-[12px] md:text-[13px] text-halo-charcoal/60">{row.oral}</div>
        </div>
      ))}
    </div>
  );
}

/* ==============================
   COMPONENT: HALO VS TYPICAL (2-col)
   ============================== */

function HaloVsTypicalTable() {
  return (
    <div className="rounded-[22px] overflow-hidden border border-halo-charcoal/[0.08] bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.12)]">
      <div className="grid grid-cols-[1.3fr_1fr_1fr] border-b border-halo-charcoal/[0.08]">
        <div className="p-4 md:p-5 flex items-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/40">Compare</span>
        </div>
        <div className="p-4 md:p-5 flex items-center justify-center text-center" style={{ background: `${PERSONA}10` }}>
          <div>
            <p className="font-serif text-[16px] md:text-[18px] leading-tight tracking-tight" style={{ color: PERSONA_DEEP }}>
              Halo
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em]" style={{ color: PERSONA }}>Your protocol</p>
          </div>
        </div>
        <div className="p-4 md:p-5 flex items-center justify-center text-center">
          <div>
            <p className="font-serif text-[16px] md:text-[18px] text-halo-charcoal/70 leading-tight tracking-tight">
              IV Longevity Clinic
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/40">Boutique drip</p>
          </div>
        </div>
      </div>

      {comparisonRows.map((row, i) => (
        <div
          key={row.label}
          className={`grid grid-cols-[1.3fr_1fr_1fr] ${
            i !== comparisonRows.length - 1 ? "border-b border-halo-charcoal/[0.06]" : ""
          }`}
        >
          <div className="p-4 md:p-5 text-[13px] md:text-[14px] text-halo-charcoal/80 font-medium">{row.label}</div>
          <div className="p-4 md:p-5 text-center text-[13px] md:text-[14px] font-medium" style={{ background: `${PERSONA}08`, color: PERSONA_DEEP }}>
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
      ))}
    </div>
  );
}

/* ==============================
   COMPONENT: OUTCOME CARD
   ============================== */

function OutcomeCard({ outcome }: { outcome: (typeof outcomes)[number] }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div className="flex flex-col">
      <div
        className="relative aspect-[4/5] rounded-[20px] overflow-hidden mb-6"
        style={{ background: `linear-gradient(145deg, #F5F1EA 0%, ${PERSONA_SOFT}60 100%)` }}
      >
        {!imgFailed && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={outcome.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-3" style={{ color: PERSONA }}>
          {outcome.stat}
        </p>
        <p className="font-serif text-[36px] md:text-[44px] font-light leading-none tracking-tight italic mb-3" style={{ color: PERSONA_DEEP }}>
          {outcome.label}
        </p>
        <div className="w-10 h-px mb-4" style={{ background: PERSONA, opacity: 0.4 }} />
        <p className="text-[14px] text-halo-charcoal/70 leading-relaxed">{outcome.claim}</p>
      </div>
    </div>
  );
}

/* ==============================
   PAGE
   ============================== */

export default function NadTherapyPage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════
          1 · HERO — split, portrait right
          ═══════════════════════════════════════════════ */}
      <section className="relative section-light overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_1.1fr] lg:min-h-[680px]">
          <div className="relative flex flex-col justify-center px-6 md:px-10 lg:px-14 py-12 md:py-16 lg:py-20 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: PERSONA }}>
                NAD+ Therapy
              </span>
            </div>

            <h1 className="headline-hero text-[36px] md:text-[52px] lg:text-[60px] text-halo-charcoal leading-[1.02] tracking-tight mb-5">
              Take on{" "}
              <span className="italic" style={{ color: PERSONA }}>
                Father Time.
              </span>
            </h1>

            <p className="text-[16px] md:text-[17px] text-halo-charcoal/70 leading-relaxed mb-8 max-w-md">
              NAD+ drops 50% by age 60. Halo prescribes, measures, and restores
              it &mdash; monthly, at home.
            </p>

            <ul className="space-y-2.5 mb-9 max-w-md">
              {[
                "Physician-designed. Not a supplement stack.",
                "Subcutaneous injection \u2014 skip the IV chair.",
                "Paired with Glutathione. Monitored every 90 days.",
              ].map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-[10px] flex-shrink-0 w-5 h-px" style={{ background: PERSONA }} />
                  <span className="text-[14px] md:text-[15px] text-halo-charcoal/85 leading-snug">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Link
                href="/quiz?from=nad"
                className="hidden md:inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold text-sm transition-all hover:brightness-95"
                style={{
                  backgroundColor: PERSONA,
                  boxShadow: `0 8px 28px ${PERSONA}45`,
                }}
              >
                Start my assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quiz?from=nad"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-halo-charcoal/20 text-halo-charcoal font-semibold text-sm hover:border-halo-charcoal/40 transition-colors"
              >
                See if I qualify
              </Link>
            </div>

            <p className="text-[12px] text-halo-charcoal/50 italic">
              Starts at $179/mo. Free physician consultation before any prescription.
            </p>
          </div>

          <div
            className="relative order-1 lg:order-2 min-h-[400px] md:min-h-[500px] lg:min-h-0 overflow-hidden"
            style={{
              background: `linear-gradient(165deg, #E8EEF8 0%, #B8C8E0 50%, ${PERSONA_SOFT} 100%)`,
            }}
          >
            {/* Mobile CTA overlay */}
            <div className="md:hidden absolute bottom-5 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none">
              <Link
                href="/quiz?from=nad"
                className="pointer-events-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-white font-semibold text-sm shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                style={{ backgroundColor: PERSONA }}
              >
                Start my assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nad/hero-portrait.jpg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center 35%" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(180deg, transparent 70%, rgba(20,25,40,0.22) 100%)",
              }}
            />
          </div>
        </div>

        {/* Trust strip */}
        <div className="border-t border-halo-charcoal/[0.08] bg-white/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/60">
            <span>Board-certified physicians</span>
            <span className="text-halo-charcoal/20">&middot;</span>
            <span>US-licensed 503A pharmacy</span>
            <span className="text-halo-charcoal/20">&middot;</span>
            <span>Lab-monitored</span>
            <span className="text-halo-charcoal/20">&middot;</span>
            <span>Available in 30+ states</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2 · AUTO-SCROLLING BENEFITS
          ═══════════════════════════════════════════════ */}
      <BenefitScroller items={benefits} accent={PERSONA} background="#FAF8F4" speed={55} />

      {/* ═══════════════════════════════════════════════
          3 · MARQUEE
          ═══════════════════════════════════════════════ */}
      <HaloMarquee items={marqueeItems} />

      {/* ═══════════════════════════════════════════════
          4 · THE COST GAP
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                The cost gap
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                Same molecule.{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  Different markup.
                </span>
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 max-w-xl mx-auto mt-5 leading-relaxed">
                IV therapy centers charge $100&ndash;$200 per session for NAD+.
                At-home injection is the same pharmacy-grade molecule, without
                the chair or the markup.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10 lg:gap-x-10">
              {costGapStats.map((stat, i) => (
                <div
                  key={i}
                  className={`aos-child text-center md:text-left flex flex-col ${
                    i === 2 ? "md:border-l md:pl-6 lg:pl-10" : ""
                  }`}
                  style={i === 2 ? { borderColor: `${PERSONA}30` } : undefined}
                >
                  <p
                    className="font-serif text-[44px] md:text-[60px] lg:text-[68px] font-light leading-[0.95] mb-3 tracking-tight"
                    style={{ color: i === 2 ? PERSONA : "#6F6355" }}
                  >
                    {stat.numberText}
                  </p>
                  <div
                    className="w-10 h-px mb-3 md:mx-0 mx-auto"
                    style={{ background: PERSONA, opacity: i === 2 ? 0.6 : 0.3 }}
                  />
                  <p className="text-[14px] md:text-[15px] text-halo-charcoal/80 leading-snug mb-3">
                    {stat.label}
                  </p>
                  {stat.source && (
                    <p className="text-[11px] italic text-halo-charcoal/40 mt-auto">{stat.source}</p>
                  )}
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5 · THE DECLINE — science + biohacker accordion
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6" style={{ background: "#F2EEE4" }}>
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-10 md:mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                The science
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1] max-w-3xl mx-auto">
                NAD+ runs your mitochondria.{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  And it&rsquo;s running out.
                </span>
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/70 max-w-2xl mx-auto mt-5 leading-relaxed">
                NAD+ is the coenzyme your cells use to convert fuel into ATP
                and activate sirtuins for DNA repair. Tissue NAD+ declines
                roughly 50% between age 30 and 60 &mdash; a decline correlated
                with slower recovery, reduced mitochondrial output, and
                increased oxidative stress.{" "}
                <span className="italic text-halo-charcoal/50">
                  Massudi et al., J Biol Chem, 2012.
                </span>
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10">
              {impactStats.map((stat, i) => (
                <div key={i} className="aos-child text-center md:text-left flex flex-col">
                  <p className="font-serif text-[44px] md:text-[60px] lg:text-[68px] font-light leading-[0.95] mb-3 tracking-tight" style={{ color: PERSONA }}>
                    {stat.numberText}
                  </p>
                  <div className="w-10 h-px mb-3 md:mx-0 mx-auto" style={{ background: PERSONA, opacity: 0.4 }} />
                  <p className="text-[14px] md:text-[15px] text-halo-charcoal/80 leading-snug mb-3">
                    {stat.label}
                  </p>
                  <p className="text-[11px] italic text-halo-charcoal/40 mt-auto">{stat.source}</p>
                </div>
              ))}
            </div>

            <ScienceAccordion summary="Mechanism — for the biohackers">
              <p className="mb-3">
                NAD+ acts as an electron carrier in the mitochondrial electron
                transport chain and as a cosubstrate for a family of
                NAD+-consuming enzymes: <strong>sirtuins</strong> (SIRT1&ndash;7),
                which regulate gene expression and DNA repair;{" "}
                <strong>PARPs</strong>, which handle single-strand DNA break
                repair; and <strong>CD38</strong>, a surface enzyme whose
                activity increases with age and accelerates NAD+ depletion.
              </p>
              <p className="mb-3">
                Age-related NAD+ decline is driven by both reduced biosynthesis
                (lower NAMPT activity) and increased consumption (rising CD38
                with chronic inflammation). Restoring NAD+ via direct
                supplementation or precursor therapy (NR, NMN) supports
                sirtuin-mediated cellular repair pathways.
              </p>
              <p className="text-[12px] italic text-halo-charcoal/55">
                Verdin, Science 2015; Rajman et al., Cell Metabolism 2018;
                Covarrubias et al., Nature Reviews Molecular Cell Biology 2021.
              </p>
            </ScienceAccordion>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6 · BIOMARKER SCROLL
          ═══════════════════════════════════════════════ */}
      <BiomarkerScroll />

      {/* ═══════════════════════════════════════════════
          7 · SYMPTOM FLIP CARDS
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                What changes
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.08] max-w-3xl mx-auto">
                The body responds faster.{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  The mind starts sharper.
                </span>
              </h2>
              <p className="text-[14px] md:text-[15px] text-halo-charcoal/55 max-w-lg mx-auto mt-5 leading-relaxed italic">
                Hover or tap. See what shifts.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <SymptomFlipCards />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8 · DELIVERY COMPARISON (3-col)
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6" style={{ background: "#F7F3EC" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                How it&rsquo;s delivered
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1] max-w-3xl mx-auto">
                Three paths to the same molecule.{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  Only one fits your life.
                </span>
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 max-w-xl mx-auto mt-5 leading-relaxed">
                IV drips in a clinic chair. Subcutaneous injection at home.
                Oral capsules with lower bioavailability. Here&rsquo;s how they
                stack up.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <DeliveryComparison />
          </AnimateOnScroll>

          <AnimateOnScroll>
            <ScienceAccordion summary="Pharmacokinetics — for the biohackers">
              <p className="mb-3">
                IV NAD+ produces an immediate peak with rapid clearance &mdash;
                the classic spike-and-crash profile, which is why IV protocols
                typically require 2&ndash;4 hour drips to extend exposure time.
                Subcutaneous injection creates a sustained-release curve over
                roughly 24&ndash;48 hours, achieving comparable peak exposure
                with steadier trough levels. Oral NR and NMN precursors are
                first-pass metabolized in the gut and liver, reducing systemic
                bioavailability to ~30&ndash;50% while relying on endogenous
                conversion pathways (NRK, NMNAT) to raise cellular NAD+.
              </p>
              <p className="text-[12px] italic text-halo-charcoal/55">
                Grant et al., Front Aging Neurosci 2019; Trammell et al., Nat
                Commun 2016.
              </p>
            </ScienceAccordion>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9 · THE PROTOCOL
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                The protocol
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                What&rsquo;s in your shipment.{" "}
                <span className="italic" style={{ color: PERSONA }}>And why.</span>
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {[
                {
                  name: "NAD+ Injection",
                  dose: "100 mg, weekly subcutaneous",
                  desc:
                    "Direct NAD+ supplementation. Bypasses the gut. Reaches cellular targets efficiently.",
                },
                {
                  name: "Glutathione",
                  dose: "200 mg, paired weekly",
                  desc:
                    "Antioxidant cofactor. NAD+ redox cycling increases oxidative load; Glutathione buffers it.",
                },
                {
                  name: "Baseline Lab Panel",
                  dose: "16+ biomarkers",
                  desc:
                    "Metabolic, inflammation, and energy markers. Confirms you\u2019re a candidate before any prescription.",
                },
                {
                  name: "90-Day Follow-up",
                  dose: "Repeat panel",
                  desc:
                    "Your physician adjusts dose based on response. Protocol evolves with your labs.",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="aos-child rounded-[20px] border border-halo-charcoal/[0.08] p-6 md:p-7"
                  style={{ background: "#FAF8F4" }}
                >
                  <h3 className="font-serif text-[22px] md:text-[24px] text-halo-charcoal leading-tight tracking-tight mb-1">
                    {item.name}
                  </h3>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: PERSONA }}>
                    {item.dose}
                  </p>
                  <p className="text-[14px] text-halo-charcoal/70 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          10 · HALO VS IV CLINIC
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light" style={{ background: "#FAF8F4" }}>
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                The difference
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1] max-w-3xl mx-auto">
                NAD+ without{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  the four-hour chair.
                </span>
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 max-w-xl mx-auto mt-5 leading-relaxed">
                What you&rsquo;d get at a boutique longevity clinic, vs what
                you get at Halo.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <HaloVsTypicalTable />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          11 · OUTCOMES
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                What members report
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1] max-w-3xl mx-auto">
                Not a lifespan claim.{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  A capability one.
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
              Patient-reported outcomes. Individual response varies. Halo
              positions NAD+ as metabolic resilience support, not as treatment
              for any specific disease. Not evaluated by the FDA.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          12 · SCIENCE AUTHORITY — named researchers
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6" style={{ background: "#F2EEE4" }}>
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-10 md:mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                The research
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                The work{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  this rests on.
                </span>
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="rounded-[20px] border border-halo-charcoal/[0.08] bg-white p-7 md:p-10 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.10)]">
              <p className="text-[14px] md:text-[15px] text-halo-charcoal/80 leading-relaxed mb-5">
                The clinical foundation for NAD+ therapy dates to discoveries
                by <strong>Charles Brenner (Dartmouth, now City of Hope)</strong>,
                who identified the nicotinamide riboside (NR) salvage pathway
                in 2004. Since then, clinical work including{" "}
                <strong>Martens et al. (Nature Communications, 2018)</strong>{" "}
                has shown NR can raise whole-blood NAD+ by ~40% in healthy
                middle-aged adults.
              </p>
              <p className="text-[14px] md:text-[15px] text-halo-charcoal/80 leading-relaxed mb-5">
                Mechanistic research by{" "}
                <strong>Eric Verdin (Buck Institute)</strong> and{" "}
                <strong>David Sinclair (Harvard Medical School)</strong> has
                linked sirtuin activation to DNA repair, mitochondrial
                biogenesis, and metabolic regulation.{" "}
                <strong>Brakedal et al. (Cell Metabolism, 2022)</strong>{" "}
                demonstrated clinical benefit of NR supplementation in
                Parkinson&rsquo;s disease populations.
              </p>
              <p className="text-[13px] text-halo-charcoal/55 italic leading-relaxed">
                Halo cites this research because it&rsquo;s the honest
                foundation for NAD+ therapy. We don&rsquo;t claim endorsement.
                We don&rsquo;t promise lifespan extension. We provide a
                physician-led protocol grounded in peer-reviewed mechanism.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          13 · PHYSICIAN STRIP
          ═══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 px-6 section-light">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div
              className="rounded-[20px] p-6 md:p-8 lg:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center"
              style={{ background: "#EBF0F7" }}
            >
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
              <div className="flex-1 text-center md:text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: PERSONA }}>
                  Your physician
                </p>
                <h3 className="headline-section text-2xl md:text-3xl text-halo-charcoal leading-[1.15] mb-3">
                  A peptide and{" "}
                  <span className="italic text-halo-charcoal/70">
                    longevity specialist.
                  </span>
                  <br className="hidden md:block" />
                  Not a drip-clinic concierge.
                </h3>
                <p className="text-[14px] text-halo-charcoal/60 leading-relaxed max-w-lg md:mx-0 mx-auto">
                  Halo physicians are board-certified internists with specific
                  training in peptide therapy, NAD+ protocols, and side-effect
                  management.
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          14 · PRICING + FAQ
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light" style={{ background: "#FAF8F4" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                Terms
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                Starts at $179.{" "}
                <span className="italic" style={{ color: PERSONA }}>Everything in.</span>
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 md:gap-12 items-start">
            <AnimateOnScroll>
              <div className="rounded-[24px] bg-white border border-halo-charcoal/[0.08] p-7 md:p-10 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.15)] lg:sticky lg:top-24">
                <div className="flex items-baseline gap-2 md:gap-3 mb-2 flex-wrap">
                  <span className="text-[13px] md:text-[14px] text-halo-charcoal/50 uppercase tracking-[0.2em] font-semibold mr-1">
                    From
                  </span>
                  <span className="font-serif text-[44px] md:text-[64px] font-light leading-none" style={{ color: PERSONA }}>
                    $179
                  </span>
                  <span className="text-[15px] md:text-[18px] text-halo-charcoal/50">/month</span>
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: PERSONA_DEEP }}>
                  Full protocol &middot; No contracts
                </p>

                <div className="border-t border-halo-charcoal/[0.08] pt-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-halo-charcoal/50 mb-4">
                    What&rsquo;s included
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      "Initial physician consultation",
                      "Baseline metabolic + NAD-relevant panel",
                      "NAD+ 100mg weekly subcutaneous injection",
                      "Glutathione 200mg paired weekly",
                      "Follow-up labs at 90 days",
                      "Async physician access",
                      "Injection supplies and shipping",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[13px] text-halo-charcoal/80 leading-snug">
                        <span className="mt-[7px] flex-shrink-0 w-3 h-px" style={{ background: PERSONA }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/quiz?from=nad"
                  className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold text-sm transition-all hover:brightness-95"
                  style={{
                    backgroundColor: PERSONA,
                    boxShadow: `0 8px 28px ${PERSONA}45`,
                  }}
                >
                  Start my assessment
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-[11px] text-halo-charcoal/45 italic mt-4">
                  No contracts. Cancel anytime.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                  Questions
                </p>
                <h3 className="headline-section text-2xl md:text-3xl text-halo-charcoal leading-[1.15] mb-8">
                  Everything worth asking.
                </h3>
                <FAQ items={faqItems} />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          15 · FINAL CTA
          ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-24 px-6" style={{ background: "#0D1220" }}>
        <HaloPattern variant="default" intensity={1.8} color={PERSONA} showCore={false} className="absolute inset-0 w-full h-full" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-5" style={{ color: PERSONA_SOFT }}>
              Aging isn&rsquo;t optional. The drift is.
            </p>
            <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-white leading-[1.1] mb-6">
              Take on{" "}
              <span className="italic" style={{ color: PERSONA_SOFT }}>
                Father Time.
              </span>
            </h2>
            <p className="text-[15px] md:text-base text-white/60 leading-relaxed mb-10 max-w-xl mx-auto">
              Starts at $179/mo. Free physician consultation before any
              prescription. Cancel anytime.
            </p>
            <Link
              href="/quiz?from=nad"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[#0D1220] font-semibold text-sm transition-all hover:brightness-95"
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
          Halo is a technology platform that connects patients with licensed
          healthcare providers. All clinical decisions are made by independent
          licensed providers. Individual results vary. Not medical advice.
          Compounded drug products are not FDA-approved or evaluated. NAD+
          therapy is not intended to diagnose, treat, cure, or prevent any
          disease, and Halo makes no lifespan claims. Rx required. Not
          available in all 50 states.
        </p>
      </div>
    </>
  );
}
