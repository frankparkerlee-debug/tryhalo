"use client";

import Link from "next/link";
import { ArrowRight, Check, Clock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import FAQ from "@/components/FAQ";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import PillPattern from "@/components/PillPattern";
import HaloMarquee from "@/components/HaloMarquee";
import {
  applyFoundingDiscount,
  formatPrice,
  getProgram,
} from "@/lib/programs";

/* ==============================
   PRICING — pulled from canonical programs data.
   Two variants: Sermorelin (GH peptide) + B12 / Glutathione / Lipo-C stack.
   ============================== */

const PEPTIDES_PROGRAM = getProgram("peptides")!;
const SERMORELIN_VARIANT = PEPTIDES_PROGRAM.variants!.find(
  (v) => v.id === "sermorelin"
)!;
const B12_VARIANT = PEPTIDES_PROGRAM.variants!.find(
  (v) => v.id === "b12_stack"
)!;

const SERMORELIN_MONTHLY = applyFoundingDiscount(
  SERMORELIN_VARIANT.pricing!.monthly!
);
const SERMORELIN_QUARTERLY_PER_MO = Math.round(
  applyFoundingDiscount(SERMORELIN_VARIANT.pricing!.quarterly!) / 3
);
const SERMORELIN_YEARLY_PER_MO = Math.round(
  applyFoundingDiscount(SERMORELIN_VARIANT.pricing!.yearly!) / 12
);
const SERMORELIN_YEARLY_SAVINGS_PCT = Math.round(
  (1 - SERMORELIN_YEARLY_PER_MO / SERMORELIN_MONTHLY) * 100
);

const B12_MONTHLY = applyFoundingDiscount(B12_VARIANT.pricing!.monthly!);

/* ==============================
   PERSONA — Peptides = green
   ============================== */
const PERSONA = "#6B8F68";
const PERSONA_SOFT = "#A8C0A5";
const PERSONA_DEEP = "#4F7050";

/* ==============================
   PEPTIDE FAMILIES — the heart of the page.
   Six therapeutic categories, varying availability under the current 503A
   regime. Status badges are honest about what's prescribable today vs what
   we expect back after the July 2026 PCAC review.
   ============================== */

type Availability = "available" | "returning" | "in-review";

interface PeptideFamily {
  id: string;
  category: string;
  title: string;
  goal: string;
  compounds: string[];
  body: string;
  bullets: string[];
  availability: Availability;
  availabilityNote: string;
}

const peptideFamilies: PeptideFamily[] = [
  {
    id: "performance",
    category: "Performance & GH",
    title: "Sleep deeper. Recover faster. Train consistently.",
    goal: "Restore growth-hormone signaling that declines ~14% per decade after 30.",
    compounds: ["Sermorelin", "CJC-1295 / Ipamorelin"],
    body:
      "Growth-hormone secretagogues that signal your pituitary to produce more GH on its own — distinct from synthetic HGH. Sermorelin is the long-established GHRH analog. CJC/Ipa is the gold-standard combination expected to return to legal compounding after the July review.",
    bullets: [
      "Subcutaneous injection — typically before bed",
      "Felt change in sleep depth within 2–4 weeks",
      "Body composition + recovery follow over 90 days",
    ],
    availability: "available",
    availabilityNote: "Sermorelin available now · CJC/Ipa expected back 2027",
  },
  {
    id: "metabolic",
    category: "Metabolic Support",
    title: "Steady energy. Cleaner workouts. Sharper recovery.",
    goal: "Targeted metabolic and recovery substrates delivered subcutaneously.",
    compounds: ["B12 (methylcobalamin)", "Glutathione", "Lipo-C"],
    body:
      "A maintenance stack for members who want the metabolic benefits without going into full GH-peptide territory. Methylated B12 supports energy and methylation status; glutathione is the body's master antioxidant; Lipo-C supports fat metabolism and liver function.",
    bullets: [
      "Weekly subcutaneous injection",
      "No prescription bottleneck — broadly compoundable",
      "Pairs with TRT, HRT, NAD+, or runs solo",
    ],
    availability: "available",
    availabilityNote: "Available now · Independent of FDA peptide review",
  },
  {
    id: "recovery",
    category: "Recovery & Repair",
    title: "Soft-tissue repair after the recovery curve flattens.",
    goal: "Targeted healing for tendons, ligaments, gut lining, and chronic strain.",
    compounds: ["BPC-157", "TB-500"],
    body:
      "BPC-157 is a gastric-derived peptide widely used off-label for soft-tissue and gut-lining repair. TB-500 (a thymosin-beta-4 fragment) is its companion in most recovery protocols. Both are currently restricted under FDA Category 2 — under formal review at the July 23–24 PCAC meeting.",
    bullets: [
      "Filed in the strongest position for Category 1 reclassification",
      "Most-requested peptides among current Halo members",
      "Member protocols mapped for both outcomes",
    ],
    availability: "in-review",
    availabilityNote: "Pending July 2026 FDA review · Likely returning 2027",
  },
  {
    id: "anti-inflammatory",
    category: "Anti-Inflammatory",
    title: "Lower the noise systemic inflammation makes.",
    goal: "Modulate inflammatory signaling without immunosuppression.",
    compounds: ["KPV"],
    body:
      "An alpha-MSH tripeptide fragment with localized anti-inflammatory action — particularly studied for gut and skin inflammation. Under PCAC review with strong public-comment support for Category 1 classification.",
    bullets: [
      "Targeted action without broad immune dampening",
      "Compounded oral or subcutaneous formats",
      "Stacks cleanly with BPC-157 for gut-focused protocols",
    ],
    availability: "in-review",
    availabilityNote: "Pending July 2026 FDA review",
  },
  {
    id: "cognitive",
    category: "Cognitive Support",
    title: "Steadier focus under load.",
    goal: "Anxiolytic regulatory peptide for stress-load and cognitive resilience.",
    compounds: ["Selank"],
    body:
      "A short regulatory peptide with documented anxiolytic and nootropic effects in non-U.S. clinical literature. Less U.S. clinical history than the recovery family, which makes its PCAC trajectory less certain.",
    bullets: [
      "Intranasal or subcutaneous administration",
      "Non-sedating — works on GABAergic and immune signaling",
      "Limited U.S. clinical history (regulatory caveat)",
    ],
    availability: "in-review",
    availabilityNote: "Pending review · Lower probability of fast return",
  },
  {
    id: "longevity",
    category: "Longevity",
    title: "Telomerase, sirtuins, and the long-horizon protocols.",
    goal: "Pineal-gland tetrapeptide studied for telomere maintenance and circadian regulation.",
    compounds: ["Epitalon"],
    body:
      "A research-tier peptide with a long Russian clinical literature on telomerase activity and pineal-gland function. Mostly used in 10–20 day cycles rather than daily. Outside the formal channel today; we publish updates as the regulatory state evolves.",
    bullets: [
      "Cycle-based dosing (10–20 days, twice yearly)",
      "Strongest evidence base outside the U.S.",
      "Currently outside the legal compounding channel",
    ],
    availability: "in-review",
    availabilityNote: "Outside formal channel · Under review",
  },
];

const availabilityMeta: Record<
  Availability,
  { label: string; bg: string; color: string }
> = {
  available: {
    label: "Available now",
    bg: "rgba(107,143,104,0.12)",
    color: "#4F7050",
  },
  returning: {
    label: "Returning 2026",
    bg: "rgba(184,151,78,0.14)",
    color: "#B8974E",
  },
  "in-review": {
    label: "Pending FDA review",
    bg: "rgba(143,116,56,0.12)",
    color: "#8F7438",
  },
};

/* ==============================
   STATIC DATA
   ============================== */

const peptideMarquee = [
  { symptom: "Stalled Recovery", outcome: "Consecutive Days" },
  { symptom: "Light Sleep", outcome: "Deep Architecture" },
  { symptom: "Old Injuries", outcome: "Quiet Tendons" },
  { symptom: "Stubborn Composition", outcome: "Lean Response" },
  { symptom: "Inflammatory Drag", outcome: "Calm System" },
  { symptom: "Diffuse Energy", outcome: "Steady Output" },
];

const protocolSteps = [
  {
    day: "Day 1",
    title: "Profile",
    desc: "5-minute intake. Goal, history, training load, sleep state. Tells your physician what to watch for in the panel.",
  },
  {
    day: "Day 2–5",
    title: "Labs",
    desc: "Quest or Labcorp order, walk-in. We pull the markers that move on a peptide protocol — IGF-1, hs-CRP, CBC, metabolic panel.",
  },
  {
    day: "Day 6–10",
    title: "Consult",
    desc: "Video visit. Physician walks the panel and selects the protocol that matches the goal — performance, recovery, metabolic, or stacked.",
  },
  {
    day: "Day 11–14",
    title: "Delivery",
    desc: "Compounded by a US-licensed 503A pharmacy. Cold-pack shipped to your door. Reorders run on autopilot.",
  },
];

const peptideVsHGH = [
  {
    label: "Mechanism",
    peptide: "Signals your pituitary to release more of your own GH",
    hgh: "Replaces endogenous production with synthetic somatropin",
  },
  {
    label: "Regulatory",
    peptide: "Compounded at a licensed 503A pharmacy",
    hgh: "Schedule III in many states — controlled substance",
  },
  {
    label: "Pulsatility",
    peptide: "Preserves natural pulse architecture (especially CJC/Ipa)",
    hgh: "Flat exogenous level, suppresses native pulse",
  },
  {
    label: "Reversibility",
    peptide: "Stop and your pituitary resumes its baseline",
    hgh: "Stop and the suppressed axis takes longer to recover",
  },
  {
    label: "Cost",
    peptide: `$229 / mo (Sermorelin)`,
    hgh: "$800–$2,000+ / mo cash",
  },
];

const faqItems = [
  {
    question: "What are peptides?",
    answer:
      "Peptides are short chains of amino acids that act as signaling molecules. Different families do very different things — GH secretagogues like Sermorelin signal the pituitary, BPC-157 supports tissue repair, KPV modulates inflammation. They share biochemistry, not therapeutic effect.",
  },
  {
    question: "Is this the same as HGH?",
    answer:
      "No. Halo Peptide Therapy uses growth-hormone secretagogues that prompt your pituitary to produce more GH on its own. This is fundamentally different from synthetic HGH (somatropin), a controlled substance with separate regulation, dosing, and monitoring requirements.",
  },
  {
    question: "What's available right now vs what's coming back?",
    answer:
      "Available today: Sermorelin (GH peptide) and the B12/Glutathione/Lipo-C metabolic stack. Under FDA review at the July 2026 PCAC meeting: BPC-157, TB-500, KPV, CJC-1295/Ipamorelin. Members on existing protocols are not affected by the review until the FDA acts on the recommendations. We publish a follow-up brief after each meeting.",
  },
  {
    question: "Can I combine peptides with other Halo programs?",
    answer:
      "Yes — peptides stack particularly cleanly with TRT, HRT, and NAD+ programs. Your physician coordinates dosing and monitoring across programs so you don't have one provider working blind on what another prescribed.",
  },
  {
    question: "How are peptides administered?",
    answer:
      "Most are subcutaneous injection — same workflow as a GLP-1 pen but with a finer needle. GH peptides typically dose before bed since GH is primarily released in deep sleep. KPV is available oral or subcutaneous. Selank is intranasal. Your physician walks the technique on the consult; most members are comfortable within two days.",
  },
  {
    question: "How fast will I feel it?",
    answer:
      "Sleep depth shifts in 2–4 weeks on a GH peptide protocol. Recovery and body composition follow over 8–12 weeks. Recovery peptides (BPC-157, TB-500) move on the timescale of the tissue they're targeting — usually weeks for soft tissue, longer for chronic injuries.",
  },
  {
    question: "What happens if the FDA review goes against the peptides I want?",
    answer:
      "We've built every protocol to survive the conservative outcome. Sermorelin and the B12 stack don't depend on the review at all. If BPC-157 or KPV stay restricted, our recovery protocols substitute compounds that don't require Category 2 reclassification. The program is built to outlast the regulatory cycle.",
  },
  {
    question: "Cancel anytime?",
    answer:
      "Yes. No contracts. Cancel through your member portal or by emailing your care team. Your prescription continues through the current shipment cycle.",
  },
];

/* ==============================
   PAGE
   ============================== */

export default function PeptideTherapyPage() {
  const [pricingCadence, setPricingCadence] = useState<
    "monthly" | "quarterly" | "yearly"
  >("monthly");
  const [activeFamily, setActiveFamily] = useState<string>(peptideFamilies[0].id);

  const sermorelinPrice =
    pricingCadence === "monthly"
      ? SERMORELIN_MONTHLY
      : pricingCadence === "quarterly"
        ? SERMORELIN_QUARTERLY_PER_MO
        : SERMORELIN_YEARLY_PER_MO;

  return (
    <>
      {/* ═══════════════════════════════════════════════
          1 · HERO BENTO
          ═══════════════════════════════════════════════ */}
      <section className="relative section-light overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(80% 60% at 70% 30%, ${PERSONA}14 0%, transparent 60%), radial-gradient(60% 40% at 20% 20%, rgba(168,192,165,0.10) 0%, transparent 50%)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-10 md:pt-14 lg:pt-16 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
            {/* HERO TEXT CARD */}
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
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                  style={{ color: PERSONA }}
                >
                  Peptide Therapy
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
                Targeted peptides.
                <br />
                <span className="italic font-light" style={{ color: PERSONA }}>
                  Specific outcomes.
                </span>
              </h1>

              <p
                className="text-[16px] md:text-[17px] leading-relaxed mb-7 max-w-lg"
                style={{ color: "rgba(28,28,30,0.65)" }}
              >
                Six therapeutic families, one protocol logic. A physician
                matches the peptide to the goal — recovery, GH support,
                inflammation, cognition, longevity — and adjusts every quarter
                against your labs.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
                <Link
                  href="/quiz/peptides"
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
                  href="#families"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-halo-charcoal"
                  style={{
                    borderBottom: `1px solid #1C1C1E`,
                    paddingBottom: "2px",
                  }}
                >
                  Browse the families
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* PORTRAIT CARD — green-toned, peptide imagery */}
            <div
              className="lg:col-span-5 lg:row-span-2 relative overflow-hidden rounded-[24px]"
              style={{
                background: PERSONA_DEEP,
                minHeight: "380px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/support-peptide.jpg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectPosition: "center 35%",
                  filter: "contrast(1.05) saturate(0.75) brightness(0.92)",
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

            {/* DATA CARD — peptide families count */}
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
                  What we offer
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
                    6
                  </span>
                  <span
                    className="text-[14px] md:text-[16px]"
                    style={{ color: PERSONA_SOFT }}
                  >
                    families
                  </span>
                </div>
                <p className="text-[12px] text-white/65 leading-snug">
                  Performance, recovery, metabolic, anti-inflammatory,
                  cognitive, longevity. Matched to the goal — not the catalog.
                </p>
              </div>
            </div>

            {/* INFO CARD — regulatory honesty */}
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
                  Regulatory state
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span
                    className="font-serif font-light leading-none text-halo-charcoal"
                    style={{
                      fontSize: "clamp(2.5rem, 4.5vw, 3.5rem)",
                      letterSpacing: "-0.035em",
                    }}
                  >
                    July 23
                  </span>
                </div>
                <p className="text-[12px] text-halo-charcoal/65 leading-snug">
                  PCAC reviews seven peptides for reclassification.{" "}
                  <Link
                    href="/brief/fda-peptide-review"
                    className="underline decoration-halo-charcoal/30 hover:decoration-halo-charcoal/70 transition-colors font-semibold"
                    style={{ color: PERSONA_DEEP }}
                  >
                    Read the brief
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="relative border-t border-halo-charcoal/[0.08] bg-white/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/60">
            <span>Board-certified physicians</span>
            <span className="text-halo-charcoal/20">&middot;</span>
            <span>US-licensed 503A pharmacy</span>
            <span className="text-halo-charcoal/20">&middot;</span>
            <span>HIPAA secure</span>
            <span className="text-halo-charcoal/20">&middot;</span>
            <span>Cold-pack shipping</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2 · MARQUEE
          ═══════════════════════════════════════════════ */}
      <HaloMarquee items={peptideMarquee} />

      {/* ═══════════════════════════════════════════════
          3 · THE PROBLEM — the systems that go quiet first
          ═══════════════════════════════════════════════ */}
      <section className="relative py-16 md:py-20 px-6 section-light overflow-hidden">
        <PillPattern
          density="medium"
          tone="warm"
          assets={["/pill-green.png", "/pill-purple.png", "/pill-orange.png"]}
        />
        <div className="relative z-10 max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-10 md:mb-14">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
                Why peptides
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1] max-w-3xl mx-auto">
                The systems that go{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  quiet first
                </span>{" "}
                aren&rsquo;t broken. The signal got soft.
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 max-w-xl mx-auto mt-5 leading-relaxed">
                GH output declines roughly 14% per decade after 30. Recovery
                pathways slow. Inflammatory tone climbs. Peptides are signaling
                molecules — they restore the conversation cells were already
                having before something turned the volume down.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10 lg:gap-x-10">
              {[
                {
                  numberText: "14%",
                  label: "GH decline per decade after age 30. Compounding annually.",
                  source: "Veldhuis et al., JCEM, 1995",
                },
                {
                  numberText: "5+ yrs",
                  label:
                    "average wait between recovery decline and the first conversation about it.",
                  source: "Endocrine Society review, 2021",
                },
                {
                  numberText: "<1%",
                  label:
                    "of the U.S. peptide market sits inside FDA-regulated compounding today. The rest is research-grade.",
                  source: "OFA market analysis, 2025",
                },
              ].map((s, i) => (
                <div key={i} className="aos-child text-center md:text-left">
                  <div
                    className="font-serif font-light leading-none mb-3"
                    style={{
                      fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
                      letterSpacing: "-0.035em",
                      color: PERSONA_DEEP,
                    }}
                  >
                    {s.numberText}
                  </div>
                  <p className="text-[14px] text-halo-charcoal/75 leading-relaxed mb-2 max-w-xs md:max-w-none">
                    {s.label}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-halo-charcoal/40">
                    {s.source}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4 · PEPTIDE FAMILIES — the differentiator section
          ═══════════════════════════════════════════════ */}
      <section
        id="families"
        className="py-16 md:py-24 px-6 section-light border-t border-halo-charcoal/[0.06]"
      >
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll>
            <div className="mb-12 md:mb-16 max-w-3xl">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
                Six families · One protocol logic
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                Different goals.
                <br />
                Different peptides.
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 mt-5 leading-relaxed max-w-2xl">
                Most platforms list a catalog and ask you to pick. We start
                with what you&rsquo;re trying to change — and the protocol
                follows from there. Status badges below are honest about
                what&rsquo;s prescribable today versus what&rsquo;s coming back
                after the FDA&rsquo;s July review.
              </p>
            </div>
          </AnimateOnScroll>

          {/* Family selector — desktop tabs */}
          <AnimateOnScroll>
            <div className="hidden lg:flex flex-wrap gap-2 mb-8">
              {peptideFamilies.map((f) => {
                const isActive = activeFamily === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFamily(f.id)}
                    className="px-4 py-2 rounded-full text-[12px] font-semibold uppercase tracking-[0.16em] transition-all"
                    style={{
                      background: isActive ? PERSONA : "transparent",
                      color: isActive ? "white" : PERSONA_DEEP,
                      border: `1px solid ${isActive ? PERSONA : PERSONA_SOFT}55`,
                    }}
                  >
                    {f.category}
                  </button>
                );
              })}
            </div>
          </AnimateOnScroll>

          {/* Active family detail (desktop) */}
          <div className="hidden lg:block">
            {peptideFamilies.map((f) => {
              if (f.id !== activeFamily) return null;
              const meta = availabilityMeta[f.availability];
              return (
                <AnimateOnScroll key={f.id}>
                  <div
                    className="grid lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-12 rounded-[24px] p-8 md:p-10 lg:p-12"
                    style={{
                      background: `linear-gradient(155deg, ${PERSONA}10 0%, ${PERSONA_SOFT}25 60%, ${PERSONA}1A 100%)`,
                      border: `1px solid ${PERSONA}26`,
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-5">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em]"
                          style={{ background: meta.bg, color: meta.color }}
                        >
                          <span
                            className="w-1 h-1 rounded-full"
                            style={{ background: meta.color }}
                          />
                          {meta.label}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-halo-charcoal/45">
                          {f.category}
                        </span>
                      </div>
                      <h3
                        className="font-serif font-light text-halo-charcoal leading-[1.05] tracking-tight mb-5"
                        style={{
                          fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                          letterSpacing: "-0.025em",
                        }}
                      >
                        {f.title}
                      </h3>
                      <p
                        className="text-[14px] font-semibold uppercase tracking-[0.18em] mb-4"
                        style={{ color: PERSONA_DEEP }}
                      >
                        Goal — {f.goal}
                      </p>
                      <p className="text-[15px] md:text-[16px] text-halo-charcoal/72 leading-relaxed mb-6">
                        {f.body}
                      </p>
                      <ul className="space-y-2.5">
                        {f.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-2.5 text-[14px] text-halo-charcoal/75 leading-snug"
                          >
                            <Check
                              className="flex-shrink-0 mt-[3px]"
                              style={{ color: PERSONA, width: 14, height: 14 }}
                              strokeWidth={2.5}
                            />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div
                        className="rounded-[20px] p-6 md:p-7"
                        style={{
                          background: "white",
                          border: `1px solid ${PERSONA}1F`,
                        }}
                      >
                        <p
                          className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-4"
                          style={{ color: PERSONA }}
                        >
                          Compounds
                        </p>
                        <ul className="space-y-3">
                          {f.compounds.map((c) => (
                            <li
                              key={c}
                              className="font-serif text-[20px] text-halo-charcoal leading-tight"
                            >
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div
                        className="rounded-[20px] p-5 md:p-6 flex items-start gap-3"
                        style={{
                          background: "rgba(28,28,30,0.04)",
                          border: "1px solid rgba(28,28,30,0.06)",
                        }}
                      >
                        <Clock
                          className="flex-shrink-0 mt-1"
                          style={{ color: meta.color, width: 16, height: 16 }}
                          strokeWidth={1.8}
                        />
                        <div>
                          <p
                            className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-1.5"
                            style={{ color: meta.color }}
                          >
                            Availability
                          </p>
                          <p className="text-[13px] text-halo-charcoal/70 leading-snug">
                            {f.availabilityNote}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>

          {/* Mobile / tablet — stacked cards (no tab interaction) */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {peptideFamilies.map((f) => {
              const meta = availabilityMeta[f.availability];
              return (
                <div
                  key={f.id}
                  className="rounded-[20px] p-6 md:p-7 flex flex-col"
                  style={{
                    background: "white",
                    border: `1px solid ${PERSONA}1F`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-[0.16em]"
                      style={{ background: meta.bg, color: meta.color }}
                    >
                      <span
                        className="w-1 h-1 rounded-full"
                        style={{ background: meta.color }}
                      />
                      {meta.label}
                    </span>
                  </div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-3"
                    style={{ color: PERSONA_DEEP }}
                  >
                    {f.category}
                  </p>
                  <h3
                    className="font-serif font-light text-halo-charcoal leading-tight mb-3"
                    style={{
                      fontSize: "clamp(1.25rem, 2.4vw, 1.5rem)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-[13px] text-halo-charcoal/70 leading-relaxed mb-4 flex-1">
                    {f.body}
                  </p>
                  <div className="pt-4 border-t border-halo-charcoal/[0.08]">
                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-2"
                      style={{ color: PERSONA }}
                    >
                      Compounds
                    </p>
                    <p className="text-[14px] text-halo-charcoal/85 leading-snug font-medium">
                      {f.compounds.join(" · ")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5 · PEPTIDES vs HGH — comparison row
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light border-t border-halo-charcoal/[0.06]">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-8 md:gap-12 mb-10 md:mb-12">
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3"
                  style={{ color: PERSONA }}
                >
                  Why not HGH
                </p>
                <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal leading-[1.1]">
                  Peptides{" "}
                  <span className="italic" style={{ color: PERSONA }}>
                    talk to your body.
                  </span>
                  <br />
                  HGH replaces what it does.
                </h2>
              </div>
              <p className="text-[15px] md:text-[16px] text-halo-charcoal/70 leading-relaxed self-end">
                Synthetic HGH (somatropin) is a controlled substance in many
                states. It works — and it suppresses the axis it&rsquo;s
                imitating. Peptides preserve the natural pulse, cost a
                fraction, and don&rsquo;t require the same regulatory tier to
                prescribe.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="rounded-[22px] overflow-hidden border border-halo-charcoal/[0.08] bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.12)]">
              <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-halo-charcoal/[0.08]">
                <div className="p-4 md:p-5" />
                <div
                  className="p-4 md:p-5 text-center border-l border-halo-charcoal/[0.08]"
                  style={{ background: `${PERSONA}0F` }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                    style={{ color: PERSONA_DEEP }}
                  >
                    Halo Peptides
                  </p>
                </div>
                <div className="p-4 md:p-5 text-center border-l border-halo-charcoal/[0.08]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/40">
                    Synthetic HGH
                  </p>
                </div>
              </div>
              {peptideVsHGH.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[1fr_1fr_1fr] ${
                    i < peptideVsHGH.length - 1
                      ? "border-b border-halo-charcoal/[0.06]"
                      : ""
                  }`}
                >
                  <div className="p-4 md:p-5 text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.14em] text-halo-charcoal/55">
                    {row.label}
                  </div>
                  <div
                    className="p-4 md:p-5 border-l border-halo-charcoal/[0.06] text-[13px] md:text-[14px] text-halo-charcoal/85 leading-snug"
                    style={{ background: `${PERSONA}07` }}
                  >
                    {row.peptide}
                  </div>
                  <div className="p-4 md:p-5 border-l border-halo-charcoal/[0.06] text-[13px] md:text-[14px] text-halo-charcoal/55 leading-snug">
                    {row.hgh}
                  </div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6 · PROTOCOL — 4-step process
          ═══════════════════════════════════════════════ */}
      <section
        id="protocol"
        className="py-16 md:py-24 px-6 section-light border-t border-halo-charcoal/[0.06]"
      >
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="mb-12 md:mb-14 max-w-2xl">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3"
                style={{ color: PERSONA }}
              >
                Protocol
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                From profile to first shipment in two weeks.
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
              {protocolSteps.map((s, i) => (
                <div
                  key={s.title}
                  className="aos-child rounded-[20px] p-6 md:p-7 bg-white border border-halo-charcoal/[0.08] flex flex-col"
                >
                  <div className="flex items-baseline gap-3 mb-4">
                    <span
                      className="font-serif font-light leading-none"
                      style={{
                        fontSize: "clamp(2.25rem, 4vw, 2.75rem)",
                        letterSpacing: "-0.03em",
                        color: PERSONA,
                      }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                      style={{ color: PERSONA_DEEP }}
                    >
                      {s.day}
                    </span>
                  </div>
                  <h3 className="font-serif text-[20px] md:text-[22px] text-halo-charcoal leading-tight mb-2 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-[13px] text-halo-charcoal/65 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7 · PRICING — bundled cadences
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light border-t border-halo-charcoal/[0.06]">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-10 md:mb-12">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3"
                style={{ color: PERSONA }}
              >
                Pricing
              </p>
              <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal leading-[1.1]">
                One bundled fee. No surprises.
              </h2>
              <p className="text-[15px] text-halo-charcoal/65 mt-4 max-w-xl mx-auto leading-relaxed">
                Compounded medication, physician access, and protocol
                adjustments — all included. Founding-member pricing through
                first 500 members.
              </p>
            </div>
          </AnimateOnScroll>

          {/* Cadence selector */}
          <AnimateOnScroll>
            <div className="flex justify-center mb-8">
              <div
                className="inline-flex p-1 rounded-full"
                style={{ background: "rgba(28,28,30,0.05)" }}
              >
                {(["monthly", "quarterly", "yearly"] as const).map((c) => {
                  const isActive = pricingCadence === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setPricingCadence(c)}
                      className="px-5 py-2 rounded-full text-[12px] font-semibold uppercase tracking-[0.16em] transition-all"
                      style={{
                        background: isActive ? "white" : "transparent",
                        color: isActive ? PERSONA_DEEP : "rgba(28,28,30,0.55)",
                        boxShadow: isActive
                          ? "0 4px 12px -4px rgba(0,0,0,0.12)"
                          : "none",
                      }}
                    >
                      {c}
                      {c === "yearly" && (
                        <span
                          className="ml-1.5 text-[9px] font-semibold"
                          style={{ color: PERSONA }}
                        >
                          save {SERMORELIN_YEARLY_SAVINGS_PCT}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {/* Sermorelin card — featured */}
              <div
                className="relative rounded-[24px] p-7 md:p-8 lg:p-10 flex flex-col"
                style={{
                  background: `linear-gradient(155deg, white 0%, ${PERSONA}0F 100%)`,
                  border: `1.5px solid ${PERSONA}40`,
                  boxShadow: "0 24px 60px -28px rgba(0,0,0,0.16)",
                }}
              >
                <span
                  className="absolute top-5 right-5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-[0.18em] text-white"
                  style={{ background: PERSONA }}
                >
                  <span className="w-1 h-1 rounded-full bg-white" />
                  Most prescribed
                </span>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3"
                  style={{ color: PERSONA }}
                >
                  Performance & GH
                </p>
                <h3
                  className="font-serif font-light text-halo-charcoal leading-tight mb-2 tracking-tight"
                  style={{
                    fontSize: "clamp(1.625rem, 2.6vw, 2rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Sermorelin
                </h3>
                <p className="text-[13px] text-halo-charcoal/55 mb-6">
                  GHRH analog · Subcutaneous · Available now
                </p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span
                    className="font-serif font-light leading-none"
                    style={{
                      fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                      letterSpacing: "-0.035em",
                      color: PERSONA_DEEP,
                    }}
                  >
                    ${sermorelinPrice}
                  </span>
                  <span className="text-[14px] text-halo-charcoal/55">
                    /mo
                  </span>
                  {pricingCadence !== "monthly" && (
                    <span className="text-[12px] text-halo-charcoal/45 ml-1">
                      billed {pricingCadence}
                    </span>
                  )}
                </div>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {[
                    "Compounded Sermorelin included",
                    "Quarterly lab panel reviewed by physician",
                    "Physician consult + async messaging",
                    "Protocol adjustments based on bloodwork",
                    "Free cold-pack shipping",
                  ].map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-[14px] text-halo-charcoal/80 leading-snug"
                    >
                      <Check
                        className="flex-shrink-0 mt-[3px]"
                        style={{ color: PERSONA, width: 14, height: 14 }}
                        strokeWidth={2.5}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/quiz/peptides"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-white font-semibold text-[13px] transition-all hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.35)] hover:-translate-y-0.5"
                  style={{ background: "#1C1C1E" }}
                >
                  Start your assessment
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* B12 stack card — supporting tier */}
              <div className="relative rounded-[24px] p-7 md:p-8 lg:p-10 bg-white border border-halo-charcoal/[0.08] flex flex-col">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3"
                  style={{ color: PERSONA_DEEP }}
                >
                  Metabolic Support
                </p>
                <h3
                  className="font-serif font-light text-halo-charcoal leading-tight mb-2 tracking-tight"
                  style={{
                    fontSize: "clamp(1.625rem, 2.6vw, 2rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  B12 / Glutathione / Lipo-C
                </h3>
                <p className="text-[13px] text-halo-charcoal/55 mb-6">
                  Metabolic stack · Subcutaneous · Available now
                </p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span
                    className="font-serif font-light leading-none"
                    style={{
                      fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                      letterSpacing: "-0.035em",
                      color: PERSONA_DEEP,
                    }}
                  >
                    ${B12_MONTHLY}
                  </span>
                  <span className="text-[14px] text-halo-charcoal/55">/mo</span>
                </div>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {[
                    "Methylated B12 + glutathione + Lipo-C",
                    "Weekly subcutaneous injection",
                    "Physician oversight + async messaging",
                    "Stacks with TRT, HRT, NAD+, or Sermorelin",
                    "Free cold-pack shipping",
                  ].map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-[14px] text-halo-charcoal/80 leading-snug"
                    >
                      <Check
                        className="flex-shrink-0 mt-[3px]"
                        style={{ color: PERSONA, width: 14, height: 14 }}
                        strokeWidth={2.5}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/quiz/peptides"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-[13px] transition-all border-[1.5px] hover:bg-halo-charcoal hover:text-white"
                  style={{
                    color: "#1C1C1E",
                    borderColor: "#1C1C1E",
                  }}
                >
                  Add to your protocol
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <p className="text-center text-[12px] text-halo-charcoal/45 mt-6 italic">
              Quarterly lab panels billed separately at cost. Founding pricing
              honored at every renewal.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8 · REGULATORY CALLOUT — link to FDA brief
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-6 section-light border-t border-halo-charcoal/[0.06]">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div
              className="relative overflow-hidden rounded-[24px] p-8 md:p-12 text-white"
              style={{
                background: `linear-gradient(140deg, #1C1817 0%, #2A2624 50%, #1C1817 100%)`,
              }}
            >
              <div
                aria-hidden
                className="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none"
                style={{
                  background: "#C8A96E",
                  filter: "blur(80px)",
                  opacity: 0.22,
                }}
              />
              <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck
                      className="flex-shrink-0"
                      style={{ color: "#C8A96E", width: 18, height: 18 }}
                      strokeWidth={1.5}
                    />
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                      style={{ color: "#C8A96E" }}
                    >
                      Current event · Regulatory
                    </span>
                  </div>
                  <h3
                    className="font-serif font-light leading-[1.1] tracking-tight mb-3"
                    style={{
                      fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
                      letterSpacing: "-0.02em",
                      color: "#F3EADA",
                    }}
                  >
                    The 2026 FDA peptide review.
                  </h3>
                  <p className="text-[14px] md:text-[15px] text-white/65 leading-relaxed max-w-xl">
                    Halo&rsquo;s peptide program is built to survive every
                    PCAC outcome — not bet on one. Read what changes for your
                    protocol when the verdict lands.
                  </p>
                </div>
                <Link
                  href="/brief/fda-peptide-review"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[13px] font-semibold transition-all hover:-translate-y-0.5 self-start md:self-center flex-shrink-0"
                  style={{
                    background: "#C8A96E",
                    color: "#1C1817",
                  }}
                >
                  Read the brief
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9 · FAQ
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light border-t border-halo-charcoal/[0.06]">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3"
                style={{ color: PERSONA }}
              >
                Common questions
              </p>
              <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal leading-[1.1]">
                Frequently asked.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <FAQ items={faqItems} />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          10 · FINAL CTA (Dark)
          ═══════════════════════════════════════════════ */}
      <section
        className="relative py-20 md:py-28 px-6 overflow-hidden"
        style={{ background: "#0F1115" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(60% 50% at 70% 40%, ${PERSONA}1F 0%, transparent 60%)`,
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-5"
              style={{ color: PERSONA_SOFT }}
            >
              Halo Peptide Therapy
            </p>
            <h2
              className="font-serif font-light text-white leading-[1.05] tracking-tight mb-5"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                letterSpacing: "-0.03em",
              }}
            >
              Your body still knows how.
              <br />
              <span className="italic" style={{ color: PERSONA_SOFT }}>
                It just needs the signal.
              </span>
            </h2>
            <p className="text-[15px] md:text-[16px] text-white/60 leading-relaxed mb-9 max-w-xl mx-auto">
              Five-minute health profile. Physician review of your labs.
              Protocol matched to your goal — and adjusted every quarter.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <Link
                href="/quiz/peptides"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[13px] font-semibold transition-all hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-0.5"
                style={{
                  background: PERSONA,
                  color: "white",
                }}
              >
                Start your assessment
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/85 hover:text-white border-b border-white/30 hover:border-white/70 pb-0.5 transition-colors"
              >
                See all programs
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="py-6 px-6 section-light">
        <p className="text-center text-xs text-halo-charcoal/35 max-w-3xl mx-auto leading-relaxed">
          Halo is a technology platform that connects patients with licensed
          healthcare providers. All clinical decisions are made by independent
          licensed providers. Individual results may vary. This content is not
          medical advice. Compounded peptides are not FDA-approved drugs;
          they are produced under section 503A of the FD&amp;C Act.
        </p>
      </div>
    </>
  );
}
