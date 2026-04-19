"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import FAQ from "@/components/FAQ";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import HaloPattern from "@/components/HaloPattern";
import HaloMarquee from "@/components/HaloMarquee";

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
  },
  {
    name: "Cream",
    desc: "Daily transdermal",
    body: "Applied to shoulders or upper arms. Smooth levels, no needles. Absorbs in minutes.",
    image: "/trt/format-cream.png",
  },
  {
    name: "Pill",
    desc: "Daily oral capsule",
    body: "Simple routine. No needles. A steady daily format that moves with your life.",
    image: "/trt/format-pill.png",
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
    label: "average wait from symptoms to first lab.",
    source: "Endocrine Society Statement, 2020",
  },
];

const symptoms = [
  "Low drive",
  "Poor recovery",
  "3pm crash",
  "Brain fog",
  "Disrupted sleep",
  "Weight won't move",
  "Strength fading",
  "Mood shifts",
  "Low libido",
];

const outcomes = [
  {
    stat: "78%",
    label: "Drive",
    claim: "Renewed motivation and focus. Most men feel it within six weeks.",
    image: "/trt/life-drive.png",
  },
  {
    stat: "74%",
    label: "Energy",
    claim: "Daily energy sustained through afternoon. No 3pm crash.",
    image: "/trt/life-energy.png",
  },
  {
    stat: "82%",
    label: "Recovery",
    claim: "Deeper sleep. Faster recovery from training.",
    image: "/trt/life-recovery.png",
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
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          aria-label="Testosterone decline with age and therapeutic range"
        >
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

          <rect
            x={px}
            y={rangeTop}
            width={plotW}
            height={rangeBot - rangeTop}
            fill="url(#range-band-trt)"
            rx="3"
          />

          <text
            x={W - px - 8}
            y={rangeTop + (rangeBot - rangeTop) / 2 + 4}
            textAnchor="end"
            fontSize="11"
            fontWeight="700"
            letterSpacing="2.5"
            fill={PERSONA}
          >
            TRT THERAPEUTIC RANGE
          </text>

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

          <path d={areaPath} fill="url(#decline-fill-trt)" />

          <path
            d={smoothPath}
            fill="none"
            stroke="#6F6355"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="8" fill="#6F6355" opacity="0.12" />
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

          {ages.map((age, i) => {
            const x = px + (i / (ages.length - 1)) * plotW;
            return (
              <g key={age}>
                <line
                  x1={x}
                  y1={H - pyBot + 4}
                  x2={x}
                  y2={H - pyBot + 8}
                  stroke="rgba(28,28,30,0.2)"
                  strokeWidth="1"
                />
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

          <text
            x={px}
            y={pyTop - 20}
            fontSize="10"
            fontWeight="600"
            letterSpacing="2.5"
            fill="rgba(28,28,30,0.55)"
          >
            TOTAL TESTOSTERONE
          </text>
        </svg>

        <p className="text-[11px] italic text-halo-charcoal/45 mt-5 leading-relaxed">
          Clinical reference ranges for total serum testosterone. Therapeutic
          targets vary by patient. &mdash; Bhasin et al., Endocrine Society
          Guidelines, 2018.
        </p>
      </div>
    </div>
  );
}

/* ==============================
   FORMAT CARD
   ============================== */

function FormatCard({ format }: { format: (typeof treatmentFormats)[number] }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <div className="rounded-[20px] border border-halo-charcoal/[0.08] bg-white overflow-hidden transition-shadow hover:shadow-[0_10px_40px_-20px_rgba(0,0,0,0.15)]">
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
            className="absolute inset-0 w-full h-full object-cover"
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
      <div className="p-5 md:p-6">
        <h3 className="font-serif text-[22px] text-halo-charcoal leading-tight tracking-tight mb-1">
          {format.name}
        </h3>
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: PERSONA }}>
          {format.desc}
        </p>
        <p className="text-[13px] text-halo-charcoal/65 leading-relaxed">
          {format.body}
        </p>
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
      {/* Life-moment image on top */}
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

      {/* Stat + claim */}
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
      </div>
    </div>
  );
}

/* ==============================
   PAGE
   ============================== */

export default function TestosteroneTherapyPage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════
          1 · HERO — Portrait + left content
          ═══════════════════════════════════════════════ */}
      <section className="relative section-light overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_1.1fr] lg:min-h-[680px]">
          {/* LEFT: Content */}
          <div className="relative flex flex-col justify-center px-6 md:px-10 lg:px-14 py-12 md:py-16 lg:py-20 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                style={{ color: PERSONA }}
              >
                Testosterone Therapy
              </span>
            </div>

            <h1 className="headline-hero text-[34px] md:text-[48px] lg:text-[56px] text-halo-charcoal leading-[1.05] tracking-tight mb-5">
              Low T isn&rsquo;t a{" "}
              <span className="italic" style={{ color: PERSONA }}>
                vibe.
              </span>
              <br />
              It&rsquo;s a lab result.
            </h1>

            <p className="text-[16px] md:text-[17px] text-halo-charcoal/70 leading-relaxed mb-8 max-w-md">
              Physician-led testosterone optimization. Real labs. Compounded
              medication. Door to door.
            </p>

            <ul className="space-y-2.5 mb-9 max-w-md">
              {[
                "Physician-led. Not a supplement stack.",
                "Every adjustment based on bloodwork.",
                "Medication delivered in 14 days.",
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
                href="/quiz?from=trt"
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
                href="/quiz?from=trt"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-halo-charcoal/20 text-halo-charcoal font-semibold text-sm hover:border-halo-charcoal/40 transition-colors"
              >
                Is TRT right for me?
              </Link>
            </div>

            <p className="text-[12px] text-halo-charcoal/50 italic">
              Free physician consultation before any prescription.
            </p>
          </div>

          {/* RIGHT: Portrait */}
          <div
            className="relative order-1 lg:order-2 min-h-[400px] md:min-h-[500px] lg:min-h-0 overflow-hidden"
            style={{
              background:
                "linear-gradient(165deg, #E8EFF6 0%, #C9D9EB 50%, #8BA8C8 100%)",
            }}
          >
            {/* Portrait loads if file present */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/trt/hero-portrait.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center 35%" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            {/* Soft bottom scrim for trust-strip legibility */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, transparent 70%, rgba(20,25,35,0.18) 100%)",
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
            <span>HIPAA secure</span>
            <span className="text-halo-charcoal/20">&middot;</span>
            <span>Ships in 48 hours</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2 · MARQUEE
          ═══════════════════════════════════════════════ */}
      <HaloMarquee items={trtMarqueeItems} />

      {/* ═══════════════════════════════════════════════
          3 · THE TREATMENT GAP
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
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
                You&rsquo;ve been told it&rsquo;s aging. Offered coffee instead
                of bloodwork. That&rsquo;s not medicine. It&rsquo;s a shrug.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10 lg:gap-x-10">
              {impactStats.map((stat, i) => (
                <div
                  key={i}
                  className="aos-child text-center md:text-left flex flex-col"
                >
                  <p
                    className="font-serif text-[48px] md:text-[64px] lg:text-[72px] font-light leading-[0.95] mb-3 tracking-tight"
                    style={{ color: PERSONA }}
                  >
                    {stat.numberText}
                  </p>
                  <div
                    className="w-10 h-px mb-3 md:mx-0 mx-auto"
                    style={{ background: PERSONA, opacity: 0.4 }}
                  />
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
          4 · THE DECLINE
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6" style={{ background: "#F7F3EC" }}>
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-10 md:mb-14">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
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
                Recovery. Muscle. Focus. Mood. Sleep. Metabolism. When
                testosterone drops, all of it drops with it.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <TestosteroneChart />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5 · SYMPTOMS REFRAME
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="grid md:grid-cols-[1fr_1fr] gap-10 md:gap-16 items-center">
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-5"
                  style={{ color: PERSONA }}
                >
                  What it feels like
                </p>
                <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.08] mb-6">
                  You&rsquo;re not{" "}
                  <span className="italic" style={{ color: PERSONA }}>
                    aging.
                  </span>
                  <br />
                  You&rsquo;re running low.
                </h2>
                <p className="text-[15px] md:text-base text-halo-charcoal/70 leading-relaxed max-w-md">
                  If several of these are familiar, it&rsquo;s time to check
                  your numbers. Not aging. Not stress. Testosterone.
                  Measurable.
                </p>
              </div>
              <div>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {symptoms.map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-2.5 text-[14px] md:text-[15px] text-halo-charcoal/85"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: PERSONA }}
                      />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6 · THREE FORMATS
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6" style={{ background: "#F0EBE0" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
                The treatment
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                Three formats.{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  One protocol.
                </span>
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 max-w-xl mx-auto mt-5 leading-relaxed">
                The medicine is the same. Pick the format that fits your life.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
              {treatmentFormats.map((format) => (
                <div key={format.name} className="aos-child">
                  <FormatCard format={format} />
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7 · 14-DAY TIMELINE
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6" style={{ background: "#1C1817" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA_SOFT }}
              >
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
                    className="relative w-12 h-12 rounded-full mb-5 flex items-center justify-center mx-auto md:mx-0"
                    style={{
                      background: "#1C1817",
                      border: `1.5px solid ${PERSONA}`,
                    }}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ background: PERSONA }} />
                  </div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2 text-center md:text-left"
                    style={{ color: PERSONA_SOFT }}
                  >
                    {step.day}
                  </p>
                  <h3 className="font-serif text-[22px] md:text-[24px] text-white leading-tight tracking-tight mb-3 text-center md:text-left">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-white/65 leading-relaxed text-center md:text-left">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8 · 90-DAY OUTCOMES — with life-moment imagery
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
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
              Based on patient-reported outcomes from clinical trials of
              testosterone replacement therapy. Individual response varies.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9 · PRICING + FAQ
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light" style={{ background: "#FAF8F4" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
                Terms
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                One membership.{" "}
                <span className="italic" style={{ color: PERSONA }}>
                  Everything in.
                </span>
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 md:gap-12 items-start">
            <AnimateOnScroll>
              <div className="rounded-[24px] bg-white border border-halo-charcoal/[0.08] p-7 md:p-10 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.15)] lg:sticky lg:top-24">
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
                  style={{ color: PERSONA_DEEP }}
                >
                  Founding rate &middot; locked in for life
                </p>

                <div className="border-t border-halo-charcoal/[0.08] pt-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-halo-charcoal/50 mb-4">
                    What&rsquo;s included
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      "Initial video consultation with your physician",
                      "Full hormone panel (first one free)",
                      "Testosterone and protocol medications",
                      "Async physician access",
                      "Follow-up labs at 90 days",
                      "Protocol adjustments as needed",
                      "Supplies (syringes, swabs) included",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-[13px] text-halo-charcoal/80 leading-snug"
                      >
                        <span
                          className="mt-[7px] flex-shrink-0 w-3 h-px"
                          style={{ background: PERSONA }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/quiz?from=trt"
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
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                  style={{ color: PERSONA }}
                >
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
          10 · FINAL CTA
          ═══════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-16 md:py-24 px-6"
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
              Know your numbers
            </p>
            <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-white leading-[1.1] mb-6">
              Stop wondering.{" "}
              <span className="italic" style={{ color: PERSONA_SOFT }}>
                Start knowing.
              </span>
            </h2>
            <p className="text-[15px] md:text-base text-white/60 leading-relaxed mb-10 max-w-xl mx-auto">
              First lab panel is free for founding members. No commitment until
              your physician reviews the numbers.
            </p>
            <Link
              href="/quiz?from=trt"
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
          Compounded drug products are not FDA-approved or evaluated. Testosterone
          is a controlled substance. Rx required. Not available in all 50 states.
        </p>
      </div>
    </>
  );
}
