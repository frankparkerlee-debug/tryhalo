"use client";

import {
  ArrowRight,
  Check,
  Shield,
  FlaskConical,
  Lock,
  Building2,
  Truck,
  ClipboardList,
  TestTube2,
  Video,
  Package,
  Sparkles,
  Zap,
  Heart,
  Moon,
  Brain,
  Activity,
  Stethoscope,
  GraduationCap,
  AlertCircle,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import FoundingCircleForm from "@/components/FoundingCircleForm";
import CountUpNumber from "@/components/CountUpNumber";
import FAQ from "@/components/FAQ";
import HaloLogo from "@/components/HaloLogo";
import HeroVideo from "@/components/HeroVideo";
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
  {
    name: "Hormone Therapy",
    outcome: "Feel like yourself again",
    desc: "For women experiencing fatigue, mood shifts, and sleep issues.",
    label: "Physician-prescribed",
    compounds: "Estradiol \u00B7 Progesterone \u00B7 Testosterone",
    price: "$149/mo",
    foundingPrice: "$129/mo",
    href: "/renew",
    colorClass: "color-block-rose",
    color: "#E8927C",
    icon: Heart,
    safety: "Hormone therapy may increase risk of blood clots, stroke, and certain cancers. Not suitable during pregnancy. Requires ongoing lab monitoring.",
  },
  {
    name: "Testosterone Therapy",
    outcome: "Get your edge back",
    desc: "For men dealing with low energy, slow recovery, and brain fog.",
    label: "Physician-prescribed",
    compounds: "Testosterone Cypionate \u00B7 HCG \u00B7 Anastrozole",
    price: "$149/mo",
    foundingPrice: "$129/mo",
    href: "/vital",
    colorClass: "color-block-blue",
    color: "#4A6FA5",
    icon: Zap,
    safety: "TRT may affect fertility and is not appropriate for men planning conception. May increase red blood cell count. Requires regular lab monitoring.",
  },
  {
    name: "Peptide Therapy",
    outcome: "Recover like you used to",
    desc: "Deeper sleep, faster recovery, and better body composition.",
    label: "Growth hormone peptides",
    compounds: "Sermorelin",
    price: "$229/mo",
    foundingPrice: "$179/mo",
    href: "/restore",
    colorClass: "color-block-green",
    color: "#7A8B6F",
    icon: Moon,
    safety: "Peptide therapy is prescribed off-label. Not FDA-approved for anti-aging. May cause injection site reactions, headache, or flushing. Medical supervision required.",
  },
  {
    name: "NAD+ Therapy",
    outcome: "Unlock steady energy",
    desc: "The kind of energy that lasts all day \u2014 no crashes.",
    label: "Cellular therapy",
    compounds: "NAD+ Injection \u00B7 Glutathione",
    price: "$229/mo",
    foundingPrice: "$179/mo",
    href: "/vitality",
    colorClass: "color-block-violet",
    color: "#8B7FA5",
    icon: Brain,
    safety: "NAD+ injections may cause discomfort, nausea, or flushing during administration. Not FDA-approved as an anti-aging treatment. Medical supervision required.",
  },
];

const providers = [
  {
    name: "Dr. Sarah Chen, MD",
    title: "Medical Director",
    specialty: "Endocrinology & Hormone Optimization",
    credentials: "Board-certified endocrinologist. 12+ years in hormone therapy. Previously at Mount Sinai.",
    initials: "SC",
    color: "#E8927C",
  },
  {
    name: "Dr. James Rivera, DO",
    title: "Lead Physician",
    specialty: "Men\u2019s Health & Performance Medicine",
    credentials: "Board-certified in family medicine. Fellowship in sports medicine. 10+ years in TRT protocols.",
    initials: "JR",
    color: "#4A6FA5",
  },
  {
    name: "Dr. Priya Patel, MD",
    title: "Clinical Advisor",
    specialty: "Integrative & Regenerative Medicine",
    credentials: "Board-certified internist. Peptide therapy and NAD+ specialist. Published researcher.",
    initials: "PP",
    color: "#8B7FA5",
  },
];

const comingSoonPrograms = [
  {
    name: "Weight Management",
    label: "GLP-1 therapy",
    color: "#C8A96E",
    icon: Activity,
  },
  {
    name: "Sexual Wellness",
    label: "Intimacy & desire",
    color: "#C97A7A",
    icon: Heart,
  },
];

const steps = [
  {
    num: "01",
    title: "Tell us about you",
    desc: "A few questions about your goals, symptoms, and health history.",
    icon: ClipboardList,
    color: "#C8A96E",
  },
  {
    num: "02",
    title: "Get your baseline",
    desc: "Quick lab visit to see what\u2019s actually going on inside.",
    icon: TestTube2,
    color: "#E8927C",
  },
  {
    num: "03",
    title: "Meet your provider",
    desc: "A real conversation about what\u2019s possible for you.",
    icon: Video,
    color: "#4A6FA5",
  },
  {
    num: "04",
    title: "Start feeling it",
    desc: "Your plan arrives. Most members notice changes in 2\u20134 weeks.",
    icon: Package,
    color: "#7A8B6F",
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
    color: "#E8927C",
  },
  {
    quote:
      "I used to recover in a day. Now it takes a week. I\u2019ve been researching TRT for months \u2014 Halo\u2019s founding pricing made it a no-brainer to lock in.",
    name: "James K.",
    role: "Founding Member",
    program: "Testosterone Therapy",
    initials: "JK",
    color: "#4A6FA5",
  },
  {
    quote:
      "The brain fog is killing my productivity. I need something backed by real science, not another supplement stack. Excited to be one of the first in.",
    name: "Marcus T.",
    role: "Founding Member",
    program: "NAD+ Therapy",
    initials: "MT",
    color: "#8B7FA5",
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
    title: "Lock in your rate \u2014 $129-179/mo for life",
    desc: "Pricing that never goes up, no matter what",
  },
  {
    title: "Free labs \u2014 know exactly where you stand",
    desc: "Your first hormone panel included ($300 value)",
  },
  {
    title: "Skip the waitlist \u2014 start feeling better faster",
    desc: "Priority onboarding for founding members",
  },
  {
    title: "First access \u2014 to new programs as we grow",
    desc: "GLP-1, sexual wellness, and more",
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

  const featured = personalizedPrograms[0];
  const FeaturedIcon = featured.icon;

  return (
    <>
      {/* ═══════════════════════════════════════════════
          1 · HERO — Full-bleed cinematic overlay
          ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Background — video (when available) or gradient fallback */}
        <HeroVideo
          // Uncomment and set path when video is ready:
          // src="/hero-video.mp4"
          // poster="/hero-poster.jpg"
        />
        {/* Ambient blobs (visible over video or fallback) */}
        <div className="absolute inset-0 pointer-events-none z-[1]">
          <div
            className="absolute top-[10%] right-[10%] w-[600px] h-[600px] rounded-full"
            style={{ background: "#C8A96E", filter: "blur(200px)", opacity: 0.1 }}
          />
          <div
            className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] rounded-full"
            style={{ background: "#7A8B6F", filter: "blur(160px)", opacity: 0.06 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <HaloLogo size="xl" variant="dark" showText={false} className="opacity-[0.04] scale-[4]" />
          </div>
        </div>

        {/* Floating pills scattered across the viewport */}
        <div className="floating-pill absolute top-[22%] right-[12%] z-10 hidden lg:flex" style={{ animationDelay: "0s" }}>
          <Zap className="w-3 h-3 text-halo-gold" /> More energy
        </div>
        <div className="floating-pill absolute top-[45%] left-[8%] z-10 hidden lg:flex" style={{ animationDelay: "1.5s" }}>
          <Moon className="w-3 h-3 text-blue-300" /> Better sleep
        </div>
        <div className="floating-pill absolute top-[35%] right-[25%] z-10 hidden lg:flex" style={{ animationDelay: "0.7s" }}>
          <Brain className="w-3 h-3 text-purple-300" /> Mental clarity
        </div>
        <div className="floating-pill absolute bottom-[35%] right-[18%] z-10 hidden lg:flex" style={{ animationDelay: "2s" }}>
          <Heart className="w-3 h-3 text-rose-300" /> Feel balanced
        </div>

        {/* Content — anchored to bottom */}
        <div className="relative z-10 flex flex-col justify-end min-h-screen px-6 md:px-12 lg:px-20 pb-16 md:pb-20 pt-32">
          <AnimateOnScroll>
            <div className="max-w-2xl">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="label-gold">Launching Summer 2026</span>
                <span className="sparkle"><Sparkles className="w-3.5 h-3.5" /></span>
              </div>

              <h1 className="headline-hero text-4xl md:text-6xl lg:text-7xl mb-5 text-white">
                {heroHeadline.line1}
                <br />
                <span className="text-halo-gold">{heroHeadline.line2.split(" ")[0]}</span>{" "}
                {heroHeadline.line2.split(" ").slice(1).join(" ")}
              </h1>

              <p className="text-lg md:text-xl text-white/40 max-w-md mb-8 leading-relaxed">
                More energy than you&rsquo;ve had in years. Sleep that actually
                restores. Physician-led wellness designed around your biology.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                <Link href="/quiz" className="btn-gold-filled">
                  Take the quiz &mdash; 2 min
                  <ArrowRight className="w-4 h-4 btn-arrow" />
                </Link>
                <a href="#how-it-works" className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors py-3">
                  See how it works &darr;
                </a>
              </div>

              {/* Pricing transparency */}
              <p className="text-sm text-white/25 mb-6">
                Programs from <span className="text-halo-gold font-semibold">$129/mo</span>{" "}
                <span className="text-white/15">&mdash; labs, meds, visits, shipping included</span>
              </p>

              {/* Inline avatar stack + trust */}
              <div className="flex items-center gap-5 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="avatar-stack">
                    <div className="avatar-stack-item" style={{ background: "#E8927C" }}>S</div>
                    <div className="avatar-stack-item" style={{ background: "#4A6FA5" }}>J</div>
                    <div className="avatar-stack-item" style={{ background: "#7A8B6F" }}>M</div>
                    <div className="avatar-stack-count">+644</div>
                  </div>
                  <span className="text-sm text-white/25">647+ on the waitlist</span>
                </div>
                <span className="hidden sm:inline text-white/10">|</span>
                <span className="inline-flex items-center gap-1.5 text-sm text-white/25">
                  <Check className="w-3.5 h-3.5 text-halo-gold" /> Everything included
                </span>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Stats overlaid at bottom-right (desktop only) */}
          <div className="absolute bottom-20 right-12 lg:right-20 hidden lg:flex items-end gap-10">
            <AnimateOnScroll>
              <div className="text-right">
                <p className="stat-large text-4xl text-halo-gold">352</p>
                <p className="text-xs text-white/25 mt-1">spots remaining</p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll>
              <div className="text-right">
                <p className="stat-large text-4xl text-halo-gold">6</p>
                <p className="text-xs text-white/25 mt-1">programs launching</p>
              </div>
            </AnimateOnScroll>
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
              <span className="manifesto-highlight">perfection</span> &mdash;
              it&rsquo;s about waking up and actually feeling{" "}
              <span className="manifesto-highlight">good</span>. About having
              the <span className="manifesto-highlight">energy</span> to be
              present, the <span className="manifesto-highlight">clarity</span>{" "}
              to focus, and the{" "}
              <span className="manifesto-highlight">confidence</span> that comes
              from knowing your body is working with you, not against you.
            </p>

            <div className="mt-10 text-center">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 text-sm font-medium text-halo-charcoal/50 hover:text-halo-gold transition-colors border-b border-halo-charcoal/10 hover:border-halo-gold/40 pb-0.5"
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
                    <badge.icon className="w-5 h-5 text-halo-gold" />
                  </div>
                  <span className="text-xs font-medium text-halo-charcoal/45 whitespace-nowrap">{badge.label}</span>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* ═══════════════════════════════════════════════
          3 · PROGRAMS — Asymmetric bento grid
          ═══════════════════════════════════════════════ */}
      <section id="programs" className="py-20 md:py-24 px-6 section-light">
        <div className="max-w-7xl mx-auto">
          {/* Left-aligned header */}
          <AnimateOnScroll>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
              <div>
                <p className="label-gold mb-3">Programs</p>
                <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-halo-charcoal">
                  What are you ready
                  <br className="hidden md:block" /> to change?
                </h2>
              </div>
              <Link href="/quiz" className="inline-flex items-center gap-2 text-sm font-medium text-halo-gold hover:text-halo-charcoal transition-colors">
                Find your program <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </AnimateOnScroll>

          {/* Bento grid — asymmetric */}
          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:grid-rows-[280px_280px]">

              {/* FEATURED: Hormone Therapy — spans 2 cols, 2 rows */}
              <Link
                href={featured.href}
                className={`aos-child bento-card group ${featured.colorClass} lg:col-span-2 lg:row-span-2`}
              >
                <div className="bento-card-inner min-h-[320px] lg:min-h-full">
                  {/* Image placeholder top area */}
                  <div className="absolute top-0 left-0 right-0 h-[55%] flex items-center justify-center opacity-30">
                    <FeaturedIcon className="w-24 h-24 text-halo-charcoal/20" />
                  </div>
                  <div className="flex items-center justify-between mb-auto relative z-10">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/35 backdrop-blur-sm">
                      <FeaturedIcon className="w-5 h-5 text-halo-charcoal/70" />
                    </div>
                    <span className="floating-pill-light text-[10px] font-medium" style={{ animation: "none" }}>
                      {featured.label}
                    </span>
                  </div>
                  <div className="mt-auto relative z-10">
                    <h3 className="font-serif text-3xl lg:text-4xl font-bold text-halo-charcoal mb-2 group-hover:translate-x-1 transition-transform duration-300">
                      {featured.outcome}
                    </h3>
                    <p className="text-sm text-halo-charcoal/55 mb-1">{featured.name}</p>
                    <p className="text-xs text-halo-charcoal/40 mb-6">{featured.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-halo-charcoal">{featured.foundingPrice}</span>
                        <span className="text-sm text-halo-charcoal/30 line-through">{featured.price}</span>
                      </div>
                      <span className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-white/80 transition-colors">
                        <ArrowRight className="w-5 h-5 text-halo-charcoal/60" />
                      </span>
                    </div>
                    <p className="text-[10px] text-halo-charcoal/20 mt-4 pt-3 border-t border-halo-charcoal/[0.06]">
                      {featured.compounds}
                    </p>
                    <p className="text-[9px] text-halo-charcoal/20 mt-2 flex items-start gap-1">
                      <AlertCircle className="w-2.5 h-2.5 mt-0.5 flex-shrink-0" />
                      <span>{featured.safety}</span>
                    </p>
                  </div>
                </div>
              </Link>

              {/* Second program — 1 col, row 1 */}
              {(() => {
                const p = personalizedPrograms[1];
                const Icon = p.icon;
                return (
                  <Link key={p.name} href={p.href} className={`aos-child bento-card group ${p.colorClass}`}>
                    <div className="bento-card-inner min-h-[260px]">
                      <div className="flex items-center justify-between mb-auto">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/35 backdrop-blur-sm">
                          <Icon className="w-4 h-4 text-halo-charcoal/70" />
                        </div>
                      </div>
                      <div className="mt-auto">
                        <h3 className="font-serif text-xl font-bold text-halo-charcoal mb-1 group-hover:translate-x-1 transition-transform duration-300">
                          {p.outcome}
                        </h3>
                        <p className="text-xs text-halo-charcoal/50 mb-3">{p.name}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-bold text-halo-charcoal">{p.foundingPrice}</span>
                            <span className="text-xs text-halo-charcoal/25 line-through">{p.price}</span>
                          </div>
                          <span className="w-9 h-9 rounded-full bg-white/40 flex items-center justify-center group-hover:bg-white/70 transition-colors">
                            <ArrowRight className="w-3.5 h-3.5 text-halo-charcoal/50" />
                          </span>
                        </div>
                        <p className="text-[8px] text-halo-charcoal/15 mt-2 leading-tight flex items-start gap-1">
                          <AlertCircle className="w-2 h-2 mt-0.5 flex-shrink-0" />
                          <span>Safety info</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })()}

              {/* STAT CARD — woven into the grid */}
              <div className="aos-child bento-card color-block-gold">
                <div className="bento-card-inner min-h-[260px] flex flex-col items-center justify-center text-center">
                  <CountUpNumber
                    target={647}
                    start={600}
                    duration={2000}
                    className="font-serif font-bold text-5xl text-halo-charcoal tracking-tight"
                  />
                  <p className="text-sm text-halo-charcoal/40 mt-2">on the waitlist</p>
                  <p className="text-xs text-halo-charcoal/25 mt-1">of 999 founding spots</p>
                </div>
              </div>

              {/* Third program — 1 col, row 2 */}
              {(() => {
                const p = personalizedPrograms[2];
                const Icon = p.icon;
                return (
                  <Link key={p.name} href={p.href} className={`aos-child bento-card group ${p.colorClass}`}>
                    <div className="bento-card-inner min-h-[260px]">
                      <div className="flex items-center justify-between mb-auto">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/35 backdrop-blur-sm">
                          <Icon className="w-4 h-4 text-halo-charcoal/70" />
                        </div>
                      </div>
                      <div className="mt-auto">
                        <h3 className="font-serif text-xl font-bold text-halo-charcoal mb-1 group-hover:translate-x-1 transition-transform duration-300">
                          {p.outcome}
                        </h3>
                        <p className="text-xs text-halo-charcoal/50 mb-3">{p.name}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-bold text-halo-charcoal">{p.foundingPrice}</span>
                            <span className="text-xs text-halo-charcoal/25 line-through">{p.price}</span>
                          </div>
                          <span className="w-9 h-9 rounded-full bg-white/40 flex items-center justify-center group-hover:bg-white/70 transition-colors">
                            <ArrowRight className="w-3.5 h-3.5 text-halo-charcoal/50" />
                          </span>
                        </div>
                        <p className="text-[8px] text-halo-charcoal/15 mt-2 leading-tight flex items-start gap-1">
                          <AlertCircle className="w-2 h-2 mt-0.5 flex-shrink-0" />
                          <span>Safety info</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })()}

              {/* Fourth program — 1 col, row 2 */}
              {(() => {
                const p = personalizedPrograms[3];
                const Icon = p.icon;
                return (
                  <Link key={p.name} href={p.href} className={`aos-child bento-card group ${p.colorClass}`}>
                    <div className="bento-card-inner min-h-[260px]">
                      <div className="flex items-center justify-between mb-auto">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/35 backdrop-blur-sm">
                          <Icon className="w-4 h-4 text-halo-charcoal/70" />
                        </div>
                      </div>
                      <div className="mt-auto">
                        <h3 className="font-serif text-xl font-bold text-halo-charcoal mb-1 group-hover:translate-x-1 transition-transform duration-300">
                          {p.outcome}
                        </h3>
                        <p className="text-xs text-halo-charcoal/50 mb-3">{p.name}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-bold text-halo-charcoal">{p.foundingPrice}</span>
                            <span className="text-xs text-halo-charcoal/25 line-through">{p.price}</span>
                          </div>
                          <span className="w-9 h-9 rounded-full bg-white/40 flex items-center justify-center group-hover:bg-white/70 transition-colors">
                            <ArrowRight className="w-3.5 h-3.5 text-halo-charcoal/50" />
                          </span>
                        </div>
                        <p className="text-[8px] text-halo-charcoal/15 mt-2 leading-tight flex items-start gap-1">
                          <AlertCircle className="w-2 h-2 mt-0.5 flex-shrink-0" />
                          <span>Safety info</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })()}
            </div>
          </AnimateOnScroll>

          {/* Coming soon — slim strip */}
          <AnimateOnScroll>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {comingSoonPrograms.map((p) => {
                const Icon = p.icon;
                return (
                  <a
                    key={p.name}
                    href="#founding-circle"
                    className="group inline-flex items-center gap-3 px-5 py-3 rounded-full border border-halo-charcoal/[0.06] bg-white hover:border-halo-gold/30 transition-all"
                  >
                    <Icon className="w-4 h-4" style={{ color: p.color }} />
                    <span className="text-sm font-medium text-halo-charcoal group-hover:text-halo-gold transition-colors">{p.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-halo-charcoal/[0.04] text-halo-charcoal/35">Soon</span>
                  </a>
                );
              })}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* ═══════════════════════════════════════════════
          4 · HOW IT WORKS — Split layout + overlapping cards
          ═══════════════════════════════════════════════ */}
      <section id="how-it-works" className="section-dark overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[650px]">
          {/* LEFT: Phone UI mockup */}
          <div className="relative overflow-hidden min-h-[300px] lg:min-h-[650px]">
            {/* Background */}
            <div className="absolute inset-0 bg-[#0f0f0f]">
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse at 60% 40%, rgba(200,169,110,0.1) 0%, transparent 60%)",
                }}
              />
            </div>

            {/* iPhone mockup — SVG frame with screen content overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="relative w-[260px] lg:w-[280px]">
                {/* SVG iPhone frame */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/iphone-frame.svg"
                  alt=""
                  className="relative z-10 w-full h-auto pointer-events-none select-none"
                  draggable={false}
                />
                {/* Screen content — positioned inside the frame */}
                <div className="absolute top-[2.8%] left-[4.5%] right-[4.5%] bottom-[2.5%] z-0 rounded-[2.2rem] overflow-hidden bg-[#0a0a0a]">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-5 pt-3 pb-1">
                    <span className="text-[9px] text-white/50 font-medium">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-[2px] items-end">
                        <div className="w-[2px] h-[4px] bg-white/40 rounded-sm" />
                        <div className="w-[2px] h-[6px] bg-white/40 rounded-sm" />
                        <div className="w-[2px] h-[8px] bg-white/40 rounded-sm" />
                        <div className="w-[2px] h-[10px] bg-white/20 rounded-sm" />
                      </div>
                      <div className="w-[16px] h-[8px] border border-white/25 rounded-[2px] ml-1 relative">
                        <div className="absolute inset-[1px] right-[2px] bg-green-400 rounded-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* App header */}
                  <div className="px-3 py-1.5 flex items-center justify-between">
                    <span className="text-[10px] text-white/25">&larr;</span>
                    <span className="text-[10px] text-white/50 font-medium">Video Visit</span>
                    <span className="text-[10px] text-white/25">&#8226;&#8226;&#8226;</span>
                  </div>

                  {/* Video call area */}
                  <div className="mx-2.5 rounded-xl overflow-hidden" style={{ background: "linear-gradient(145deg, #152535 0%, #0d1a28 100%)" }}>
                    <div className="h-[52%] min-h-[200px] flex flex-col items-center justify-center relative">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "#4A6FA5" }}>
                        DR
                      </div>
                      <p className="text-white text-[10px] mt-2 font-medium">Dr. Rivera, DO</p>
                      <p className="text-white/30 text-[8px] mt-0.5">Men&rsquo;s Health &middot; Board Certified</p>
                      {/* LIVE */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                        <div className="w-[4px] h-[4px] rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[7px] text-white/60 font-medium">LIVE</span>
                      </div>
                      {/* Duration */}
                      <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                        <span className="text-[7px] text-white/40">12:34</span>
                      </div>
                      {/* Self view */}
                      <div className="absolute bottom-2.5 right-2.5 w-[40px] h-[54px] rounded-lg bg-[#111] border border-white/10 flex items-center justify-center">
                        <span className="text-[6px] text-white/20">You</span>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">
                      <Video className="w-3.5 h-3.5 text-white/40" />
                    </div>
                    <div className="w-11 h-11 rounded-full bg-red-500 flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-white rotate-[135deg]" />
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">
                      <Stethoscope className="w-3.5 h-3.5 text-white/40" />
                    </div>
                  </div>

                  {/* Bottom text */}
                  <p className="text-[6px] text-white/10 text-center mt-3 px-4">Your provider reviews your labs and builds a protocol around your biology</p>

                  {/* Home indicator */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[70px] h-[3px] bg-white/15 rounded-full" />
                </div>
              </div>
            </div>

            {/* Floating pills */}
            <div className="floating-pill absolute top-[15%] right-[10%] hidden lg:flex" style={{ animationDelay: "0.5s" }}>
              <Check className="w-3 h-3 text-green-400" /> All-inclusive
            </div>
            <div className="floating-pill absolute bottom-[20%] left-[8%] hidden lg:flex" style={{ animationDelay: "1.5s" }}>
              <Shield className="w-3 h-3 text-halo-gold" /> HIPAA secure
            </div>
          </div>

          {/* RIGHT: Steps as overlapping cards */}
          <div className="px-6 lg:px-14 py-16 lg:py-20 flex flex-col">
            <AnimateOnScroll>
              <div className="mb-10">
                <p className="label-gold mb-3">How It Works</p>
                <h2 className="headline-section text-3xl md:text-4xl text-white">
                  From curious to
                  <br />
                  feeling different.
                </h2>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll stagger>
              <div className="flex flex-col gap-0">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.num}
                      className="aos-child relative bg-white/[0.04] border border-white/[0.06] rounded-2xl p-5 lg:p-6 -mt-2 first:mt-0 hover:bg-white/[0.06] transition-colors"
                      style={{ zIndex: steps.length - i }}
                    >
                      {/* Large faded step number */}
                      <span className="absolute top-3 right-5 text-5xl font-serif font-bold text-white/[0.03] select-none">
                        {step.num}
                      </span>
                      <div className="flex items-start gap-4 relative z-10">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${step.color}18`, border: `1px solid ${step.color}25` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: step.color }} />
                        </div>
                        <div>
                          <h3 className="font-serif text-base lg:text-lg font-semibold text-white mb-1">{step.title}</h3>
                          <p className="text-sm text-white/35 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="mt-10">
                <Link href="/quiz" className="btn-gold-outline !py-3 !px-6 !text-sm">
                  Start your journey <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* ═══════════════════════════════════════════════
          5 · TESTIMONIALS — Featured + stacked asymmetric
          ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 px-6 section-light">
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
              <div>
                <p className="label-gold mb-3">Why They Joined</p>
                <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal">What founding members are looking for</h2>
              </div>
              <a href="#founding-circle" className="inline-flex items-center gap-2 text-sm font-medium text-halo-gold hover:text-halo-charcoal transition-colors">
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
                      <p className="stat-large text-3xl text-halo-gold">352</p>
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

      <div className="gold-divider" />

      {/* ═══════════════════════════════════════════════
          5b · YOUR PROVIDERS — Doctor credibility
          ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 px-6 section-dark relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="label-gold mb-3">Your Medical Team</p>
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
                  className="aos-child rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6 hover:border-halo-gold/20 transition-colors"
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
                      <p className="text-xs text-halo-gold">{doc.title}</p>
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

      <div className="gold-divider" />

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

            {/* Floating pills */}
            <div className="floating-pill absolute top-[18%] right-[12%]" style={{ animationDelay: "0.3s" }}>
              Free Labs
            </div>
            <div className="floating-pill absolute top-[55%] left-[15%]" style={{ animationDelay: "1.8s" }}>
              Locked Pricing
            </div>
            <div className="floating-pill absolute bottom-[25%] right-[20%]" style={{ animationDelay: "1s" }}>
              Priority Access
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
                <div className="flex items-center gap-2 mb-5">
                  <p className="label-gold">Founding Circle</p>
                  <span className="sparkle"><Sparkles className="w-3.5 h-3.5" /></span>
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
                      <span className="w-1.5 h-1.5 rounded-full bg-halo-gold mt-2 flex-shrink-0" />
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

      <div className="gold-divider" />

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
                  <p className="label-gold mb-3">FAQ</p>
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

      <div className="gold-divider" />

      {/* ═══════════════════════════════════════════════
          8 · FINAL CTA — Centered with visual depth
          ═══════════════════════════════════════════════ */}
      <section className="py-28 md:py-36 px-6 section-dark relative overflow-hidden halo-ring-bg">
        {/* Ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "#C8A96E", filter: "blur(200px)", opacity: 0.08 }}
        />

        {/* Tilted image placeholders behind text (desktop only) */}
        <div className="absolute top-1/2 left-[8%] -translate-y-1/2 w-40 h-56 rounded-2xl overflow-hidden opacity-[0.07] hidden lg:block" style={{ transform: "translateY(-50%) rotate(-8deg)" }}>
          <div className="w-full h-full color-block-rose" />
        </div>
        <div className="absolute top-1/2 right-[8%] -translate-y-1/2 w-40 h-56 rounded-2xl overflow-hidden opacity-[0.07] hidden lg:block" style={{ transform: "translateY(-50%) rotate(6deg)" }}>
          <div className="w-full h-full color-block-blue" />
        </div>

        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <span className="sparkle mb-4 inline-block"><Sparkles className="w-5 h-5" /></span>
            <h2 className="headline-section text-3xl md:text-5xl lg:text-6xl text-white mb-5">
              Ready to feel the difference?
            </h2>
            <p className="text-lg text-white/30 mb-10 leading-relaxed max-w-lg mx-auto">
              Take a 2-minute quiz and find out which program is built for you.
            </p>
            <Link href="/quiz" className="btn-gold-filled">
              Take the quiz <ArrowRight className="w-4 h-4 btn-arrow" />
            </Link>

            {/* Avatar stack social proof */}
            <div className="flex items-center justify-center gap-3 mt-10">
              <div className="avatar-stack">
                <div className="avatar-stack-item" style={{ background: "#E8927C" }}>S</div>
                <div className="avatar-stack-item" style={{ background: "#4A6FA5" }}>J</div>
                <div className="avatar-stack-item" style={{ background: "#8B7FA5" }}>M</div>
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
