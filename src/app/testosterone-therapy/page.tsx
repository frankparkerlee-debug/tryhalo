"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import FAQ from "@/components/FAQ";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import HaloPattern from "@/components/HaloPattern";
import HaloMarquee from "@/components/HaloMarquee";

/* ==============================
   PERSONA COLOR — TRT = steel blue
   ============================== */
const PERSONA = "#4A7AB8";
const PERSONA_SOFT = "#8DA1B8";
const PERSONA_DEEP = "#3A5F94";

/* ==============================
   DATA
   ============================== */

const treatmentFormats = [
  {
    name: "Pill",
    desc: "Daily oral capsule",
    body: "Simple routine, no needles. A steady format for men who want treatment without any daily physicality.",
    image: "/trt/format-pill.png",
  },
  {
    name: "Injection",
    desc: "Weekly subcutaneous",
    body: "The gold standard for precise dosing and the most well-studied delivery method. A small needle, once a week.",
    image: "/trt/format-injection.png",
  },
  {
    name: "Cream",
    desc: "Daily transdermal",
    body: "Applied to the shoulders or upper arms. Smooth, steady levels without needles. Absorbs quickly.",
    image: "/trt/format-cream.png",
  },
];

const impactStats = [
  {
    numberText: "25%",
    label: "drop in men's testosterone levels since the 1980s",
    source: "Travison et al., J Clin Endocrinol Metab, 2007",
  },
  {
    numberText: "1 in 4",
    label: "men over 30 have clinically low testosterone",
    source: "Araujo et al., J Clin Endocrinol Metab, 2007",
  },
  {
    numberText: "5+ yrs",
    label: "average wait before a man gets tested for low T",
    source: "Endocrine Society Position Statement, 2020",
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
    claim: "report renewed motivation and focus within 6 weeks",
  },
  {
    stat: "74%",
    label: "Energy",
    claim: "sustained daily energy without afternoon crash",
  },
  {
    stat: "82%",
    label: "Recovery",
    claim: "deeper sleep and faster recovery within 12 weeks",
  },
];

const trtSteps = [
  {
    day: "DAY 1",
    title: "Health profile",
    desc: "A short intake covering symptoms, goals, and medical history. About two minutes.",
  },
  {
    day: "DAY 2\u20135",
    title: "Labs drawn",
    desc: "Lab order sent to a Quest or Labcorp near you. Walk in anytime \u2014 no appointment needed.",
  },
  {
    day: "DAY 6\u201310",
    title: "Physician consult",
    desc: "Video visit with your physician. They walk your panel, discuss goals, and design your protocol.",
  },
  {
    day: "DAY 11\u201314",
    title: "Medication ships",
    desc: "Shipped from a US-licensed 503A pharmacy, everything you need in one box.",
  },
];

const faqItems = [
  {
    question: "Who is testosterone therapy for?",
    answer:
      "Men with clinically low testosterone \u2014 typically ages 30 through 65. Symptoms include fatigue, low drive, poor recovery, brain fog, disrupted sleep, and loss of strength or muscle mass. Diagnosis starts with a full hormone panel.",
  },
  {
    question: "Will TRT shut down my natural production?",
    answer:
      "Exogenous testosterone suppresses your body\u2019s LH and FSH signaling, which can reduce your own production. That\u2019s why some protocols include HCG to preserve testicular function. Your physician will walk through the tradeoffs before you start.",
  },
  {
    question: "Will TRT affect my fertility?",
    answer:
      "Testosterone alone can reduce sperm production. If fertility matters, your physician may add HCG to your protocol, or prescribe Enclomiphene \u2014 which stimulates your own production while preserving fertility. This is a first-visit conversation.",
  },
  {
    question: "Is TRT forever?",
    answer:
      "For most men with clinically low testosterone, yes. Stopping causes a return to baseline. That said, you\u2019re never locked in. Protocols can be adjusted, tapered, or paused with physician guidance.",
  },
  {
    question: "What labs do you run?",
    answer:
      "Total testosterone, free testosterone, SHBG, estradiol, LH, FSH, prolactin, CBC, CMP, lipid panel, PSA, and thyroid panel. Follow-up labs at 90 days. Every adjustment is based on bloodwork.",
  },
  {
    question: "How fast will I feel results?",
    answer:
      "Most men notice energy and drive shifts within 2\u20134 weeks. Body composition, strength, and recovery typically catch up over 8\u201312 weeks as levels stabilize.",
  },
  {
    question: "Can I switch formats later?",
    answer:
      "Yes. If injection isn\u2019t working for your routine, we can switch to cream. If cream isn\u2019t consistent enough, we can switch to injection. Format is a lifestyle choice \u2014 the medicine underneath stays the same.",
  },
  {
    question: "Can I cancel anytime?",
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
   LAB PANEL \u2014 the hero visual
   ============================== */

type LabMarker = {
  name: string;
  value: string;
  unit: string;
  status: "low" | "mid" | "ok" | "optimal";
  position: number;
};

const beforePanel: LabMarker[] = [
  { name: "Total Testosterone", value: "325", unit: "ng/dL", status: "low", position: 2 },
  { name: "Free T", value: "6.4", unit: "pg/mL", status: "low", position: 2.5 },
  { name: "SHBG", value: "42", unit: "nmol/L", status: "mid", position: 5 },
  { name: "Estradiol", value: "19", unit: "pg/mL", status: "ok", position: 6 },
  { name: "LH", value: "4.2", unit: "IU/L", status: "ok", position: 5.5 },
];

const afterPanel: LabMarker[] = [
  { name: "Total Testosterone", value: "685", unit: "ng/dL", status: "optimal", position: 7.5 },
  { name: "Free T", value: "18.2", unit: "pg/mL", status: "optimal", position: 7.8 },
  { name: "SHBG", value: "38", unit: "nmol/L", status: "ok", position: 5.5 },
  { name: "Estradiol", value: "24", unit: "pg/mL", status: "ok", position: 6.5 },
  { name: "LH", value: "2.8", unit: "IU/L", status: "ok", position: 4.5 },
];

function statusLabel(status: LabMarker["status"]) {
  if (status === "low") return "LOW";
  if (status === "mid") return "MID";
  if (status === "ok") return "NORMAL";
  return "OPTIMAL";
}

function statusColor(status: LabMarker["status"]) {
  if (status === "low") return "#C26B4A";
  if (status === "mid") return "#8DA1B8";
  if (status === "ok") return "#6B8BB8";
  return PERSONA;
}

function Gauge({ position, status }: { position: number; status: LabMarker["status"] }) {
  const pct = Math.max(2, Math.min(98, (position / 10) * 100));
  return (
    <div className="relative w-full h-[6px] rounded-full overflow-hidden" style={{ background: "rgba(28,28,30,0.06)" }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(194,107,74,0.18) 0%, rgba(141,161,184,0.15) 45%, rgba(74,122,184,0.20) 100%)",
        }}
      />
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

function LabPanel({ markers, badge }: { markers: LabMarker[]; badge?: string }) {
  return (
    <div
      className="relative rounded-[22px] overflow-hidden"
      style={{
        background: "#FAF8F4",
        boxShadow:
          "0 20px 60px -20px rgba(30,30,40,0.22), 0 1px 0 rgba(255,255,255,0.6) inset",
        border: "1px solid rgba(28,28,30,0.06)",
      }}
    >
      {/* Header */}
      <div className="px-6 md:px-7 pt-5 md:pt-6 pb-4 flex items-start justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-halo-charcoal/40">
            Halo Health
          </p>
          <p className="text-[13px] md:text-[14px] font-semibold tracking-tight text-halo-charcoal mt-1.5">
            Your Hormone Panel
          </p>
        </div>
        {badge && (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-[0.15em]"
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
                background: badge.toLowerCase().includes("before")
                  ? "#C26B4A"
                  : PERSONA,
              }}
            />
            {badge}
          </span>
        )}
      </div>

      <div className="h-px w-full" style={{ background: "rgba(28,28,30,0.08)" }} />

      {/* Lead number */}
      <div className="px-6 md:px-7 pt-5 pb-4">
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/45">
            Total Testosterone
          </p>
          <span
            className="text-[9px] font-semibold tracking-[0.15em]"
            style={{ color: statusColor(markers[0].status) }}
          >
            {statusLabel(markers[0].status)}
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-serif text-[48px] md:text-[56px] font-light leading-none tracking-tight text-halo-charcoal">
            {markers[0].value}
          </span>
          <span className="text-[13px] text-halo-charcoal/55">
            {markers[0].unit}
          </span>
        </div>
        <Gauge position={markers[0].position} status={markers[0].status} />
      </div>

      <div className="h-px w-full" style={{ background: "rgba(28,28,30,0.08)" }} />

      {/* Secondary markers */}
      <div className="px-6 md:px-7 py-4 space-y-3">
        {markers.slice(1).map((m) => (
          <div key={m.name}>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-[11px] font-medium text-halo-charcoal/80 truncate">
                {m.name}
              </span>
              <div className="flex items-baseline gap-1.5 flex-shrink-0">
                <span className="text-[12px] font-medium text-halo-charcoal">
                  {m.value}
                </span>
                <span className="text-[10px] text-halo-charcoal/45">
                  {m.unit}
                </span>
                <span
                  className="text-[9px] font-semibold tracking-[0.12em] ml-1"
                  style={{ color: statusColor(m.status) }}
                >
                  · {statusLabel(m.status)}
                </span>
              </div>
            </div>
            <Gauge position={m.position} status={m.status} />
          </div>
        ))}
      </div>

      <div className="h-px w-full" style={{ background: "rgba(28,28,30,0.08)" }} />

      {/* Footer */}
      <div className="px-6 md:px-7 py-3.5 flex items-center justify-between">
        <p className="text-[10px] italic text-halo-charcoal/45">
          Physician review in 5 days
        </p>
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-halo-charcoal/30">
          Halo · 2026
        </p>
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
      <p className="font-serif text-[22px] md:text-[28px] text-halo-charcoal leading-tight mb-2 tracking-tight">
        Your number,{" "}
        <span className="italic" style={{ color: PERSONA }}>
          pulled back up.
        </span>
      </p>
      <p className="text-[13px] text-halo-charcoal/55 mb-8 max-w-md">
        Testosterone drops 1&ndash;2% per year after 30. TRT restores you to a
        clinically healthy range &mdash; not a 25-year-old&rsquo;s peak, the
        number your body actually needs now.
      </p>

      <div
        className="relative rounded-[20px] border border-halo-charcoal/[0.08] p-6 md:p-8"
        style={{
          background: "linear-gradient(180deg, #F7FAFC 0%, #E8EFF7 100%)",
        }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          aria-label="Testosterone levels decline with age — TRT restores to therapeutic range"
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
          Based on clinical reference ranges for total serum testosterone.
          Therapeutic targets vary by patient. &mdash; Bhasin et al., Endocrine
          Society Guidelines, 2018.
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
   PAGE
   ============================== */

export default function TestosteroneTherapyPage() {
  const rightColRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  /* Parallax: right column scrolls slightly faster than the page */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;

    let raf = 0;
    const update = () => {
      if (!rightColRef.current || !heroRef.current) return;
      const heroTop = heroRef.current.getBoundingClientRect().top;
      const offset = Math.max(-160, Math.min(0, heroTop * 0.12));
      rightColRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════
          1 · HERO — Lab Panel + left content
          ═══════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative section-light overflow-hidden">
        <div className="grid lg:grid-cols-[40%_60%] lg:min-h-[760px]">
          {/* LEFT: Content */}
          <div className="relative flex flex-col justify-center px-6 md:px-10 lg:px-14 py-12 md:py-16 lg:py-20 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.25em]"
                style={{ color: PERSONA }}
              >
                Testosterone Therapy
              </span>
              <span className="text-halo-charcoal/20">·</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-halo-charcoal/50">
                For men
              </span>
              <span
                className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                style={{
                  borderColor: `${PERSONA}40`,
                  color: PERSONA,
                }}
              >
                <span className="w-1 h-1 rounded-full" style={{ background: PERSONA }} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                  Founding · Closes June 1
                </span>
              </span>
            </div>

            <h1 className="headline-hero text-[34px] md:text-[48px] lg:text-[56px] text-halo-charcoal leading-[1.05] tracking-tight mb-4">
              Low T isn&rsquo;t a{" "}
              <span className="italic" style={{ color: PERSONA }}>
                vibe.
              </span>
              <br />
              It&rsquo;s a lab result.
            </h1>

            <p className="text-[16px] md:text-[17px] text-halo-charcoal/65 leading-relaxed mb-8 max-w-md">
              Halo Testosterone is physician-led optimization for men whose
              numbers have drifted. Comprehensive labs. Pharmacy-compounded
              medication. Delivered to your door.
            </p>

            <ul className="space-y-2.5 mb-8 max-w-md">
              {[
                "Physician-led protocols, not a supplement stack",
                "Real labs. Real numbers. Real adjustments.",
                "Medication in your hands in 14 days",
              ].map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span
                    className="mt-[9px] flex-shrink-0 w-5 h-px"
                    style={{ background: PERSONA }}
                  />
                  <span className="text-[14px] md:text-[15px] text-halo-charcoal/80 leading-snug">
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

          {/* RIGHT: Lab Panel stack + parallax */}
          <div
            className="relative order-1 lg:order-2"
            style={{
              background:
                "linear-gradient(165deg, #EDF3FA 0%, #DEE6F1 50%, #B8CCE3 100%)",
            }}
          >
            <div className="absolute inset-0 opacity-[0.25] pointer-events-none">
              <HaloPattern
                variant="default"
                intensity={0.9}
                color={PERSONA}
                showCore={false}
                className="absolute inset-0 w-full h-full"
              />
            </div>

            <div
              ref={rightColRef}
              className="relative px-6 md:px-10 lg:px-14 py-10 md:py-14 lg:py-20 min-h-[540px] lg:min-h-[760px] flex items-center"
            >
              <div className="relative w-full max-w-[440px] mx-auto">
                {/* BACK panel — peeks behind */}
                <div
                  className="absolute top-10 md:top-14 -right-6 md:-right-8 w-[88%] md:w-[92%] opacity-[0.85] pointer-events-none"
                  aria-hidden="true"
                  style={{ filter: "blur(0.4px) saturate(0.92)" }}
                >
                  <LabPanel markers={afterPanel} badge="At 90 days · Optimal" />
                </div>

                {/* FRONT panel */}
                <div className="relative">
                  <LabPanel markers={beforePanel} badge="Before protocol" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="border-t border-halo-charcoal/[0.08] bg-white/40 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/55">
            <span>Board-certified physicians</span>
            <span className="text-halo-charcoal/20">·</span>
            <span>US-licensed 503A pharmacy</span>
            <span className="text-halo-charcoal/20">·</span>
            <span>HIPAA secure</span>
            <span className="text-halo-charcoal/20">·</span>
            <span>Ships in 48 hours</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2 · MARQUEE
          ═══════════════════════════════════════════════ */}
      <HaloMarquee items={trtMarqueeItems} />

      {/* ═══════════════════════════════════════════════
          3 · DATA PUNCH — The treatment gap
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
                Why most men{" "}
                <span className="italic text-halo-charcoal/70">wait years</span>{" "}
                to get tested.
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/55 max-w-xl mx-auto mt-5 leading-relaxed">
                You&rsquo;ve been told it&rsquo;s just getting older. Offered
                coffee instead of a lab panel. That&rsquo;s not medicine.
                That&rsquo;s a shrug.
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
                    className="font-serif text-[44px] md:text-[64px] lg:text-[72px] font-light leading-[0.95] mb-3 tracking-tight"
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
          4 · THE DECLINE CHART
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light" style={{ background: "#FAF8F4" }}>
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-10 md:mb-14">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
                The science
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1] max-w-3xl mx-auto">
                Testosterone doesn&rsquo;t just run libido.{" "}
                <span className="italic text-halo-charcoal/70">
                  It runs everything.
                </span>
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/55 max-w-xl mx-auto mt-5 leading-relaxed">
                Recovery, muscle, focus, mood, sleep architecture, metabolic
                rate. When testosterone drops, all of it drops with it.
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
      <section
        className="py-16 md:py-24 px-6"
        style={{
          background: "linear-gradient(180deg, #EDF3FA 0%, #DEE6F1 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="grid md:grid-cols-[1fr_1fr] gap-10 md:gap-16 items-center">
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-5"
                  style={{ color: PERSONA }}
                >
                  The reframe
                </p>
                <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.08] mb-6">
                  You&rsquo;re not{" "}
                  <span className="italic" style={{ color: PERSONA }}>
                    aging.
                  </span>
                  <br />
                  You&rsquo;re running low.
                </h2>
                <p className="text-[15px] md:text-base text-halo-charcoal/65 leading-relaxed max-w-md">
                  If several of these sound familiar, it&rsquo;s worth knowing
                  your numbers. Not getting older. Not stress. Not a vibe.
                  Testosterone, measurable.
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
      <section className="py-20 md:py-28 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
                Your treatment
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                Three formats.{" "}
                <span className="italic text-halo-charcoal/70">
                  One protocol.
                </span>
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/55 max-w-xl mx-auto mt-5 leading-relaxed">
                The medicine is the same. Pick the format that fits your life
                &mdash; needles or not, daily or weekly, in your routine or out
                of it.
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
      <section className="py-20 md:py-28 px-6" style={{ background: "#1C1817" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-14 md:mb-20">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA_SOFT }}
              >
                Your first 14 days
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-white leading-[1.1]">
                From intake to medication,{" "}
                <span className="italic text-white/70">two weeks.</span>
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
                  <p className="text-[14px] text-white/60 leading-relaxed text-center md:text-left">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8 · 90-DAY OUTCOMES
          ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-14 md:mb-20">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
                What optimization looks like
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1] max-w-3xl mx-auto">
                At 90 days,{" "}
                <span className="italic text-halo-charcoal/70">
                  your numbers. And everything they carry.
                </span>
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
              {outcomes.map((o) => (
                <div
                  key={o.label}
                  className="aos-child p-8 md:p-10 rounded-[24px] border border-halo-charcoal/[0.08] flex flex-col"
                  style={{ background: "#FAF8F4" }}
                >
                  <p
                    className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-5"
                    style={{ color: PERSONA }}
                  >
                    {o.label}
                  </p>
                  <p
                    className="font-serif text-[64px] md:text-[76px] font-light leading-[0.95] mb-4 tracking-tight"
                    style={{ color: PERSONA_DEEP }}
                  >
                    {o.stat}
                  </p>
                  <div
                    className="w-12 h-px mb-4"
                    style={{ background: PERSONA, opacity: 0.35 }}
                  />
                  <p className="text-[14px] text-halo-charcoal/70 leading-relaxed">
                    {o.claim}
                  </p>
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
      <section className="py-20 md:py-28 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
                style={{ color: PERSONA }}
              >
                Pricing
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                One membership.{" "}
                <span className="italic text-halo-charcoal/70">
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
                      "Comprehensive hormone panel (first panel free)",
                      "Testosterone and protocol medications included",
                      "Ongoing async physician access",
                      "Follow-up labs at 90 days",
                      "Protocol adjustments as needed",
                      "Supplies (syringes, alcohol swabs) included",
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
              Stop wondering.{" "}
              <span className="italic" style={{ color: PERSONA_SOFT }}>
                Start knowing.
              </span>
            </h2>
            <p className="text-[15px] md:text-base text-white/55 leading-relaxed mb-10 max-w-xl mx-auto">
              The first lab panel is free for founding members. No commitment
              until your physician reviews your numbers.
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
        <p className="text-center text-[11px] text-halo-charcoal/30 max-w-3xl mx-auto leading-relaxed">
          Halo is a technology platform that connects patients with licensed
          healthcare providers. All clinical decisions are made by independent
          licensed providers. Individual results may vary. This content is not
          medical advice. Compounded drug products are not approved or evaluated
          for safety, effectiveness, or quality by the FDA. Testosterone is a
          controlled substance. Rx required. Not available in all 50 states.
        </p>
      </div>
    </>
  );
}
