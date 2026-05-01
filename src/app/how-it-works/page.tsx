import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardList,
  TestTube2,
  Video,
  Package,
  Pill,
  Microscope,
  MessageCircle,
  Truck,
  Calendar,
} from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import PillPattern from "@/components/PillPattern";

export const metadata = {
  title: "How Halo Works — From Sign-Up to Treatment in 3 Weeks",
  description:
    "Four steps from sign-up to feeling different. Health profile, labs, provider consultation, and medications shipped to your door.",
};

/* ==============================
   PERSONA — How-it-works = sage (system / process accent)
   ============================== */
const PERSONA = "#6B8B82";
const PERSONA_SOFT = "#A2B5AE";
const PERSONA_DEEP = "#4A6F66";

const steps = [
  {
    num: "01",
    day: "Day 1",
    title: "Health profile",
    desc: "Five-minute intake covering symptoms, history, training load, and goals. Tells your physician what to look for in the panel.",
    icon: ClipboardList,
  },
  {
    num: "02",
    day: "Day 2–7",
    title: "Lab draw",
    desc: "Quest or Labcorp order to your inbox. Walk into any of their thousands of locations — no appointment, results back in 3–5 days.",
    icon: TestTube2,
  },
  {
    num: "03",
    day: "Week 2",
    title: "Provider consult",
    desc: "Video visit with your board-certified physician. They walk the labs, discuss goals, and design the protocol. Not a five-minute drive-by.",
    icon: Video,
  },
  {
    num: "04",
    day: "Week 2–3",
    title: "Medication shipped",
    desc: "Compounded by a US-licensed 503A pharmacy and shipped temperature-controlled. Refills run on autopilot with quick async check-ins.",
    icon: Package,
  },
];

const included = [
  {
    icon: Pill,
    title: "Medication",
    body: "Compounded therapy from a 503A pharmacy — included in your monthly fee. No surprise pharmacy bills.",
  },
  {
    icon: Microscope,
    title: "Lab panels",
    body: "First panel free for founding members. Quarterly redraws to confirm the protocol is doing what it should.",
  },
  {
    icon: Video,
    title: "Provider time",
    body: "Video consults plus async messaging — your physician is the same one across the program, not a rotating queue.",
  },
  {
    icon: MessageCircle,
    title: "Calibration",
    body: "Every 90-day cycle, your physician reviews the new labs and adjusts dose, format, or strategy if the data warrants it.",
  },
  {
    icon: Truck,
    title: "Shipping",
    body: "Free temperature-controlled delivery on every order. No coupon codes, no upcharge for cold-pack packaging.",
  },
  {
    icon: Calendar,
    title: "Cancel anytime",
    body: "No contracts, no cancellation fees. Founding pricing stays locked as long as the membership remains active.",
  },
];

const audiences = [
  {
    title: "Women in perimenopause or menopause",
    body: "Hot flashes, sleep disruption, brain fog, weight drift, mood — symptoms that get blamed on aging when they're actually treatable.",
    href: "/hormone-therapy",
    label: "Hormone Therapy",
  },
  {
    title: "Men with low-T symptoms",
    body: "Fatigue, low drive, poor recovery, cognitive drag. Hypogonadism rarely announces itself — most men wait five years before a real lab.",
    href: "/testosterone-therapy",
    label: "Testosterone Therapy",
  },
  {
    title: "Adults focused on cellular health",
    body: "NAD+ for energy and recovery. Peptide protocols for repair, sleep, and inflammation. Designed for the systems that go quiet first.",
    href: "/nad-therapy",
    label: "NAD+ Therapy",
  },
  {
    title: "Anyone tired of generic care",
    body: "Bloodwork that gets read, protocols built around it, and a physician who adjusts the plan when the data moves. Not telehealth-by-checkbox.",
    href: "/quiz",
    label: "Take the assessment",
  },
];

const faqRow = [
  { label: "Time to first physician visit", value: "Under 10 days" },
  { label: "Hormone panel depth", value: "12+ biomarkers" },
  { label: "Protocol personalization", value: "Calibrated to your labs" },
  { label: "Follow-up monitoring", value: "Labs at 90 days" },
];

export default function HowItWorksPage() {
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
            background: `radial-gradient(80% 60% at 70% 30%, ${PERSONA}14 0%, transparent 60%), radial-gradient(60% 40% at 20% 20%, rgba(162,181,174,0.10) 0%, transparent 50%)`,
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
                  How Halo works
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
                From profile to protocol in{" "}
                <span className="italic font-light" style={{ color: PERSONA }}>
                  three weeks.
                </span>
              </h1>

              <p
                className="text-[16px] md:text-[17px] leading-relaxed mb-7 max-w-lg"
                style={{ color: "rgba(28,28,30,0.65)" }}
              >
                Four steps. A real physician. Bloodwork that actually gets
                read. Medication that ships on a timeline you can plan
                around — not when insurance feels like it.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
                <Link
                  href="/quiz"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-medium text-sm transition-all hover:brightness-95"
                  style={{
                    backgroundColor: "#1C1C1E",
                    letterSpacing: "0.01em",
                  }}
                >
                  Start the assessment
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#protocol"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-halo-charcoal"
                  style={{
                    borderBottom: `1px solid #1C1C1E`,
                    paddingBottom: "2px",
                  }}
                >
                  Read the steps
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* PROCESS-DURATION DATA CARD */}
            <div
              className="lg:col-span-5 lg:row-span-2 relative overflow-hidden rounded-[24px]"
              style={{
                background: `linear-gradient(155deg, ${PERSONA_DEEP} 0%, #2C3F39 100%)`,
                minHeight: "380px",
              }}
            >
              <PillPattern
                density="medium"
                tone="quiet"
                opacityMultiplier={0.5}
                assets={["/pill-green.png", "/pill-purple.png", "/pill-orange.png"]}
              />
              <div className="relative z-10 h-full p-7 md:p-9 flex flex-col justify-between">
                <div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                    style={{ color: PERSONA_SOFT }}
                  >
                    The arc
                  </span>
                </div>
                <div>
                  <p
                    className="font-serif font-light leading-[0.95] tracking-tight text-white mb-4"
                    style={{
                      fontSize: "clamp(2.5rem, 4.5vw, 3.5rem)",
                      letterSpacing: "-0.035em",
                    }}
                  >
                    Profile to{" "}
                    <span style={{ color: PERSONA_SOFT }}>protocol</span>
                  </p>
                  <ul className="space-y-2.5 mb-2">
                    {faqRow.map((f) => (
                      <li
                        key={f.label}
                        className="flex items-baseline justify-between gap-4 text-[12px] md:text-[13px] border-b border-white/[0.08] pb-2"
                      >
                        <span className="text-white/55 font-medium uppercase tracking-[0.14em] text-[10px] md:text-[11px]">
                          {f.label}
                        </span>
                        <span
                          className="text-white font-semibold text-right"
                          style={{ color: PERSONA_SOFT }}
                        >
                          {f.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* DAY-1 STAT CARD */}
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
                  To first consult
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
                    10
                  </span>
                  <span
                    className="text-[14px] md:text-[16px]"
                    style={{ color: PERSONA_SOFT }}
                  >
                    days
                  </span>
                </div>
                <p className="text-[12px] text-white/65 leading-snug">
                  From assessment to your video visit. Most members hit it in
                  seven.
                </p>
              </div>
            </div>

            {/* WHAT'S MEASURED CARD */}
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
                  Calibration cycle
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span
                    className="font-serif font-light leading-none text-halo-charcoal"
                    style={{
                      fontSize: "clamp(3rem, 5vw, 4.25rem)",
                      letterSpacing: "-0.035em",
                    }}
                  >
                    90
                  </span>
                  <span className="text-[14px] md:text-[16px] text-halo-charcoal/55">
                    days
                  </span>
                </div>
                <p className="text-[12px] text-halo-charcoal/65 leading-snug">
                  Quarterly relabs and physician review. Every adjustment is
                  built on bloodwork, not vibes.
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
            <span>Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2 · PROTOCOL — 4 steps
          ═══════════════════════════════════════════════ */}
      <section
        id="protocol"
        className="py-16 md:py-24 px-6 section-light border-t border-halo-charcoal/[0.06]"
      >
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll>
            <div className="mb-12 md:mb-14 max-w-2xl">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3"
                style={{ color: PERSONA }}
              >
                The protocol
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                Four steps. No surprises.
              </h2>
              <p className="text-[15px] md:text-base text-halo-charcoal/65 mt-5 leading-relaxed">
                Same arc for every program — TRT, HRT, NAD+, peptides,
                weight care. Different labs and different protocols, but the
                same physician-led cadence.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {steps.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.num}
                    className="aos-child rounded-[20px] p-6 md:p-7 bg-white border border-halo-charcoal/[0.08] flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span
                        className="font-serif font-light leading-none"
                        style={{
                          fontSize: "clamp(2.25rem, 4vw, 2.75rem)",
                          letterSpacing: "-0.03em",
                          color: PERSONA,
                        }}
                      >
                        {s.num}
                      </span>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          background: `${PERSONA}14`,
                          border: `1px solid ${PERSONA}26`,
                        }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: PERSONA_DEEP }}
                          strokeWidth={1.8}
                        />
                      </div>
                    </div>
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-2"
                      style={{ color: PERSONA_DEEP }}
                    >
                      {s.day}
                    </span>
                    <h3 className="font-serif text-[20px] md:text-[22px] text-halo-charcoal leading-tight mb-3 tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-[13px] text-halo-charcoal/65 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3 · WHAT'S INCLUDED
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light border-t border-halo-charcoal/[0.06]">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-8 md:gap-12 mb-10 md:mb-14">
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3"
                  style={{ color: PERSONA }}
                >
                  Membership
                </p>
                <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal leading-[1.1]">
                  Everything is{" "}
                  <span className="italic" style={{ color: PERSONA }}>
                    included.
                  </span>
                </h2>
              </div>
              <p className="text-[15px] md:text-[16px] text-halo-charcoal/70 leading-relaxed self-end">
                One monthly fee covers the full clinical experience. No
                surprise pharmacy bills, no à-la-carte consultation charges,
                no &ldquo;pay for the appointment plus pay for the protocol.&rdquo;
                What you see on the pricing page is what you pay.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {included.map((it) => {
                const Icon = it.icon;
                return (
                  <div
                    key={it.title}
                    className="aos-child rounded-[20px] p-6 md:p-7 bg-white border border-halo-charcoal/[0.08]"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                      style={{
                        background: `${PERSONA}14`,
                        border: `1px solid ${PERSONA}26`,
                      }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: PERSONA_DEEP }}
                        strokeWidth={1.8}
                      />
                    </div>
                    <h3 className="font-serif text-[19px] text-halo-charcoal mb-2 tracking-tight">
                      {it.title}
                    </h3>
                    <p className="text-[13px] text-halo-charcoal/65 leading-relaxed">
                      {it.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4 · WHO IT'S FOR
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light border-t border-halo-charcoal/[0.06]">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="mb-12 md:mb-14 max-w-2xl">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3"
                style={{ color: PERSONA }}
              >
                Who it&rsquo;s for
              </p>
              <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                Built for the people <br />
                generic care misses.
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {audiences.map((a) => (
                <Link
                  key={a.title}
                  href={a.href}
                  className="aos-child group rounded-[20px] bg-white border border-halo-charcoal/[0.08] p-7 md:p-8 hover:border-halo-charcoal/20 hover:shadow-[0_18px_44px_-22px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all flex flex-col"
                >
                  <h3
                    className="font-serif font-light text-halo-charcoal leading-tight mb-3 tracking-tight"
                    style={{
                      fontSize: "clamp(1.375rem, 2.4vw, 1.625rem)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {a.title}
                  </h3>
                  <p className="text-[14px] text-halo-charcoal/65 leading-relaxed mb-5 flex-1">
                    {a.body}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold self-start border-b pb-0.5 transition-colors"
                    style={{
                      color: PERSONA_DEEP,
                      borderColor: `${PERSONA}40`,
                    }}
                  >
                    {a.label}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5 · FINAL CTA — Dark
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
              Ready to start
            </p>
            <h2
              className="font-serif font-light text-white leading-[1.05] tracking-tight mb-5"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                letterSpacing: "-0.03em",
              }}
            >
              Five minutes to know
              <br />
              <span className="italic" style={{ color: PERSONA_SOFT }}>
                what&rsquo;s actually going on.
              </span>
            </h2>
            <p className="text-[15px] md:text-[16px] text-white/60 leading-relaxed mb-9 max-w-xl mx-auto">
              Take the assessment. A physician reviews every submission
              before any protocol is built. No commitment until your first
              consultation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <Link
                href="/quiz"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[13px] font-semibold transition-all hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-0.5"
                style={{ background: PERSONA, color: "white" }}
              >
                Take the assessment
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/85 hover:text-white border-b border-white/30 hover:border-white/70 pb-0.5 transition-colors"
              >
                See pricing
                <Check className="w-3 h-3" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
