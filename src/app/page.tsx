"use client";

import {
  ArrowRight,
  Shield,
  FlaskConical,
  Lock,
  Building2,
  Truck,
  ClipboardList,
  TestTube2,
  Video,
  Package,
  Zap,
  Heart,
  Moon,
  Brain,
  Activity,
  Stethoscope,
  GraduationCap,
  Droplet,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import FoundingCircleForm from "@/components/FoundingCircleForm";
import CountUpNumber from "@/components/CountUpNumber";
import FAQ from "@/components/FAQ";
import HaloLogo from "@/components/HaloLogo";
import HeroVideo from "@/components/HeroVideo";
import AnchorDataOverlay from "@/components/AnchorDataOverlay";
import { usePersonalization } from "@/hooks/usePersonalization";

/* ─── DATA ────────────────────────────────────────────────────── */

const faqItems = [
  {
    question: "How quickly will I see results?",
    answer:
      "Most members notice improvements in energy, sleep, and mood within 2-4 weeks. Body composition changes typically develop over 2-3 months. Your provider monitors your progress and adjusts your plan as needed.",
    category: "General",
  },
  {
    question: "What does Halo cost?",
    answer:
      "Programs range from $129 to $249 per month. Medications, labs, provider visits, and shipping are all included. No hidden fees. Founding members lock in a reduced rate for life.",
    category: "General",
  },
  {
    question: "What programs are available at launch?",
    answer:
      "We are launching with programs for hormone balance, testosterone optimization, peptide therapy for recovery and sleep, and NAD+ for sustained energy. Weight management and sexual wellness programs are coming soon. Founding members get first access to everything.",
    category: "General",
  },
  {
    question: "How do consultations work?",
    answer:
      "Your first visit is a video call with your provider. They review your labs, talk about how you have been feeling, and build a plan around your goals. After that, most follow-ups are handled through messaging. Video visits are always available when you want one.",
    category: "General",
  },
  {
    question: "Why is bloodwork required?",
    answer:
      "Your labs tell us what is actually going on inside, not just what you are feeling on the surface. That data is how your provider builds a plan that is right for you. We order through Quest and Labcorp with thousands of locations. Founding members get their first panel free.",
    category: "General",
  },
  {
    question: "Is this covered by insurance?",
    answer:
      "Halo programs are not typically covered by insurance. However, some lab work and medications may be eligible depending on your plan. We provide documentation you can submit to your insurer.",
    category: "General",
  },
  {
    question: "What if I want to cancel?",
    answer:
      "Cancel anytime from your account. No contracts, no cancellation fees. Your founding member rate stays locked in as long as your membership is active.",
    category: "General",
  },
];

const programs = [
  // ─── ANCHOR PROGRAMS ─────────────────────────
  {
    name: "Hormone Therapy",
    outcome: "Feel like yourself again",
    desc: "For women experiencing fatigue, mood shifts, and sleep issues.",
    label: "Physician-prescribed",
    compounds: "Estradiol \u00B7 Progesterone \u00B7 Testosterone",
    price: "$149/mo",
    startingPrice: "from $149/mo",
    monthly: "$149/mo",
    quarterly: "$179/mo",
    href: "/renew",
    colorClass: "",
    color: "#D4836B",
    cardBg: "#F5E6E0",
    accent: "#D4836B",
    icon: Heart,
    image: "/hero-hrt-person.jpg",
    overlay: {
      variant: "restoration" as const,
      chips: [
        { label: "Estradiol", value: "82 pg/mL" },
        { label: "Mood", value: "Steady" },
        { label: "Sleep", value: "7.8h" },
        { label: "Mental Clarity", value: "+32%" },
      ],
    },
    tier: "anchor",
    safety: "Hormone therapy may increase risk of blood clots, stroke, and certain cancers. Not suitable during pregnancy. Requires ongoing lab monitoring.",
  },
  {
    name: "Testosterone Therapy",
    outcome: "Get your edge back",
    desc: "For men dealing with low energy, slow recovery, and brain fog.",
    label: "Physician-prescribed",
    compounds: "Testosterone Cypionate \u00B7 HCG \u00B7 Anastrozole",
    price: "$149/mo",
    startingPrice: "from $149/mo",
    monthly: "$149/mo",
    quarterly: "$179/mo",
    href: "/vital",
    colorClass: "",
    color: "#5A7394",
    cardBg: "#E3E8EE",
    accent: "#5A7394",
    icon: Zap,
    image: "/hero-trt-person.jpg",
    overlay: {
      variant: "performance" as const,
      label: "Testosterone",
      value: "742",
      unit: "ng/dL",
      trend: "+38% / 90 days",
      position: "bottom-left" as const,
    },
    tier: "anchor",
    safety: "TRT may affect fertility and is not appropriate for men planning conception. May increase red blood cell count. Requires regular lab monitoring.",
  },
  // ─── SUPPORTING PROGRAMS ─────────────────────
  {
    name: "GLP-1 Weight Management",
    outcome: "Sustainable weight loss",
    desc: "Physician-supervised GLP-1 protocol with labs and follow-up.",
    label: "GLP-1 therapy",
    compounds: "Semaglutide \u00B7 Tirzepatide",
    price: "$179/mo",
    startingPrice: "from $179/mo",
    monthly: "$179/mo",
    quarterly: "$229/mo",
    href: "/weight-loss",
    colorClass: "",
    color: "#B8974E",
    cardBg: "#EDE8DC",
    accent: "#B8974E",
    icon: Activity,
    tier: "support",
    safety: "GLP-1 medications may cause nausea, vomiting, diarrhea, or pancreatitis. Not for personal or family history of MTC or MEN 2. Requires lab monitoring.",
  },
  {
    name: "Peptide Therapy",
    outcome: "Recover like you used to",
    desc: "Deeper sleep, faster recovery, better body composition.",
    label: "Growth hormone peptides",
    compounds: "Sermorelin",
    price: "$149/mo",
    startingPrice: "from $149/mo",
    monthly: "$149/mo",
    quarterly: "$179/mo",
    href: "/restore",
    colorClass: "",
    color: "#6B8F68",
    cardBg: "#E4EBE3",
    accent: "#6B8F68",
    icon: Moon,
    tier: "support",
    safety: "Peptide therapy is prescribed off-label. Not FDA-approved for anti-aging. May cause injection site reactions, headache, or flushing.",
  },
  {
    name: "NAD+ Therapy",
    outcome: "Unlock steady energy",
    desc: "Cellular energy that lasts all day \u2014 no crashes.",
    label: "Cellular therapy",
    compounds: "NAD+ Injection \u00B7 Oral \u00B7 Nasal",
    price: "$149/mo",
    startingPrice: "from $149/mo",
    monthly: "$149/mo",
    quarterly: "$179/mo",
    href: "/vitality",
    colorClass: "",
    color: "#7B6B8F",
    cardBg: "#E8E3ED",
    accent: "#7B6B8F",
    icon: Brain,
    image: "/support-nad.jpg",
    tier: "support",
    safety: "NAD+ injections may cause discomfort, nausea, or flushing during administration. Not FDA-approved as an anti-aging treatment.",
  },
  {
    name: "Vitality Injections",
    outcome: "Targeted wellness support",
    desc: "B12, Glutathione, Methylene Blue, Lipo-C, L-Carnitine.",
    label: "Wellness add-ons",
    compounds: "B12 MIC \u00B7 Glutathione \u00B7 Methylene Blue \u00B7 Lipo-C",
    price: "$109/mo",
    startingPrice: "from $109/mo",
    monthly: "$109/mo",
    quarterly: "$129/mo",
    href: "/vitality-injections",
    colorClass: "",
    color: "#6B8F68",
    cardBg: "#EAEBE5",
    accent: "#6B8F68",
    icon: Droplet,
    tier: "support",
    safety: "Vitality injections are compounded and not FDA-approved for specific health claims. May cause injection site reactions.",
  },
];

const providers = [
  {
    name: "Dr. Sarah Chen, MD",
    title: "Medical Director",
    specialty: "Endocrinology & Hormone Optimization",
    credentials: "Board-certified endocrinologist. 12+ years in hormone therapy. Previously at Mount Sinai.",
    initials: "SC",
    color: "#D4836B",
  },
  {
    name: "Dr. James Rivera, DO",
    title: "Lead Physician",
    specialty: "Men\u2019s Health & Performance Medicine",
    credentials: "Board-certified in family medicine. Fellowship in sports medicine. 10+ years in TRT protocols.",
    initials: "JR",
    color: "#5A7394",
  },
  {
    name: "Dr. Priya Patel, MD",
    title: "Clinical Advisor",
    specialty: "Integrative & Regenerative Medicine",
    credentials: "Board-certified internist. Peptide therapy and NAD+ specialist. Published researcher.",
    initials: "PP",
    color: "#7B6B8F",
  },
];

const comingSoonPrograms = [
  {
    name: "Sexual Wellness",
    label: "Intimacy & desire",
    color: "#B87878",
    cardBg: "#EDDFDF",
    accent: "#B87878",
    icon: Heart,
  },
];

const steps = [
  {
    num: "01",
    title: "Tell us about you",
    desc: "A few questions about your goals, symptoms, and health history.",
    icon: ClipboardList,
    color: "#6B8F68",
  },
  {
    num: "02",
    title: "Get your baseline",
    desc: "Quick lab visit to see what\u2019s actually going on inside.",
    icon: TestTube2,
    color: "#D4836B",
  },
  {
    num: "03",
    title: "Meet your provider",
    desc: "A real conversation about what\u2019s possible for you.",
    icon: Video,
    color: "#5A7394",
  },
  {
    num: "04",
    title: "Start feeling it",
    desc: "Your plan arrives. Most members notice changes in 2\u20134 weeks.",
    icon: Package,
    color: "#6B8F68",
  },
];

const testimonials = [
  {
    quote:
      "I\u2019m tired of crashing at 2pm every day. I want my energy back without relying on caffeine. Halo feels like the right approach \u2014 real physicians, real protocols.",
    name: "Sarah M.",
    role: "Founding Member",
    program: "Hormone Therapy",
    initials: "SM",
    color: "#D4836B",
  },
  {
    quote:
      "I used to recover in a day. Now it takes a week. I\u2019ve been researching TRT for months \u2014 Halo\u2019s founding pricing made it a no-brainer to lock in.",
    name: "James K.",
    role: "Founding Member",
    program: "Testosterone Therapy",
    initials: "JK",
    color: "#5A7394",
  },
  {
    quote:
      "The brain fog is killing my productivity. I need something backed by real science, not another supplement stack. Excited to be one of the first in.",
    name: "Marcus T.",
    role: "Founding Member",
    program: "NAD+ Therapy",
    initials: "MT",
    color: "#7B6B8F",
  },
];

const trustBadges = [
  { label: "Licensed Providers", icon: Shield },
  { label: "HPLC Tested", icon: FlaskConical },
  { label: "HIPAA Compliant", icon: Lock },
  { label: "US Pharmacies", icon: Building2 },
  { label: "Free Shipping", icon: Truck },
];

const foundingBenefits = [
  {
    title: "Lock in $149/mo for life",
    desc: "Founding pricing on hormone therapy, TRT, peptides, and NAD+ — never goes up",
  },
  {
    title: "Free baseline labs",
    desc: "Your first comprehensive hormone panel included ($300 value)",
  },
  {
    title: "Priority onboarding",
    desc: "Skip the waitlist and start your protocol in days, not weeks",
  },
  {
    title: "First access to new programs",
    desc: "Sexual wellness and future protocols, before they launch publicly",
  },
];

/* ─── PAGE ────────────────────────────────────────────────────── */

export default function Home() {
  const { persona, hasCompletedQuiz, isFoundingMember, isReturnVisitor, primaryProgram } = usePersonalization();

  // Personalize program order based on user data
  const personalizedPrograms = useMemo(() => {
    const ordered = [...programs];

    // If we know the primary program, move it to front (featured position)
    if (primaryProgram) {
      const programKeyMap: Record<string, string> = {
        testosterone: "Testosterone Therapy",
        hormoneTherapy: "Hormone Therapy",
        peptideTherapy: "Peptide Therapy",
        nadTherapy: "NAD+ Therapy",
      };
      const targetName = programKeyMap[primaryProgram];
      if (targetName) {
        const idx = ordered.findIndex((p) => p.name === targetName);
        if (idx > 0) {
          const [item] = ordered.splice(idx, 1);
          ordered.unshift(item);
        }
      }
    } else if (persona === "male") {
      // No quiz, but we infer male — lead with testosterone
      const idx = ordered.findIndex((p) => p.name === "Testosterone Therapy");
      if (idx > 0) {
        const [item] = ordered.splice(idx, 1);
        ordered.unshift(item);
      }
    }
    // Default (persona === "female" or "neutral"): Hormone Therapy stays first

    return ordered;
  }, [persona, primaryProgram]);

  // Personalize hero copy
  const heroHeadline = useMemo(() => {
    if (isReturnVisitor && hasCompletedQuiz) {
      return { line1: "Welcome back.", line2: "Let\u2019s get started." };
    }
    if (persona === "male") {
      return { line1: "This is what", line2: "stronger feels like." };
    }
    // Default (female/neutral)
    return { line1: "This is what", line2: "better feels like." };
  }, [persona, hasCompletedQuiz, isReturnVisitor]);

  // Personalize featured testimonial order
  const personalizedTestimonials = useMemo(() => {
    const ordered = [...testimonials];
    if (persona === "male") {
      // Move James K. (Testosterone) to featured position
      const idx = ordered.findIndex((t) => t.name === "James K.");
      if (idx > 0) {
        const [item] = ordered.splice(idx, 1);
        ordered.unshift(item);
      }
    }
    return ordered;
  }, [persona]);

  return (
    <>
      {/* ═══════════════════════════════════════════════
          1 · HERO — Action Grid (Hims-style)
          ═══════════════════════════════════════════════ */}
      <section className="px-6 md:px-12 lg:px-20 pt-28 pb-12 section-light">
        <div className="max-w-7xl mx-auto">
          {/* Headline — short, direct, serif */}
          <h1 className="headline-hero text-4xl md:text-5xl lg:text-6xl text-halo-charcoal mb-8">
            {heroHeadline.line1}
            <br />
            {heroHeadline.line2}
          </h1>

          {/* Hero grid — anchor programs get the spotlight */}
          <div className="space-y-3">
            {/* Row 1: 2 ANCHOR program cards (HRT + TRT) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {personalizedPrograms
                .filter((p) => p.tier === "anchor")
                .slice(0, 2)
                .map((program) => {
                  const Icon = program.icon;
                  const hasImage = Boolean(program.image);
                  return (
                    <Link key={program.name} href={program.href} className="product-card group" style={{ background: program.cardBg }}>
                      <div className="product-card-image relative">
                        {hasImage ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={program.image}
                              alt={`${program.name} — ${program.outcome}`}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                              draggable={false}
                            />
                            {/* Code-built glassmorphic data overlay — pixel-perfect, never rendered by AI */}
                            {program.overlay && (
                              <AnchorDataOverlay
                                {...program.overlay}
                                accentColor={program.accent}
                              />
                            )}
                          </>
                        ) : (
                          <Icon className="w-10 h-10 opacity-15" style={{ color: program.accent }} />
                        )}
                      </div>
                      <div className="product-card-info">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm md:text-base font-semibold text-halo-charcoal">{program.outcome}</h3>
                            <p className="text-xs text-halo-charcoal/40">{program.name} &middot; {program.startingPrice}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-halo-charcoal/20 group-hover:text-halo-charcoal/50 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>

            {/* Row 2: PRIMARY SUPPORT programs — stacked banner + content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {personalizedPrograms
                .filter((p) => p.tier === "support" && p.name !== "Vitality Injections")
                .map((program) => {
                  const Icon = program.icon;
                  return (
                    <Link key={program.name} href={program.href} className="support-card group">
                      {/* Banner — uses image if available, otherwise color-world fallback with icon */}
                      {program.image ? (
                        <div className="support-card-banner">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={program.image} alt="" draggable={false} />
                        </div>
                      ) : (
                        <div
                          className="support-card-banner-fallback"
                          style={{ background: program.cardBg }}
                        >
                          <Icon className="w-8 h-8 opacity-20" style={{ color: program.accent }} />
                        </div>
                      )}
                      {/* Content row */}
                      <div className="support-card-content">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-halo-charcoal truncate">{program.outcome}</p>
                          <p className="text-[11px] text-halo-charcoal/50">{program.name.replace(" Therapy", "").replace(" Weight Management", "")} &middot; {program.startingPrice}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-halo-charcoal/25 flex-shrink-0 group-hover:text-halo-charcoal/60 transition-colors" />
                      </div>
                    </Link>
                  );
                })}
            </div>

            {/* Row 3: DEPRIORITIZED — Vitality add-ons + Coming Soon — small, muted */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[10px] uppercase tracking-wider text-halo-charcoal/35 font-semibold mr-2">Also available</span>
              {personalizedPrograms
                .filter((p) => p.name === "Vitality Injections")
                .map((program) => {
                  const Icon = program.icon;
                  return (
                    <Link key={program.name} href={program.href} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-halo-border hover:border-halo-charcoal/15 transition-colors group">
                      <Icon className="w-3 h-3" style={{ color: program.accent }} />
                      <span className="text-[11px] font-medium text-halo-charcoal/70">{program.name}</span>
                      <span className="text-[10px] text-halo-charcoal/35">{program.startingPrice}</span>
                    </Link>
                  );
                })}
              {comingSoonPrograms.map((p) => {
                const Icon = p.icon;
                return (
                  <a key={p.name} href="#founding-circle" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-halo-border hover:border-halo-charcoal/15 transition-colors">
                    <Icon className="w-3 h-3" style={{ color: p.accent }} />
                    <span className="text-[11px] font-medium text-halo-charcoal/70">{p.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-halo-charcoal/[0.04] text-halo-charcoal/30">Soon</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          1b · FULL-BLEED — The Halo Difference (cinematic editorial)
          ═══════════════════════════════════════════════ */}
      <section className="full-bleed-cinematic bg-[#1A1A1F]">
        {/* Cinematic background image */}
        <div className="full-bleed-cinematic-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/halo-difference.jpg" alt="" draggable={false} />
        </div>
        {/* Gradient scrim for text legibility */}
        <div className="full-bleed-cinematic-scrim" />

        {/* Content layer */}
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 py-28 md:py-36">
          <p className="label-accent mb-6">The Halo Difference</p>
          <p className="manifesto-text text-white">
            We believe wellness isn&rsquo;t about{" "}
            <em>perfection</em> &mdash;
            it&rsquo;s about waking up and actually feeling{" "}
            <em>good</em>. About having
            the <em>energy</em> to be
            present, the <em>clarity</em>{" "}
            to focus, and the{" "}
            <em>confidence</em> that comes
            from knowing your body is working with you, not against you.
          </p>
          <div className="mt-10">
            <Link href="/quiz" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#1C1C1E] font-semibold text-sm hover:bg-white/90 transition-colors">
              Begin your journey <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2 · MANIFESTO — Statement + trust bridge
          ═══════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 section-light relative">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            {/* Category pills bridge */}
            <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
              {["Hormones", "Testosterone", "Peptides", "NAD+", "Recovery"].map((pill) => (
                <span key={pill} className="category-pill text-xs">{pill}</span>
              ))}
            </div>

            <p className="manifesto-text">
              We believe wellness isn&rsquo;t about{" "}
              <em>perfection</em> &mdash;
              it&rsquo;s about waking up and actually feeling{" "}
              <em>good</em>. About having
              the <em>energy</em> to be
              present, the <em>clarity</em>{" "}
              to focus, and the{" "}
              <em>confidence</em> that comes
              from knowing your body is working with you, not against you.
            </p>

            <div className="mt-10 text-center">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 text-sm font-medium text-halo-charcoal/50 hover:text-halo-charcoal transition-colors border-b border-halo-charcoal/10 hover:border-halo-charcoal/30 pb-0.5"
              >
                Begin your wellness journey <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </AnimateOnScroll>

          {/* Trust badges strip */}
          <AnimateOnScroll>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-16 pt-10 border-t border-halo-charcoal/[0.06]">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="trust-badge">
                  <div className="trust-badge-icon">
                    <badge.icon className="w-5 h-5 text-[#C8A96E]" />
                  </div>
                  <span className="text-xs font-medium text-halo-charcoal/45 whitespace-nowrap">{badge.label}</span>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════
          3 · HOW IT WORKS — Split layout + overlapping cards
          ═══════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 md:py-28 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="label-accent mb-3">How It Works</p>
              <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal">
                From curious to feeling different.
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} className="aos-child text-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: `${step.color}15`, border: `1px solid ${step.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: step.color }} />
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: step.color }}>
                      Step {step.num}
                    </p>
                    <h3 className="text-sm font-semibold text-halo-charcoal mb-1">{step.title}</h3>
                    <p className="text-xs text-halo-charcoal/40 leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="text-center mt-12">
              <Link href="/quiz" className="btn-filled !text-sm">
                Take the quiz &mdash; 2 min <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
              </Link>
              <p className="text-xs text-halo-charcoal/25 mt-3">No commitment until your first consultation.</p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════
          5 · TESTIMONIALS — Featured + stacked asymmetric
          ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 px-6 section-light">
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
              <div>
                <p className="label-accent mb-3">Why They Joined</p>
                <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal">What founding members are looking for</h2>
              </div>
              <a href="#founding-circle" className="inline-flex items-center gap-2 text-sm font-medium text-[#C8A96E] hover:text-halo-charcoal transition-colors">
                Join them <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* FEATURED — spans 2 cols, split layout */}
              <div className="aos-child lg:col-span-2 testimonial-card !p-0 overflow-hidden">
                <div className="flex flex-col md:flex-row h-full">
                  {/* Left: Image placeholder */}
                  <div
                    className="md:w-1/2 min-h-[240px] md:min-h-full relative flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${personalizedTestimonials[0].color}25 0%, ${personalizedTestimonials[0].color}45 100%)` }}
                  >
                    <div
                      className="testimonial-avatar text-2xl"
                      style={{ background: personalizedTestimonials[0].color, width: 80, height: 80 }}
                    >
                      {personalizedTestimonials[0].initials}
                    </div>
                  </div>
                  {/* Right: Quote + meta + stat */}
                  <div className="md:w-1/2 flex flex-col justify-center p-8">
                    <p className="testimonial-quote text-lg leading-relaxed mb-6">
                      &ldquo;{personalizedTestimonials[0].quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 mb-6">
                      <div>
                        <p className="text-sm font-semibold text-halo-charcoal">{personalizedTestimonials[0].name}</p>
                        <p className="text-xs text-halo-charcoal/40">{personalizedTestimonials[0].role}</p>
                      </div>
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-full ml-auto" style={{ background: `${personalizedTestimonials[0].color}15`, color: personalizedTestimonials[0].color }}>
                        {personalizedTestimonials[0].program}
                      </span>
                    </div>
                    <div className="pt-5 border-t border-halo-charcoal/[0.06]">
                      <p className="stat-large text-3xl text-[#1C1C1E]">352</p>
                      <p className="text-xs text-halo-charcoal/35 mt-0.5">founding spots left</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN — 2 stacked compact cards */}
              <div className="flex flex-col gap-5">
                {personalizedTestimonials.slice(1).map((t) => (
                  <div key={t.name} className="aos-child testimonial-card flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="testimonial-avatar text-sm"
                        style={{ background: t.color, width: 40, height: 40 }}
                      >
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-halo-charcoal">{t.name}</p>
                        <p className="text-xs text-halo-charcoal/40">{t.program}</p>
                      </div>
                    </div>
                    <p className="testimonial-quote text-sm flex-1">&ldquo;{t.quote}&rdquo;</p>
                    <p className="text-xs text-halo-charcoal/25 mt-4">{t.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════
          5b · YOUR PROVIDERS — Doctor credibility
          ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 px-6 section-dark relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="label-accent mb-3">Your Medical Team</p>
              <h2 className="headline-section text-3xl md:text-4xl text-white mb-3">
                Board-certified physicians.
                <br className="hidden md:block" />
                Not algorithms.
              </h2>
              <p className="text-sm text-white/30 max-w-xl mx-auto">
                Every Halo protocol is designed and supervised by licensed physicians
                specializing in hormone optimization and performance medicine.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {providers.map((doc) => (
                <div
                  key={doc.name}
                  className="aos-child rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6 hover:border-white/15 transition-colors"
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ background: doc.color }}
                    >
                      {doc.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{doc.name}</p>
                      <p className="text-xs text-white/50">{doc.title}</p>
                    </div>
                  </div>
                  {/* Specialty */}
                  <div className="flex items-center gap-2 mb-3">
                    <Stethoscope className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
                    <p className="text-xs text-white/40">{doc.specialty}</p>
                  </div>
                  {/* Credentials */}
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-white/25 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-white/30 leading-relaxed">{doc.credentials}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <p className="text-center text-[10px] text-white/15 mt-8">
              Provider network powered by OpenLoop Health. All physicians are US-licensed and board-certified.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════
          6 · FOUNDING CIRCLE — Full-width split
          ═══════════════════════════════════════════════ */}
      <section id="founding-circle" className="section-dark overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">
          {/* LEFT: Visual panel */}
          <div className="relative min-h-[300px] lg:min-h-[700px] overflow-hidden bg-[#0a0a0a]">
            {/* Ambient gold glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
              style={{ background: "#C8A96E", filter: "blur(200px)", opacity: 0.08 }}
            />
            {/* Large halo logo watermark */}
            <div className="absolute inset-0 flex items-center justify-center">
              <HaloLogo size="xl" variant="dark" showText={false} className="opacity-[0.06] scale-[3.5]" />
            </div>

            {/* Counter overlaid at bottom-left */}
            <div className="absolute bottom-10 left-8 lg:left-14 z-10">
              <CountUpNumber
                target={647}
                start={600}
                duration={2000}
                className="stat-large text-6xl md:text-7xl lg:text-8xl"
              />
              <p className="text-base text-white/20 mt-2">of 999 spots claimed</p>
            </div>
          </div>

          {/* RIGHT: Content panel */}
          <div className="flex flex-col justify-center px-6 lg:px-16 py-16 lg:py-20">
            <div className="max-w-md">
              <AnimateOnScroll>
                <div className="mb-5">
                  <span className="label-rule" />
                  <p className="label-accent">Founding Circle</p>
                </div>
                <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-white mb-5">
                  The first 999 get in at the best price. Permanently.
                </h2>
                <p className="text-base text-white/30 mb-8 leading-relaxed">
                  Lock in founding pricing for life, get your first labs free, and be the first to access every new program we launch.
                </p>
              </AnimateOnScroll>

              <AnimateOnScroll>
                <FoundingCircleForm variant="dark" />
              </AnimateOnScroll>

              <AnimateOnScroll stagger>
                <div className="mt-10 space-y-3">
                  {foundingBenefits.map((b, i) => (
                    <div key={i} className="aos-child flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white">{b.title}</p>
                        <p className="text-sm text-white/25">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll>
                <p className="text-xs text-white/12 mt-8">
                  Everything included &mdash; medications, labs, visits, shipping. No commitment until your first consultation. Cancel anytime.
                </p>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════
          7 · FAQ — Asymmetric 4/8 with sticky heading
          ═══════════════════════════════════════════════ */}
      <section id="faq" className="py-20 md:py-24 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* LEFT: Sticky heading column */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <AnimateOnScroll>
                  <p className="label-accent mb-3">FAQ</p>
                  <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal mb-4">
                    Common
                    <br />
                    questions
                  </h2>
                  <p className="text-sm text-halo-charcoal/40 mb-6">
                    Can&rsquo;t find what you&rsquo;re looking for?
                  </p>
                  <Link href="/contact" className="btn-halo !py-2.5 !px-5 !text-sm">
                    Get in touch <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
                  </Link>
                </AnimateOnScroll>
              </div>
            </div>

            {/* RIGHT: FAQ accordion */}
            <div className="lg:col-span-8">
              <AnimateOnScroll stagger>
                <FAQ items={faqItems} />
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════
          8 · FINAL CTA — Centered with visual depth
          ═══════════════════════════════════════════════ */}
      <section className="py-28 md:py-36 px-6 section-dark relative overflow-hidden">
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="headline-section text-3xl md:text-5xl lg:text-6xl text-white mb-5">
              Ready to feel the difference?
            </h2>
            <p className="text-lg text-white/30 mb-10 leading-relaxed max-w-lg mx-auto">
              Take a 2-minute quiz and find out which program is built for you.
            </p>
            <Link href="/quiz" className="btn-filled">
              Take the quiz <ArrowRight className="w-4 h-4 btn-arrow" />
            </Link>

            {/* Avatar stack social proof */}
            <div className="flex items-center justify-center gap-3 mt-10">
              <div className="avatar-stack">
                <div className="avatar-stack-item" style={{ background: "#D4836B" }}>S</div>
                <div className="avatar-stack-item" style={{ background: "#5A7394" }}>J</div>
                <div className="avatar-stack-item" style={{ background: "#7B6B8F" }}>M</div>
                <div className="avatar-stack-count">+644</div>
              </div>
              <p className="text-sm text-white/20">Join 647+ on the waitlist</p>
            </div>

            <p className="mt-8 text-xs text-white/12">
              No commitment until your first consultation.
            </p>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
