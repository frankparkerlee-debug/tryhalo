"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Plus, Minus } from "lucide-react";
import HaloLogo from "@/components/HaloLogo";
import FoundingCircleForm from "@/components/FoundingCircleForm";
import HormoneBalanceChart from "@/components/HormoneBalanceChart";
import { track } from "@/lib/tracking";
import { submitQuiz } from "@/lib/quiz-client";
import {
  applyFoundingDiscount,
  formatPrice,
  getProgram,
  type ProgramCard,
} from "@/lib/programs";

/* ==============================
   PROGRAM DATA — derived from programs.ts so prices can never drift.
   ============================== */

type QuizProgram = {
  name: string;
  compounds: string;
  price: string;
  foundingPrice: string;
  description: string;
  includes: string[];
  href: string;
  available: boolean;
};

const priceFromCatalog = (p: ProgramCard): { price: string; founding: string } => {
  const std = p.pricing.monthly;
  const founding = p.foundingExempt ? std : applyFoundingDiscount(std);
  return {
    price: `${formatPrice(std)}/mo`,
    founding: `${formatPrice(founding)}/mo`,
  };
};

const hrtCatalog = getProgram("hrt")!;
const trtCatalog = getProgram("trt")!;
const peptidesCatalog = getProgram("peptides")!;
const nadCatalog = getProgram("nad")!;
const weightLossCatalog = getProgram("weight_loss")!;
const sexualWellnessCatalog = getProgram("sexual_wellness")!;

const hrtPr = priceFromCatalog(hrtCatalog);
const trtPr = priceFromCatalog(trtCatalog);
const peptidesPr = priceFromCatalog(peptidesCatalog);
const nadPr = priceFromCatalog(nadCatalog);
const weightLossPr = priceFromCatalog(weightLossCatalog);
const sexualWellnessPr = priceFromCatalog(sexualWellnessCatalog);

const programs: Record<string, QuizProgram> = {
  hormoneTherapy: {
    name: "Hormone Therapy",
    compounds: "Estradiol \u00B7 Progesterone",
    price: hrtPr.price,
    foundingPrice: hrtPr.founding,
    description:
      "Personalized hormone optimization for women navigating perimenopause, menopause, and hormonal imbalance.",
    includes: [
      "Compounded medications",
      "Comprehensive lab panel",
      "Provider consultations",
      "Free shipping",
    ],
    href: hrtCatalog.href,
    available: !hrtCatalog.comingSoon,
  },
  testosterone: {
    name: "Testosterone",
    compounds: "Testosterone Cypionate \u00B7 HCG \u00B7 Anastrozole",
    price: trtPr.price,
    foundingPrice: trtPr.founding,
    description:
      "Lab-driven testosterone optimization with ongoing provider monitoring.",
    includes: [
      "Testosterone + ancillaries",
      "Comprehensive lab panel",
      "Provider consultations",
      "Free shipping",
    ],
    href: trtCatalog.href,
    available: !trtCatalog.comingSoon,
  },
  peptideTherapy: {
    name: "Peptide Therapy",
    compounds: "Sermorelin",
    price: peptidesPr.price,
    foundingPrice: peptidesPr.founding,
    description:
      "Growth hormone peptide therapy for recovery, sleep, and body composition.",
    includes: [
      "Compounded peptides",
      "Provider consultations",
      "Protocol adjustments",
      "Free shipping",
    ],
    href: peptidesCatalog.href,
    available: !peptidesCatalog.comingSoon,
  },
  nadTherapy: {
    name: "NAD+ Therapy",
    compounds: "NAD+ Injection \u00B7 Glutathione",
    price: nadPr.price,
    foundingPrice: nadPr.founding,
    description:
      "Clinical-grade NAD+ for energy, mental clarity, and cellular health.",
    includes: [
      "Pharmaceutical-grade NAD+",
      "Provider consultations",
      "Dosing optimization",
      "Free shipping",
    ],
    href: nadCatalog.href,
    available: !nadCatalog.comingSoon,
  },
  weightLoss: {
    name: "Medical Weight Loss",
    compounds: "Compounded Semaglutide \u00B7 Branded Ozempic® / Zepbound®",
    price: weightLossPr.price,
    foundingPrice: weightLossPr.founding,
    description: "GLP-1 therapy for sustainable weight management.",
    includes: [
      "GLP-1 medication",
      "Provider consultations",
      "Metabolic monitoring",
      "Free shipping",
    ],
    href: weightLossCatalog.href,
    available: !weightLossCatalog.comingSoon,
  },
  sexualWellness: {
    name: "Sexual Wellness",
    compounds: "Sildenafil \u00B7 Tadalafil",
    price: sexualWellnessPr.price,
    foundingPrice: sexualWellnessPr.founding,
    description: "Physician-prescribed therapies for performance and desire.",
    includes: [
      "Prescribed medications",
      "Provider consultations",
      "Ongoing support",
      "Free shipping",
    ],
    href: sexualWellnessCatalog.href,
    available: !sexualWellnessCatalog.comingSoon,
  },
};

/* ==============================
   GENDER-AWARE SYMPTOM MAPPING
   ============================== */

type GenderKey = "Woman" | "Man" | "default";

const symptomMapping: Record<string, Partial<Record<GenderKey, string[]>>> = {
  "Energy & fatigue": {
    Woman: [
      "Afternoon energy crashes",
      "Morning fatigue",
      "Brain fog",
      "Fatigue that worsens with your cycle",
    ],
    Man: [
      "Afternoon energy crashes",
      "Morning fatigue",
      "Brain fog",
      "Low motivation",
    ],
    default: ["Afternoon energy crashes", "Morning fatigue", "Brain fog", "Low motivation"],
  },
  "Sleep quality": {
    Woman: [
      "Trouble falling asleep",
      "Waking during the night",
      "Night sweats",
      "Hot flashes",
    ],
    Man: [
      "Trouble falling asleep",
      "Waking during the night",
      "Not feeling rested",
      "Snoring / sleep apnea",
    ],
    default: [
      "Trouble falling asleep",
      "Waking during the night",
      "Not feeling rested",
    ],
  },
  "Weight management": {
    default: [
      "Stubborn weight gain",
      "Slow metabolism",
      "Cravings",
      "Plateau despite exercise",
    ],
  },
  "Mood & mental clarity": {
    Woman: [
      "Irritability",
      "Anxiety",
      "Mood swings with your cycle",
      "Difficulty concentrating",
    ],
    Man: ["Irritability", "Anxiety", "Mood swings", "Difficulty concentrating"],
    default: ["Irritability", "Anxiety", "Mood swings", "Difficulty concentrating"],
  },
  "Recovery & performance": {
    default: [
      "Slow recovery from exercise",
      "Joint stiffness",
      "Loss of muscle mass",
      "Decreased stamina",
    ],
  },
  "Sexual health & libido": {
    Woman: [
      "Low desire",
      "Vaginal dryness",
      "Difficulty with arousal",
      "Decreased satisfaction",
    ],
    Man: ["Low desire", "Difficulty with erections", "Decreased satisfaction"],
    default: ["Low desire", "Difficulty with arousal", "Decreased satisfaction"],
  },
  "Skin, hair & aging": {
    default: ["Thinning hair", "Dry or aging skin", "Slow wound healing"],
  },
  "Overall optimization": {
    default: [
      "Afternoon energy crashes",
      "Brain fog",
      "Slow recovery",
      "Sleep disruption",
    ],
  },
};

function getSymptomsFor(goals: string[], gender: string): string[] {
  const key: GenderKey =
    gender === "Woman" ? "Woman" : gender === "Man" ? "Man" : "default";
  const set = new Set<string>();
  goals.forEach((goal) => {
    const goalMap = symptomMapping[goal];
    if (!goalMap) return;
    const list = goalMap[key] || goalMap.default || [];
    list.forEach((s) => set.add(s));
  });
  return Array.from(set);
}

/* ==============================
   GOALS LIST
   ============================== */

const goalOptions = [
  "Energy & fatigue",
  "Sleep quality",
  "Weight management",
  "Mood & mental clarity",
  "Recovery & performance",
  "Sexual health & libido",
  "Skin, hair & aging",
  "Overall optimization",
];

/* ==============================
   SAFETY OPTIONS (gender-aware)
   ============================== */

function getSafetyOptions(gender: string): string[] {
  const base = [
    "History of blood clots",
    "Cancer history",
    "Heart disease",
    "Liver disease",
  ];
  if (gender === "Woman") base.push("Pregnant or planning pregnancy");
  base.push("None of these");
  return base;
}

const RED_FLAGS = new Set([
  "History of blood clots",
  "Cancer history",
  "Heart disease",
  "Liver disease",
  "Pregnant or planning pregnancy",
]);

/* ==============================
   PERSONA COLORS — quiz-long color persistence
   Carries the first-step gender choice through the whole experience
   ============================== */

const PERSONA_COLORS: Record<string, string> = {
  Woman: "#D4836B", // terracotta rose (matches HRT anchor card)
  Man: "#5A7394", // slate blue (matches TRT anchor card)
};

const NEUTRAL_COLOR = "#C8A96E";

function getPersonaColor(gender: string): string {
  return PERSONA_COLORS[gender] || NEUTRAL_COLOR;
}

/* ==============================
   PILL OPTION — single-select with radio
   Module-scoped so it can hold hover state safely
   ============================== */

function PillOption({
  label,
  selected,
  onClick,
  disabled,
  accentColor,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  accentColor: string;
}) {
  const [hovered, setHovered] = useState(false);
  const isActive = selected || (hovered && !disabled);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group w-full flex items-center gap-3.5 px-5 py-4 rounded-full bg-white text-left transition-all duration-300 border ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      }`}
      style={{
        borderColor: isActive ? accentColor : "rgba(28, 28, 30, 0.08)",
        boxShadow: selected
          ? `0 4px 20px ${accentColor}2E`
          : "none",
      }}
    >
      <span
        className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border-[1.5px] transition-all duration-200"
        style={{
          borderColor: isActive ? accentColor : "rgba(28, 28, 30, 0.25)",
          backgroundColor: selected ? accentColor : "transparent",
        }}
      >
        {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      <span className="text-halo-charcoal text-[15px] font-medium">{label}</span>
    </button>
  );
}

/* ==============================
   CHECK OPTION — multi-select with checkbox
   ============================== */

function CheckOption({
  label,
  selected,
  onClick,
  disabled,
  accentColor,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  accentColor: string;
}) {
  const [hovered, setHovered] = useState(false);
  const isActive = selected || (hovered && !disabled);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-white text-left transition-all duration-300 border ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      }`}
      style={{
        borderColor: isActive ? accentColor : "rgba(28, 28, 30, 0.08)",
        boxShadow: selected
          ? `0 4px 18px ${accentColor}26`
          : "none",
      }}
    >
      <span
        className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border-[1.5px] transition-all duration-200"
        style={{
          borderColor: isActive ? accentColor : "rgba(28, 28, 30, 0.25)",
          backgroundColor: selected ? accentColor : "transparent",
        }}
      >
        {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </span>
      <span className="text-halo-charcoal text-[14px] md:text-[15px] font-medium">
        {label}
      </span>
    </button>
  );
}

/* ==============================
   "WHY WE ASK" RATIONALES
   ============================== */

const rationales: Record<number, string> = {
  1: "Hormones and therapy eligibility are sex-specific. This helps your physician determine what's biologically appropriate — not how to label you.",
  2: "Hormone needs, lab reference ranges, and therapy protocols vary significantly by age.",
  3: "Your goals shape your protocol. We optimize for what you actually want to change — not a template.",
  4: "Symptoms help your physician pinpoint what's happening physiologically and set measurable benchmarks to track.",
  // Step 5 is the Science Gate (educational, no "Why we ask" needed)
  6: "Drug interactions matter. Your physician will cross-reference your current medications before prescribing anything.",
  7: "Certain conditions require extra care. Flagging these helps your physician prepare — it doesn't disqualify you.",
};

/* ==============================
   AGE HELPER
   ============================== */

function ageToNum(range: string): number {
  const n = parseInt(range, 10);
  return isNaN(n) ? 35 : n;
}

/* ==============================
   TOTAL STEPS
   1: Gender, 2: Age, 3: Goals, 4: Symptoms,
   5: Science Gate, 6: Medications, 7: Safety,
   8: Loading, 9: Results
   ============================== */

const TOTAL_STEPS = 9;

/* ==============================
   QUIZ PAGE
   ============================== */

/**
 * Map the legacy programs-object key (how the quiz records its pick) to the
 * canonical Program slug the /stack builder and /api/quiz-submission schema
 * both speak. Keep this in sync with the keys in the `programs` object above.
 * Returning null means "no specific primary" — /stack renders with no
 * pre-selected card, same as a direct visit.
 */
function primaryRecToStackSlug(
  key: keyof typeof programs | null
): string | null {
  switch (key) {
    case "hormoneTherapy":
      return "hrt";
    case "testosterone":
      return "trt";
    case "peptideTherapy":
      return "peptides";
    case "nadTherapy":
      return "nad";
    case "weightLoss":
      return "weight_loss";
    case "sexualWellness":
      return "sexual_wellness";
    case null:
    case undefined:
      return null;
    default:
      return null;
  }
}

function QuizPageInner() {
  /* ---- URL context (?from=hrt | ?from=trt | none) ---- */
  const searchParams = useSearchParams();
  const router = useRouter();
  const quizContext = useMemo(() => {
    const from = searchParams?.get("from");
    if (from === "hrt" || from === "trt" || from === "peptide" || from === "nad") {
      return from;
    }
    return "general";
  }, [searchParams]);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [animating, setAnimating] = useState(false);

  // Answers
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [takingMedications, setTakingMedications] = useState<string | null>(null);
  const [medicationDetails, setMedicationDetails] = useState("");
  const [safetyItems, setSafetyItems] = useState<string[]>([]);

  // Results
  const [primaryRec, setPrimaryRec] = useState<keyof typeof programs | null>(null);
  const [secondaryRecs, setSecondaryRecs] = useState<(keyof typeof programs)[]>([]);
  const [comingSoonRecs, setComingSoonRecs] = useState<(keyof typeof programs)[]>([]);

  // Derived safety options based on gender
  const safetyOptions = useMemo(() => getSafetyOptions(gender), [gender]);
  const derivedSymptoms = useMemo(() => getSymptomsFor(goals, gender), [goals, gender]);
  const hasContraindications = useMemo(
    () => safetyItems.some((s) => RED_FLAGS.has(s)),
    [safetyItems],
  );

  // Persona color — carries the quiz's color identity based on gender selection
  const personaColor = useMemo(() => getPersonaColor(gender), [gender]);

  /* ---- Step transition ---- */
  const goTo = useCallback(
    (nextStep: number, dir: "forward" | "back" = "forward") => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setStep(nextStep);
        setAnimating(false);
      }, 250);
    },
    [animating],
  );

  const goNext = useCallback(() => goTo(step + 1, "forward"), [step, goTo]);
  const goBack = useCallback(() => {
    if (step > 1) goTo(step - 1, "back");
  }, [step, goTo]);

  /* ---- Auto-advance on single-select ---- */
  const selectGender = (value: string) => {
    setGender(value);
    // Clear safety selections in case they changed (e.g., pregnancy option)
    setSafetyItems([]);
    setTimeout(() => goTo(2, "forward"), 300);
  };

  const selectAge = (value: string) => {
    setAge(value);
    setTimeout(() => goTo(3, "forward"), 300);
  };

  /* ---- Multi-select toggles ---- */
  const toggleGoal = (goal: string) => {
    setGoals((prev) => {
      if (prev.includes(goal)) return prev.filter((g) => g !== goal);
      if (prev.length >= 3) return prev;
      return [...prev, goal];
    });
  };

  const toggleSymptom = (s: string) => {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  const toggleSafety = (item: string) => {
    if (item === "None of these") {
      setSafetyItems(["None of these"]);
      return;
    }
    setSafetyItems((prev) => {
      const without = prev.filter((x) => x !== "None of these");
      if (without.includes(item)) return without.filter((x) => x !== item);
      return [...without, item];
    });
  };

  /* ==============================
     ROUTING LOGIC — refined
     ============================== */
  const computeResults = useCallback(() => {
    const recs: (keyof typeof programs)[] = [];
    const comingSoon: (keyof typeof programs)[] = [];
    const ageNum = ageToNum(age);
    const goalSet = new Set(goals);

    // ---- Women ----
    if (gender === "Woman") {
      const hormoneSignals = [
        "Energy & fatigue",
        "Sleep quality",
        "Mood & mental clarity",
        "Sexual health & libido",
        "Skin, hair & aging",
      ].filter((g) => goalSet.has(g)).length;

      // 35+ with any hormone signal: HRT is the right primary.
      if (ageNum >= 35 && hormoneSignals >= 1) {
        recs.push("hormoneTherapy");
      } else if (ageNum < 35 && hormoneSignals >= 2) {
        // Under 35: require stronger signal (2+) to anchor on HRT.
        recs.push("hormoneTherapy");
      } else if (ageNum < 35 && hormoneSignals === 1) {
        // Under 35 with only one signal: offer NAD+ as the entry point
        // and let the clinician decide whether HRT is appropriate at intake.
        recs.push("nadTherapy");
      }
    }

    // ---- Men ----
    if (gender === "Man") {
      const trtSignals = [
        "Energy & fatigue",
        "Recovery & performance",
        "Sexual health & libido",
        "Mood & mental clarity",
      ].filter((g) => goalSet.has(g)).length;

      // 35+ with any TRT signal: TRT is the right primary.
      if (ageNum >= 35 && trtSignals >= 1) {
        recs.push("testosterone");
      } else if (ageNum < 35 && trtSignals >= 2) {
        // Under 35: require stronger signal (2+) to anchor on TRT.
        recs.push("testosterone");
      } else if (ageNum < 35 && trtSignals === 1) {
        // Under 35 with only one signal: offer NAD+ as the entry point
        // and let the clinician decide whether TRT is appropriate at intake.
        recs.push("nadTherapy");
      }
    }

    // ---- Peptide Therapy ----
    // Expanded triggers: recovery, sleep, skin/aging, body composition (40+)
    if (
      (goalSet.has("Recovery & performance") ||
        goalSet.has("Sleep quality") ||
        goalSet.has("Skin, hair & aging") ||
        (ageNum >= 40 && goalSet.has("Weight management"))) &&
      !recs.includes("peptideTherapy")
    ) {
      recs.push("peptideTherapy");
    }

    // ---- NAD+ Therapy ----
    // Tightened: 40+ AND at least one energy/cognitive goal AND at least 2 goals total
    if (
      ageNum >= 40 &&
      (goalSet.has("Energy & fatigue") ||
        goalSet.has("Overall optimization") ||
        goalSet.has("Mood & mental clarity")) &&
      goals.length >= 2 &&
      !recs.includes("nadTherapy")
    ) {
      recs.push("nadTherapy");
    }

    // ---- Weight Loss (coming soon) ----
    if (goalSet.has("Weight management")) {
      comingSoon.push("weightLoss");
    }

    // ---- Sexual Wellness (coming soon) ----
    // Only if not already covered by TRT/HRT
    if (
      goalSet.has("Sexual health & libido") &&
      !recs.includes("testosterone") &&
      !recs.includes("hormoneTherapy")
    ) {
      comingSoon.push("sexualWellness");
    }

    // ---- Final fallback ----
    // If the router came up empty, honor the originating product page
    // (e.g. ?from=hrt / trt / peptide / nad) as the primary. The clinician
    // will refine at intake — we never punt the user to a generic consult.
    if (recs.length === 0) {
      if (quizContext === "hrt") recs.push("hormoneTherapy");
      else if (quizContext === "trt") recs.push("testosterone");
      else if (quizContext === "peptide") recs.push("peptideTherapy");
      else if (quizContext === "nad") recs.push("nadTherapy");
    }

    const primary = recs[0] ?? null;
    const secondary = recs.slice(1);

    setPrimaryRec(primary);
    setSecondaryRecs(secondary);
    setComingSoonRecs(comingSoon);

    // Save for homepage personalization
    try {
      localStorage.setItem(
        "halo_quiz",
        JSON.stringify({
          gender,
          age,
          goals,
          hasContraindications,
          primaryRec: primary,
          secondaryRecs: secondary,
          completedAt: new Date().toISOString(),
        }),
      );
    } catch {}
  }, [gender, age, goals, hasContraindications, quizContext]);

  /* ---- Auto-skip gender step when launched from HRT or TRT page ---- */
  useEffect(() => {
    // Only run on mount, and only if we're on step 1 with no gender picked yet
    if (step !== 1 || gender) return;
    if (quizContext === "hrt") {
      setGender("Woman");
      goTo(2, "forward");
    } else if (quizContext === "trt") {
      setGender("Man");
      goTo(2, "forward");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizContext]);

  /* ---- Auto-advance from loading to results ---- */
  useEffect(() => {
    if (step === 8) {
      computeResults();
      const timer = setTimeout(() => {
        setDirection("forward");
        setAnimating(true);
        setTimeout(() => {
          setStep(9);
          setAnimating(false);
        }, 250);
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [step, computeResults]);

  /* ---- Track step views + quiz lifecycle ---- */
  useEffect(() => {
    if (step === 1 && !gender) {
      track("quiz_start", { context: quizContext });
    }
    track("quiz_step_view", {
      step,
      context: quizContext,
      gender: gender || null,
      age: age || null,
    });
    if (step === 5) {
      track("quiz_gate_view", {
        gate: "science_hormones",
        context: quizContext,
      });
    }
    if (step === 9) {
      track("quiz_complete", {
        context: quizContext,
        gender,
        age,
        goals,
        primaryRec,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  /* ---- Track abandonment ---- */
  useEffect(() => {
    const handleUnload = () => {
      if (step < 9) {
        track("quiz_abandoned", {
          step,
          context: quizContext,
          gender: gender || null,
        });
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [step, gender, quizContext]);

  /* ==============================
     SHARED UI BUILDING BLOCKS
     ============================== */

  const QuestionHeadline = ({ children }: { children: React.ReactNode }) => (
    <h1
      className="font-serif text-[34px] md:text-[42px] lg:text-[48px] leading-[1.08] text-halo-charcoal tracking-tight mb-4"
      style={{ fontFeatureSettings: '"kern", "liga"' }}
    >
      {children}
    </h1>
  );

  const QuestionSub = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[15px] text-halo-charcoal/55 mb-8 max-w-md leading-relaxed">
      {children}
    </p>
  );

  // Primary continue CTA (persona pill)
  const ContinueButton = ({
    onClick,
    disabled,
    label = "Continue",
  }: {
    onClick: () => void;
    disabled?: boolean;
    label?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full text-white font-semibold text-sm transition-all duration-300 ${
        disabled ? "opacity-40 cursor-not-allowed" : "hover:brightness-95"
      }`}
      style={{
        backgroundColor: personaColor,
        boxShadow: disabled ? "none" : `0 6px 24px ${personaColor}47`,
      }}
    >
      {label}
      <ArrowRight className="w-4 h-4" />
    </button>
  );

  // "Why we ask" disclosure chip
  const WhyWeAsk = ({ stepNum }: { stepNum: number }) => {
    const [open, setOpen] = useState(false);
    const rationale = rationales[stepNum];
    if (!rationale) return null;
    return (
      <div className="mt-8">
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-halo-charcoal/15 text-[10px] font-semibold uppercase tracking-[0.2em] text-halo-charcoal/60 hover:border-halo-charcoal/30 hover:text-halo-charcoal transition-colors"
          aria-expanded={open}
        >
          Why we ask
          {open ? (
            <Minus className="w-3 h-3" strokeWidth={2.5} />
          ) : (
            <Plus className="w-3 h-3" strokeWidth={2.5} />
          )}
        </button>
        <div
          className={`grid transition-all duration-400 ease-out ${
            open ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="text-[13px] text-halo-charcoal/60 leading-relaxed max-w-md">
              {rationale}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Progress dots — tinted by persona color
  const ProgressDots = () => (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
        const num = i + 1;
        const isCurrent = num === step;
        const isPast = num < step;
        return (
          <span
            key={num}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              isCurrent ? "w-6" : "w-1.5"
            }`}
            style={{
              backgroundColor: isCurrent
                ? personaColor
                : isPast
                  ? `${personaColor}73`
                  : "rgba(28, 28, 30, 0.15)",
            }}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );

  /* ---- Step animation classes ---- */
  const stepAnim = animating
    ? direction === "forward"
      ? "opacity-0 translate-x-6"
      : "opacity-0 -translate-x-6"
    : "opacity-100 translate-x-0";

  /* ==============================
     RENDER
     ============================== */

  return (
    <>
      {/* Hide main nav, footer, chat on quiz page */}
      <style>{`
        body > *:not(main):not(script):not(style):not(next-route-announcer) {
          display: none !important;
        }
        body > main {
          display: block !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
        }
      `}</style>

      <div className="min-h-screen w-full flex flex-col bg-halo-stone relative overflow-hidden">
        {/* Soft warm light from top — atmosphere without a pattern */}
        {step < 9 && (
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 80% 45% at 50% 0%, rgba(255, 232, 185, 0.55) 0%, transparent 60%)",
            }}
          />
        )}

        {/* ── TOP BAR ── */}
        <header className="relative z-20 flex items-center justify-between px-6 py-5 md:px-8 md:py-6">
          {step > 1 && step < 9 ? (
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-halo-charcoal/50 hover:text-halo-charcoal transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : step === 9 ? (
            <button
              onClick={() => goTo(7, "back")}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-halo-charcoal/50 hover:text-halo-charcoal transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-halo-charcoal/50 hover:text-halo-charcoal transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
          )}

          <Link href="/" className="flex items-center">
            <HaloLogo size="md" variant="light" />
          </Link>

          <div className="w-16" />
        </header>

        {/* ── PROGRESS DOTS ── */}
        {step < 9 && (
          <div className="relative z-20 flex justify-center pt-1 pb-2">
            <ProgressDots />
          </div>
        )}

        {/* ── TRUST STRIP — persistent credibility across all active steps ── */}
        {step < 9 && (
          <div className="relative z-20 flex justify-center px-4 pb-2">
            <p className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/40 text-center">
              Board-certified physicians
              <span className="mx-1.5 md:mx-2 text-halo-charcoal/25">&middot;</span>
              USP-compounded
              <span className="mx-1.5 md:mx-2 text-halo-charcoal/25">&middot;</span>
              HIPAA secure
            </p>
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        <main
          className={`relative z-10 flex-1 flex flex-col ${
            step === 9 ? "items-center justify-start" : "items-center justify-center"
          } px-6 py-8 md:py-12 w-full`}
        >
          <div
            className={`w-full max-w-xl mx-auto transition-all duration-250 ease-out ${stepAnim}`}
          >
            {/* ============ STEP 1: GENDER ============ */}
            {step === 1 && (
              <div>
                {/* Context label — shows when quiz is launched from a specific therapy page */}
                {quizContext !== "general" && (
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.28em] text-center mb-4"
                    style={{ color: "#C8A96E" }}
                  >
                    {quizContext === "hrt" && "Hormone Therapy Assessment"}
                    {quizContext === "trt" && "Testosterone Therapy Assessment"}
                    {quizContext === "peptide" && "Peptide Therapy Assessment"}
                    {quizContext === "nad" && "NAD+ Therapy Assessment"}
                  </p>
                )}
                <QuestionHeadline>
                  Let&rsquo;s find what&rsquo;s{" "}
                  <span className="italic text-halo-charcoal/70">right for you.</span>
                </QuestionHeadline>
                <QuestionSub>
                  Takes about two minutes. Every answer shapes your care.
                </QuestionSub>
                <div className="flex flex-col gap-2.5">
                  {["Woman", "Man"].map((option) => (
                    <PillOption
                      key={option}
                      label={option}
                      selected={gender === option}
                      onClick={() => selectGender(option)}
                      accentColor={PERSONA_COLORS[option] || NEUTRAL_COLOR}
                    />
                  ))}
                </div>
                <WhyWeAsk stepNum={1} />
              </div>
            )}

            {/* ============ STEP 2: AGE ============ */}
            {step === 2 && (
              <div>
                {/* Context label — when auto-routed from HRT/TRT page */}
                {(quizContext === "hrt" || quizContext === "trt") && (
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.28em] text-center mb-4"
                    style={{ color: personaColor }}
                  >
                    {quizContext === "hrt" && "Hormone Therapy Assessment"}
                    {quizContext === "trt" && "Testosterone Therapy Assessment"}
                  </p>
                )}
                <QuestionHeadline>
                  What&rsquo;s your{" "}
                  <span className="italic text-halo-charcoal/70">age range?</span>
                </QuestionHeadline>
                <QuestionSub>
                  Hormone protocols and reference ranges shift by decade.
                </QuestionSub>
                <div className="flex flex-col gap-2.5">
                  {["25-34", "35-44", "45-54", "55-64", "65+"].map((option) => (
                    <PillOption
                      key={option}
                      label={option}
                      selected={age === option}
                      onClick={() => selectAge(option)}
                      accentColor={personaColor}
                    />
                  ))}
                </div>
                {/* Escape link — if auto-routed and this isn't for them */}
                {(quizContext === "hrt" || quizContext === "trt") && (
                  <div className="mt-5 text-center">
                    <button
                      onClick={() => {
                        setGender("");
                        goTo(1, "back");
                      }}
                      className="text-[12px] text-halo-charcoal/50 hover:text-halo-charcoal transition-colors border-b border-halo-charcoal/15 hover:border-halo-charcoal/35 pb-0.5 italic"
                    >
                      {quizContext === "hrt"
                        ? "Looking for a man in your life? Switch"
                        : "Looking for a woman in your life? Switch"}
                    </button>
                  </div>
                )}
                <WhyWeAsk stepNum={2} />
              </div>
            )}

            {/* ============ STEP 3: GOALS ============ */}
            {step === 3 && (
              <div>
                <QuestionHeadline>
                  What are you most{" "}
                  <span className="italic text-halo-charcoal/70">looking to improve?</span>
                </QuestionHeadline>
                <QuestionSub>Select up to three.</QuestionSub>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {goalOptions.map((goal) => {
                    const selected = goals.includes(goal);
                    const disabled = !selected && goals.length >= 3;
                    return (
                      <CheckOption
                        key={goal}
                        label={goal}
                        selected={selected}
                        onClick={() => toggleGoal(goal)}
                        disabled={disabled}
                        accentColor={personaColor}
                      />
                    );
                  })}
                </div>
                {goals.length >= 1 && <ContinueButton onClick={goNext} />}
                <WhyWeAsk stepNum={3} />
              </div>
            )}

            {/* ============ STEP 4: SYMPTOMS ============ */}
            {step === 4 && (
              <div>
                <QuestionHeadline>
                  Which of these{" "}
                  <span className="italic text-halo-charcoal/70">do you experience?</span>
                </QuestionHeadline>
                <QuestionSub>Select all that apply. Skip if none.</QuestionSub>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {derivedSymptoms.map((symptom) => (
                    <CheckOption
                      key={symptom}
                      label={symptom}
                      selected={symptoms.includes(symptom)}
                      onClick={() => toggleSymptom(symptom)}
                      accentColor={personaColor}
                    />
                  ))}
                </div>
                <ContinueButton onClick={goNext} />
                <WhyWeAsk stepNum={4} />
              </div>
            )}

            {/* ============ STEP 5: SCIENCE GATE ============
                Integrated editorial frame — photo + chart + stat + headline
                all in one composition.
            ============================================== */}
            {step === 5 && (
              <div className="w-full max-w-3xl mx-auto">
                {/* Integrated frame */}
                <div
                  className="relative overflow-hidden rounded-[20px] border border-halo-charcoal/[0.08] bg-white shadow-[0_10px_40px_-20px_rgba(0,0,0,0.1)] mb-8 md:mb-10"
                >
                  {/* Tiny top caption */}
                  <div className="absolute top-4 left-5 md:left-6 z-20">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.25em]"
                      style={{ color: personaColor }}
                    >
                      Before we go further
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[42%_58%]">
                    {/* LEFT: Portrait — gendered background + image */}
                    <div
                      className="relative aspect-[4/5] md:aspect-auto md:min-h-[380px] overflow-hidden"
                      style={{
                        background:
                          gender === "Man"
                            ? `
                              radial-gradient(ellipse 80% 55% at 50% 10%, rgba(220, 230, 240, 0.85) 0%, transparent 60%),
                              radial-gradient(ellipse 60% 40% at 30% 80%, ${personaColor}30 0%, transparent 55%),
                              linear-gradient(165deg, #EDF3FA 0%, #C9D9EB 50%, #8BA8C8 100%)
                            `
                            : `
                              radial-gradient(ellipse 80% 55% at 50% 10%, rgba(255, 220, 195, 0.85) 0%, transparent 60%),
                              radial-gradient(ellipse 60% 40% at 30% 80%, ${personaColor}30 0%, transparent 55%),
                              linear-gradient(165deg, #FBEDDE 0%, #ECC4A6 50%, #B87960 100%)
                            `,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          gender === "Man"
                            ? "/trt/hero-portrait.png"
                            : "/hrt/gate-portrait.png"
                        }
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>

                    {/* RIGHT: Chart + Headline + Stat, vertically composed */}
                    <div className="flex flex-col justify-center p-6 md:p-7 lg:p-8 gap-5 md:gap-6">
                      {/* Hormone chart — compact */}
                      <div className="w-full">
                        <HormoneBalanceChart
                          compact
                          hormones={
                            gender === "Man"
                              ? [
                                  { name: "Testosterone", color: personaColor },
                                  { name: "Cortisol", color: "#8C7E6E" },
                                ]
                              : [
                                  { name: "Estradiol", color: personaColor },
                                  { name: "Progesterone", color: "#B87060" },
                                ]
                          }
                        />
                      </div>

                      {/* Headline */}
                      <h1 className="font-serif text-[22px] md:text-[26px] lg:text-[30px] text-halo-charcoal leading-[1.1] tracking-tight">
                        It&rsquo;s not the{" "}
                        <span className="italic" style={{ color: personaColor }}>
                          decline
                        </span>
                        .
                        <br />
                        It&rsquo;s the{" "}
                        <span className="italic" style={{ color: personaColor }}>
                          disruption
                        </span>
                        .
                      </h1>

                      {/* Speed-to-care — two columns */}
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div
                            className="font-serif text-[32px] md:text-[38px] lg:text-[44px] font-light leading-none tracking-tight mb-2"
                            style={{ color: personaColor }}
                          >
                            3 DAYS
                          </div>
                          <div
                            className="w-8 h-px mb-2"
                            style={{ background: personaColor, opacity: 0.4 }}
                            aria-hidden="true"
                          />
                          <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-halo-charcoal/55 leading-snug">
                            to see your<br />physician
                          </p>
                        </div>
                        <div>
                          <div
                            className="font-serif text-[32px] md:text-[38px] lg:text-[44px] font-light leading-none tracking-tight mb-2"
                            style={{ color: personaColor }}
                          >
                            7 DAYS
                          </div>
                          <div
                            className="w-8 h-px mb-2"
                            style={{ background: personaColor, opacity: 0.4 }}
                            aria-hidden="true"
                          />
                          <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-halo-charcoal/55 leading-snug">
                            to your<br />medication
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body text below the frame */}
                <p className="text-[14px] md:text-[15px] text-halo-charcoal/65 text-center leading-relaxed mb-5 max-w-md mx-auto">
                  When hormones fall out of sync, everything they govern
                  &mdash; sleep, mood, energy, cognition &mdash; falls with
                  them.
                </p>

                {/* Credibility line */}
                <p className="text-center text-[12px] text-halo-charcoal/55 italic mb-2">
                  Protocols built by board-certified hormone specialists.
                </p>

                {/* Source footnote */}
                <p className="text-center text-[10px] text-halo-charcoal/35 italic mb-8">
                  Based on clinical trials of bioidentical hormone therapy.
                </p>

                {/* Continue */}
                <div className="text-center">
                  <ContinueButton
                    onClick={() => {
                      track("quiz_gate_continue", {
                        gate: "science_hormones",
                        context: quizContext,
                      });
                      goNext();
                    }}
                    label="Continue"
                  />
                </div>
              </div>
            )}

            {/* ============ STEP 6: MEDICATIONS ============ */}
            {step === 6 && (
              <div>
                <QuestionHeadline>
                  Are you currently{" "}
                  <span className="italic text-halo-charcoal/70">
                    taking any medications?
                  </span>
                </QuestionHeadline>
                <QuestionSub>
                  Including prescriptions, supplements, and hormones.
                </QuestionSub>
                <div className="flex flex-col gap-2.5">
                  <PillOption
                    label="Yes"
                    selected={takingMedications === "Yes"}
                    onClick={() => setTakingMedications("Yes")}
                    accentColor={personaColor}
                  />
                  <PillOption
                    label="No"
                    selected={takingMedications === "No"}
                    onClick={() => {
                      setTakingMedications("No");
                      setMedicationDetails("");
                      setTimeout(() => goTo(7, "forward"), 300);
                    }}
                    accentColor={personaColor}
                  />
                </div>
                {takingMedications === "Yes" && (
                  <div className="mt-5">
                    <textarea
                      value={medicationDetails}
                      onChange={(e) => setMedicationDetails(e.target.value)}
                      placeholder="List your current medications, supplements, or hormones..."
                      rows={3}
                      className="w-full rounded-2xl bg-white border border-halo-charcoal/[0.08] text-halo-charcoal text-[14px] px-5 py-4 placeholder:text-halo-charcoal/35 outline-none transition-all resize-none"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = personaColor;
                        e.currentTarget.style.boxShadow = `0 4px 20px ${personaColor}26`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "";
                        e.currentTarget.style.boxShadow = "";
                      }}
                    />
                    <ContinueButton onClick={goNext} />
                  </div>
                )}
                <WhyWeAsk stepNum={6} />
              </div>
            )}

            {/* ============ STEP 7: SAFETY ============ */}
            {step === 7 && (
              <div>
                <QuestionHeadline>
                  Do any of these{" "}
                  <span className="italic text-halo-charcoal/70">apply to you?</span>
                </QuestionHeadline>
                <QuestionSub>
                  Select all that apply. These don&rsquo;t disqualify you — they help
                  your physician prepare.
                </QuestionSub>
                <div className="flex flex-col gap-2.5">
                  {safetyOptions.map((item) => (
                    <CheckOption
                      key={item}
                      label={item}
                      selected={safetyItems.includes(item)}
                      onClick={() => toggleSafety(item)}
                      accentColor={personaColor}
                    />
                  ))}
                </div>
                <ContinueButton
                  onClick={() => goTo(8, "forward")}
                  label="See my results"
                  disabled={safetyItems.length === 0}
                />
                <WhyWeAsk stepNum={7} />
              </div>
            )}

            {/* ============ STEP 8: LOADING ============ */}
            {step === 8 && (
              <div className="text-center flex flex-col items-center justify-center py-12">
                <div
                  className="relative w-20 h-20 mb-10"
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-0 rounded-full border-[1.5px]"
                    style={{
                      animation: "quiz-spin 2.4s linear infinite",
                      borderColor: `${personaColor}99`,
                      borderTopColor: "transparent",
                      borderRightColor: "transparent",
                    }}
                  />
                  <div
                    className="absolute inset-2 rounded-full border-[1.5px]"
                    style={{
                      animation: "quiz-spin 3.6s linear infinite reverse",
                      borderColor: `${personaColor}4D`,
                      borderBottomColor: "transparent",
                      borderLeftColor: "transparent",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: personaColor }}
                    />
                  </div>
                </div>
                <p className="font-serif text-2xl md:text-[28px] text-halo-charcoal mb-3 italic">
                  Building your recommendation&hellip;
                </p>
                {/* Credibility anchor — reinforces trust during the wait */}
                <div className="flex flex-col items-center gap-3 mt-2 max-w-xs">
                  <p className="text-[12px] text-halo-charcoal/55 leading-relaxed text-center">
                    Reviewed against Halo&rsquo;s protocol standards &mdash;
                    designed by board-certified hormone specialists.
                  </p>
                  <div className="w-8 h-px bg-halo-charcoal/15" />
                  <p className="text-[11px] text-halo-charcoal/40">
                    647 founding members and counting
                  </p>
                </div>
              </div>
            )}

            {/* ============ STEP 9: LEAD CAPTURE ============ */}
            {/*
              The funnel deliberately hides the recommendation cards at this
              step. The stack builder (/stack) IS the reveal — we don't want
              the user to see the protocol preview and bounce before their
              contact info is captured. Submit → router.push('/stack') below.
            */}
            {step === 9 && (
              <div className="w-full max-w-lg mx-auto">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.28em] text-center mb-4"
                  style={{ color: personaColor }}
                >
                  Your protocol is ready
                </p>
                <h1 className="font-serif text-[30px] md:text-[38px] leading-[1.1] text-halo-charcoal tracking-tight mb-3 text-center">
                  Let&rsquo;s line up{" "}
                  <span className="italic text-halo-charcoal/70">your protocol.</span>
                </h1>
                <p className="text-[14px] md:text-[15px] text-halo-charcoal/55 mb-8 text-center leading-relaxed">
                  Enter your email to unlock your recommendation and lock in
                  your founding rate. 999 spots. Reduced pricing for life.
                </p>

                {/* Contraindication notice — lightweight, no "consultation" framing */}
                {hasContraindications && (
                  <div className="mb-6 p-5 rounded-2xl border border-[#C8A96E]/40 bg-[#FEF8E9]">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[#9C7F3E] mb-2">
                      Physician review
                    </p>
                    <p className="text-[14px] text-halo-charcoal/70 leading-relaxed">
                      You flagged a condition that warrants careful review.
                      Your clinician will tailor any protocol to your history
                      at intake. Nothing you see next is a prescription — it&rsquo;s
                      a starting point for the conversation.
                    </p>
                  </div>
                )}

                <FoundingCircleForm
                  variant="light"
                  onSubmitted={({ email, phone }) => {
                    // Fire a separate "Completed Homepage Intake" event
                    // carrying the full quiz answers. The founding-circle
                    // signup is its own event; this is the intake record
                    // physicians/marketing can segment on.
                    const stackSlug = primaryRecToStackSlug(primaryRec);
                    void submitQuiz({
                      quiz: "homepage",
                      contact: { email, phone },
                      answers: {
                        gender,
                        age,
                        goals,
                        symptoms,
                        taking_medications: takingMedications,
                        medication_details: medicationDetails || undefined,
                        quiz_context: quizContext,
                      },
                      derived: {
                        // Stamp the canonical Program slug for Klaviyo
                        // segmentation ("halo_primary_program").
                        primary_program: (stackSlug as
                          | "hrt"
                          | "trt"
                          | "peptides"
                          | "nad"
                          | "weight_loss"
                          | "sexual_wellness"
                          | undefined) ?? undefined,
                      },
                    });

                    // Forward the user into the stack builder so the
                    // funnel terminates there: quiz → lead capture → stack.
                    // Preserve the primary recommendation as ?primary so
                    // the card grid highlights it and orders it first.
                    const params = new URLSearchParams();
                    params.set("from", "homepage");
                    if (stackSlug) params.set("primary", stackSlug);
                    if (gender === "Woman") params.set("gender", "female");
                    else if (gender === "Man") params.set("gender", "male");
                    router.push(`/stack?${params.toString()}`);
                  }}
                />

                <p className="text-[11px] text-halo-charcoal/40 text-center mt-6 leading-relaxed">
                  No charges now. Your clinician reviews every intake and
                  designs your protocol around your labs and goals.
                </p>
              </div>
            )}

          </div>
        </main>

        {/* Spinning keyframe for loading screen */}
        <style jsx>{`
          @keyframes quiz-spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F3ECE0] flex items-center justify-center">
          <div className="text-halo-charcoal/40 text-sm tracking-[0.2em] uppercase">
            Loading&hellip;
          </div>
        </div>
      }
    >
      <QuizPageInner />
    </Suspense>
  );
}
