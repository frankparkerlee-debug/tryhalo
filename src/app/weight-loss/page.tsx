"use client";

import Link from "next/link";
import { ArrowRight, Check, X, Minus } from "lucide-react";
import { useState } from "react";
import FAQ from "@/components/FAQ";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import HaloPattern from "@/components/HaloPattern";
import HaloMarquee from "@/components/HaloMarquee";
import ScrollRotate from "@/components/ScrollRotate";
import BenefitScroller from "@/components/BenefitScroller";

/* ==============================
   PERSONA — GLP-1 = burnt terracotta (change + energy)
   ============================== */
const PERSONA = "#C5603D";
const PERSONA_SOFT = "#E09874";
const PERSONA_DEEP = "#8F4324";

/* ==============================
   DATA
   ============================== */

const products = [
  {
    name: "Compounded Semaglutide",
    badge: "Most prescribed",
    stock: "In stock",
    stockColor: "#4A7A4A",
    price: "$199",
    image: "/glp/product-semaglutide.jpg",
    bullets: [
      "Same active ingredient as Wegovy®",
      "Weekly subcutaneous injection",
      "Titrated over 16 weeks",
    ],
  },
  {
    name: "Compounded Tirzepatide",
    badge: null,
    stock: "In stock",
    stockColor: "#4A7A4A",
    price: "$249",
    image: "/glp/product-tirzepatide.jpg",
    bullets: [
      "Same active ingredient as Zepbound®",
      "Dual GLP-1 / GIP receptor agonist",
      "Higher average weight loss",
    ],
  },
  {
    name: "Branded Wegovy® / Zepbound®",
    badge: null,
    stock: "Insurance-dependent",
    stockColor: "#B8974E",
    price: "Varies",
    image: "/glp/product-branded.jpg",
    bullets: [
      "FDA-approved brand medication",
      "Pricing through your insurance",
      "We handle prior authorization",
    ],
  },
];

const impactStats = [
  {
    numberText: "42%",
    label: "of U.S. adults have obesity or severe obesity.",
    source: "CDC NHANES, 2021\u20132023",
  },
  {
    numberText: "5+ diets",
    label: "the average adult tries before considering medication.",
    source: "International Journal of Obesity, 2022",
  },
  {
    numberText: "<1%",
    label: "of eligible patients are offered prescription weight care.",
    source: "Gasoyan et al., Obesity, 2022",
  },
];

const flipSymptoms = [
  { before: "Food noise all day", after: "Quiet appetite" },
  { before: "Post-meal crash", after: "Steady energy" },
  { before: "Plateau after plateau", after: "Steady loss" },
  { before: "Cravings at 9pm", after: "No second dinner" },
  { before: "Size up every year", after: "Clothes that fit" },
  { before: "Losing the diet battle", after: "Not fighting anymore" },
];

const outcomes = [
  {
    stat: "15%",
    label: "Body weight",
    claim:
      "Average reduction at 68 weeks on semaglutide 2.4mg. Tirzepatide averages 20%.",
    image: "/glp/life-appetite.jpg",
    source: "Wilding et al., NEJM, 2021",
  },
  {
    stat: "68%",
    label: "Food noise",
    claim:
      "Of patients report reduced food intrusion and cravings within 8 weeks.",
    image: "/glp/life-energy.jpg",
    source: "Patient-reported outcomes, published trial data",
  },
  {
    stat: "1.7%",
    label: "HbA1c",
    claim:
      "Average reduction in A1c for pre-diabetic patients on GLP-1 therapy.",
    image: "/glp/life-metabolic.jpg",
    source: "STEP 2 Trial, Lancet, 2021",
  },
];

const titrationWeeks = [
  { week: "Wk 1\u20134", dose: "0.25 mg", note: "Starting dose" },
  { week: "Wk 5\u20138", dose: "0.5 mg", note: "First escalation" },
  { week: "Wk 9\u201312", dose: "1.0 mg", note: "Building tolerance" },
  { week: "Wk 13\u201316", dose: "1.7 mg", note: "Second escalation" },
  { week: "Wk 17+", dose: "2.4 mg", note: "Maintenance" },
];

const comparisonRows = [
  {
    label: "Baseline metabolic panel",
    halo: "HbA1c, insulin, lipids, thyroid, liver, kidney",
    typical: "Weight and BMI only",
  },
  { label: "Physician consultation", halo: "Within 5 days", typical: "Weeks to months" },
  { label: "Dose titration", halo: "Designed to your response", typical: "Fixed schedule" },
  { label: "Follow-up monitoring", halo: "Labs at 90 days", typical: "Not included" },
  { label: "Side-effect management", halo: "Async physician access", typical: "Emergency room" },
  { label: "Insurance required", halo: "Optional", typical: "Often required" },
  { label: "Cancel anytime", halo: "Yes, no contract", typical: "Contract-locked" },
];

const benefits = [
  "Physician-designed",
  "Full metabolic panel",
  "Weekly titration",
  "Ongoing monitoring",
  "503A pharmacy",
  "HSA/FSA eligible",
  "Cancel anytime",
  "No insurance required",
];

const marqueeItems = [
  { symptom: "Food Noise", outcome: "Quiet Appetite" },
  { symptom: "Plateau", outcome: "Steady Loss" },
  { symptom: "3pm Crash", outcome: "Sustained Energy" },
  { symptom: "Cravings", outcome: "Satiety" },
  { symptom: "Size Creep", outcome: "Clothes Fit" },
  { symptom: "Diet Fatigue", outcome: "It Just Works" },
];

const biomarkers = [
  "HbA1c",
  "Fasting Insulin",
  "Fasting Glucose",
  "Total Cholesterol",
  "LDL",
  "HDL",
  "Triglycerides",
  "ApoB",
  "hs-CRP",
  "TSH",
  "Free T4",
  "ALT",
  "AST",
  "Creatinine",
  "eGFR",
  "Vitamin D",
  "B12",
  "CBC",
  "Testosterone (men)",
  "Estradiol (women)",
];

const featuredPhysician = {
  name: "Dr. Priya Patel, MD",
  title: "Internal Medicine \u00B7 Metabolic Health",
  image: "/providers/priya-patel.png",
};

const faqItems = [
  {
    question: "Who is GLP-1 weight loss for?",
    answer:
      "Adults with a BMI over 27 (with metabolic risk factors) or over 30. We start with a full metabolic panel to confirm you\u2019re a candidate \u2014 not just a weight number.",
  },
  {
    question: "Compounded vs branded \u2014 what\u2019s the difference?",
    answer:
      "Compounded semaglutide and tirzepatide use the same active ingredients as Wegovy and Zepbound, prepared by a US-licensed 503A pharmacy. They\u2019re not FDA-approved as finished products, but the active ingredients and pharmacy standards are. Compounded is significantly less expensive and in stock. Branded is FDA-approved; pricing depends on your insurance.",
  },
  {
    question: "What are the side effects?",
    answer:
      "Most common: nausea, constipation, heartburn, fatigue \u2014 usually during dose escalation. Serious but rare: pancreatitis, gallbladder issues. Not appropriate if you have a personal or family history of MTC or MEN 2 syndrome. Your physician screens for this up front.",
  },
  {
    question: "Do I have to stay on it forever?",
    answer:
      "Most people who stop GLP-1s regain the weight over 12\u201318 months. That\u2019s biology, not willpower. Some patients taper to a lower maintenance dose. Others stay on 2.4mg indefinitely. Your physician walks you through the tradeoffs.",
  },
  {
    question: "Will my insurance cover this?",
    answer:
      "Maybe. Branded Wegovy and Zepbound are sometimes covered for obesity. Compounded versions aren\u2019t insurance-billed but are significantly less expensive. We handle prior authorization paperwork for the branded route if you want to try your insurance first.",
  },
  {
    question: "How fast will I lose weight?",
    answer:
      "Most people see 1\u20132 lbs per week during dose escalation. Full results accrue over 6\u201312 months. Semaglutide averages 15% body weight at 68 weeks; tirzepatide averages 20%.",
  },
  {
    question: "What labs do you run?",
    answer:
      "HbA1c, fasting insulin, fasting glucose, full lipid panel, ApoB, hs-CRP, TSH, free T4, liver enzymes (ALT, AST), kidney function (creatinine, eGFR), CBC, vitamin D, B12, and sex hormones. Follow-up at 90 days.",
  },
  {
    question: "Cancel anytime?",
    answer:
      "Yes. No contracts. Cancel through your member portal or by emailing your care team. Your prescription continues through the current shipment cycle.",
  },
];

/* ==============================
   COMPONENT: BIOMARKER SCROLL (local, matches TRT pattern)
   ============================== */

function BiomarkerScroll() {
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
          What we test before prescribing
        </p>
        <h3 className="font-serif text-2xl md:text-3xl text-white leading-[1.15] tracking-tight max-w-2xl mx-auto">
          Every protocol starts with a full metabolic panel.{" "}
          <span className="italic text-white/55">Not just BMI.</span>
        </h3>
      </div>

      <div className="relative mb-4 marquee-mask">
        <div className="marquee-track-right flex gap-3 md:gap-4 whitespace-nowrap">
          {items.map((m, i) => (
            <span
              key={`r1-${i}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] md:text-[12px] font-medium text-white/75 flex-shrink-0"
              style={{
                borderColor: "rgba(224,152,116,0.25)",
                background: "rgba(197,96,61,0.06)",
              }}
            >
              <span className="w-1 h-1 rounded-full" style={{ background: PERSONA }} />
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
              style={{
                background: "rgba(197,96,61,0.12)",
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
          .marquee-track-right, .marquee-track-left { animation: none; }
        }
      `}</style>
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
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/40 mb-2">
                  Before
                </p>
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
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/65 mb-2">
                  On protocol
                </p>
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
   COMPONENT: PRODUCT CARD
   ============================== */

function ProductCard({ product }: { product: (typeof products)[number] }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div className="group relative rounded-[20px] border border-halo-charcoal/[0.08] bg-white overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.22)] hover:-translate-y-1">
      {product.badge && (
        <span
          className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-[0.18em]"
          style={{ background: PERSONA, color: "white" }}
        >
          <span className="w-1 h-1 rounded-full bg-white" />
          {product.badge}
        </span>
      )}

      <div
        className="relative aspect-[4/5] flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(145deg, #F5F1EA 0%, ${PERSONA_SOFT}40 60%, ${PERSONA}30 100%)`,
        }}
      >
        {!imgFailed && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setImgFailed(true)}
          />
        )}
        {imgFailed && (
          <div className="flex flex-col items-center gap-2 opacity-40" aria-hidden="true">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: PERSONA_DEEP }}>
              Halo
            </span>
            <span className="font-serif text-[18px] italic text-center px-4" style={{ color: PERSONA_DEEP }}>
              {product.name}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 md:p-6">
        <div className="flex items-baseline justify-between mb-3 gap-2">
          <h3 className="font-serif text-[18px] md:text-[20px] text-halo-charcoal leading-tight tracking-tight flex-1">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-1 flex-shrink-0">
            {product.price !== "Varies" && (
              <span className="text-[10px] text-halo-charcoal/40 uppercase tracking-[0.15em]">
                From
              </span>
            )}
            <span className="font-serif text-[20px] font-light" style={{ color: PERSONA_DEEP }}>
              {product.price}
            </span>
            {product.price !== "Varies" && (
              <span className="text-[10px] text-halo-charcoal/50">/mo</span>
            )}
          </div>
        </div>

        <div
          className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] mb-4 px-2 py-0.5 rounded-full"
          style={{ background: `${product.stockColor}18`, color: product.stockColor }}
        >
          <span className="w-1 h-1 rounded-full" style={{ background: product.stockColor }} />
          {product.stock}
        </div>

        <ul className="space-y-2 mb-5">
          {product.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-[13px] text-halo-charcoal/70 leading-snug">
              <Check className="w-3.5 h-3.5 flex-shrink-0 mt-[3px]" strokeWidth={2.5} style={{ color: PERSONA }} />
              {b}
            </li>
          ))}
        </ul>

        <div
          className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] px-3 py-2 rounded-full mb-5"
          style={{ background: `${PERSONA}10`, color: PERSONA_DEEP }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: PERSONA }} />
          Full lab panel included
        </div>

        <Link
          href="/quiz?from=weight-loss"
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
          {outcome.label}
        </p>
        <div className="flex items-baseline gap-3 mb-3">
          <span className="font-serif text-[56px] md:text-[64px] font-light leading-none tracking-tight" style={{ color: PERSONA_DEEP }}>
            {outcome.stat}
          </span>
          <span className="w-8 h-px" style={{ background: PERSONA, opacity: 0.4 }} aria-hidden="true" />
        </div>
        <p className="text-[14px] text-halo-charcoal/70 leading-relaxed mb-2">
          {outcome.claim}
        </p>
        <p className="text-[11px] italic text-halo-charcoal/40">
          {outcome.source}
        </p>
      </div>
    </div>
  );
}

/* ==============================
   COMPONENT: COMPARISON TABLE
   ============================== */

function ComparisonTable() {
  return (
    <div className="rounded-[22px] overflow-hidden border border-halo-charcoal/[0.08] bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.12)]">
      <div className="grid grid-cols-[1.3fr_1fr_1fr] border-b border-halo-charcoal/[0.08]">
        <div className="p-4 md:p-5 flex items-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/40">
            Compare
          </span>
        </div>
        <div className="p-4 md:p-5 flex items-center justify-center text-center" style={{ background: `${PERSONA}10` }}>
          <div>
            <p className="font-serif text-[16px] md:text-[18px] leading-tight tracking-tight" style={{ color: PERSONA_DEEP }}>
              Halo
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em]" style={{ color: PERSONA }}>
              Your protocol
            </p>
          </div>
        </div>
        <div className="p-4 md:p-5 flex items-center justify-center text-center">
          <div>
            <p className="font-serif text-[16px] md:text-[18px] text-halo-charcoal/70 leading-tight tracking-tight">
              Typical telehealth
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/40">
              Or your PCP
            </p>
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
          <div className="p-4 md:p-5 text-[13px] md:text-[14px] text-halo-charcoal/80 font-medium">
            {row.label}
          </div>
          <div
            className="p-4 md:p-5 text-center text-[13px] md:text-[14px] font-medium"
            style={{ background: `${PERSONA}08`, color: PERSONA_DEEP }}
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
      ))}
    </div>
  );
}

/* ==============================
   COMPONENT: TITRATION TIMELINE
   ============================== */

function TitrationTimeline() {
  return (
    <div className="relative rounded-[22px] border border-halo-charcoal/[0.08] bg-white p-6 md:p-8 lg:p-10">
      {/* Connector line */}
      <div className="hidden md:block absolute top-[68px] left-[10%] right-[10%] h-px" style={{ background: `${PERSONA}30` }} aria-hidden="true" />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-3 relative">
        {titrationWeeks.map((step, i) => (
          <div key={step.week} className="relative text-center md:text-left">
            {/* Dot */}
            <div className="relative z-10 w-10 h-10 rounded-full mx-auto md:mx-0 mb-4 flex items-center justify-center bg-white" style={{ border: `1.5px solid ${PERSONA}` }}>
              <span className="text-[10px] font-bold" style={{ color: PERSONA_DEEP }}>
                {i + 1}
              </span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: PERSONA }}>
              {step.week}
            </p>
            <p className="font-serif text-[22px] md:text-[24px] font-light text-halo-charcoal leading-none mb-2 tracking-tight">
              {step.dose}
            </p>
            <p className="text-[12px] text-halo-charcoal/55 italic">
              {step.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==============================
   PAGE
   ============================== */

export default function WeightLossPage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════
          1 · HERO — Bento with mixed motion
          ═══════════════════════════════════════════════ */}
      <section className="relative section-light overflow-hidden">
        <div className="grid lg:grid-cols-[38%_62%] lg:min-h-[680px]">
          {/* LEFT — Content */}
          <div className="relative flex flex-col justify-center px-6 md:px-10 lg:px-14 py-12 md:py-16 lg:py-20 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                style={{ color: PERSONA }}
              >
                GLP-1 Weight Loss
              </span>
            </div>

            <h1 className="headline-hero text-[34px] md:text-[44px] lg:text-[52px] text-halo-charcoal leading-[1.05] tracking-tight mb-5">
              Less weight.{" "}
              <span className="italic" style={{ color: PERSONA }}>
                More everything else.
              </span>
            </h1>

            <p className="text-[16px] md:text-[17px] text-halo-charcoal/70 leading-relaxed mb-8 max-w-md">
              Physician-led GLP-1 weight loss for men and women. Full metabolic
              panel. Dose titrated to your labs. Medication in 14 days.
            </p>

            <ul className="space-y-2.5 mb-9 max-w-md">
              {[
                "Compounded semaglutide or tirzepatide, or branded.",
                "Physician reviews a full metabolic panel first.",
                "Dose escalated and monitored every 90 days.",
              ].map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span
                    className="mt-[10px] flex-shrink-0 w-5 h-px"
                    style={{ background: PERSONA }}
                  />
                  <span className="text-[14px] md:text-[15px] text-halo-charcoal/85 leading-snug">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Link
                href="/quiz?from=weight-loss"
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
                href="/quiz?from=weight-loss"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-halo-charcoal/20 text-halo-charcoal font-semibold text-sm hover:border-halo-charcoal/40 transition-colors"
              >
                See if I qualify
              </Link>
            </div>

            <p className="text-[12px] text-halo-charcoal/50 italic">
              Free physician consultation before any prescription.
            </p>
          </div>

          {/* RIGHT — Bento grid */}
          <div
            className="relative order-1 lg:order-2 min-h-[400px] md:min-h-[500px] lg:min-h-0 p-4 md:p-6 lg:p-8"
            style={{
              background: `linear-gradient(165deg, #F7EEE6 0%, #ECD8C6 50%, ${PERSONA_SOFT} 100%)`,
            }}
          >
            {/* Mobile-only CTA overlay — above the fold on phones */}
            <div className="md:hidden absolute bottom-5 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none">
              <Link
                href="/quiz?from=weight-loss"
                className="pointer-events-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-white font-semibold text-sm shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                style={{ backgroundColor: PERSONA }}
              >
                Start my assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-3 grid-rows-2 gap-2 md:gap-3 h-full min-h-[380px] md:min-h-[460px] lg:min-h-[580px]">
              {/* Woman portrait — tile 1 */}
              <div
                className="relative col-span-1 row-span-1 rounded-[14px] md:rounded-[18px] overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, #F5E4D4 0%, ${PERSONA_SOFT}80 100%)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/glp/hero-woman.jpg"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Product vial — tile 2 (with scroll rotation) */}
              <div
                className="relative col-span-1 row-span-1 rounded-[14px] md:rounded-[18px] overflow-hidden flex items-center justify-center"
                style={{
                  background: `linear-gradient(145deg, #EDE0D2 0%, ${PERSONA}25 100%)`,
                }}
              >
                <ScrollRotate maxDeg={20} scrollExtent={1000} axis="y" className="w-[60%] h-[60%] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/glp/product-vial.png"
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-contain drop-shadow-xl"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </ScrollRotate>
              </div>

              {/* App UI — tile 3 */}
              <div
                className="relative col-span-1 row-span-2 rounded-[14px] md:rounded-[18px] overflow-hidden flex items-center justify-center"
                style={{
                  background: `linear-gradient(145deg, ${PERSONA_DEEP} 0%, ${PERSONA} 100%)`,
                }}
              >
                {/* App mockup — SVG fallback */}
                <div className="relative w-[80%] h-[75%] rounded-[10px] bg-white/95 backdrop-blur-sm p-3 md:p-4 shadow-xl">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-halo-charcoal/40 mb-1">
                    Your protocol
                  </p>
                  <p className="font-serif text-[16px] md:text-[22px] font-light leading-none mb-3 md:mb-4" style={{ color: PERSONA_DEEP }}>
                    Week 8
                  </p>
                  <div className="mb-3 md:mb-4">
                    <p className="text-[7px] uppercase tracking-wider text-halo-charcoal/40 mb-1">Dose</p>
                    <p className="text-[11px] md:text-[13px] font-semibold text-halo-charcoal">0.5mg semaglutide</p>
                  </div>
                  <div className="mb-3 md:mb-4">
                    <p className="text-[7px] uppercase tracking-wider text-halo-charcoal/40 mb-1">Weight trend</p>
                    {/* Mini trend line */}
                    <svg viewBox="0 0 120 30" className="w-full h-6 md:h-8">
                      <path
                        d="M 0 8 L 20 10 L 40 14 L 60 18 L 80 22 L 100 24 L 120 26"
                        fill="none"
                        stroke={PERSONA}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <circle cx="120" cy="26" r="2" fill={PERSONA} />
                    </svg>
                    <p className="text-[9px] text-halo-charcoal/60 mt-1">&minus;9.2 lbs</p>
                  </div>
                  <div>
                    <p className="text-[7px] uppercase tracking-wider text-halo-charcoal/40 mb-1">Next lab</p>
                    <p className="text-[10px] text-halo-charcoal/70">30 days</p>
                  </div>
                </div>
              </div>

              {/* Man portrait — tile 4 */}
              <div
                className="relative col-span-1 row-span-1 rounded-[14px] md:rounded-[18px] overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, #E4D2C0 0%, ${PERSONA}35 100%)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/glp/hero-man.jpg"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Lifestyle / kitchen — tile 5 */}
              <div
                className="relative col-span-1 row-span-1 rounded-[14px] md:rounded-[18px] overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, #F0DDC8 0%, #D9B896 100%)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/glp/hero-kitchen.jpg"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="border-t border-halo-charcoal/[0.08] bg-white/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/60">
            <span>Board-certified physicians</span>
            <span className="text-halo-charcoal/20">&middot;</span>
            <span>US-licensed 503A pharmacy</span>
            <span className="text-halo-charcoal/20">&middot;</span>
            <span>HIPAA secure</span>
            <span className="text-halo-charcoal/20">&middot;</span>
            <span>HSA/FSA eligible</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2 · BENEFIT SCROLLER — auto-scrolling one-line
          ═══════════════════════════════════════════════ */}
      <BenefitScroller items={benefits} accent={PERSONA} background="#FAF8F4" speed={50} />

      {/* ═══════════════════════════════════════════════
          3 · MARQUEE — symptom → outcome
          ═══════════════════════════════════════════════ */}
      <HaloMarquee items={marqueeItems} />

      {/* ═══════════════════════════════════════════════
          4 · THE TREATMENT GAP
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                The treatment gap
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                The problem isn&rsquo;t{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  willpower.
                </span>
                <br className="hidden md:block" />{" "}
                It&rsquo;s biology the system ignores.
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 max-w-xl mx-auto mt-5 leading-relaxed">
                You&rsquo;ve tried the diets. You&rsquo;ve tried the discipline.
                Your PCP suggested you try again. GLP-1s treat the underlying
                biology. Not the willpower.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10 lg:gap-x-10">
              {impactStats.map((stat, i) => (
                <div key={i} className="aos-child text-center md:text-left flex flex-col">
                  <p className="font-serif text-[44px] md:text-[60px] lg:text-[68px] font-light leading-[0.95] mb-3 tracking-tight" style={{ color: PERSONA }}>
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
          5 · BIOMARKER SCROLL — metabolic panel depth
          ═══════════════════════════════════════════════ */}
      <BiomarkerScroll />

      {/* ═══════════════════════════════════════════════
          6 · HOW GLP-1 WORKS — science
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6" style={{ background: "#F7F3EC" }}>
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-10 md:mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                The science
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1] max-w-3xl mx-auto">
                GLP-1s don&rsquo;t suppress appetite.{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  They restore it.
                </span>
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 max-w-xl mx-auto mt-5 leading-relaxed">
                Slower gastric emptying. Stronger satiety signaling. Better
                insulin response. Your body learns what full feels like again.{" "}
                <span className="italic text-halo-charcoal/45">
                  Wilding et al., NEJM, 2021.
                </span>
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {[
                {
                  title: "Slower emptying",
                  body:
                    "Food stays in your stomach longer. You feel full on less.",
                },
                {
                  title: "Satiety signal",
                  body:
                    "GLP-1 receptors in your brain register fullness earlier and longer.",
                },
                {
                  title: "Insulin response",
                  body:
                    "Blood sugar stabilizes. Fewer crashes. Fewer cravings.",
                },
              ].map((m) => (
                <div
                  key={m.title}
                  className="aos-child rounded-[20px] border border-halo-charcoal/[0.08] p-6 md:p-7"
                  style={{ background: "#FAF8F4" }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: PERSONA }}>
                    Mechanism
                  </p>
                  <h3 className="font-serif text-[22px] md:text-[24px] text-halo-charcoal leading-tight tracking-tight mb-3">
                    {m.title}
                  </h3>
                  <p className="text-[14px] text-halo-charcoal/70 leading-relaxed">
                    {m.body}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

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
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.08] max-w-2xl mx-auto">
                Your relationship with food,{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  quiet again.
                </span>
              </h2>
              <p className="text-[14px] md:text-[15px] text-halo-charcoal/55 max-w-lg mx-auto mt-5 leading-relaxed italic">
                Hover or tap. See what changes.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <SymptomFlipCards />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8 · PRODUCT COMPARISON — 3 cards with pricing + stock
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6" style={{ background: "#F0EBE0" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                Your options
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                Three paths.{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  Same physicians.
                </span>
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 max-w-xl mx-auto mt-5 leading-relaxed">
                Compounded GLP-1s are significantly more affordable and in
                stock. Branded options are FDA-approved and may be covered by
                insurance. Your physician helps you pick.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {products.map((p) => (
                <div key={p.name} className="aos-child">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <p className="text-center text-[11px] italic text-halo-charcoal/40 mt-10 max-w-2xl mx-auto">
              Compounded medications are not FDA-approved as finished products.
              They are prepared by US-licensed 503A pharmacies under USP 797
              standards. Not available in all 50 states.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9 · TITRATION PROTOCOL
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-10 md:mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                The protocol
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1] max-w-3xl mx-auto">
                Dose up gradually.{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  Minimize side effects.
                </span>
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 max-w-xl mx-auto mt-5 leading-relaxed">
                Semaglutide titration typically runs 16 weeks to maintenance.
                Your physician adjusts based on your tolerance and response.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <TitrationTimeline />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          10 · COMPARISON TABLE — Halo vs typical
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light" style={{ background: "#FAF8F4" }}>
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                The difference
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1] max-w-3xl mx-auto">
                Weight loss done{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  like medicine.
                </span>
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 max-w-xl mx-auto mt-5 leading-relaxed">
                What you&rsquo;d get at quick-Rx telehealth or a GP, vs what
                you get at Halo.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <ComparisonTable />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          11 · 90-DAY OUTCOMES
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                What to expect
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1] max-w-3xl mx-auto">
                Real numbers.{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  Real trials.
                </span>{" "}
                Not marketing.
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
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          12 · PHYSICIAN STRIP
          ═══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 px-6 section-light">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div
              className="rounded-[20px] p-6 md:p-8 lg:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center"
              style={{ background: "#F5ECE0" }}
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
                  A metabolic{" "}
                  <span className="italic text-halo-charcoal/70">
                    specialist.
                  </span>
                  <br className="hidden md:block" />
                  Not a weight-loss mill.
                </h3>
                <p className="text-[14px] text-halo-charcoal/60 leading-relaxed max-w-lg md:mx-0 mx-auto">
                  Halo physicians are board-certified internists and
                  endocrinologists with specific training in metabolic health,
                  GLP-1 titration, and side-effect management.
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          13 · PRICING + FAQ
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light" style={{ background: "#FAF8F4" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
                Terms
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                Everything included.{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  Membership, medication, labs.
                </span>
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 md:gap-12 items-start">
            <AnimateOnScroll>
              <div className="rounded-[24px] bg-white border border-halo-charcoal/[0.08] p-7 md:p-10 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.15)] lg:sticky lg:top-24">
                <div className="flex items-baseline gap-2 md:gap-3 mb-2 flex-wrap">
                  <span className="font-serif text-[44px] md:text-[64px] font-light leading-none" style={{ color: PERSONA }}>
                    $199
                  </span>
                  <span className="text-[15px] md:text-[18px] text-halo-charcoal/50">
                    /month
                  </span>
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: PERSONA_DEEP }}>
                  Starting price, compounded semaglutide
                </p>

                <div className="border-t border-halo-charcoal/[0.08] pt-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-halo-charcoal/50 mb-4">
                    What&rsquo;s included
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      "Initial physician consultation",
                      "Full baseline metabolic panel",
                      "Compounded GLP-1 medication",
                      "Physician-designed dose titration",
                      "Async physician access",
                      "Follow-up labs at 90 days",
                      "Injection supplies included",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[13px] text-halo-charcoal/80 leading-snug">
                        <span className="mt-[7px] flex-shrink-0 w-3 h-px" style={{ background: PERSONA }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/quiz?from=weight-loss"
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
          14 · FINAL CTA
          ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-24 px-6" style={{ background: "#1C1817" }}>
        <HaloPattern variant="default" intensity={1.8} color={PERSONA} showCore={false} className="absolute inset-0 w-full h-full" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-5" style={{ color: PERSONA_SOFT }}>
              Weight loss, measured
            </p>
            <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-white leading-[1.1] mb-6">
              Less weight.{" "}
              <span className="italic" style={{ color: PERSONA_SOFT }}>
                More everything else.
              </span>
            </h2>
            <p className="text-[15px] md:text-base text-white/60 leading-relaxed mb-10 max-w-xl mx-auto">
              First physician consultation is free. No commitment until your
              physician reviews your metabolic panel.
            </p>
            <Link
              href="/quiz?from=weight-loss"
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
          Halo is a technology platform that connects patients with licensed
          healthcare providers. All clinical decisions are made by independent
          licensed providers. Individual results vary. Not medical advice.
          Compounded drug products are not FDA-approved or evaluated.
          GLP-1 medications may cause nausea, vomiting, diarrhea, pancreatitis,
          or gallbladder issues. Not for personal or family history of MTC or
          MEN 2 syndrome. Rx required. Not available in all 50 states.
        </p>
      </div>
    </>
  );
}
