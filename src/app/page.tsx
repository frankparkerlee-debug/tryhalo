"use client";

import {
  ArrowRight,
  Zap,
  Heart,
  Moon,
  Brain,
  Activity,
  Stethoscope,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import FoundingCircleForm from "@/components/FoundingCircleForm";
import CountUpNumber from "@/components/CountUpNumber";
import FAQ from "@/components/FAQ";
import HaloLogo from "@/components/HaloLogo";
import HeroVideo from "@/components/HeroVideo";
import AnchorDataOverlay from "@/components/AnchorDataOverlay";
import HaloPattern from "@/components/HaloPattern";
import HaloMarquee from "@/components/HaloMarquee";
import { usePersonalization } from "@/hooks/usePersonalization";
import {
  FOUNDING_CAP,
  cheapestMonthlyFounding,
  formatMonthlyRounded,
  getProgram,
} from "@/lib/programs";

// Catalog-derived founding "from $X/mo" strings. Drift-proof.
const HRT_FROM = formatMonthlyRounded(cheapestMonthlyFounding(getProgram("hrt")!).price);
const NAD_FROM = formatMonthlyRounded(cheapestMonthlyFounding(getProgram("nad")!).price);
const TRT_FROM = formatMonthlyRounded(cheapestMonthlyFounding(getProgram("trt")!).price);
const PEPTIDES_FROM = formatMonthlyRounded(cheapestMonthlyFounding(getProgram("peptides")!).price);
const WEIGHT_LOSS_FROM = formatMonthlyRounded(cheapestMonthlyFounding(getProgram("weight_loss")!).price);
const WOMENS_T_FROM = formatMonthlyRounded(cheapestMonthlyFounding(getProgram("womens_testosterone")!).price);

/* ─── DATA ────────────────────────────────────────────────────── */

const faqItems = [
  // ─── GENERAL ───────────────────────────────────
  {
    question: "What is Halo?",
    answer:
      "Halo is a physician-led hormone optimization and wellness platform built for high-performing adults in their 40s and 50s. We offer testosterone replacement therapy (TRT) for men, hormone replacement therapy (HRT) for women, GLP-1 weight management, peptide therapy, and NAD+ — all delivered through 100% online consultations with board-certified physicians, at-home lab draws, and a US-licensed compounding pharmacy.",
    category: "General",
  },
  {
    question: "How is Halo different from Hims, Ro, or Hone?",
    answer:
      "Most telehealth brands sell one-size-fits-all protocols optimized for the 25-to-40 demographic. Halo is built specifically for the 40-to-55 professional who wants to reverse aging, not just manage symptoms. Every plan is personalized by a board-certified physician based on comprehensive lab work, not a chatbot. Pricing is transparent. Protocols are adjusted quarterly based on your results, not a standard template.",
    category: "General",
  },
  {
    question: "How does the Halo process work?",
    answer:
      "1) Take our 2-minute quiz to match you to the right program. 2) Complete at-home labs through Quest or Labcorp — free for founding members. 3) Meet your physician on a video visit to review your results and build your plan. 4) Medications ship from our partner pharmacy within 3-5 business days. Follow-ups happen via secure messaging, with video visits any time you want.",
    category: "General",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Most members report improvements in energy, sleep quality, and mood within 2 to 4 weeks. Body composition changes, muscle recovery, and libido improvements typically develop over 2 to 3 months. Your physician monitors biomarkers through repeat labs at 90 days and adjusts your protocol if needed. Individual results vary based on age, baseline levels, and program adherence.",
    category: "General",
  },
  {
    question: "Who is Halo for?",
    answer:
      "Halo is designed for adults 35-65 who want physician-led hormone optimization and wellness protocols. Our core demographic is 40-55 year old professionals who notice their energy, sleep, body composition, or cognitive sharpness declining and want a serious, medically-supervised approach — not supplements or generic TRT clinics. We are not for anyone under 18, pregnant, or with certain active cancers or cardiovascular conditions.",
    category: "General",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Halo has no long-term contracts, no cancellation fees, and no hidden commitments. You can pause or cancel your membership directly from your account dashboard. Your founding member pricing stays locked in as long as your membership remains active.",
    category: "General",
  },

  // ─── PROGRAMS ──────────────────────────────────
  {
    question: "What is testosterone replacement therapy (TRT) and how does it work?",
    answer:
      "Testosterone replacement therapy is a physician-prescribed protocol for men with clinically low testosterone levels. Halo's TRT protocol uses testosterone cypionate (injectable), HCG to preserve testicular function and fertility, and anastrozole to manage estrogen conversion. Your physician customizes dosing based on your baseline labs and adjusts quarterly. Most men experience improved energy, recovery, libido, body composition, and cognitive function within 4 to 8 weeks.",
    category: "Programs",
  },
  {
    question: "What is hormone replacement therapy (HRT) for women?",
    answer:
      "HRT addresses the hormonal decline women experience in perimenopause and menopause. Halo's HRT protocol uses bioidentical estradiol, progesterone, and low-dose testosterone based on your individual symptoms and lab work. Most women report improvements in hot flashes, sleep quality, mood stability, mental clarity, libido, and body composition within 2 to 6 weeks. Protocols are FDA-approved bioidentical hormones compounded by a licensed US pharmacy.",
    category: "Programs",
  },
  {
    question: "Does TRT affect fertility?",
    answer:
      "Traditional TRT can suppress natural testosterone production and reduce sperm count. That is why Halo's TRT protocol includes HCG (human chorionic gonadotropin) — an adjunct medication that maintains testicular function and preserves fertility for men who may want to conceive in the future. If fertility is a priority, talk to your physician during your intake — we can also discuss enclomiphene as an alternative.",
    category: "Programs",
  },
  {
    question: "What GLP-1 medications does Halo offer?",
    answer:
      "Halo offers compounded semaglutide (the active ingredient in branded Ozempic®), produced by a US-licensed 503A compounding pharmacy. For patients who prefer the branded route, we also offer direct-pay Ozempic® and Zepbound®. Your physician titrates your dose up gradually over several months to minimize side effects and maximize weight loss. Most members lose 10\u201315% of body weight over 12 months on compounded semaglutide in published trials.",
    category: "Programs",
  },
  {
    question: "What are peptides and is peptide therapy safe?",
    answer:
      "Peptides are short chains of amino acids that signal your body to produce specific responses — like growth hormone release, tissue repair, or cellular recovery. Halo's primary peptide is sermorelin, a growth hormone releasing hormone (GHRH) analog that stimulates your pituitary to produce more of your own growth hormone. Peptide therapy is prescribed off-label and is not FDA-approved for anti-aging, but is widely used by physicians for sleep, recovery, and body composition support. All protocols are physician-supervised and monitored through repeat labs.",
    category: "Programs",
  },
  {
    question: "What does NAD+ therapy do?",
    answer:
      "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme essential to cellular energy production and DNA repair. NAD+ levels decline significantly with age. Halo offers NAD+ as an injectable, oral, or nasal protocol — depending on your lifestyle and preference. Members report sustained energy, improved focus, and better recovery within 2 to 3 weeks. NAD+ is prescribed off-label for longevity and cellular support and is not FDA-approved as a treatment for any specific condition.",
    category: "Programs",
  },

  // ─── PRICING ───────────────────────────────────
  {
    question: "How much does Halo cost?",
    answer:
      `Pricing depends on what your physician prescribes. Founding-member rates: Hormone Therapy (HRT) from ${HRT_FROM}/mo; NAD+ Therapy from ${NAD_FROM}/mo; Testosterone for Women from ${WOMENS_T_FROM}/mo; Testosterone (TRT) for men from ${TRT_FROM}/mo; Peptide Therapy from ${PEPTIDES_FROM}/mo; Medical Weight Loss from ${WEIGHT_LOSS_FROM}/mo for compounded GLP-1. Branded Ozempic® and Zepbound® are priced separately. Every plan includes physician consultations, compounded or branded medications, lab ordering, ongoing adjustments, and shipping. No hidden fees.`,
    category: "Pricing",
  },
  {
    question: "What is included in my membership?",
    answer:
      "Everything needed to run your protocol: unlimited physician messaging, video visits as needed, prescribed medications shipped monthly or quarterly, at-home lab ordering through Quest and Labcorp, protocol adjustments based on your labs, and US-based member support. Founding members also get their baseline hormone panel free (a $300 value) and locked-in pricing for life.",
    category: "Pricing",
  },
  {
    question: "Does Halo take insurance?",
    answer:
      "Halo operates outside of insurance to keep pricing transparent and avoid insurer-driven protocol restrictions. Most hormone optimization and compounded medications are not covered by insurance anyway. We provide itemized receipts you can submit to your insurer for possible lab reimbursement, and most members pay with HSA or FSA funds, which are fully accepted.",
    category: "Pricing",
  },
  {
    question: "Can I use my HSA or FSA?",
    answer:
      "Yes. Halo accepts HSA and FSA cards for all membership fees, medications, and lab work. This is a pre-tax benefit that can reduce your effective cost by 20-40% depending on your tax bracket.",
    category: "Pricing",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No. Your monthly or quarterly membership fee covers everything: physician visits, messaging, medications, lab orders, protocol adjustments, and shipping. The only additional cost is if you require lab work beyond your included panels (very rare), or specialty medications outside your program.",
    category: "Pricing",
  },
  {
    question: "What is the founding member pricing?",
    answer:
      `The first ${FOUNDING_CAP} members lock in a flat 10% discount on every term for the entire life of their membership, regardless of future price increases \u2014 as low as ${HRT_FROM}/mo for Hormone Therapy on the annual term. Founding members also receive their baseline comprehensive hormone panel free (normally $300), priority onboarding, and first access to new programs as we launch them. Branded Ozempic® and Zepbound® are excluded from the founding discount.`,
    category: "Pricing",
  },

  // ─── MEDICAL ───────────────────────────────────
  {
    question: "Are Halo physicians real and board-certified?",
    answer:
      "Yes. Every physician on the Halo platform is a US-licensed MD or DO, board-certified in their specialty (endocrinology, internal medicine, family medicine, or sports medicine), credentialed through our board-certified physician network, and licensed in your state. Your physician reviews your labs, builds your personalized protocol, and adjusts it based on your results. No chatbots, no generic templates.",
    category: "Medical",
  },
  {
    question: "Where do Halo medications come from?",
    answer:
      "All Halo medications ship from a licensed US compounding pharmacy operating under DEA registration and USP standards. Compounded medications are custom-mixed for each patient based on their physician's prescription — the same way specialty pharmacies have operated for decades. Your medications arrive in labeled sterile vials or pens with clear dosing instructions.",
    category: "Medical",
  },
  {
    question: "What biomarkers does Halo test?",
    answer:
      "Your baseline hormone panel includes total and free testosterone, estradiol, progesterone, SHBG, DHEA-S, IGF-1, complete metabolic panel, lipid panel, thyroid panel (TSH, free T3, free T4), CBC, PSA (men), and vitamin D. Follow-up panels focus on the biomarkers most relevant to your specific protocol. We retest at 90 days and then every 6 months to track progress.",
    category: "Medical",
  },
  {
    question: "What are the side effects of TRT or HRT?",
    answer:
      "Common TRT side effects include acne, increased red blood cell count (polycythemia), water retention, and in rare cases sleep apnea worsening. TRT may affect fertility if HCG is not used. Common HRT side effects include breast tenderness, spotting, mood changes, and minor weight fluctuations. HRT may slightly increase blood clot risk and certain cancer risks — your physician will review your personal and family history to determine if you are a candidate. All protocols require ongoing lab monitoring.",
    category: "Medical",
  },
  {
    question: "Do I need to do lab work before starting?",
    answer:
      "Yes. Halo never prescribes hormones or optimization medications without first reviewing your labs. This is both medically required and what separates us from clinics that rush prescriptions without data. You will visit a local Quest or Labcorp (thousands of locations) for a quick blood draw. Results return in 2-5 business days, then you meet your physician to build your plan. Founding members get their first panel free.",
    category: "Medical",
  },
  {
    question: "Is compounded medication FDA-approved?",
    answer:
      "Compounded medications are not FDA-approved as products because they are custom-made for each patient. However, the active ingredients (bioidentical estradiol, testosterone, semaglutide, etc.) are FDA-approved, and the compounding pharmacy is state-licensed, DEA-registered, and operates under USP 797 standards. This is the same model used for decades for personalized hormone replacement, pediatric medications, and specialty formulations.",
    category: "Medical",
  },
  {
    question: "What if I have a bad reaction or side effect?",
    answer:
      "Message your physician through the Halo platform — typical response time is under 4 hours during business hours. For urgent concerns, video visits can be scheduled same-day or next-day. For true medical emergencies, always call 911 or go to your nearest ER first, then notify your physician. Your physician can adjust dosing, switch medications, or discontinue treatment immediately.",
    category: "Medical",
  },
];

const programs = [
  // ─── ANCHOR PROGRAMS — HRT + NAD+ lead the launch narrative ──
  {
    name: "Hormone Therapy",
    outcome: "Feel like yourself again",
    desc: "For women experiencing fatigue, mood shifts, and sleep issues.",
    label: "Physician-prescribed",
    compounds: "Estradiol \u00B7 Progesterone",
    startingPrice: `from ${HRT_FROM}/mo`,
    href: "/hormone-therapy",
    colorClass: "",
    color: "#D4836B",
    cardBg: "#F5E6E0",
    accent: "#D4836B",
    icon: Heart,
    image: "/hero-hrt-person.jpg",
    overlay: {
      variant: "restoration" as const,
      chips: [
        { label: "Mood", iconKey: "waves" as const },
        { label: "Sleep", iconKey: "moon" as const },
      ],
    },
    tier: "anchor",
    safety: "Hormone therapy may increase risk of blood clots, stroke, and certain cancers. Not suitable during pregnancy. Requires ongoing lab monitoring.",
  },
  {
    name: "NAD+ Therapy",
    outcome: "Unlock steady energy",
    desc: "Cellular energy that lasts all day \u2014 no crashes.",
    label: "Cellular therapy",
    compounds: "NAD+ Injection \u00B7 Glutathione",
    startingPrice: `from ${NAD_FROM}/mo`,
    href: "/nad-therapy",
    colorClass: "",
    color: "#7B6B8F",
    cardBg: "#E8E3ED",
    accent: "#7B6B8F",
    icon: Brain,
    image: "/support-nad.jpg",
    tier: "anchor",
    safety: "NAD+ injections may cause discomfort, nausea, or flushing during administration. Not FDA-approved as an anti-aging treatment.",
  },
  // ─── SUPPORTING PROGRAMS ─────────────────────
  {
    name: "Testosterone Therapy",
    outcome: "Get your edge back",
    desc: "For men dealing with low energy, slow recovery, and brain fog.",
    label: "Physician-prescribed",
    compounds: "Testosterone Cypionate \u00B7 HCG \u00B7 Anastrozole",
    startingPrice: `from ${TRT_FROM}/mo`,
    href: "/testosterone-therapy",
    colorClass: "",
    color: "#5A7394",
    cardBg: "#E3E8EE",
    accent: "#5A7394",
    icon: Zap,
    image: "/hero-trt-person.jpg",
    overlay: {
      variant: "performance" as const,
      chips: [
        { label: "Drive", iconKey: "up" as const },
        { label: "Recovery", iconKey: "rotate" as const },
      ],
    },
    tier: "support",
    safety: "TRT may affect fertility and is not appropriate for men planning conception. May increase red blood cell count. Requires regular lab monitoring.",
  },
  {
    name: "Peptide Therapy",
    outcome: "Recover like you used to",
    desc: "Deeper sleep, faster recovery, better body composition.",
    label: "Growth hormone peptides",
    compounds: "Sermorelin",
    startingPrice: `from ${PEPTIDES_FROM}/mo`,
    href: "/peptide-therapy",
    colorClass: "",
    color: "#6B8F68",
    cardBg: "#E4EBE3",
    accent: "#6B8F68",
    icon: Moon,
    image: "/support-peptide.jpg",
    tier: "support",
    safety: "Peptide therapy is prescribed off-label. Not FDA-approved for anti-aging. May cause injection site reactions, headache, or flushing.",
  },
  {
    name: "GLP-1 Weight Management",
    outcome: "Sustainable weight loss",
    desc: "Physician-supervised GLP-1 protocol with labs and follow-up.",
    label: "GLP-1 therapy",
    compounds: "Compounded Semaglutide \u00B7 Branded Ozempic® \u00B7 Branded Zepbound®",
    startingPrice: `from ${WEIGHT_LOSS_FROM}/mo`,
    href: "/weight-loss",
    colorClass: "",
    color: "#B8974E",
    cardBg: "#EDE8DC",
    accent: "#B8974E",
    icon: Activity,
    image: "/support-glp1.jpg",
    tier: "support",
    safety: "GLP-1 medications may cause nausea, vomiting, diarrhea, or pancreatitis. Not for personal or family history of MTC or MEN 2. Requires lab monitoring.",
  },
];

const providers = [
  {
    name: "Dr. Sarah Chen, MD",
    title: "Board-Certified Endocrinologist",
    chips: ["Hormone Therapy", "Menopause"],
    bio: "Twelve years of clinical experience in hormone optimization and perimenopause care. Previously at Mount Sinai.",
    initials: "SC",
    color: "#D4836B",
    image: "/providers/sarah-chen.png",
  },
  {
    name: "Dr. James Rivera, DO",
    title: "Family Medicine Physician",
    chips: ["Men\u2019s Health", "Sports Medicine"],
    bio: "Board-certified with a sports medicine fellowship. Ten years of TRT protocol design and men\u2019s performance care.",
    initials: "JR",
    color: "#5A7394",
    image: "/providers/james-rivera.png",
  },
  {
    name: "Dr. Priya Patel, MD",
    title: "Board-Certified Internist",
    chips: ["Peptide Therapy", "NAD+ Therapy"],
    bio: "Internal medicine specialist with expertise in peptide and NAD+ protocols. Published researcher in regenerative medicine.",
    initials: "PP",
    color: "#7B6B8F",
    image: "/providers/priya-patel.png",
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
    titleShort: "Quick intake",
    desc: "A short intake covering symptoms, goals, and history. Nothing invasive \u2014 just enough context for your physician to understand what's going on and what you want to change.",
    details: [
      "Symptoms \u2014 energy, sleep, mood, body composition",
      "Goals \u2014 what you want to feel or see change",
      "History \u2014 medications, conditions, family context",
    ],
    time: "2 minutes",
  },
  {
    num: "02",
    title: "Meet your physician",
    titleShort: "Video visit",
    desc: "A 30-minute video visit with a physician who specializes in hormone and longevity care. You'll review your intake together, talk through what's possible, and order the right labs.",
    details: [
      "Personal consultation \u2014 not a script-read session",
      "Hormone-trained physicians \u2014 not generalists",
      "Lab order if needed \u2014 at-home kit or local draw",
    ],
    time: "Within 5 days",
  },
  {
    num: "03",
    title: "Begin your plan",
    titleShort: "Your protocol",
    desc: "Your physician reviews your labs, designs a protocol around your biology, and your medications ship directly \u2014 compounded by a US-licensed pharmacy and discreetly packaged.",
    details: [
      "Protocol design \u2014 matched to your labs and goals",
      "US-licensed pharmacy \u2014 compounded to order",
      "Discreet shipping \u2014 plain packaging, clear instructions",
    ],
    time: "Within 2 weeks",
  },
  {
    num: "04",
    title: "Keep going",
    titleShort: "Ongoing care",
    desc: "Lab work every 90 days, protocol adjustments as needed, and direct messaging with your care team whenever something feels off. Built to last as long as you do.",
    details: [
      "Quarterly labs \u2014 tracking what matters",
      "Dose adjustments \u2014 based on labs and how you feel",
      "Direct messaging \u2014 your care team, not a portal",
    ],
    time: "Ongoing",
  },
];

const testimonials = [
  {
    quote:
      "At 48 I stopped recognizing myself. My sleep, my temper, the way my clothes fit \u2014 all of it drifted. Two doctors looked at my labs and said I was fine. Halo was the first place someone said, \u2018you\u2019re not. Let\u2019s fix it.\u2019",
    name: "Sarah M.",
    age: 48,
    role: "Founding Member",
    program: "Hormone Therapy",
    initials: "SM",
    color: "#D4836B",
    image: "/testimonials/sarah.jpg",
    setting: "At home, morning light",
  },
  {
    quote:
      "I bill fifty hours a week. I don\u2019t have time for something that might work. Halo\u2019s protocol was specific, lab-driven, and my physician replied within three hours the first time I messaged her.",
    name: "James K.",
    age: 45,
    role: "Founding Member",
    program: "Testosterone",
    initials: "JK",
    color: "#5A7394",
    image: "/testimonials/james.jpg",
    setting: "Home office, afternoon",
  },
  {
    quote:
      "I used to recover from a hard run in a day. Now it takes a week. What I liked about Halo is they didn\u2019t pretend I\u2019m 25 \u2014 they built a plan for where I actually am.",
    name: "David T.",
    age: 51,
    role: "Founding Member",
    program: "Peptide Therapy",
    initials: "DT",
    color: "#7B6B8F",
    image: "/testimonials/david.jpg",
    setting: "Trail, golden hour",
  },
  {
    quote:
      "I\u2019m not interested in \u2018optimizing\u2019 anything. I want to be alive at 75 \u2014 clear-headed, present, with energy for the life I\u2019ve built. Halo is the first place I\u2019ve found that treats that as a real clinical goal, not a slogan.",
    name: "Marcus T.",
    age: 47,
    role: "Founding Member",
    program: "NAD+ Therapy",
    initials: "MT",
    color: "#6B8F68",
    image: "/testimonials/marcus.jpg",
    setting: "Dinner with friends",
  },
  {
    quote:
      "After three kids I forgot I was a person with desires. My physician didn\u2019t flinch when I brought it up \u2014 she just listened and ordered the right labs.",
    name: "Ren\u00E9e D.",
    age: 42,
    role: "Founding Member",
    program: "Hormone Therapy",
    initials: "RD",
    color: "#C4867A",
    image: "/testimonials/renee.jpg",
    setting: "Beach walk, sunset",
  },
];

const foundingBenefits = [
  {
    title: "10% off every term \u2014 for life",
    desc: "Founding rate on every core program \u2014 HRT, NAD+, TRT, peptides, and compounded GLP-1. Your price never goes up.",
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
    desc: "Sexual wellness, vitamin injections, and future protocols before they launch publicly",
  },
];

/* ─── MOBILE QUIZ BANNER ────────────────────────────────────────
   Slides up from the bottom after the user scrolls past the hero.
   Hidden on tablet/desktop where the hero has its own quiz button.
   ─────────────────────────────────────────────────────────────── */

function MobileQuizBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      // Show after scrolling past ~85% of the first viewport height.
      // On mobile the hero is roughly one screen tall, so this puts
      // the banner just as the user enters the second section.
      const threshold = window.innerHeight * 0.85;
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{
        background: "#1C1C1E",
        paddingBottom: "env(safe-area-inset-bottom, 0)",
      }}
    >
      <Link
        href="/quiz"
        className="flex items-center justify-center gap-2 w-full px-6 py-3.5 text-white font-semibold text-[14px]"
      >
        Take the 2-minute quiz
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

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

  // How It Works — accordion: track which step is open (0-based)
  const [openStep, setOpenStep] = useState<number>(0);

  return (
    <>
      {/* ═══════════════════════════════════════════════
          Mobile-only scroll-triggered quiz banner
          Hidden on desktop. Hidden while the user is in the hero.
          Slides up from the bottom after they scroll past ~90% of
          the viewport height, giving an always-available path to
          the quiz for the remainder of the page.
          ═══════════════════════════════════════════════ */}
      <MobileQuizBanner />

      {/* ═══════════════════════════════════════════════
          1 · HERO — 4-card bento (HRT + TRT as core, plus hero text + portrait)
              + slim NAD+/Peptides/GLP-1 row below
          ═══════════════════════════════════════════════ */}
      <section className="px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12 section-light">
        <div className="max-w-7xl mx-auto">
          {/* ── BENTO HERO ──────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 mb-10 md:mb-14">
            {/* Hero text card — cols 1–7 */}
            <div className="lg:col-span-7 rounded-[24px] bg-white border border-halo-charcoal/[0.08] p-7 md:p-10 lg:p-12 flex flex-col justify-center min-h-[360px] md:min-h-[400px]">
              <div className="flex items-center gap-3 mb-5">
                <span className="block w-8 h-px bg-halo-charcoal/30" aria-hidden />
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-halo-charcoal/65">
                  Longevity Intelligence
                </span>
              </div>
              <h1
                className="headline-hero text-halo-charcoal mb-5"
                style={{
                  fontSize: "clamp(2.25rem, 5.2vw, 4rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.98,
                }}
              >
                {heroHeadline.line1}
                <br />
                {heroHeadline.line2}
              </h1>
              <p className="text-[15px] md:text-[17px] text-halo-charcoal/70 leading-relaxed mb-7 max-w-md">
                Comprehensive labs, adaptive protocols, and physician oversight — designed around what you&rsquo;re actually trying to change.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/quiz"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-halo-charcoal text-white font-semibold text-sm hover:bg-halo-charcoal/85 transition-colors shadow-[0_8px_28px_rgba(0,0,0,0.15)]"
                >
                  Take the 2-minute quiz
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#programs"
                  className="inline-flex items-center justify-center gap-2 px-2 py-2 text-halo-charcoal/80 font-semibold text-sm border-b border-halo-charcoal/30 hover:border-halo-charcoal/60 transition-colors"
                >
                  See the programs
                </Link>
              </div>
            </div>

            {/* Portrait card — cols 8–12, spans both rows */}
            <div
              className="lg:col-span-5 lg:row-span-2 rounded-[24px] overflow-hidden relative min-h-[360px] md:min-h-[440px] lg:min-h-0"
              style={{ background: "#1A1A1F" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero-trt-person.jpg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectPosition: "center 30%",
                  filter: "contrast(1.05) saturate(0.7) brightness(0.92)",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(155deg, rgba(28,28,30,0.30) 0%, rgba(15,17,21,0.05) 45%, rgba(15,17,21,0.45) 100%)",
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

            {/* HRT + TRT — the two core bentos (pinned by program name) */}
            {(["Hormone Therapy", "Testosterone Therapy"] as const)
              .map((targetName) =>
                personalizedPrograms.find((p) => p.name === targetName)
              )
              .filter((p): p is NonNullable<typeof p> => p !== undefined)
              .map((program, idx) => {
                const Icon = program.icon;
                const hasImage = Boolean(program.image);
                const colSpan = idx === 0 ? "lg:col-span-4" : "lg:col-span-3";
                return (
                  <Link
                    key={program.name}
                    href={program.href}
                    className={`group relative ${colSpan} rounded-[24px] overflow-hidden flex flex-col justify-end min-h-[200px] transition-shadow hover:shadow-[0_18px_44px_-22px_rgba(0,0,0,0.32)]`}
                    style={{ background: program.cardBg }}
                  >
                    {hasImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={program.image}
                        alt={`${program.name} — ${program.outcome}`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        draggable={false}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-12 h-12 opacity-15" style={{ color: program.accent }} />
                      </div>
                    )}
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 0%, rgba(15,17,21,0.78) 100%)",
                      }}
                    />
                    <div className="relative p-5 md:p-6 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <span
                          className="block text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5"
                          style={{ color: program.accent }}
                        >
                          {program.name.replace(" Therapy", "").replace(" Weight Management", "")}
                        </span>
                        <p className="font-serif text-[20px] md:text-[24px] text-white leading-tight tracking-tight">
                          {program.outcome}
                        </p>
                        <p className="text-[12px] text-white/65 mt-1">
                          {program.startingPrice}
                        </p>
                      </div>
                      <span
                        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-colors"
                        aria-hidden
                      >
                        <ArrowRight className="w-4 h-4 text-white" />
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>

          {/* Programs supporting tier — slim NAD+ / Peptides / GLP-1 row + "also available" */}
          <div id="programs" className="space-y-3 scroll-mt-24">
            {/* SUPPORT programs — slim horizontal cards (image · name · arrow).
                Pinned to NAD+ / Peptides / GLP-1 in that order. */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {(["NAD+ Therapy", "Peptide Therapy", "GLP-1 Weight Management"] as const)
                .map((targetName) =>
                  personalizedPrograms.find((p) => p.name === targetName)
                )
                .filter((p): p is NonNullable<typeof p> => p !== undefined)
                .map((program) => {
                  const Icon = program.icon;
                  return (
                    <Link
                      key={program.name}
                      href={program.href}
                      className="group flex items-center gap-3 p-3 rounded-[14px] bg-white border border-halo-charcoal/[0.08] hover:border-halo-charcoal/20 hover:shadow-[0_8px_22px_-12px_rgba(0,0,0,0.18)] transition-all"
                    >
                      <div
                        className="relative w-14 h-14 rounded-[10px] overflow-hidden flex-shrink-0"
                        style={{ background: program.cardBg }}
                      >
                        {program.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={program.image}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon className="w-6 h-6 opacity-25" style={{ color: program.accent }} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-halo-charcoal truncate leading-tight">
                          {program.name.replace(" Therapy", "").replace(" Weight Management", "")}
                        </p>
                        <p className="text-[11px] text-halo-charcoal/55 truncate mt-0.5">
                          {program.outcome} &middot; {program.startingPrice}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-halo-charcoal/25 flex-shrink-0 group-hover:text-halo-charcoal/60 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  );
                })}
            </div>

            {/* Row 3: DEPRIORITIZED — Vitamin injections + Coming Soon — small, muted */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[10px] uppercase tracking-wider text-halo-charcoal/35 font-semibold mr-2">Also available</span>
              {personalizedPrograms
                .filter((p) => p.name === "Vitamin Injections")
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
        {/* Cinematic background — video if available, falls back to static image */}
        <div className="full-bleed-cinematic-image">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/halo-difference.jpg"
            className="w-full h-full object-cover"
            aria-hidden="true"
          >
            <source src="/halo-difference.mp4" type="video/mp4" />
            <source src="/halo-difference.webm" type="video/webm" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/halo-difference.jpg" alt="" loading="lazy" decoding="async" draggable={false} />
          </video>
        </div>
        {/* Gradient scrim for text legibility */}
        <div className="full-bleed-cinematic-scrim" />

        {/* Content layer — short hero statement only, manifesto paragraph lives below */}
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 py-28 md:py-36">
          <p className="label-accent mb-6">The Halo Difference</p>
          <h2 className="headline-section text-3xl md:text-5xl lg:text-6xl text-white mb-6 leading-[1.1]">
            <span className="text-white/55 font-light italic">Aging well used to be </span>
            <span className="text-white/75 italic">genetics.</span>
            <br />
            <span className="text-white">Now it&rsquo;s a </span>
            <span className="text-[#C8A96E]">choice.</span>
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto mb-10">
            Every Halo protocol is tuned to your biology, adjusted to your results, and built to keep working for you.
          </p>
          <Link href="/quiz" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#1C1C1E] font-semibold text-sm hover:bg-white/90 transition-colors">
            Begin your journey <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2 · HOW IT WORKS — Split panel: portrait + accordion
          Left: warm image with overlaid italic headline
          Right: four expandable steps (one open at a time)
          ═══════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-12 md:py-16 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="mb-6 md:mb-8">
              <p className="label-accent">How It Works</p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="grid md:grid-cols-2 rounded-[20px] overflow-hidden border border-halo-charcoal/[0.08] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.12)]">

              {/* ── LEFT: guide.png with overlaid headline ── */}
              <div className="relative min-h-[320px] md:min-h-0 overflow-hidden bg-[#F5EED8]">
                {/* Image — fills the panel */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/guide.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />

                {/* Primary bottom scrim — stronger, covers more of the image */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 28%, rgba(15, 12, 8, 0.45) 62%, rgba(15, 12, 8, 0.75) 100%)",
                  }}
                  aria-hidden="true"
                />

                {/* Focused dark pool behind the headline block — stronger contrast for text only */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 115% 55% at 25% 100%, rgba(15, 12, 8, 0.55) 0%, transparent 60%)",
                  }}
                  aria-hidden="true"
                />

                {/* Overlaid headline — white with subtle text shadow for legibility */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10">
                  <h2
                    className="font-serif leading-[1.05] tracking-tight"
                    style={{ textShadow: "0 2px 24px rgba(0, 0, 0, 0.45)" }}
                  >
                    <span className="block text-2xl md:text-[32px] lg:text-[40px] font-light text-white">
                      Simple to start.
                    </span>
                    <span className="block text-2xl md:text-[32px] lg:text-[40px] italic font-light text-white/90">
                      Built to last.
                    </span>
                  </h2>
                  <div className="flex items-center gap-3 mt-4 md:mt-5">
                    <span className="w-6 h-px bg-[#C8A96E]" aria-hidden="true" />
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E8CB93]"
                      style={{ textShadow: "0 1px 8px rgba(0, 0, 0, 0.5)" }}
                    >
                      Four steps
                    </span>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Accordion (one step expanded at a time) ── */}
              <div className="bg-white flex flex-col">
                {steps.map((step, i) => {
                  const isOpen = openStep === i;
                  return (
                    <div
                      key={step.num}
                      className={`border-b border-halo-charcoal/[0.08] last:border-b-0 transition-colors duration-300 ${
                        isOpen ? "bg-[#F3EADA]" : "bg-white hover:bg-halo-charcoal/[0.015]"
                      }`}
                    >
                      <button
                        onClick={() => setOpenStep(isOpen ? -1 : i)}
                        className="w-full px-5 md:px-7 py-4 md:py-[18px] flex items-center justify-between gap-4 text-left cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-baseline gap-4 md:gap-5 flex-1 min-w-0">
                          <span className="text-[11px] font-semibold tracking-[0.18em] text-[#C8A96E] flex-shrink-0">
                            {step.num}
                          </span>
                          <h3 className="text-base md:text-[17px] font-medium text-halo-charcoal tracking-tight leading-tight">
                            {step.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
                          {/* Time cue — visible when closed, fades when open */}
                          <span
                            className={`hidden md:inline text-[10px] font-semibold uppercase tracking-[0.15em] text-halo-charcoal/45 transition-opacity duration-300 ${
                              isOpen ? "opacity-0" : "opacity-100"
                            }`}
                          >
                            {step.time}
                          </span>

                          {/* +/× indicator */}
                          <span
                            className={`flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full transition-all duration-300 ${
                              isOpen
                                ? "rotate-45 bg-halo-charcoal text-white"
                                : "bg-halo-charcoal/[0.06] text-halo-charcoal/60"
                            }`}
                            aria-hidden="true"
                          >
                            <svg
                              width="9"
                              height="9"
                              viewBox="0 0 10 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
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

                      {/* Expanded content — grid-rows trick for smooth animation */}
                      <div
                        className={`grid transition-all duration-500 ease-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-5 md:px-7 pb-5 md:pb-6 pl-[calc(1.25rem+2.25rem)] md:pl-[calc(1.75rem+1.75rem)]">
                            <p className="text-[14px] text-halo-charcoal/65 leading-relaxed mb-3">
                              {step.desc}
                            </p>

                            {/* Detail list */}
                            {step.details && (
                              <ul className="flex flex-col gap-1 mb-4">
                                {step.details.map((detail, j) => (
                                  <li
                                    key={j}
                                    className="flex items-start gap-2 text-[13px] text-halo-charcoal/55 leading-snug"
                                  >
                                    <span className="text-[#C8A96E] mt-[1px] select-none" aria-hidden="true">·</span>
                                    <span>{detail}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            <div className="flex items-center gap-3 pt-1">
                              <span className="w-6 h-px bg-[#C8A96E]" aria-hidden="true" />
                              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C8A96E]">
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
          </AnimateOnScroll>

          {/* Trailing CTA */}
          <AnimateOnScroll>
            <div className="text-center mt-10 md:mt-14">
              <Link href="/quiz" className="btn-filled !text-sm">
                Begin your journey <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
              </Link>
              <p className="text-xs text-halo-charcoal/30 mt-3">No commitment until your first consultation.</p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Halo Marquee — symptom → outcome pairs, horizontal scroll */}
      <HaloMarquee />

      {/* ═══════════════════════════════════════════════
          3 · MANIFESTO — Statement before testimonials
          Halo signature pattern behind the quote
          ═══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 px-6 section-light relative overflow-hidden">
        {/* Halo signature pattern — reusable component, boosted intensity for this hero placement */}
        <HaloPattern
          variant="default"
          intensity={1.8}
          className="absolute inset-0 w-full h-full"
        />

        {/* Content — sits above the pattern */}
        <div className="max-w-4xl mx-auto relative z-10">
          <AnimateOnScroll>
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

            <div className="mt-6 text-center">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 text-sm font-medium text-halo-charcoal/50 hover:text-halo-charcoal transition-colors border-b border-halo-charcoal/10 hover:border-halo-charcoal/30 pb-0.5"
              >
                Begin your wellness journey <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════
          5 · TESTIMONIALS — Editorial pull-quote + supporting 2-up
          ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16 gap-4">
              <div>
                <p className="label-accent mb-3">Founding members</p>
                <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal">
                  Why they joined.
                </h2>
              </div>
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#C8A96E] hover:text-halo-charcoal transition-colors"
              >
                Take the 2-minute quiz <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </AnimateOnScroll>

          {/* Featured editorial pull-quote */}
          <AnimateOnScroll>
            <figure className="mb-12 md:mb-16 max-w-4xl">
              <blockquote
                className="text-halo-charcoal font-serif font-light leading-[1.1] tracking-tight"
                style={{
                  fontSize: "clamp(1.875rem, 4.4vw, 3.5rem)",
                  letterSpacing: "-0.025em",
                }}
              >
                <span
                  aria-hidden
                  className="font-serif inline-block leading-none mr-1"
                  style={{
                    color: "#C8A96E",
                    fontSize: "1em",
                    transform: "translateY(0.12em)",
                  }}
                >
                  &ldquo;
                </span>
                {personalizedTestimonials[0].quote}
                <span
                  aria-hidden
                  className="font-serif inline-block leading-none ml-0.5"
                  style={{
                    color: "#C8A96E",
                    fontSize: "1em",
                    transform: "translateY(0.12em)",
                  }}
                >
                  &rdquo;
                </span>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <div
                  className="testimonial-avatar text-base flex-shrink-0"
                  style={{
                    background: personalizedTestimonials[0].color,
                    width: 48,
                    height: 48,
                  }}
                >
                  {personalizedTestimonials[0].initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-halo-charcoal">
                    {personalizedTestimonials[0].name}
                  </p>
                  <p className="text-xs text-halo-charcoal/55 mt-0.5">
                    {personalizedTestimonials[0].role} &middot;{" "}
                    <span style={{ color: personalizedTestimonials[0].color }}>
                      {personalizedTestimonials[0].program}
                    </span>
                  </p>
                </div>
              </figcaption>
            </figure>
          </AnimateOnScroll>

          {/* Supporting 2-up — peers, not afterthoughts */}
          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {personalizedTestimonials.slice(1, 3).map((t) => (
                <figure
                  key={t.name}
                  className="aos-child rounded-[20px] bg-white border border-halo-charcoal/[0.08] p-7 md:p-8 flex flex-col"
                >
                  <blockquote className="testimonial-quote font-serif italic text-[18px] md:text-[19px] leading-snug text-halo-charcoal/90 flex-1 mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3 pt-5 border-t border-halo-charcoal/[0.06]">
                    <div
                      className="testimonial-avatar text-sm flex-shrink-0"
                      style={{ background: t.color, width: 40, height: 40 }}
                    >
                      {t.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-halo-charcoal truncate">{t.name}</p>
                      <p className="text-xs text-halo-charcoal/55 mt-0.5">
                        {t.role} &middot;{" "}
                        <span style={{ color: t.color }}>{t.program}</span>
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════
          5b · YOUR PROVIDERS — Compact credibility banner
          Hims-style: small credentials chip card + name/bio below
          ═══════════════════════════════════════════════ */}
      <section className="py-14 md:py-20 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-10 md:mb-14">
              <h2 className="headline-section text-2xl md:text-4xl lg:text-5xl text-halo-charcoal leading-[1.1]">
                <span className="text-[#C8A96E]">Board-certified specialists,</span>
                <br />
                matched to{" "}
                <span className="italic text-halo-charcoal/70">your protocol.</span>
              </h2>
              <p className="text-sm md:text-base text-halo-charcoal/50 max-w-xl mx-auto mt-4 leading-relaxed">
                Halo&rsquo;s provider network includes endocrinologists, internists,
                and specialists in hormone and longevity medicine &mdash; so the
                physician who reviews your labs actually understands them.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {providers.map((doc) => (
                <div key={doc.name} className="aos-child flex flex-col">
                  {/* Credential card — cream, compact, Hims-style */}
                  <div className="flex gap-4 rounded-[18px] bg-[#F3EADA] p-3.5 md:p-4 mb-4">
                    {/* Portrait — warm gradient placeholder, will render <img> when real file lands */}
                    <div className="relative flex-shrink-0 w-[88px] h-[112px] md:w-[100px] md:h-[128px] rounded-xl overflow-hidden bg-halo-charcoal/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={doc.image}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          // Hide broken img, placeholder gradient shows through
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      {/* Placeholder gradient + initials (shows if image fails or before load) */}
                      <div
                        className="absolute inset-0 flex items-center justify-center -z-[1]"
                        style={{
                          background: `linear-gradient(145deg, ${doc.color}33 0%, ${doc.color}80 100%)`,
                        }}
                      >
                        <span
                          className="font-serif text-[24px] md:text-[28px] italic"
                          style={{ color: doc.color }}
                        >
                          {doc.initials}
                        </span>
                      </div>
                    </div>

                    {/* Right side: title + chips */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-halo-charcoal/75 leading-tight mb-3">
                        {doc.title}
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {doc.chips.map((chip) => (
                          <div key={chip} className="flex items-center gap-2">
                            <span
                              className="w-[3px] h-3 rounded-[1px] flex-shrink-0"
                              style={{ background: "#C8A96E" }}
                              aria-hidden="true"
                            />
                            <span className="text-[12px] text-halo-charcoal/70 leading-tight">
                              {chip}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Doctor name + bio — below the card, Hims pattern */}
                  <p className="text-[15px] font-semibold text-halo-charcoal mb-1.5 leading-tight">
                    {doc.name}
                  </p>
                  <p className="text-[13px] text-halo-charcoal/55 leading-relaxed">
                    {doc.bio}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <p className="text-center text-[12px] text-halo-charcoal/45 mt-8 md:mt-10 italic">
              Representative physicians from Halo&rsquo;s provider network.
            </p>
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/30 mt-4">
              Board-certified physician network &middot; All physicians
              US-licensed
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════
          6 · FOUNDING CIRCLE — Full-width split
          ═══════════════════════════════════════════════ */}
      <section id="founding-circle" className="section-dark overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[700px]">
          {/* LEFT: Visual panel — the HALO is the Founding Circle */}
          <div className="relative min-h-[420px] lg:min-h-[700px] overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
            {/* Subtle ambient warmth — reduced gold presence */}
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(200,169,110,0.14) 0%, rgba(200,169,110,0.04) 45%, transparent 75%)",
              }}
            />

            {/* Halo signature pattern — brand mark, core hidden so our counter takes its place */}
            <HaloPattern
              variant="default"
              intensity={2.1}
              color="#C8A96E"
              showCore={false}
              className="absolute inset-0 w-full h-full"
            />

            {/* Central focal point: progress ring + counter */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px] lg:w-[440px] lg:h-[440px] flex items-center justify-center">

                {/* Progress ring — gold, because it signals scarcity (the one place gold earns its keep) */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 100"
                  style={{ transform: "rotate(-90deg)" }}
                  aria-hidden="true"
                >
                  {/* Full-circle faint guide */}
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="0.4"
                  />
                  {/* Progress arc (64.7% = 647/999) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="#C8A96E"
                    strokeWidth="0.7"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 48 * 0.6477} ${2 * Math.PI * 48}`}
                    opacity="0.95"
                  />
                </svg>

                {/* Counter in the center — cream, not gold. Content stands out; pattern stays atmosphere */}
                <div className="flex flex-col items-center text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55 mb-3">
                    Founding Members
                  </p>
                  <CountUpNumber
                    target={647}
                    start={600}
                    duration={2000}
                    className="font-serif text-[96px] md:text-[128px] lg:text-[148px] font-light text-[#F3EADA] leading-[0.9] tracking-tight"
                  />
                  <div
                    className="w-10 h-px bg-white/25 my-4"
                    aria-hidden="true"
                  />
                  <p className="text-[13px] text-white/55">
                    of{" "}
                    <span className="text-white/85 font-semibold">{FOUNDING_CAP}</span>{" "}
                    spots claimed
                  </p>
                </div>
              </div>

              {/* Caption below the ring — includes deadline */}
              <div className="flex flex-col items-center gap-2 mt-6 md:mt-8">
                <p className="text-[10px] text-white/35 uppercase tracking-[0.28em] font-semibold">
                  64.7% claimed &middot; 352 remaining
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="w-1 h-1 rounded-full bg-[#C8A96E]"
                    aria-hidden="true"
                  />
                  <p className="text-[11px] text-[#C8A96E] uppercase tracking-[0.28em] font-semibold">
                    Closes June 1
                  </p>
                  <span
                    className="w-1 h-1 rounded-full bg-[#C8A96E]"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Content panel */}
          <div className="flex flex-col justify-center px-6 lg:px-16 py-16 lg:py-20">
            <div className="max-w-md">
              <AnimateOnScroll>
                <div className="mb-5 flex items-center gap-3">
                  <span className="label-rule" />
                  <p className="label-accent">Founding Circle</p>
                  <span className="text-[#C8A96E]/40 text-xs">&middot;</span>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C8A96E]">
                    Ends June 1
                  </p>
                </div>
                <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-white mb-5">
                  The first {FOUNDING_CAP} get in at the best price. Permanently.
                </h2>
                <p className="text-base text-white/30 mb-8 leading-relaxed">
                  Lock in founding pricing for life, get your first labs free, and be the first to access every new program we launch.{" "}
                  <span className="text-white/55 font-medium">
                    Founding Circle closes June 1, 2026.
                  </span>
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
      <section className="py-16 md:py-28 lg:py-36 px-6 section-dark relative overflow-hidden">
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
