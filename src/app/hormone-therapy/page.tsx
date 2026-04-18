"use client";

import Link from "next/link";
import { ArrowRight, Plus, Minus } from "lucide-react";
import { useState } from "react";
import FAQ from "@/components/FAQ";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import HaloPattern from "@/components/HaloPattern";
import HaloMarquee from "@/components/HaloMarquee";
import CountUpNumber from "@/components/CountUpNumber";

/* ==============================
   PERSONA COLOR — HRT = terracotta rose
   ============================== */
const PERSONA = "#D4836B";
const PERSONA_SOFT = "#E8A798";

/* ==============================
   DATA
   ============================== */

const treatmentFormats = [
  { name: "Patch", desc: "Twice-weekly transdermal", image: "/hrt/format-patch.png" },
  { name: "Cream", desc: "Daily topical compound", image: "/hrt/format-cream.png" },
  { name: "Pill", desc: "Oral capsule", image: "/hrt/format-pill.png" },
];

const impactStats = [
  {
    numberText: "1 in 5",
    label: "women have left a job because of menopause",
    source: "Mayo Clinic Proceedings, 2023",
  },
  {
    numberText: "7-10 yrs",
    label: "average length of menopausal symptoms",
    source: "Avis et al., SWAN Study (JAMA Internal Medicine, 2015)",
  },
  {
    numberText: "1 in 5",
    label: "OB-GYN residents feel confident prescribing HRT",
    source: "Kling et al., Mayo Clinic Proceedings, 2019",
  },
];

const symptomChips = [
  "Hot flashes",
  "Night sweats",
  "Brain fog",
  "Mood shifts",
  "Disrupted sleep",
  "Low libido",
  "Weight drift",
  "Vaginal dryness",
  "Irritability",
];

const compounds = [
  {
    name: "Estradiol",
    subtitle: "Transdermal · Oral · Cream",
    desc: "The primary estrogen your body produces less of in perimenopause. Delivered as a patch, cream, or pill based on your needs. Addresses hot flashes, sleep, cognition, and bone health.",
    image: "/hrt/compound-estradiol.png",
  },
  {
    name: "Progesterone",
    subtitle: "Bioidentical micronized",
    desc: "Essential for sleep, mood, and uterine health. Compounded to your specific dose. Most patients take it nightly.",
    image: "/hrt/compound-progesterone.png",
    objectPosition: "35% center",
  },
  {
    name: "Testosterone",
    subtitle: "For women · Low-dose",
    desc: "Most providers don’t test women’s testosterone. We do. A small dose can transform energy, libido, and body composition — without masculinizing effects.",
    image: "/hrt/compound-testosterone.png",
  },
  {
    name: "DHEA",
    subtitle: "Adrenal support",
    desc: "For women whose cortisol and DHEA levels have shifted with age. Supports energy, mood, and hormonal buffering.",
    image: "/hrt/compound-dhea.png",
  },
];

const subjectiveCharts = [
  {
    title: "Mood",
    stat: "74%",
    claim: "report reduced irritability and emotional volatility",
    lifeImage: "/hrt/life-mood.png",
    type: "mood" as const,
  },
  {
    title: "Energy",
    stat: "69%",
    claim: "report sustained daily energy without afternoon collapse",
    lifeImage: "/hrt/life-energy.png",
    type: "energy" as const,
  },
  {
    title: "Sleep",
    stat: "82%",
    claim: "of women report uninterrupted sleep within 4 weeks",
    lifeImage: "/hrt/life-sleep.png",
    type: "sleep" as const,
  },
];

const faqItems = [
  {
    question: "Who is hormone therapy for?",
    answer:
      "Women experiencing perimenopause, menopause, or postmenopause symptoms — typically ages 35 through 65. Also appropriate for premature ovarian insufficiency, surgical menopause, or hormonal imbalances affecting quality of life.",
  },
  {
    question: "Is hormone therapy safe?",
    answer:
      "Modern bioidentical hormone therapy has been extensively studied. Current research shows that bioidentical hormones — especially when started within 10 years of menopause — have a favorable safety profile. Your Halo physician will review your individual risk factors before prescribing.",
  },
  {
    question: "What labs do you order?",
    answer:
      "A comprehensive panel: estradiol, progesterone, total and free testosterone, DHEA-S, thyroid panel (TSH, free T3, free T4), metabolic panel, CBC, vitamin D, and additional markers based on your history.",
  },
  {
    question: "How quickly will I feel results?",
    answer:
      "Most women notice improvements in sleep and mood within 2\u20134 weeks. Full effects on body composition, energy, and libido typically develop over 2\u20133 months as levels stabilize. We adjust your protocol based on how you feel and follow-up labs at 90 days.",
  },
  {
    question: "Is this bioidentical or synthetic hormones?",
    answer:
      "Bioidentical. Halo uses bioidentical estradiol, progesterone, testosterone, and DHEA — compounded by a US-licensed pharmacy. Bioidentical means the molecule is structurally identical to what your body produces.",
  },
  {
    question: "What happens if HRT isn’t right for me?",
    answer:
      "Your physician will tell you before you’re charged for a protocol. If HRT isn’t appropriate based on your labs and history, we’ll either adjust the approach or refer you to a local specialist. We don’t prescribe hormone therapy to patients it won’t help.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. No contracts, no commitments. Cancel through your member portal or by emailing your care team — your prescription continues through your current shipment cycle.",
  },
  {
    question: "Can I add other Halo programs?",
    answer:
      "Yes. Many Hormone Therapy members add Peptide Therapy (Sermorelin) or NAD+ Therapy to their protocol — all at their founding member rate.",
  },
];

/* ==============================
   DATA VISUALIZATIONS (inline SVG)
   ============================== */

// Estrogen bar chart — "Start feeling better in 4-6 weeks"
function EstrogenChart() {
  // Data — relative estradiol levels at key ages (0-100 scale)
  const ages = ["25", "35", "42", "48", "55", "60+"];
  const natural = [95, 82, 60, 38, 20, 12];

  // Chart geometry
  const W = 620;
  const H = 320;
  const px = 56; // padding x
  const pyTop = 52;
  const pyBot = 60;
  const plotW = W - px * 2;
  const plotH = H - pyTop - pyBot;

  // Convert natural values to x,y points
  const points = natural.map((val, i) => ({
    x: px + (i / (natural.length - 1)) * plotW,
    y: pyTop + ((100 - val) / 100) * plotH,
    val,
  }));

  // Therapeutic range band: 55-75 on the 0-100 scale
  const rangeTop = pyTop + ((100 - 75) / 100) * plotH;
  const rangeBot = pyTop + ((100 - 55) / 100) * plotH;

  // Smooth cubic bezier curve through points (gentle S-curves between each pair)
  const smoothPath = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const cpx = (prev.x + p.x) / 2;
      return `C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
    })
    .join(" ");

  // Area fill under the decline curve
  const areaPath = `${smoothPath} L ${points[points.length - 1].x} ${pyTop + plotH} L ${points[0].x} ${pyTop + plotH} Z`;

  return (
    <div className="w-full">
      <p className="font-serif text-[22px] md:text-[28px] text-halo-charcoal leading-tight mb-2 tracking-tight">
        Bring your hormones{" "}
        <span className="italic" style={{ color: PERSONA }}>
          back into balance.
        </span>
      </p>
      <p className="text-[13px] text-halo-charcoal/55 mb-8 max-w-md">
        Bioidentical hormone therapy restores estrogen to a clinically
        appropriate range — not to your 25-year-old self, to the balance
        your body needs now.
      </p>

      <div
        className="relative rounded-[20px] border border-halo-charcoal/[0.08] p-6 md:p-8"
        style={{
          background:
            "linear-gradient(180deg, #FDF9F2 0%, #F5EDDE 100%)",
        }}
      >
        {/* Chart */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          aria-label="Estrogen levels decline with age — HRT restores to therapeutic range"
        >
          <defs>
            {/* Subtle gradient fill for the therapeutic range band */}
            <linearGradient id="range-band" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={PERSONA} stopOpacity="0.22" />
              <stop offset="100%" stopColor={PERSONA} stopOpacity="0.12" />
            </linearGradient>
            {/* Gradient fill below the natural decline curve */}
            <linearGradient id="decline-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#8C7E6E" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#8C7E6E" stopOpacity="0" />
            </linearGradient>
            {/* Soft glow for the rose dots */}
            <filter id="dot-glow">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* ── Horizontal reference grid lines (very subtle) ── */}
          {[0.25, 0.5, 0.75].map((frac) => {
            const y = pyTop + plotH * frac;
            return (
              <line
                key={frac}
                x1={px}
                y1={y}
                x2={W - px}
                y2={y}
                stroke="rgba(28,28,30,0.04)"
                strokeWidth="1"
              />
            );
          })}

          {/* ── Therapeutic range band ── */}
          <rect
            x={px}
            y={rangeTop}
            width={plotW}
            height={rangeBot - rangeTop}
            fill="url(#range-band)"
            rx="3"
          />

          {/* Range label inside the band */}
          <text
            x={W - px - 8}
            y={rangeTop + (rangeBot - rangeTop) / 2 + 4}
            textAnchor="end"
            fontSize="11"
            fontWeight="700"
            letterSpacing="2.5"
            fill={PERSONA}
          >
            HRT THERAPEUTIC RANGE
          </text>

          {/* Subtle left-side indicator dot for the range */}
          <circle cx={px} cy={(rangeTop + rangeBot) / 2} r="3" fill={PERSONA} opacity="0.8" />
          <line
            x1={px + 4}
            y1={(rangeTop + rangeBot) / 2}
            x2={px + 18}
            y2={(rangeTop + rangeBot) / 2}
            stroke={PERSONA}
            strokeWidth="1"
            opacity="0.4"
          />

          {/* ── Area under decline curve ── */}
          <path d={areaPath} fill="url(#decline-fill)" />

          {/* ── Natural decline smooth curve ── */}
          <path
            d={smoothPath}
            fill="none"
            stroke="#6F6355"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ── Data points on the decline line ── */}
          {points.map((p, i) => (
            <g key={i}>
              {/* outer glow */}
              <circle
                cx={p.x}
                cy={p.y}
                r="8"
                fill="#6F6355"
                opacity="0.12"
              />
              {/* filled dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="white"
                stroke="#6F6355"
                strokeWidth="2"
              />
            </g>
          ))}

          {/* Natural decline label at the left-most point */}
          <text
            x={points[0].x + 14}
            y={points[0].y - 14}
            fontSize="11"
            fontWeight="700"
            letterSpacing="2"
            fill="#5A5145"
          >
            NATURAL DECLINE
          </text>

          {/* ── Age axis labels ── */}
          {ages.map((age, i) => {
            const x = px + (i / (ages.length - 1)) * plotW;
            return (
              <g key={age}>
                {/* Small tick */}
                <line
                  x1={x}
                  y1={H - pyBot + 4}
                  x2={x}
                  y2={H - pyBot + 8}
                  stroke="rgba(28,28,30,0.2)"
                  strokeWidth="1"
                />
                {/* Age label */}
                <text
                  x={x}
                  y={H - pyBot + 24}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="500"
                  fill="rgba(28,28,30,0.65)"
                >
                  {age}
                </text>
              </g>
            );
          })}

          {/* AGE axis caption */}
          <text
            x={W / 2}
            y={H - 12}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            letterSpacing="2.5"
            fill="rgba(28,28,30,0.45)"
          >
            AGE
          </text>

          {/* Y-axis caption top-left */}
          <text
            x={px}
            y={pyTop - 20}
            fontSize="10"
            fontWeight="600"
            letterSpacing="2.5"
            fill="rgba(28,28,30,0.55)"
          >
            ESTRADIOL LEVEL
          </text>
        </svg>

        {/* Footnote */}
        <p className="text-[11px] italic text-halo-charcoal/45 mt-5 leading-relaxed">
          Based on clinical reference ranges for serum estradiol. Therapeutic
          targets vary by patient. — ELITE Trial, NEJM (Hodis et al.,
          2016); WHI follow-up, 2017.
        </p>
      </div>
    </div>
  );
}

// Sleep waveform — before (fragmented) vs. on HRT (consolidated)
function SleepChart() {
  return (
    <svg viewBox="0 0 400 160" className="w-full h-auto">
      {/* Before label */}
      <text
        x="0"
        y="18"
        fontSize="10"
        fontWeight="600"
        fill="rgba(28,28,30,0.45)"
        letterSpacing="0.15em"
      >
        BEFORE · FRAGMENTED
      </text>
      {/* Before waveform - jagged with wake-ups */}
      <path
        d="M 0 50 Q 30 45 60 48 L 80 40 L 85 30 L 90 48 Q 120 52 150 45 L 170 35 L 180 28 L 185 48 Q 210 52 240 48 L 260 35 L 270 25 L 280 48 Q 320 54 400 50"
        fill="none"
        stroke="rgba(28,28,30,0.35)"
        strokeWidth="1.5"
      />

      {/* Divider */}
      <line
        x1="0"
        y1="85"
        x2="400"
        y2="85"
        stroke="rgba(28,28,30,0.1)"
        strokeWidth="1"
      />

      {/* After label */}
      <text
        x="0"
        y="105"
        fontSize="10"
        fontWeight="600"
        fill={PERSONA}
        letterSpacing="0.15em"
      >
        ON HRT · CONSOLIDATED
      </text>
      {/* After waveform - smooth single wave */}
      <path
        d="M 0 145 Q 100 140 200 135 Q 300 130 400 135"
        fill="none"
        stroke={PERSONA}
        strokeWidth="2"
      />
      <path
        d="M 0 145 Q 100 140 200 135 Q 300 130 400 135 L 400 160 L 0 160 Z"
        fill={PERSONA}
        opacity="0.12"
      />
    </svg>
  );
}

// Mood line — before (jagged) vs. on HRT (steady)
function MoodChart() {
  return (
    <svg viewBox="0 0 400 160" className="w-full h-auto">
      <text
        x="0"
        y="18"
        fontSize="10"
        fontWeight="600"
        fill="rgba(28,28,30,0.45)"
        letterSpacing="0.15em"
      >
        BEFORE · VOLATILE
      </text>
      <path
        d="M 0 55 L 50 40 L 100 65 L 150 30 L 200 60 L 250 25 L 300 55 L 350 30 L 400 50"
        fill="none"
        stroke="rgba(28,28,30,0.35)"
        strokeWidth="1.5"
      />

      <line
        x1="0"
        y1="85"
        x2="400"
        y2="85"
        stroke="rgba(28,28,30,0.1)"
        strokeWidth="1"
      />

      <text
        x="0"
        y="105"
        fontSize="10"
        fontWeight="600"
        fill={PERSONA}
        letterSpacing="0.15em"
      >
        ON HRT · STEADY
      </text>
      <path
        d="M 0 130 Q 100 128 200 130 Q 300 132 400 130"
        fill="none"
        stroke={PERSONA}
        strokeWidth="2"
      />
      <path
        d="M 0 130 Q 100 128 200 130 Q 300 132 400 130 L 400 160 L 0 160 Z"
        fill={PERSONA}
        opacity="0.12"
      />
    </svg>
  );
}

// Energy arc — before (peak-and-crash) vs. on HRT (sustained)
function EnergyChart() {
  return (
    <svg viewBox="0 0 400 160" className="w-full h-auto">
      <text
        x="0"
        y="18"
        fontSize="10"
        fontWeight="600"
        fill="rgba(28,28,30,0.45)"
        letterSpacing="0.15em"
      >
        BEFORE · PEAK & CRASH
      </text>
      <path
        d="M 0 60 L 40 28 Q 80 25 120 32 L 160 60 Q 180 75 200 70 L 250 68 Q 280 70 320 68 L 400 70"
        fill="none"
        stroke="rgba(28,28,30,0.35)"
        strokeWidth="1.5"
      />

      <line
        x1="0"
        y1="85"
        x2="400"
        y2="85"
        stroke="rgba(28,28,30,0.1)"
        strokeWidth="1"
      />

      <text
        x="0"
        y="105"
        fontSize="10"
        fontWeight="600"
        fill={PERSONA}
        letterSpacing="0.15em"
      >
        ON HRT · SUSTAINED
      </text>
      <path
        d="M 0 140 Q 80 115 200 118 Q 320 120 400 135"
        fill="none"
        stroke={PERSONA}
        strokeWidth="2"
      />
      <path
        d="M 0 140 Q 80 115 200 118 Q 320 120 400 135 L 400 160 L 0 160 Z"
        fill={PERSONA}
        opacity="0.12"
      />
    </svg>
  );
}

/* ==============================
   COMPOUND CARD — expandable
   ============================== */

function CompoundCard({ compound }: { compound: (typeof compounds)[number] }) {
  const [open, setOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <div className="rounded-[20px] border border-halo-charcoal/[0.08] bg-white overflow-hidden transition-shadow hover:shadow-[0_10px_40px_-20px_rgba(0,0,0,0.15)]">
      {/* Product image area — gradient shows through only when image fails */}
      <div
        className="relative aspect-[4/5] flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(145deg, #F5F1EA 0%, ${PERSONA_SOFT}40 60%, ${PERSONA}30 100%)`,
        }}
      >
        {!imageFailed && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={compound.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: compound.objectPosition || "center",
            }}
            onError={() => setImageFailed(true)}
          />
        )}
        {/* Fallback text — shown ONLY when image fails to load */}
        {imageFailed && (
          <div
            className="flex flex-col items-center gap-2 opacity-40"
            aria-hidden="true"
          >
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.25em]"
              style={{ color: "#5A4A2E" }}
            >
              Halo
            </span>
            <span
              className="font-serif text-[22px] italic"
              style={{ color: "#5A4A2E" }}
            >
              {compound.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        <h3 className="font-serif text-[20px] text-halo-charcoal leading-tight tracking-tight mb-1">
          {compound.name}
        </h3>
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-3"
          style={{ color: PERSONA }}
        >
          {compound.subtitle}
        </p>
        <p className="text-[13px] text-halo-charcoal/65 leading-relaxed mb-4">
          {compound.desc.slice(0, open ? undefined : 120)}
          {!open && compound.desc.length > 120 && "\u2026"}
        </p>
        {compound.desc.length > 120 && (
          <button
            onClick={() => setOpen(!open)}
            className="text-[11px] font-semibold uppercase tracking-[0.2em] inline-flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            style={{ color: PERSONA }}
          >
            {open ? (
              <>
                Less <Minus className="w-3 h-3" />
              </>
            ) : (
              <>
                More <Plus className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/* ==============================
   HOW IT WORKS — accordion
   ============================== */

const hrtSteps = [
  {
    num: "01",
    title: "Share your story",
    desc: "A short intake covering symptoms, cycle history, and goals. Takes about two minutes.",
    time: "2 minutes",
  },
  {
    num: "02",
    title: "Complete your labs",
    desc: "We send a lab order to a Quest or Labcorp near you. Walk in anytime — no appointment needed.",
    time: "Within 5 days",
  },
  {
    num: "03",
    title: "Meet your physician",
    desc: "A video visit with a physician who specializes in hormone care. Together you’ll review your labs and design a protocol.",
    time: "Within 2 weeks",
  },
  {
    num: "04",
    title: "Keep going",
    desc: "Labs repeated at 90 days. Protocol adjusted based on how you feel and how your body responds.",
    time: "Ongoing",
  },
];

function HowItWorksAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <div className="grid md:grid-cols-2 rounded-[20px] overflow-hidden border border-halo-charcoal/[0.08] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.12)]">
      {/* Image panel */}
      <div
        className="relative min-h-[320px] md:min-h-0 overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse 90% 55% at 50% 0%, rgba(255, 218, 195, 0.85) 0%, transparent 65%),
            linear-gradient(180deg, #FCEFE4 0%, #F3D5C2 50%, #D89E8A 100%)
          `,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hrt/how-it-works.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 45%, rgba(30, 18, 10, 0.35) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10">
          <h3
            className="font-serif leading-[1.05] tracking-tight"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}
          >
            <span className="block text-2xl md:text-[32px] lg:text-[40px] font-light text-white">
              Simple to start.
            </span>
            <span className="block text-2xl md:text-[32px] lg:text-[40px] italic font-light text-white/90">
              Built to last.
            </span>
          </h3>
        </div>
      </div>

      {/* Accordion panel */}
      <div className="bg-white flex flex-col">
        {hrtSteps.map((step, i) => {
          const isOpen = open === i;
          return (
            <div
              key={step.num}
              className="border-b border-halo-charcoal/[0.08] last:border-b-0 transition-colors duration-300"
              style={{
                background: isOpen ? `${PERSONA}14` : "white",
              }}
            >
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full px-5 md:px-7 py-4 md:py-[18px] flex items-center justify-between gap-4 text-left cursor-pointer"
              >
                <div className="flex items-baseline gap-4 md:gap-5 flex-1 min-w-0">
                  <span
                    className="text-[11px] font-semibold tracking-[0.18em] flex-shrink-0"
                    style={{ color: PERSONA }}
                  >
                    {step.num}
                  </span>
                  <h4 className="text-base md:text-[17px] font-medium text-halo-charcoal tracking-tight leading-tight">
                    {step.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
                  <span
                    className={`hidden md:inline text-[10px] font-semibold uppercase tracking-[0.15em] text-halo-charcoal/45 transition-opacity duration-300 ${
                      isOpen ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {step.time}
                  </span>
                  <span
                    className={`flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full transition-all duration-300 ${
                      isOpen
                        ? "rotate-45 bg-halo-charcoal text-white"
                        : "bg-halo-charcoal/[0.06] text-halo-charcoal/60"
                    }`}
                  >
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M5 1V9M1 5H9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>
              </button>
              <div
                className={`grid transition-all duration-500 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 md:px-7 pb-5 md:pb-6 md:pl-[calc(1.75rem+1.75rem)]">
                    <p className="text-[14px] text-halo-charcoal/65 leading-relaxed mb-3">
                      {step.desc}
                    </p>
                    <div className="flex items-center gap-3">
                      <span
                        className="w-6 h-px"
                        style={{ background: PERSONA }}
                      />
                      <span
                        className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                        style={{ color: PERSONA }}
                      >
                        {step.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==============================
   HRT MARQUEE ITEMS
   ============================== */

const hrtMarqueeItems = [
  { symptom: "Hot Flashes", outcome: "Calm" },
  { symptom: "Disrupted Sleep", outcome: "Deep Rest" },
  { symptom: "Brain Fog", outcome: "Clarity" },
  { symptom: "Mood Shifts", outcome: "Balance" },
  { symptom: "Lost Libido", outcome: "Desire" },
  { symptom: "Weight Drift", outcome: "Composition" },
  { symptom: "Night Sweats", outcome: "Steady Nights" },
  { symptom: "Low Energy", outcome: "Vitality" },
];

/* ==============================
   PAGE
   ============================== */

export default function HormoneTherapyPage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════
          1 · HERO — split, active portrait + editorial
          ═══════════════════════════════════════════════ */}
      <section className="relative section-light overflow-hidden">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] md:min-h-[640px] lg:min-h-[720px]">
          {/* LEFT: Portrait with floating format chips */}
          <div
            className="relative min-h-[340px] md:min-h-[420px] lg:min-h-0 overflow-hidden bg-halo-stone"
          >
            {/* Placeholder gradient - warm rose atmosphere */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse 80% 50% at 50% 10%, rgba(255, 220, 195, 0.9) 0%, transparent 60%),
                  radial-gradient(ellipse 60% 40% at 30% 80%, rgba(212, 131, 107, 0.35) 0%, transparent 55%),
                  linear-gradient(165deg, #FBEDDE 0%, #ECC4A6 50%, #B87960 100%)
                `,
              }}
            />

            {/* Real portrait loads if file present */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hrt/hero-portrait.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            {/* Soft scrim at bottom */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, transparent 55%, rgba(30, 18, 10, 0.28) 100%)",
              }}
            />

            {/* Mobile-only CTA overlay on the image */}
            <div className="md:hidden absolute bottom-4 left-4 right-4 z-10">
              <Link
                href="/quiz?from=hrt"
                className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full text-white font-semibold text-sm shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm"
                style={{
                  backgroundColor: PERSONA,
                }}
              >
                Start my assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Format chips — hidden on mobile to make room for the CTA overlay */}
            <div className="hidden md:flex absolute bottom-8 left-10 flex-wrap gap-3">
              {treatmentFormats.map((format) => (
                <div
                  key={format.name}
                  className="rounded-2xl overflow-hidden backdrop-blur-md bg-white/85 border border-white/50 p-2 md:p-2.5 shadow-[0_6px_24px_-8px_rgba(0,0,0,0.25)]"
                  style={{ minWidth: 64 }}
                >
                  <div
                    className="w-10 h-10 md:w-14 md:h-14 rounded-lg mb-1.5 flex items-center justify-center overflow-hidden relative"
                    style={{
                      background: `linear-gradient(145deg, #F5F1EA 0%, ${PERSONA_SOFT}50 100%)`,
                    }}
                    aria-hidden="true"
                  >
                    {/* Fallback letter behind the image */}
                    <span
                      className="absolute text-[10px] font-semibold uppercase tracking-[0.1em]"
                      style={{ color: PERSONA }}
                    >
                      {format.name[0]}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={format.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <p className="text-[11px] font-semibold text-halo-charcoal text-center leading-tight">
                    {format.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Content panel */}
          <div className="flex flex-col justify-center px-6 md:px-10 lg:px-14 py-12 lg:py-16">
            {/* Label + deadline chip */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.25em]"
                style={{ color: PERSONA }}
              >
                Hormone Therapy
              </span>
              <span className="text-halo-charcoal/20">&middot;</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-halo-charcoal/50">
                For women
              </span>
              <span
                className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                style={{
                  borderColor: `${PERSONA}40`,
                  color: PERSONA,
                }}
              >
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: PERSONA }}
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                  Founding · Closes June 1
                </span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="headline-hero text-[32px] md:text-[48px] lg:text-[58px] text-halo-charcoal leading-[1.05] tracking-tight mb-5">
              You&rsquo;re not{" "}
              <span className="italic" style={{ color: PERSONA }}>
                imagining this.
              </span>
              <br />
              And you don&rsquo;t have to push through it.
            </h1>

            <p className="text-[16px] md:text-[17px] text-halo-charcoal/65 leading-relaxed mb-8 max-w-md">
              Halo Hormone Therapy is physician-led hormone optimization for
              women navigating perimenopause, menopause, and beyond. Lab-driven
              protocols. Bioidentical compounds. Delivered to your door.
            </p>

            {/* Dual CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Link
                href="/quiz?from=hrt"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold text-sm transition-all hover:brightness-95"
                style={{
                  backgroundColor: PERSONA,
                  boxShadow: `0 8px 28px ${PERSONA}45`,
                }}
              >
                Start my assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quiz?from=hrt"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-halo-charcoal/20 text-halo-charcoal font-semibold text-sm hover:border-halo-charcoal/40 transition-colors"
              >
                Is HRT right for me?
              </Link>
            </div>

            {/* Tertiary skeptic link */}
            <button className="text-[12px] text-halo-charcoal/50 hover:text-halo-charcoal transition-colors self-start border-b border-halo-charcoal/15 hover:border-halo-charcoal/35 pb-0.5">
              Ask a physician first
            </button>
          </div>
        </div>

        {/* Trust strip below hero */}
        <div className="border-t border-halo-charcoal/[0.08] bg-white/40 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/55">
            <span>Board-certified hormone specialists</span>
            <span className="text-halo-charcoal/20">·</span>
            <span>USP-compounded bioidentical</span>
            <span className="text-halo-charcoal/20">·</span>
            <span>HIPAA secure</span>
            <span className="text-halo-charcoal/20">·</span>
            <span>Ships in 48 hours</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2 · HALO MARQUEE — HRT-specific pairs
          ═══════════════════════════════════════════════ */}
      <HaloMarquee items={hrtMarqueeItems} />

      {/* ═══════════════════════════════════════════════
          3 · WHY WOMEN WAIT YEARS — impact stats
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
                The treatment gap
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                Why most women{" "}
                <span className="italic text-halo-charcoal/70">wait years</span>{" "}
                to get help.
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/55 max-w-xl mx-auto mt-5 leading-relaxed">
                You&rsquo;ve been told to just deal with it. Offered an
                antidepressant instead of a hormone panel. That&rsquo;s not
                care. That&rsquo;s a shrug.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
              {impactStats.map((stat, i) => (
                <div
                  key={i}
                  className="aos-child text-center md:text-left flex flex-col"
                >
                  <p
                    className="font-serif text-[44px] md:text-[64px] lg:text-[72px] font-light text-halo-charcoal leading-[0.95] mb-3 tracking-tight"
                    style={{ color: PERSONA }}
                  >
                    {stat.numberText}
                  </p>
                  <div
                    className="w-10 h-px mb-3 md:mx-0 mx-auto"
                    style={{ background: PERSONA, opacity: 0.4 }}
                  />
                  <p className="text-[14px] md:text-[15px] text-halo-charcoal/75 leading-snug mb-3">
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
          4 · SYMPTOMS OVERLAY — typography on portrait
          ═══════════════════════════════════════════════ */}
      <section className="relative section-light py-0">
        <div
          className="relative min-h-[380px] md:min-h-[520px] lg:min-h-[640px] overflow-hidden"
          style={{
            background: `
              radial-gradient(ellipse 60% 45% at 60% 50%, rgba(212, 131, 107, 0.3) 0%, transparent 60%),
              linear-gradient(135deg, #F5E4D4 0%, #E0B798 100%)
            `,
          }}
        >
          {/* Real portrait loads if present */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hrt/symptoms-portrait.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />

          {/* Soft vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 45%, rgba(40, 25, 15, 0.25) 100%)",
            }}
          />

          {/* Big typography overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h2
              className="font-serif text-white text-center leading-[0.95] tracking-tight select-none"
              style={{ textShadow: "0 3px 40px rgba(0,0,0,0.35)" }}
            >
              <span className="block text-[34px] md:text-[56px] lg:text-[72px] font-extralight">
                It&rsquo;s not in your head.
              </span>
              <span className="block text-[22px] md:text-[34px] lg:text-[44px] italic font-extralight text-white/85 mt-2">
                And you&rsquo;re not alone.
              </span>
            </h2>
          </div>

          {/* Floating symptom chips — scattered */}
          <div className="absolute inset-0 hidden md:block pointer-events-none">
            {symptomChips.map((chip, i) => {
              // Position around the edges, avoiding center
              const positions = [
                { top: "14%", left: "20%" },
                { top: "16%", right: "20%" },
                { top: "30%", left: "12%" },
                { top: "30%", right: "12%" },
                { top: "66%", left: "14%" },
                { top: "68%", right: "14%" },
                { top: "82%", left: "22%" },
                { top: "82%", right: "22%" },
                { top: "50%", right: "6%" },
              ];
              const pos = positions[i % positions.length];
              return (
                <div
                  key={chip}
                  className="absolute inline-flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-sm bg-black/45 border border-white/20 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.4)]"
                  style={pos}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: PERSONA }}
                  />
                  <span className="text-[12px] font-medium text-white whitespace-nowrap">
                    {chip}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile: symptom chips in a scrollable row at bottom */}
          <div className="absolute bottom-6 left-0 right-0 md:hidden overflow-x-auto pb-2 px-6">
            <div className="flex gap-2 whitespace-nowrap">
              {symptomChips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-[11px] font-medium text-white flex-shrink-0"
                >
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: PERSONA }}
                  />
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5 · TREAT THE CAUSE — data chart
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <AnimateOnScroll>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
                The Science
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1] mb-5">
                Treat the{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  cause
                </span>
                ,<br />
                not just the signs.
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 leading-relaxed mb-6">
                When estrogen drops, everything shifts — sleep, mood,
                cognition, body composition, libido. Restoring balance
                doesn&rsquo;t turn back the clock. It brings you back to
                yourself.
              </p>
              <Link
                href="/quiz?from=hrt"
                className="inline-flex items-center gap-2 text-sm font-medium border-b pb-0.5 transition-colors hover:opacity-75"
                style={{
                  color: PERSONA,
                  borderColor: `${PERSONA}40`,
                }}
              >
                See if HRT fits
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <EstrogenChart />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6 · COMPOUNDS — branded product photography
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
                What&rsquo;s in your protocol
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                Four compounds.{" "}
                <span className="italic text-halo-charcoal/70">
                  Matched to you.
                </span>
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/55 max-w-xl mx-auto mt-5 leading-relaxed">
                Your physician may recommend one or several based on your
                bloodwork. Nothing is prescribed without data.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {compounds.map((compound) => (
                <div key={compound.name} className="aos-child">
                  <CompoundCard compound={compound} />
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7 · HOW IT WORKS — accordion
          ═══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="mb-6 md:mb-8">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                style={{ color: PERSONA }}
              >
                How It Works
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <HowItWorksAccordion />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8 · WHAT IT ACTUALLY FEELS LIKE — subjective charts
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
                The difference
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                What it{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  actually
                </span>{" "}
                feels like
                <br className="hidden md:block" />
                when it works.
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/55 max-w-xl mx-auto mt-5 leading-relaxed">
                Hormone therapy doesn&rsquo;t just resolve symptoms — it
                restores a life you recognize.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="flex flex-col gap-14 md:gap-20">
            {subjectiveCharts.map((chart, i) => {
              const reverse = i % 2 === 1;
              return (
                <AnimateOnScroll key={chart.title}>
                  <div
                    className={`grid md:grid-cols-2 gap-8 lg:gap-14 items-center ${
                      reverse ? "md:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    {/* Image */}
                    <div
                      className="relative aspect-[5/6] md:aspect-[4/5] rounded-[20px] overflow-hidden"
                      style={{
                        background: `linear-gradient(145deg, #F5E4D4 0%, ${PERSONA_SOFT}80 100%)`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={chart.lifeImage}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>

                    {/* Chart + stat */}
                    <div>
                      <p
                        className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-3"
                        style={{ color: PERSONA }}
                      >
                        {chart.title}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3 mb-5">
                        <span
                          className="font-serif text-[44px] md:text-[64px] font-light leading-none"
                          style={{ color: PERSONA }}
                        >
                          {chart.stat}
                        </span>
                        <span className="text-[14px] md:text-[15px] text-halo-charcoal/65 leading-snug">
                          {chart.claim}
                        </span>
                      </div>
                      <div className="bg-white/60 rounded-[16px] border border-halo-charcoal/[0.06] p-5 md:p-6">
                        {chart.type === "sleep" && <SleepChart />}
                        {chart.type === "mood" && <MoodChart />}
                        {chart.type === "energy" && <EnergyChart />}
                      </div>
                      <p className="text-[11px] italic text-halo-charcoal/40 mt-3">
                        Based on patient-reported outcomes from clinical trials
                        of bioidentical hormone therapy.
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9 · PHYSICIAN — specialist credibility strip
          ═══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 px-6 section-light">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="rounded-[20px] bg-[#F3EADA] p-6 md:p-8 lg:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center">
              {/* Physician photo */}
              <div
                className="relative w-[140px] h-[180px] md:w-[160px] md:h-[200px] rounded-[16px] overflow-hidden flex-shrink-0"
                style={{
                  background: `linear-gradient(145deg, #FFFFFF 0%, ${PERSONA_SOFT}60 100%)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/providers/sarah-chen.png"
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
                  A hormone{" "}
                  <span className="italic text-halo-charcoal/70">
                    specialist.
                  </span>
                  <br className="hidden md:block" />
                  Not a generalist who treats it on the side.
                </h3>
                <p className="text-[14px] text-halo-charcoal/60 leading-relaxed max-w-lg md:mx-0 mx-auto">
                  Halo physicians are board-certified endocrinologists and
                  internists with dedicated training in hormone therapy.
                  They&rsquo;ve spent a decade learning what most OBs weren&rsquo;t
                  taught.
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          10 · PRICING — founding deadline urgency
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-8">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5"
                style={{
                  borderColor: "#C8A96E40",
                  background: "#C8A96E14",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#C8A96E" }}
                />
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "#9C7F3E" }}
                >
                  Founding Circle · Closes June 1
                </span>
              </div>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                Straightforward pricing.
                <br />
                <span className="italic text-halo-charcoal/70">
                  No surprises.
                </span>
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="rounded-[24px] bg-white border border-halo-charcoal/[0.08] p-7 md:p-10 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.15)]">
              <div className="flex items-baseline gap-2 md:gap-3 mb-2 flex-wrap">
                <span
                  className="font-serif text-[44px] md:text-[64px] font-light leading-none"
                  style={{ color: PERSONA }}
                >
                  $129
                </span>
                <span className="text-[15px] md:text-[18px] text-halo-charcoal/50">
                  /month
                </span>
                <span className="text-halo-charcoal/30 line-through text-[13px] md:text-[14px] md:ml-2">
                  $149
                </span>
              </div>
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-6"
                style={{ color: "#9C7F3E" }}
              >
                Founding rate · locked in for life
              </p>

              <div className="border-t border-halo-charcoal/[0.08] pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-halo-charcoal/50 mb-4">
                  What&rsquo;s included
                </p>
                <ul className="space-y-2.5 mb-8">
                  {[
                    "Initial video consultation with your physician",
                    "Comprehensive baseline hormone panel (free for founders)",
                    "Compounded bioidentical medications",
                    "Ongoing async physician messaging",
                    "Follow-up labs at 90 days",
                    "Protocol adjustments as your body responds",
                    "Discreet shipping — plain packaging",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[14px] text-halo-charcoal/70"
                    >
                      <span
                        className="w-1 h-1 rounded-full mt-2.5 flex-shrink-0"
                        style={{ background: PERSONA }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/quiz?from=hrt"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold text-sm transition-all hover:brightness-95 flex-1"
                  style={{
                    backgroundColor: PERSONA,
                    boxShadow: `0 8px 28px ${PERSONA}40`,
                  }}
                >
                  Start my assessment
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/#founding-circle"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-halo-charcoal/20 text-halo-charcoal font-semibold text-sm hover:border-halo-charcoal/40 transition-colors"
                >
                  Join Founding Circle
                </Link>
              </div>

              <p className="text-[12px] text-halo-charcoal/45 mt-6 text-center italic">
                No contracts. Cancel anytime. Your founding rate is permanent as
                long as your membership is active.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          11 · FAQ
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-6 section-light">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-10 md:mb-14">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
                Before you ask
              </p>
              <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal leading-[1.1]">
                Frequently{" "}
                <span className="italic text-halo-charcoal/70">asked.</span>
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <FAQ items={faqItems} />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          12 · FINAL CTA — Halo pattern, rose-tinted
          ═══════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-14 md:py-24 lg:py-28 px-6"
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
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-5"
              style={{ color: PERSONA_SOFT }}
            >
              You don&rsquo;t have to push through it
            </p>
            <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-white leading-[1.1] mb-6">
              You deserve better than{" "}
              <span className="italic" style={{ color: PERSONA_SOFT }}>
                &ldquo;just deal with it.&rdquo;
              </span>
            </h2>
            <p className="text-[15px] md:text-base text-white/50 mb-8 max-w-lg mx-auto leading-relaxed">
              Start with a two-minute assessment. No commitment until your
              consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/quiz?from=hrt"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-semibold text-sm transition-all hover:brightness-110"
                style={{
                  backgroundColor: PERSONA,
                  boxShadow: `0 10px 40px ${PERSONA}50`,
                }}
              >
                Start my assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quiz?from=hrt"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/25 text-white font-semibold text-sm hover:border-white/50 transition-colors"
              >
                Is HRT right for me?
              </Link>
            </div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.28em] mt-10"
              style={{ color: PERSONA_SOFT, opacity: 0.7 }}
            >
              Founding Circle · Closes June 1
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Medical disclaimer */}
      <div className="py-6 px-6 section-light">
        <p className="text-center text-[11px] italic text-halo-charcoal/35 max-w-3xl mx-auto leading-relaxed">
          Halo is a technology platform that connects patients with licensed
          healthcare providers. All clinical decisions are made by independent
          licensed providers. Individual results may vary. This content is not
          medical advice.
        </p>
      </div>
    </>
  );
}
