"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus, Minus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import FAQ from "@/components/FAQ";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import HaloPattern from "@/components/HaloPattern";
import HaloMarquee from "@/components/HaloMarquee";
import BenefitScroller from "@/components/BenefitScroller";
import CountUpNumber from "@/components/CountUpNumber";
import { track } from "@/lib/tracking";

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

const impactStats: Array<{
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  source: string;
}> = [
  {
    value: 50,
    suffix: "%",
    label: "decline in tissue NAD+ between ages 30 and 60.",
    source: "Massudi et al., J Biol Chem, 2012",
  },
  {
    value: 40,
    suffix: "%",
    label: "average increase in whole-blood NAD+ with physician-dosed NR therapy.",
    source: "Martens et al., Nature Communications, 2018",
  },
  {
    value: 2,
    prefix: "<",
    suffix: "%",
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

/* ==============================
   LAB PANEL DATA \u2014 hero visual
   NAD+ specific markers. Before state (everything suboptimal).
   After state (90 days, optimal).
   ============================== */

type LabStatus = "low" | "mid" | "optimal" | "high";
type LabMarker = {
  name: string;
  value: string;
  unit: string;
  status: LabStatus;
  position: number; // 0\u201310 gauge position
};

/* Lab markers chosen specifically because NAD+ therapy moves them:
   - NAD+ Level: direct substrate
   - NAD+/NADH ratio: redox state, the cleanest functional readout
   - 8-OHdG: oxidative DNA damage, a PARP/NAD consumer proxy
   - hs-CRP: systemic inflammation; NAD protocols shift it in a subset of members
   The last carries a "may" caveat in the footnote. */
const beforePanel: LabMarker[] = [
  { name: "NAD+ Level", value: "18", unit: "ng/mL", status: "low", position: 2 },
  { name: "NAD+/NADH Ratio", value: "2.1", unit: "", status: "low", position: 2.5 },
  { name: "8-OHdG", value: "9.4", unit: "ng/mg Cr", status: "high", position: 7.5 },
  { name: "hs-CRP", value: "2.4", unit: "mg/L", status: "high", position: 7.2 },
];

const afterPanel: LabMarker[] = [
  { name: "NAD+ Level", value: "42", unit: "ng/mL", status: "optimal", position: 7 },
  { name: "NAD+/NADH Ratio", value: "5.8", unit: "", status: "optimal", position: 6.8 },
  { name: "8-OHdG", value: "4.2", unit: "ng/mg Cr", status: "optimal", position: 3.2 },
  { name: "hs-CRP", value: "1.1", unit: "mg/L", status: "optimal", position: 3.5 },
];

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
        <p className="plex-mono text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: PERSONA_SOFT }}>
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

/* ==============================
   COMPONENT: LAB PANEL \u2014 hero visual
   Editorial rendering of a Halo cellular panel. Shows a lead marker
   with a large numeric value, then secondary markers with mini-gauges.
   Supports a \u201cbefore\u201d / \u201cat 90 days\u201d variant pair for the parallax stack.
   ============================== */

function statusLabel(s: LabStatus) {
  if (s === "low") return "LOW";
  if (s === "mid") return "MID";
  if (s === "high") return "HIGH";
  return "OPTIMAL";
}

function statusColor(s: LabStatus) {
  if (s === "low") return "#C26B4A";
  if (s === "high") return "#C26B4A";
  if (s === "mid") return "#B8974E";
  return PERSONA;
}

function LabGauge({ position, status }: { position: number; status: LabStatus }) {
  const pct = Math.max(3, Math.min(97, (position / 10) * 100));
  return (
    <div
      className="relative w-full h-[6px] rounded-full overflow-hidden"
      style={{ background: "rgba(28,28,30,0.06)" }}
    >
      {/* Range band gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(194,107,74,0.16) 0%, rgba(184,151,78,0.14) 35%, rgba(63,90,138,0.20) 65%, rgba(194,107,74,0.16) 100%)",
        }}
      />
      {/* Indicator dot */}
      <div
        className="absolute top-1/2 w-[10px] h-[10px] rounded-full shadow-sm"
        style={{
          left: `${pct}%`,
          transform: "translate(-50%, -50%)",
          background: statusColor(status),
          border: "1.5px solid white",
        }}
      />
    </div>
  );
}

/* Ease-out cubic for smooth number ticks */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/* Parse the "value" string into a numeric part and a suffix (for "<2%" etc.).
   For our lab markers, values are always plain decimals/ints so we treat the
   whole string as a number and format back using the original decimal places. */
function parseLabValue(s: string): { n: number; decimals: number } {
  const cleaned = s.replace(/[^0-9.\-]/g, "");
  const n = parseFloat(cleaned);
  const dot = cleaned.indexOf(".");
  const decimals = dot >= 0 ? cleaned.length - dot - 1 : 0;
  return { n: isNaN(n) ? 0 : n, decimals };
}

/**
 * InteractiveLabPanel \u2014 signature hero visual.
 *
 * The visitor toggles between "Before" and "At 90 days". Every numeric value
 * animates (ease-out cubic, ~700ms), every gauge marker slides, every status
 * pill re-colors. It's the page's proof of concept: "we move these numbers."
 *
 * Why this matters for conversion: biohackers want to see measured deltas.
 * A static before/after looks like a stock photo. An interactive one makes
 * the visitor poke at the data themselves \u2014 and suddenly they're invested.
 */
function InteractiveLabPanel({
  before,
  after,
}: {
  before: LabMarker[];
  after: LabMarker[];
}) {
  const [isAfter, setIsAfter] = useState(false);
  // t \u2208 [0,1] where 0 = before, 1 = after. Animated via RAF.
  const [t, setT] = useState(0);

  useEffect(() => {
    const target = isAfter ? 1 : 0;
    const start = t;
    const startTime = performance.now();
    const duration = 720; // ms

    // Respect reduced motion \u2014 snap instantly
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setT(target);
      return;
    }

    let rafId: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = easeOutCubic(progress);
      setT(start + (target - start) * eased);
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // Only re-run when the toggle target changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAfter]);

  // Interpolate a single marker based on current t
  const lerp = (a: number, b: number) => a + (b - a) * t;

  // Status color at current t: blend from before color toward after color via opacity swap.
  // Simple approach: whichever side t is closer to wins. Threshold at 0.5.
  const currentStatus = (b: LabStatus, a: LabStatus): LabStatus =>
    t < 0.5 ? b : a;

  const renderValue = (bVal: string, aVal: string) => {
    const pb = parseLabValue(bVal);
    const pa = parseLabValue(aVal);
    const decimals = Math.max(pb.decimals, pa.decimals);
    return lerp(pb.n, pa.n).toFixed(decimals);
  };

  const lead = { before: before[0], after: after[0] };
  const leadStatus = currentStatus(lead.before.status, lead.after.status);
  const leadPosition = lerp(lead.before.position, lead.after.position);

  return (
    <div
      className="relative rounded-[22px] overflow-hidden"
      style={{
        background: "#FAF8F4",
        boxShadow:
          "0 24px 70px -20px rgba(10,14,24,0.45), 0 1px 0 rgba(255,255,255,0.6) inset",
        border: "1px solid rgba(28,28,30,0.06)",
      }}
    >
      {/* Header with toggle */}
      <div className="px-6 md:px-7 pt-5 md:pt-6 pb-4 flex items-center justify-between gap-4">
        <div>
          <p className="plex-mono text-[9px] font-semibold uppercase tracking-[0.28em] text-halo-charcoal/40">
            Halo \u00B7 Sample
          </p>
          <p className="text-[13px] md:text-[14px] font-semibold tracking-tight text-halo-charcoal mt-1.5">
            Cellular Panel
          </p>
        </div>

        {/* Segmented toggle \u2014 the signature interaction */}
        <div
          className="plex-mono relative flex items-center rounded-full p-[3px] flex-shrink-0"
          style={{
            background: "rgba(28,28,30,0.06)",
            border: "1px solid rgba(28,28,30,0.08)",
          }}
          role="tablist"
          aria-label="Toggle between before and 90-day results"
        >
          {/* Sliding pill */}
          <span
            className="absolute top-[3px] bottom-[3px] left-[3px] rounded-full transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: "calc(50% - 3px)",
              transform: isAfter ? "translateX(100%)" : "translateX(0)",
              background: isAfter ? PERSONA : "#C26B4A",
              boxShadow: "0 2px 6px rgba(10,14,24,0.18)",
            }}
            aria-hidden="true"
          />
          <button
            onClick={() => setIsAfter(false)}
            role="tab"
            aria-selected={!isAfter}
            className="relative z-10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors"
            style={{ color: !isAfter ? "#FFFFFF" : "rgba(28,28,30,0.55)" }}
          >
            Before
          </button>
          <button
            onClick={() => setIsAfter(true)}
            role="tab"
            aria-selected={isAfter}
            className="relative z-10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors"
            style={{ color: isAfter ? "#FFFFFF" : "rgba(28,28,30,0.55)" }}
          >
            90 days
          </button>
        </div>
      </div>

      <div className="h-px w-full" style={{ background: "rgba(28,28,30,0.08)" }} />

      {/* Lead marker \u2014 animated */}
      <div className="px-6 md:px-7 pt-5 pb-4">
        <div className="flex items-baseline justify-between mb-2">
          <p className="plex-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/50">
            {lead.before.name}
          </p>
          <span
            className="plex-mono text-[9px] font-semibold tracking-[0.18em] transition-colors duration-[420ms]"
            style={{ color: statusColor(leadStatus) }}
          >
            {statusLabel(leadStatus)}
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span
            className="font-serif text-[48px] md:text-[58px] font-light leading-none tracking-tight text-halo-charcoal plex-mono-num"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {renderValue(lead.before.value, lead.after.value)}
          </span>
          <span className="plex-mono text-[12px] text-halo-charcoal/55">
            {lead.before.unit || lead.after.unit}
          </span>
        </div>
        <LabGauge position={leadPosition} status={leadStatus} />
      </div>

      <div className="h-px w-full" style={{ background: "rgba(28,28,30,0.08)" }} />

      {/* Secondary markers \u2014 all animated */}
      <div className="px-6 md:px-7 py-4 space-y-3">
        {before.slice(1).map((bm, i) => {
          const am = after[i + 1];
          const status = currentStatus(bm.status, am.status);
          const position = lerp(bm.position, am.position);
          return (
            <div key={bm.name}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="plex-mono text-[10px] uppercase tracking-[0.15em] text-halo-charcoal/75 truncate">
                  {bm.name}
                </span>
                <div className="flex items-baseline gap-1.5 flex-shrink-0">
                  <span
                    className="plex-mono text-[11px] font-medium text-halo-charcoal"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {renderValue(bm.value, am.value)}
                  </span>
                  <span className="plex-mono text-[9px] text-halo-charcoal/45">
                    {bm.unit || am.unit}
                  </span>
                  <span
                    className="plex-mono text-[9px] font-semibold tracking-[0.12em] ml-1 transition-colors duration-[420ms]"
                    style={{ color: statusColor(status) }}
                  >
                    &middot; {statusLabel(status)}
                  </span>
                </div>
              </div>
              <LabGauge position={position} status={status} />
            </div>
          );
        })}
      </div>

      <div className="h-px w-full" style={{ background: "rgba(28,28,30,0.08)" }} />

      {/* Footer */}
      <div className="px-6 md:px-7 py-3.5 flex items-center justify-between">
        <p className="plex-mono text-[9px] uppercase tracking-[0.18em] text-halo-charcoal/45">
          Physician review \u00B7 90-day recheck
        </p>
        <p className="plex-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-halo-charcoal/30">
          Halo 2026
        </p>
      </div>
    </div>
  );
}

function LabPanel({ markers, badge }: { markers: LabMarker[]; badge?: string }) {
  return (
    <div
      className="relative rounded-[22px] overflow-hidden"
      style={{
        background: "#FAF8F4",
        boxShadow: "0 24px 70px -20px rgba(10,14,24,0.45), 0 1px 0 rgba(255,255,255,0.6) inset",
        border: "1px solid rgba(28,28,30,0.06)",
      }}
    >
      {/* Header */}
      <div className="px-6 md:px-7 pt-5 md:pt-6 pb-4 flex items-start justify-between">
        <div>
          <p className="plex-mono text-[9px] font-semibold uppercase tracking-[0.28em] text-halo-charcoal/40">
            Halo \u00B7 Sample
          </p>
          <p className="text-[13px] md:text-[14px] font-semibold tracking-tight text-halo-charcoal mt-1.5">
            Cellular Panel
          </p>
        </div>
        {badge && (
          <span
            className="plex-mono inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-[0.18em]"
            style={{
              background: badge.toLowerCase().includes("before")
                ? "rgba(194,107,74,0.12)"
                : `${PERSONA}18`,
              color: badge.toLowerCase().includes("before") ? "#C26B4A" : PERSONA,
            }}
          >
            <span
              className="w-1 h-1 rounded-full"
              style={{
                background: badge.toLowerCase().includes("before") ? "#C26B4A" : PERSONA,
              }}
            />
            {badge}
          </span>
        )}
      </div>

      <div className="h-px w-full" style={{ background: "rgba(28,28,30,0.08)" }} />

      {/* Lead marker */}
      <div className="px-6 md:px-7 pt-5 pb-4">
        <div className="flex items-baseline justify-between mb-2">
          <p className="plex-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/50">
            {markers[0].name}
          </p>
          <span
            className="plex-mono text-[9px] font-semibold tracking-[0.18em]"
            style={{ color: statusColor(markers[0].status) }}
          >
            {statusLabel(markers[0].status)}
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-serif text-[48px] md:text-[58px] font-light leading-none tracking-tight text-halo-charcoal">
            {markers[0].value}
          </span>
          <span className="plex-mono text-[12px] text-halo-charcoal/55">{markers[0].unit}</span>
        </div>
        <LabGauge position={markers[0].position} status={markers[0].status} />
      </div>

      <div className="h-px w-full" style={{ background: "rgba(28,28,30,0.08)" }} />

      {/* Secondary markers */}
      <div className="px-6 md:px-7 py-4 space-y-3">
        {markers.slice(1).map((m) => (
          <div key={m.name}>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="plex-mono text-[10px] uppercase tracking-[0.15em] text-halo-charcoal/75 truncate">
                {m.name}
              </span>
              <div className="flex items-baseline gap-1.5 flex-shrink-0">
                <span className="plex-mono text-[11px] font-medium text-halo-charcoal">
                  {m.value}
                </span>
                <span className="plex-mono text-[9px] text-halo-charcoal/45">{m.unit}</span>
                <span
                  className="plex-mono text-[9px] font-semibold tracking-[0.12em] ml-1"
                  style={{ color: statusColor(m.status) }}
                >
                  &middot; {statusLabel(m.status)}
                </span>
              </div>
            </div>
            <LabGauge position={m.position} status={m.status} />
          </div>
        ))}
      </div>

      <div className="h-px w-full" style={{ background: "rgba(28,28,30,0.08)" }} />

      {/* Footer */}
      <div className="px-6 md:px-7 py-3.5 flex items-center justify-between">
        <p className="plex-mono text-[9px] uppercase tracking-[0.18em] text-halo-charcoal/45">
          Physician review \u00B7 90-day recheck
        </p>
        <p className="plex-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-halo-charcoal/30">
          Halo 2026
        </p>
      </div>
    </div>
  );
}

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
   COMPONENT: CELLULAR AGE QUIZ — signature micro-interaction

   Two tap-forward questions. Calculates an estimated "cellular age gap"
   based on chronological age + a recovery self-assessment. This is a
   proxy indicator, NOT a diagnostic — we say so explicitly. The point
   is to move the visitor from passive reader to engaged participant,
   and to hand them a personalized number they want to improve.

   Converts because: personalized number + clear gap + "get your real
   panel" CTA routes high-intent visitors straight to the quiz.
   ============================== */

/* ──────────────────────────────────────────────────────────
   Cellular Age Estimator — 7-question inline quiz
   ──────────────────────────────────────────────────────────
   Honest framing: this is a PROXY for biological/cellular age
   based on lifestyle inputs correlated with NAD+ decline. The
   only way to know actual NAD+ is a blood panel. That caveat
   is the sales argument for measuring it with Halo.
   ────────────────────────────────────────────────────────── */

type Gender = "female" | "male";
type Recovery = "quick" | "slower" | "much-slower";
type Sleep = "good" | "decent" | "rough";
type Alcohol = "low" | "medium" | "high";
type Supplementation = "none" | "pills" | "iv";
type PrimaryDrag = "energy" | "clarity" | "recovery" | "mood";

type OptionItem<T extends string> = { key: T; label: string; note?: string };

const genderOptions: OptionItem<Gender>[] = [
  { key: "female", label: "Female" },
  { key: "male", label: "Male" },
];

const recoveryOptions: OptionItem<Recovery>[] = [
  { key: "quick", label: "Same day", note: "Fresh the next morning" },
  { key: "slower", label: "A day or two", note: "Back to normal in 48 hours" },
  { key: "much-slower", label: "Several days", note: "Lingering soreness, lower output" },
];

const sleepOptions: OptionItem<Sleep>[] = [
  { key: "good", label: "Consistently good", note: "7+ hours, wake up rested" },
  { key: "decent", label: "Decent, some bad nights", note: "Mixed — a few rough weeks" },
  { key: "rough", label: "Rough most nights", note: "Under 6 hours or broken sleep" },
];

const alcoholOptions: OptionItem<Alcohol>[] = [
  { key: "low", label: "0\u20132 drinks / week" },
  { key: "medium", label: "3\u20137 drinks / week" },
  { key: "high", label: "8+ drinks / week" },
];

const supplementationOptions: OptionItem<Supplementation>[] = [
  { key: "none", label: "Not supplementing", note: "Nothing targeting NAD+ right now" },
  { key: "pills", label: "NR or NMN pills", note: "Daily oral precursor" },
  { key: "iv", label: "IV drips", note: "Occasional clinic visits" },
];

const primaryDragOptions: OptionItem<PrimaryDrag>[] = [
  { key: "energy", label: "Energy & stamina" },
  { key: "clarity", label: "Mental clarity" },
  { key: "recovery", label: "Recovery & soreness" },
  { key: "mood", label: "Mood & resilience" },
];

/* Tailored narrative by user's biggest daily drag.
   Strings are interpolated via {narrative} in JSX — entities like &rsquo;
   would render literally, so use real Unicode characters instead. */
const DRAG_NARRATIVE: Record<PrimaryDrag, string> = {
  energy:
    "Most members report sustained daily energy within 4\u20136 weeks as mitochondrial output improves. It\u2019s usually the first thing they feel.",
  clarity:
    "Brain fog tends to clear first. Restored sirtuin activity and reduced CD38 consumption typically show up cognitively within 6\u20138 weeks.",
  recovery:
    "Recovery is where the biological age gap shows up fastest. NAD+ supports mitochondrial rebuilding post-stress \u2014 most members notice it inside 30 days.",
  mood:
    "Mood stabilization often follows cognitive clearing. Serotonin synthesis depends on NAD+ pools; members report steadier affect within 6\u20138 weeks.",
};

interface CellularAgeInputs {
  chronologicalAge: number;
  gender: Gender;
  recovery: Recovery;
  sleep: Sleep;
  alcohol: Alcohol;
  supplementation: Supplementation;
}

interface CellularAgeResult {
  chronologicalAge: number;
  cellularAge: number;
  ageDelta: number;
  estimatedNad: number;
  deficit: number;
}

function computeCellularAge(inputs: CellularAgeInputs): CellularAgeResult {
  let delta = 0;

  // Recovery — strongest proxy for mitochondrial NAD+ function
  if (inputs.recovery === "slower") delta += 3;
  if (inputs.recovery === "much-slower") delta += 7;

  // Sleep — NAMPT (NAD+ biosynthesis) activity peaks during deep sleep
  if (inputs.sleep === "decent") delta += 1;
  if (inputs.sleep === "rough") delta += 5;

  // Alcohol — activates CD38, a primary NAD+ consumer
  if (inputs.alcohol === "medium") delta += 1;
  if (inputs.alcohol === "high") delta += 4;

  // Supplementation — small bias correction
  if (inputs.supplementation === "pills") delta -= 1;
  if (inputs.supplementation === "iv") delta -= 2;

  // Gender — women's NAD+ decline is steeper through perimenopause window
  // Keep neutral in delta (subtle effect not worth the cognitive weight)
  void inputs.gender;

  delta = Math.max(-3, Math.min(15, delta));
  const cellularAge = Math.round(inputs.chronologicalAge + delta);

  // Rough NAD+ decline curve: ~40 ng/mL at 30, linear -0.67/yr
  const estimatedNad = Math.max(
    10,
    Math.round(40 - Math.max(0, cellularAge - 30) * 0.67)
  );
  const deficit = Math.round(((40 - estimatedNad) / 40) * 100);

  return {
    chronologicalAge: inputs.chronologicalAge,
    cellularAge,
    ageDelta: delta,
    estimatedNad,
    deficit,
  };
}

type StepNum = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Step = StepNum | "result";
const TOTAL_STEPS = 7;

function CellularAgeQuiz() {
  const [step, setStep] = useState<Step>(1);

  // Answers
  const [chronologicalAge, setChronologicalAge] = useState(40);
  const [gender, setGender] = useState<Gender | null>(null);
  const [recovery, setRecovery] = useState<Recovery | null>(null);
  const [sleep, setSleep] = useState<Sleep | null>(null);
  const [alcohol, setAlcohol] = useState<Alcohol | null>(null);
  const [supplementation, setSupplementation] = useState<Supplementation | null>(null);
  const [primaryDrag, setPrimaryDrag] = useState<PrimaryDrag | null>(null);

  // Lead capture state
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadHoneypot, setLeadHoneypot] = useState("");
  const [leadStatus, setLeadStatus] = useState<
    "idle" | "submitting" | "success" | "duplicate" | "error"
  >("idle");
  const [leadError, setLeadError] = useState("");

  // Recognize returning leads so we don't double-collect
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("halo_nad_lead_email");
    if (saved) setLeadStatus("duplicate");
  }, []);

  // Compute result once all answers are in
  const result = useMemo<CellularAgeResult | null>(() => {
    if (!gender || !recovery || !sleep || !alcohol || !supplementation) return null;
    return computeCellularAge({
      chronologicalAge,
      gender,
      recovery,
      sleep,
      alcohol,
      supplementation,
    });
  }, [chronologicalAge, gender, recovery, sleep, alcohol, supplementation]);

  // Is the current step answered?
  const currentAnswered = (() => {
    switch (step) {
      case 1: return chronologicalAge >= 25 && chronologicalAge <= 75;
      case 2: return gender !== null;
      case 3: return recovery !== null;
      case 4: return sleep !== null;
      case 5: return alcohol !== null;
      case 6: return supplementation !== null;
      case 7: return primaryDrag !== null;
      default: return false;
    }
  })();

  const goNext = () => {
    if (step === "result") return;
    if (step === 7) {
      if (result && primaryDrag) {
        setStep("result");
        track("nad_estimator_submit", {
          chronological_age: chronologicalAge,
          gender: gender ?? "",
          recovery: recovery ?? "",
          sleep: sleep ?? "",
          alcohol: alcohol ?? "",
          supplementation: supplementation ?? "",
          primary_drag: primaryDrag,
          cellular_age: result.cellularAge,
          age_delta: result.ageDelta,
          deficit: result.deficit,
        });
      }
    } else {
      setStep((step + 1) as StepNum);
    }
  };

  const goBack = () => {
    if (step === "result") {
      setStep(7);
      return;
    }
    if (step > 1) {
      setStep((step - 1) as StepNum);
    }
  };

  // Tap-to-select with auto-advance for single-select questions (Q2-Q6).
  // Q7 intentionally requires explicit submit so the user can read the result intro.
  function selectAndAdvance<T>(setter: (v: T) => void, value: T) {
    setter(value);
    setTimeout(() => {
      setStep((prev) => {
        if (prev === "result") return prev;
        if (prev === 7) return prev;
        return (prev + 1) as StepNum;
      });
    }, 300);
  }

  const validEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track("nad_lead_attempt", { has_name: !!leadName.trim() });

    if (leadHoneypot) {
      setLeadStatus("success");
      return;
    }
    if (!validEmail(leadEmail)) {
      setLeadError("Please enter a valid email.");
      setLeadStatus("error");
      track("nad_lead_error", { reason: "invalid_email" });
      return;
    }
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("halo_nad_lead_email")
        : null;
    if (saved) {
      setLeadStatus("duplicate");
      track("nad_lead_duplicate", {});
      return;
    }

    setLeadStatus("submitting");
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("halo_nad_lead_email", leadEmail.trim());
        if (leadName.trim()) {
          localStorage.setItem("halo_nad_lead_name", leadName.trim());
        }
      }
      setLeadStatus("success");
      track("nad_lead_success", {
        cellular_age: result?.cellularAge ?? 0,
        chronological_age: chronologicalAge,
        deficit: result?.deficit ?? 0,
        primary_drag: primaryDrag ?? "",
        has_name: !!leadName.trim(),
      });
    }, 800);
  };

  const handleReset = () => {
    setStep(1);
    setChronologicalAge(40);
    setGender(null);
    setRecovery(null);
    setSleep(null);
    setAlcohol(null);
    setSupplementation(null);
    setPrimaryDrag(null);
    setLeadName("");
    setLeadEmail("");
    setLeadError("");
    // Only reset lead status if user is restarting after an error/idle.
    // If they've already captured, keep duplicate state.
    if (leadStatus === "error" || leadStatus === "idle") {
      setLeadStatus("idle");
    }
  };

  const progressNum = step === "result" ? TOTAL_STEPS : step;

  // ─── Inline option-button renderer ───
  const OptionButton = ({
    label,
    note,
    selected,
    onClick,
  }: {
    label: string;
    note?: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className="rounded-[10px] py-3 px-4 text-left transition-all duration-200"
      style={{
        background: selected ? PERSONA : "#FFFFFF",
        color: selected ? "#FFFFFF" : "rgba(28,28,30,0.85)",
        border: `1px solid ${selected ? PERSONA : "rgba(28,28,30,0.12)"}`,
        boxShadow: selected
          ? `0 8px 24px ${PERSONA}55`
          : "0 1px 0 rgba(28,28,30,0.04)",
      }}
    >
      <span className="block text-[14px] font-medium leading-tight">{label}</span>
      {note && (
        <span
          className="block text-[11px] mt-1 leading-snug"
          style={{ opacity: selected ? 0.85 : 0.55 }}
        >
          {note}
        </span>
      )}
    </button>
  );

  const StepEyebrow = ({ n, title }: { n: number; title: string }) => (
    <p className="plex-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/50 mb-3">
      Question {n} of {TOTAL_STEPS} &middot; {title}
    </p>
  );

  return (
    <div
      className="relative rounded-[22px] overflow-hidden"
      style={{
        background: "#FAF8F4",
        border: "1px solid rgba(28,28,30,0.08)",
        boxShadow: "0 18px 50px -25px rgba(10,14,24,0.18)",
      }}
    >
      {/* ─── Header bar ─── */}
      <div
        className="px-6 md:px-8 py-4 flex items-center justify-between"
        style={{ background: `${PERSONA}0C`, borderBottom: "1px solid rgba(28,28,30,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: PERSONA, animation: "nad-pulse-soft 2.4s ease-in-out infinite" }}
            aria-hidden="true"
          />
          <p
            className="plex-mono text-[10px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: PERSONA_DEEP }}
          >
            Cellular Age Estimator
          </p>
        </div>
        <p className="plex-mono text-[9px] uppercase tracking-[0.18em] text-halo-charcoal/40">
          {step === "result"
            ? "Your estimate"
            : `${progressNum} / ${TOTAL_STEPS}`}
        </p>
      </div>

      {/* ─── Progress bar (hidden on result) ─── */}
      {step !== "result" && (
        <div className="px-6 md:px-8 pt-4 pb-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <span
                key={n}
                aria-hidden="true"
                className="flex-1 rounded-full transition-colors duration-300"
                style={{
                  height: 2,
                  background: n <= progressNum ? PERSONA : "rgba(28,28,30,0.10)",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ─── Body ─── */}
      <div className="px-6 md:px-8 py-8 md:py-10">
        {/* Q1 — chronological age */}
        {step === 1 && (
          <div className="animate-in fade-in duration-300">
            <StepEyebrow n={1} title="Your age" />
            <h3 className="font-serif text-[22px] md:text-[26px] leading-[1.15] tracking-tight text-halo-charcoal mb-6">
              How old are you, chronologically?
            </h3>
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-2">
              <button
                onClick={() => setChronologicalAge((a) => Math.max(25, a - 1))}
                aria-label="Decrease age"
                className="w-11 h-11 rounded-full flex items-center justify-center transition-colors hover:bg-halo-charcoal/[0.04]"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(28,28,30,0.12)",
                }}
              >
                <Minus className="w-4 h-4" strokeWidth={2.5} style={{ color: PERSONA }} />
              </button>
              <input
                type="number"
                min={25}
                max={75}
                value={chronologicalAge}
                onChange={(e) => {
                  const v = parseInt(e.target.value || "0", 10);
                  if (!isNaN(v)) setChronologicalAge(Math.max(25, Math.min(75, v)));
                }}
                className="font-serif text-[64px] md:text-[80px] font-light leading-none tracking-tight text-halo-charcoal w-[140px] text-center bg-transparent border-none focus:outline-none"
                aria-label="Age in years"
              />
              <button
                onClick={() => setChronologicalAge((a) => Math.min(75, a + 1))}
                aria-label="Increase age"
                className="w-11 h-11 rounded-full flex items-center justify-center transition-colors hover:bg-halo-charcoal/[0.04]"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(28,28,30,0.12)",
                }}
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} style={{ color: PERSONA }} />
              </button>
            </div>
            <p className="plex-mono text-[10px] uppercase tracking-[0.22em] text-halo-charcoal/45 text-center">
              years
            </p>
          </div>
        )}

        {/* Q2 — biological sex */}
        {step === 2 && (
          <div className="animate-in fade-in duration-300">
            <StepEyebrow n={2} title="Biological sex" />
            <h3 className="font-serif text-[22px] md:text-[26px] leading-[1.15] tracking-tight text-halo-charcoal mb-2">
              Which applies to you?
            </h3>
            <p className="text-[12px] italic text-halo-charcoal/50 mb-5">
              NAD+ biology differs between sexes; we use this to tune the estimate.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {genderOptions.map((o) => (
                <OptionButton
                  key={o.key}
                  label={o.label}
                  selected={gender === o.key}
                  onClick={() => selectAndAdvance(setGender, o.key)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Q3 — recovery */}
        {step === 3 && (
          <div className="animate-in fade-in duration-300">
            <StepEyebrow n={3} title="Recovery" />
            <h3 className="font-serif text-[22px] md:text-[26px] leading-[1.15] tracking-tight text-halo-charcoal mb-5">
              After a hard effort, how long until you feel fresh again?
            </h3>
            <div className="flex flex-col gap-2.5">
              {recoveryOptions.map((o) => (
                <OptionButton
                  key={o.key}
                  label={o.label}
                  note={o.note}
                  selected={recovery === o.key}
                  onClick={() => selectAndAdvance(setRecovery, o.key)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Q4 — sleep */}
        {step === 4 && (
          <div className="animate-in fade-in duration-300">
            <StepEyebrow n={4} title="Sleep" />
            <h3 className="font-serif text-[22px] md:text-[26px] leading-[1.15] tracking-tight text-halo-charcoal mb-5">
              How&rsquo;s your sleep, honestly?
            </h3>
            <div className="flex flex-col gap-2.5">
              {sleepOptions.map((o) => (
                <OptionButton
                  key={o.key}
                  label={o.label}
                  note={o.note}
                  selected={sleep === o.key}
                  onClick={() => selectAndAdvance(setSleep, o.key)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Q5 — alcohol */}
        {step === 5 && (
          <div className="animate-in fade-in duration-300">
            <StepEyebrow n={5} title="Alcohol" />
            <h3 className="font-serif text-[22px] md:text-[26px] leading-[1.15] tracking-tight text-halo-charcoal mb-2">
              A typical week of drinks?
            </h3>
            <p className="text-[12px] italic text-halo-charcoal/50 mb-5">
              Alcohol activates CD38, a primary NAD+ consumer.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {alcoholOptions.map((o) => (
                <OptionButton
                  key={o.key}
                  label={o.label}
                  selected={alcohol === o.key}
                  onClick={() => selectAndAdvance(setAlcohol, o.key)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Q6 — supplementation */}
        {step === 6 && (
          <div className="animate-in fade-in duration-300">
            <StepEyebrow n={6} title="Supplementation" />
            <h3 className="font-serif text-[22px] md:text-[26px] leading-[1.15] tracking-tight text-halo-charcoal mb-5">
              Already doing anything for NAD+?
            </h3>
            <div className="flex flex-col gap-2.5">
              {supplementationOptions.map((o) => (
                <OptionButton
                  key={o.key}
                  label={o.label}
                  note={o.note}
                  selected={supplementation === o.key}
                  onClick={() => selectAndAdvance(setSupplementation, o.key)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Q7 — primary drag */}
        {step === 7 && (
          <div className="animate-in fade-in duration-300">
            <StepEyebrow n={7} title="What feels off" />
            <h3 className="font-serif text-[22px] md:text-[26px] leading-[1.15] tracking-tight text-halo-charcoal mb-2">
              What&rsquo;s pulling on you most?
            </h3>
            <p className="text-[12px] italic text-halo-charcoal/50 mb-5">
              Pick the one that would change your daily life most if it lifted.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {primaryDragOptions.map((o) => (
                <OptionButton
                  key={o.key}
                  label={o.label}
                  selected={primaryDrag === o.key}
                  onClick={() => setPrimaryDrag(o.key)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {step === "result" && result && primaryDrag && (
          <div className="animate-in fade-in duration-500">
            <p
              className="plex-mono text-[10px] font-semibold uppercase tracking-[0.22em] mb-3"
              style={{ color: PERSONA_DEEP }}
            >
              Your estimate
            </p>
            <h3 className="font-serif text-[22px] md:text-[28px] leading-[1.15] tracking-tight text-halo-charcoal mb-6">
              {result.ageDelta > 0 ? (
                <>
                  You&rsquo;re chronologically {result.chronologicalAge}. Your
                  lifestyle puts you closer to{" "}
                  <span className="italic" style={{ color: PERSONA }}>
                    {result.cellularAge} biologically
                  </span>
                  .
                </>
              ) : result.ageDelta < 0 ? (
                <>
                  You&rsquo;re chronologically {result.chronologicalAge}, but
                  you&rsquo;re trending{" "}
                  <span className="italic" style={{ color: PERSONA }}>
                    {Math.abs(result.ageDelta)} years younger
                  </span>{" "}
                  biologically.
                </>
              ) : (
                <>
                  You&rsquo;re tracking roughly on par with your chronological
                  age &mdash;{" "}
                  <span className="italic" style={{ color: PERSONA }}>
                    {result.cellularAge}
                  </span>
                  .
                </>
              )}
            </h3>

            {/* Two number cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                className="rounded-[14px] p-5"
                style={{ background: "#FFFFFF", border: "1px solid rgba(28,28,30,0.08)" }}
              >
                <p className="plex-mono text-[9px] uppercase tracking-[0.2em] text-halo-charcoal/45 mb-2">
                  Est. cellular age
                </p>
                <div className="flex items-baseline gap-1.5">
                  <CountUpNumber
                    target={result.cellularAge}
                    duration={1200}
                    className="font-serif text-[42px] md:text-[54px] font-light leading-none tracking-tight text-halo-charcoal"
                  />
                  <span className="plex-mono text-[11px] text-halo-charcoal/55">
                    yrs
                  </span>
                </div>
                <p className="text-[11px] italic text-halo-charcoal/45 mt-2">
                  vs. {result.chronologicalAge} chronological
                </p>
              </div>

              <div
                className="rounded-[14px] p-5"
                style={{ background: `${PERSONA}0F`, border: `1px solid ${PERSONA}30` }}
              >
                <p
                  className="plex-mono text-[9px] uppercase tracking-[0.2em] mb-2"
                  style={{ color: PERSONA_DEEP }}
                >
                  NAD+ deficit
                </p>
                <div className="flex items-baseline gap-1">
                  <CountUpNumber
                    target={result.deficit}
                    duration={1200}
                    className="font-serif text-[42px] md:text-[54px] font-light leading-none tracking-tight"
                  />
                  <span
                    className="font-serif text-[28px] md:text-[36px] font-light"
                    style={{ color: PERSONA_DEEP }}
                  >
                    %
                  </span>
                </div>
                <p
                  className="text-[11px] italic mt-2"
                  style={{ color: PERSONA_DEEP, opacity: 0.7 }}
                >
                  vs. healthy 20s baseline
                </p>
              </div>
            </div>

            {/* Tailored narrative — based on primary drag */}
            <div
              className="rounded-[14px] p-5 mb-6"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(28,28,30,0.08)",
              }}
            >
              <p className="text-[13px] md:text-[14px] text-halo-charcoal/75 leading-relaxed">
                {DRAG_NARRATIVE[primaryDrag]}
              </p>
              <p className="text-[12px] text-halo-charcoal/55 leading-relaxed mt-3">
                This is an{" "}
                <strong className="text-halo-charcoal">estimate</strong> based
                on lifestyle inputs. Halo&rsquo;s baseline panel measures your
                actual NAD+ along with 15+ other markers so your physician can
                design a protocol to your biology.
              </p>
            </div>

            {/* Lead capture — idle / error / submitting */}
            {(leadStatus === "idle" ||
              leadStatus === "error" ||
              leadStatus === "submitting") && (
              <div
                className="rounded-[14px] p-5 md:p-6"
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${PERSONA}22`,
                  boxShadow: `0 10px 30px -20px ${PERSONA}66`,
                }}
              >
                <p
                  className="plex-mono text-[10px] font-semibold uppercase tracking-[0.22em] mb-2"
                  style={{ color: PERSONA_DEEP }}
                >
                  Your personalized plan
                </p>
                <h4 className="font-serif text-[20px] md:text-[22px] leading-[1.2] tracking-tight text-halo-charcoal mb-2">
                  Send my NAD+ protocol &amp; what to measure first.
                </h4>
                <p className="text-[13px] text-halo-charcoal/60 leading-relaxed mb-4">
                  A physician-built overview tailored to a{" "}
                  <strong className="text-halo-charcoal">
                    {result.deficit}%
                  </strong>{" "}
                  estimated deficit. No pressure to enroll.
                </p>

                <form onSubmit={handleLeadSubmit} className="space-y-2.5">
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    value={leadHoneypot}
                    onChange={(e) => setLeadHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      opacity: 0,
                      height: 0,
                      width: 0,
                      overflow: "hidden",
                    }}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      autoComplete="given-name"
                      placeholder="First name"
                      aria-label="First name"
                      value={leadName}
                      onChange={(e) => {
                        setLeadName(e.target.value);
                        if (leadStatus === "error") setLeadStatus("idle");
                      }}
                      className="w-full px-4 py-3 bg-[#FAF8F4] border border-halo-charcoal/12 focus:border-halo-charcoal/35 focus:outline-none rounded-[10px] text-sm text-halo-charcoal placeholder:text-halo-charcoal/40 transition-colors"
                    />
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="Email"
                      aria-label="Email"
                      required
                      value={leadEmail}
                      onChange={(e) => {
                        setLeadEmail(e.target.value);
                        if (leadStatus === "error") setLeadStatus("idle");
                      }}
                      className="w-full px-4 py-3 bg-[#FAF8F4] border border-halo-charcoal/12 focus:border-halo-charcoal/35 focus:outline-none rounded-[10px] text-sm text-halo-charcoal placeholder:text-halo-charcoal/40 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={leadStatus === "submitting"}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-white font-semibold text-sm transition-all hover:brightness-95"
                    style={{
                      backgroundColor: PERSONA,
                      boxShadow: `0 10px 28px ${PERSONA}55`,
                      opacity: leadStatus === "submitting" ? 0.7 : 1,
                      cursor:
                        leadStatus === "submitting" ? "wait" : "pointer",
                    }}
                  >
                    {leadStatus === "submitting"
                      ? "Sending\u2026"
                      : "Send my plan"}
                    {leadStatus !== "submitting" && (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                  {leadStatus === "error" && (
                    <p className="text-xs text-red-500 pl-1">{leadError}</p>
                  )}
                  <p className="text-[10px] text-center text-halo-charcoal/40 pt-1">
                    We&rsquo;ll never share your info. Unsubscribe anytime.
                  </p>
                </form>
              </div>
            )}

            {/* Success */}
            {leadStatus === "success" && (
              <div
                className="rounded-[14px] p-5 md:p-6 text-center"
                style={{
                  background: `${PERSONA}0F`,
                  border: `1px solid ${PERSONA}33`,
                }}
              >
                <p
                  className="plex-mono text-[10px] font-semibold uppercase tracking-[0.22em] mb-2"
                  style={{ color: PERSONA_DEEP }}
                >
                  On its way
                </p>
                <h4 className="font-serif text-[20px] md:text-[22px] leading-[1.2] tracking-tight text-halo-charcoal mb-2">
                  Check your inbox.
                </h4>
                <p className="text-[13px] text-halo-charcoal/65 leading-relaxed mb-5 max-w-sm mx-auto">
                  Your personalized NAD+ overview is on its way. When
                  you&rsquo;re ready to measure your actual numbers, take the
                  full assessment.
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                  {/* TODO: Swap to /quiz/nad once the focused NAD+ qualification quiz ships */}
                  <Link
                    href="/quiz?from=nad-estimator"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm transition-all hover:brightness-95"
                    style={{ backgroundColor: PERSONA }}
                  >
                    Take the full assessment
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full text-halo-charcoal/70 font-semibold text-sm border border-halo-charcoal/15 hover:bg-halo-charcoal/[0.04] transition-colors"
                  >
                    Start over
                  </button>
                </div>
              </div>
            )}

            {/* Duplicate */}
            {leadStatus === "duplicate" && (
              <div
                className="rounded-[14px] p-5 md:p-6 text-center"
                style={{
                  background: `${PERSONA}0F`,
                  border: `1px solid ${PERSONA}33`,
                }}
              >
                <p
                  className="plex-mono text-[10px] font-semibold uppercase tracking-[0.22em] mb-2"
                  style={{ color: PERSONA_DEEP }}
                >
                  Welcome back
                </p>
                <h4 className="font-serif text-[20px] md:text-[22px] leading-[1.2] tracking-tight text-halo-charcoal mb-2">
                  You&rsquo;re already on the list.
                </h4>
                <p className="text-[13px] text-halo-charcoal/65 leading-relaxed mb-5 max-w-sm mx-auto">
                  Ready to measure your actual NAD+? The full assessment takes
                  about four minutes.
                </p>
                {/* TODO: Swap to /quiz/nad once the focused NAD+ qualification quiz ships */}
                <Link
                  href="/quiz?from=nad-estimator"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm transition-all hover:brightness-95"
                  style={{ backgroundColor: PERSONA }}
                >
                  Take the full assessment
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            <p className="plex-mono text-[9px] italic text-halo-charcoal/35 mt-5 text-center">
              Not a diagnostic. Actual NAD+ varies by tissue, genetics, and lifestyle.
            </p>
          </div>
        )}
      </div>

      {/* ─── Back / Next footer — questions only ─── */}
      {step !== "result" && (
        <div className="px-6 md:px-8 pb-6 flex items-center justify-between">
          <button
            onClick={goBack}
            disabled={step === 1}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
            style={{
              color:
                step === 1 ? "rgba(28,28,30,0.25)" : "rgba(28,28,30,0.65)",
              cursor: step === 1 ? "not-allowed" : "pointer",
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          {step === 1 || step === 7 ? (
            <button
              onClick={goNext}
              disabled={!currentAnswered}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold text-[13px] transition-all hover:brightness-95"
              style={{
                backgroundColor: currentAnswered
                  ? PERSONA
                  : "rgba(28,28,30,0.15)",
                cursor: currentAnswered ? "pointer" : "not-allowed",
                boxShadow: currentAnswered ? `0 8px 24px ${PERSONA}55` : "none",
              }}
            >
              {step === 7 ? "See my estimate" : "Continue"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <p className="plex-mono text-[9px] uppercase tracking-[0.2em] text-halo-charcoal/35">
              Tap to continue
            </p>
          )}
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
      {/* Page-scoped animations. Respect prefers-reduced-motion. */}
      <style jsx global>{`
        @keyframes nad-breathe {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50%      { transform: scale(1.8); opacity: 0.18; }
        }
        @keyframes nad-pulse-soft {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50%      { opacity: 1;    transform: scale(1.25); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="nad-breathe"], [style*="nad-pulse-soft"] {
            animation: none !important;
          }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════
          1 · HERO — Dark + lab panel (edgy / scientific)
          ═══════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#0B1020" }}
      >
        {/* Subtle grid pattern — technical document register */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(123,142,179,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(123,142,179,0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at 50% 50%, black 40%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 50%, black 40%, transparent 85%)",
          }}
        />

        {/* Persona glow accents */}
        <div
          className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full pointer-events-none"
          aria-hidden="true"
          style={{ background: PERSONA, filter: "blur(160px)", opacity: 0.18 }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full pointer-events-none"
          aria-hidden="true"
          style={{ background: PERSONA_DEEP, filter: "blur(160px)", opacity: 0.25 }}
        />

        <div className="relative grid lg:grid-cols-[1fr_1.1fr] lg:min-h-[720px]">
          {/* LEFT: Content */}
          <div className="relative flex flex-col justify-center px-6 md:px-10 lg:px-14 py-14 md:py-16 lg:py-20 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              {/* Breathing cellular-energy dot — signature NAD+ motif */}
              <span
                className="relative inline-flex items-center justify-center w-[10px] h-[10px]"
                aria-hidden="true"
              >
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: PERSONA_SOFT,
                    animation: "nad-breathe 6s ease-in-out infinite",
                  }}
                />
                <span
                  className="absolute w-[4px] h-[4px] rounded-full"
                  style={{ background: PERSONA_SOFT }}
                />
              </span>
              <span
                className="plex-mono text-[10px] font-semibold uppercase tracking-[0.28em]"
                style={{ color: PERSONA_SOFT }}
              >
                NAD+ Therapy &middot; Longevity medicine
              </span>
            </div>

            <h1 className="headline-hero text-[32px] md:text-[46px] lg:text-[56px] text-white leading-[1.04] tracking-tight mb-5">
              You&rsquo;ve heard about NAD+.{" "}
              <span className="italic" style={{ color: PERSONA_SOFT }}>
                Here&rsquo;s how to actually use it.
              </span>
            </h1>

            <p className="text-[16px] md:text-[17px] text-white/65 leading-relaxed mb-8 max-w-md">
              NAD+ drops 50% by age 60. Halo prescribes, measures, and restores
              it &mdash; monthly, at home.
            </p>

            <ul className="space-y-2.5 mb-9 max-w-md">
              {[
                "A prescribed therapy \u2014 not a drugstore supplement.",
                "Subcutaneous injection \u2014 skip the IV chair.",
                "Paired with Glutathione. Monitored every 90 days.",
              ].map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span
                    className="mt-[10px] flex-shrink-0 w-5 h-px"
                    style={{ background: PERSONA_SOFT }}
                  />
                  <span className="text-[14px] md:text-[15px] text-white/85 leading-snug">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Link
                href="/quiz?from=nad"
                className="hidden md:inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all hover:brightness-105"
                style={{
                  backgroundColor: "white",
                  color: "#0B1020",
                  boxShadow: `0 8px 28px rgba(63,90,138,0.35)`,
                }}
              >
                Start my assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#cellular-age-estimator"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("cellular-age-estimator");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/25 text-white font-semibold text-sm hover:border-white/50 transition-colors"
              >
                See if I qualify
              </a>
            </div>

            <p className="text-[12px] text-white/45 italic">
              Starts at $179/mo. Free physician consultation before any prescription.
            </p>
          </div>

          {/* RIGHT: Lab panel stack */}
          <div
            className="relative order-1 lg:order-2 min-h-[520px] md:min-h-[600px] lg:min-h-0 flex items-center px-6 md:px-10 lg:px-14 py-10 md:py-14 lg:py-20"
          >
            {/* Mobile CTA overlay */}
            <div className="md:hidden absolute bottom-5 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none">
              <Link
                href="/quiz?from=nad"
                className="pointer-events-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-sm shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                style={{ backgroundColor: "white", color: "#0B1020" }}
              >
                Start my assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative w-full max-w-[440px] mx-auto">
              {/* Interactive lab panel — toggle drives animated number ticks + gauge slides.
                  This is the page's signature interaction. */}
              <InteractiveLabPanel before={beforePanel} after={afterPanel} />

              {/* Nudge caption — gets users to actually touch the toggle */}
              <p
                className="plex-mono text-[10px] uppercase tracking-[0.22em] text-white/45 mt-5 text-center flex items-center justify-center gap-2"
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: PERSONA_SOFT, animation: "nad-pulse-soft 2.4s ease-in-out infinite" }}
                  aria-hidden="true"
                />
                Tap &ldquo;90 days&rdquo; to see the shift
              </p>
              <p className="plex-mono text-[9px] uppercase tracking-[0.18em] text-white/25 mt-2 text-center">
                Sample panel &middot; representative of member results
              </p>
            </div>
          </div>
        </div>

        {/* Trust strip (dark variant) */}
        <div
          className="relative border-t backdrop-blur-sm"
          style={{
            borderColor: "rgba(123,142,179,0.15)",
            background: "rgba(11,16,32,0.6)",
          }}
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 plex-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
            <span>Board-certified physicians</span>
            <span className="text-white/20">&middot;</span>
            <span>US-licensed 503A pharmacy</span>
            <span className="text-white/20">&middot;</span>
            <span>Lab-monitored</span>
            <span className="text-white/20">&middot;</span>
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
          4 · THE DECLINE — science + biohacker accordion
          (cost comparison lives in Section 7 Delivery Comparison)
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6" style={{ background: "#F2EEE4" }}>
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-10 md:mb-14">
              <p className="plex-mono text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
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
                  <p
                    className="font-serif text-[44px] md:text-[60px] lg:text-[68px] font-light leading-[0.95] mb-3 tracking-tight flex items-baseline justify-center md:justify-start"
                    style={{ color: PERSONA }}
                  >
                    {stat.prefix && (
                      <span className="opacity-70 mr-0.5">{stat.prefix}</span>
                    )}
                    <CountUpNumber
                      target={stat.value}
                      duration={1400}
                      className="font-serif font-light leading-[0.95] tracking-tight"
                    />
                    {stat.suffix && <span>{stat.suffix}</span>}
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
          5 · CELLULAR AGE QUIZ — inline engagement
          "Your number → measure it for real"
          ═══════════════════════════════════════════════ */}
      <section id="cellular-age-estimator" className="scroll-mt-20 py-16 md:py-24 px-6 section-light">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-10 md:mb-14">
              <p
                className="plex-mono text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
                Your number
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-[44px] text-halo-charcoal leading-[1.1] max-w-2xl mx-auto">
                See roughly where you stand.{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  Before you measure it.
                </span>
              </h2>
              <p className="text-[14px] md:text-[15px] text-halo-charcoal/60 max-w-xl mx-auto mt-5 leading-relaxed">
                Seven quick questions. One estimated cellular age. It&rsquo;s
                not a diagnostic &mdash; Halo&rsquo;s baseline panel is. But
                it&rsquo;s a fast way to see how far the curve has moved on
                you.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <CellularAgeQuiz />
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
              <p className="plex-mono text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
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
              <p className="plex-mono text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
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
              <p className="plex-mono text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
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
          10 · OUTCOMES
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <p className="plex-mono text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
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
              <p className="plex-mono text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
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
                <p className="plex-mono text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: PERSONA }}>
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
              <p className="plex-mono text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
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
                <p className="plex-mono text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: PERSONA }}>
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
            <p className="plex-mono text-[10px] font-semibold uppercase tracking-[0.28em] mb-5" style={{ color: PERSONA_SOFT }}>
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
