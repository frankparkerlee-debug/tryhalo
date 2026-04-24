/**
 * Full clinical intake quizzes — 5 program-specific config-driven quizzes
 * that replace the legacy homepage router as the default top-of-funnel
 * path when a user arrives from a product page.
 *
 * Funnel:
 *   Product page CTA  →  /quiz/[slug]  →  Lead capture  →  /stack
 *
 * Design principles (per Halo clinical team):
 *   - SOFT qualification. Never reject — every tier ends on /stack with a
 *     recommendation. Clinician refines at the async/sync MD visit.
 *   - Make the patient comfortable and confident. No scary warnings, no
 *     "you don't qualify" — everything is framed as "your physician will
 *     confirm this with you."
 *   - Collect the minimum viable signal to (a) segment in Klaviyo and
 *     (b) show the clinician who's coming before they open the chart.
 *
 * Tier assignment (universal across quizzes):
 *   strong            → no red flags, strong symptom signal. Klaviyo "hot."
 *   soft              → mild/exploratory signal. Klaviyo "nurture."
 *   medical_review    → any contraindication flag. Shown as "a Halo clinician
 *                       will review your intake before any protocol is
 *                       issued." Reassuring, NOT a rejection.
 *   better_elsewhere  → only when user explicitly picks a disqualifier that
 *                       makes the program inappropriate (e.g. pregnant for
 *                       weight-loss, prostate cancer history for TRT).
 *                       Lands them on /stack with a soft explainer.
 */

import type { QuizDerived, Program, Tier } from "./quiz-submission";

/* ──────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────── */

export type IntakeAnswer = string | string[] | number;
export type IntakeAnswers = Record<string, IntakeAnswer>;

export interface IntakeOption {
  /** Chip label shown to the user. */
  label: string;
  /** Wire value stamped into the answers payload. */
  value: string;
  /** Score contribution — higher = stronger clinical signal for the program. */
  score?: number;
  /** If set, picking this option triggers a tier escalation at scoring time. */
  flag?: "medical_review" | "better_elsewhere";
  /** Optional metadata for downstream calc (BMI bucket, dose band, etc). */
  meta?: Record<string, number | string>;
  /** Short disclosure shown under the chip. */
  note?: string;
}

export interface IntakeQuestion {
  /** Answer key used in the submission payload (snake_case). */
  id: string;
  /** Eyebrow label above the prompt (e.g. "Energy"). */
  label: string;
  /** Question prompt shown to the user. */
  prompt: string;
  /** Input type. "single" = one chip; "multi" = checkbox chips; "number" =
   *  numeric input (e.g. weight, height); "text" = short free text. */
  type: "single" | "multi" | "number" | "text";
  /** Required for single/multi. */
  options?: IntakeOption[];
  /** Placeholder for number/text inputs. */
  placeholder?: string;
  /** Numeric bounds for `number` input type. */
  min?: number;
  max?: number;
  /** Optional conditional visibility. Return false to skip this question. */
  showIf?: (answers: IntakeAnswers) => boolean;
  /** "Why we ask" disclosure copy. Shown on tap. */
  whyWeAsk?: string;
  /** Optional: this question is required. Default: true. */
  required?: boolean;
}

export interface IntakeConfig {
  /** Matches FULL_QUIZZES slug in quiz-submission.ts. */
  slug: "nad" | "trt" | "hrt" | "peptides" | "weight_loss";
  /** Program the quiz routes to on /stack. */
  primary: Program;
  /** Eyebrow label on the intro card. */
  eyebrow: string;
  /** Main headline — sets tone for the whole quiz. */
  headline: string;
  /** One-line subhead under the headline. */
  subhead: string;
  /** Copy for the intro-card CTA button. Default "Start assessment". */
  introCta?: string;
  /** Ordered question list. */
  questions: IntakeQuestion[];
  /** Compute tier from answers. */
  computeTier: (answers: IntakeAnswers) => Tier;
  /** Optional: extra derived fields stamped into Klaviyo (BMI, age band). */
  computeDerived?: (answers: IntakeAnswers) => Partial<QuizDerived>;
  /** Copy shown on the lead-capture step after all questions answered. */
  captureHeadline: string;
  /** Subhead on lead-capture step. */
  captureSubhead: string;
}

/* ──────────────────────────────────────────────────────────
   Shared option sets reused across quizzes
   ────────────────────────────────────────────────────────── */

const AGE_OPTIONS: IntakeOption[] = [
  { label: "Under 30", value: "under_30", meta: { age_mid: 27 } },
  { label: "30 – 39", value: "30_39", meta: { age_mid: 35 } },
  { label: "40 – 49", value: "40_49", meta: { age_mid: 45 } },
  { label: "50 – 59", value: "50_59", meta: { age_mid: 55 } },
  { label: "60+", value: "60_plus", meta: { age_mid: 65 } },
];

const READINESS_OPTIONS: IntakeOption[] = [
  {
    label: "Ready to start this month",
    value: "this_month",
    score: 3,
    note: "We'll fast-track your intake.",
  },
  {
    label: "Within the next 3 months",
    value: "within_3mo",
    score: 2,
  },
  {
    label: "Exploring — not sure yet",
    value: "exploring",
    score: 1,
    note: "No pressure. We'll help you learn.",
  },
];

const SEVERITY_OPTIONS: IntakeOption[] = [
  { label: "Mild — occasional", value: "mild", score: 1 },
  { label: "Moderate — most weeks", value: "moderate", score: 2 },
  { label: "Severe — daily", value: "severe", score: 3 },
];

const YES_NO_OPTIONS: IntakeOption[] = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

/* ──────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────── */

/**
 * Collect all IntakeOption objects actually picked across every single/multi
 * question in the given answers. Lets tier logic iterate over flags in one
 * pass without threading the config everywhere.
 */
function pickedOptions(
  config: IntakeConfig,
  answers: IntakeAnswers
): IntakeOption[] {
  const picked: IntakeOption[] = [];
  for (const q of config.questions) {
    if (q.type !== "single" && q.type !== "multi") continue;
    if (!q.options) continue;
    const raw = answers[q.id];
    const values = Array.isArray(raw)
      ? raw
      : typeof raw === "string"
        ? [raw]
        : [];
    for (const v of values) {
      const opt = q.options.find((o) => o.value === v);
      if (opt) picked.push(opt);
    }
  }
  return picked;
}

/**
 * Sum the `score` across picked options. Used by severity-driven tier logic.
 */
function totalScore(config: IntakeConfig, answers: IntakeAnswers): number {
  return pickedOptions(config, answers).reduce(
    (sum, o) => sum + (o.score ?? 0),
    0
  );
}

/**
 * Universal tier helper — every quiz uses this. Checks hard flags first
 * (medical_review wins over better_elsewhere), then buckets by score.
 */
function tierFromFlagsAndScore(
  config: IntakeConfig,
  answers: IntakeAnswers,
  thresholds: { strong: number }
): Tier {
  const picked = pickedOptions(config, answers);
  if (picked.some((o) => o.flag === "medical_review")) {
    return "medical_review";
  }
  if (picked.some((o) => o.flag === "better_elsewhere")) {
    return "better_elsewhere";
  }
  const score = picked.reduce((sum, o) => sum + (o.score ?? 0), 0);
  return score >= thresholds.strong ? "strong" : "soft";
}

/* ──────────────────────────────────────────────────────────
   TRT — Testosterone Replacement
   ────────────────────────────────────────────────────────── */

const trtConfig: IntakeConfig = {
  slug: "trt",
  primary: "trt",
  eyebrow: "Testosterone Assessment",
  headline: "Let's get a read on your baseline.",
  subhead:
    "Seven quick questions. A Halo physician will build your protocol from here.",
  introCta: "Start assessment",
  captureHeadline: "Your testosterone protocol is ready.",
  captureSubhead:
    "Enter your email to lock in founding pricing and see your plan. A clinician reviews every intake.",
  questions: [
    {
      id: "age",
      label: "About you",
      prompt: "How old are you?",
      type: "single",
      options: AGE_OPTIONS,
      whyWeAsk:
        "Testosterone ranges shift by decade. This helps the physician anchor your expected baseline.",
    },
    {
      id: "primary_symptom",
      label: "What brings you here",
      prompt: "What's the biggest thing you'd like to change?",
      type: "single",
      options: [
        { label: "Low energy / fatigue", value: "energy", score: 2 },
        { label: "Low libido / sexual function", value: "libido", score: 3 },
        { label: "Strength and muscle loss", value: "strength", score: 2 },
        { label: "Mood or motivation", value: "mood", score: 2 },
        { label: "Just want to optimize", value: "optimize", score: 1 },
      ],
    },
    {
      id: "symptom_severity",
      label: "How often",
      prompt: "How often does this show up?",
      type: "single",
      options: SEVERITY_OPTIONS,
    },
    {
      id: "duration",
      label: "How long",
      prompt: "How long have you felt this way?",
      type: "single",
      options: [
        { label: "A few months", value: "months", score: 1 },
        { label: "About a year", value: "year", score: 2 },
        { label: "Several years", value: "years", score: 3 },
      ],
    },
    {
      id: "contraindications",
      label: "Safety check",
      prompt: "Any of the following apply?",
      type: "multi",
      options: [
        {
          label: "Prostate cancer history",
          value: "prostate_cancer",
          flag: "better_elsewhere",
        },
        {
          label: "Breast cancer history",
          value: "breast_cancer",
          flag: "better_elsewhere",
        },
        {
          label: "Severe sleep apnea (untreated)",
          value: "sleep_apnea",
          flag: "medical_review",
        },
        {
          label: "Heart attack or stroke in last 6 months",
          value: "cardiac",
          flag: "medical_review",
        },
        {
          label: "Planning to father a child in the next 12 months",
          value: "fertility_plan",
          flag: "medical_review",
          note: "TRT can suppress fertility — we may suggest an alternative path.",
        },
        { label: "None of these", value: "none", score: 1 },
      ],
      whyWeAsk:
        "Some conditions make testosterone therapy inappropriate or need closer physician oversight. Nothing disqualifies you from care — it just shapes the conversation.",
    },
    {
      id: "prior_experience",
      label: "History",
      prompt: "Have you tried testosterone therapy before?",
      type: "single",
      options: [
        { label: "No, new to this", value: "new", score: 1 },
        {
          label: "Yes, currently on it (want to switch)",
          value: "current",
          score: 2,
        },
        { label: "Yes, in the past", value: "past", score: 2 },
      ],
    },
    {
      id: "readiness",
      label: "Timing",
      prompt: "When are you looking to get started?",
      type: "single",
      options: READINESS_OPTIONS,
    },
  ],
  computeTier: (answers) => tierFromFlagsAndScore(trtConfig, answers, { strong: 10 }),
  computeDerived: (answers) => {
    const picked = pickedOptions(trtConfig, answers);
    const primaryDriver =
      typeof answers.primary_symptom === "string"
        ? answers.primary_symptom
        : undefined;
    return {
      symptom_score: picked.reduce((s, o) => s + (o.score ?? 0), 0),
      primary_driver: primaryDriver,
    };
  },
};

/* ──────────────────────────────────────────────────────────
   HRT — Hormone Replacement (Women)
   ────────────────────────────────────────────────────────── */

const hrtConfig: IntakeConfig = {
  slug: "hrt",
  primary: "hrt",
  eyebrow: "Hormone Assessment",
  headline: "Let's find what your body needs.",
  subhead:
    "Eight quick questions. A Halo physician will tailor your protocol from here.",
  introCta: "Start assessment",
  captureHeadline: "Your hormone protocol is ready.",
  captureSubhead:
    "Enter your email to lock in founding pricing. A clinician reviews every intake.",
  questions: [
    {
      id: "age",
      label: "About you",
      prompt: "How old are you?",
      type: "single",
      options: AGE_OPTIONS,
    },
    {
      id: "cycle_status",
      label: "Cycle",
      prompt: "Where are you in your cycle journey?",
      type: "single",
      options: [
        { label: "Regular cycles", value: "regular", score: 1 },
        {
          label: "Cycles are changing (perimenopause)",
          value: "peri",
          score: 3,
        },
        { label: "Cycles have stopped (menopause)", value: "meno", score: 3 },
        { label: "Post-hysterectomy", value: "post_hyst", score: 2 },
        { label: "Not sure", value: "unsure", score: 1 },
      ],
      whyWeAsk:
        "Your cycle state shapes whether we'd prioritize estrogen, progesterone, testosterone, or a combination.",
    },
    {
      id: "primary_symptom",
      label: "What brings you here",
      prompt: "What's the biggest thing you'd like to change?",
      type: "single",
      options: [
        { label: "Hot flashes / night sweats", value: "vasomotor", score: 3 },
        { label: "Sleep disruption", value: "sleep", score: 2 },
        { label: "Mood / anxiety / irritability", value: "mood", score: 2 },
        { label: "Low libido / sexual function", value: "libido", score: 2 },
        { label: "Brain fog / memory", value: "cognitive", score: 2 },
        { label: "Weight gain / metabolism", value: "weight", score: 1 },
      ],
    },
    {
      id: "symptom_severity",
      label: "How often",
      prompt: "How often does this show up?",
      type: "single",
      options: SEVERITY_OPTIONS,
    },
    {
      id: "contraindications",
      label: "Safety check",
      prompt: "Any of the following apply?",
      type: "multi",
      options: [
        {
          label: "Breast cancer history",
          value: "breast_cancer",
          flag: "better_elsewhere",
        },
        {
          label: "Blood clot / DVT / stroke history",
          value: "clot_history",
          flag: "medical_review",
        },
        {
          label: "Unexplained vaginal bleeding",
          value: "bleeding",
          flag: "medical_review",
        },
        { label: "Liver disease", value: "liver", flag: "medical_review" },
        {
          label: "Currently pregnant or breastfeeding",
          value: "pregnant",
          flag: "better_elsewhere",
        },
        { label: "None of these", value: "none", score: 1 },
      ],
      whyWeAsk:
        "Certain histories require a different protocol or a specialist referral. A Halo clinician reviews every intake before any prescription is issued.",
    },
    {
      id: "current_hrt",
      label: "History",
      prompt: "Are you currently on any hormone therapy?",
      type: "single",
      options: [
        { label: "No", value: "no", score: 1 },
        {
          label: "Yes — and it's working",
          value: "yes_working",
          score: 1,
        },
        {
          label: "Yes — but want to switch or adjust",
          value: "yes_switch",
          score: 2,
        },
      ],
    },
  ],
  // Threshold lowered from 9 → 7 on 2026-04-22 when `lab_history` (max +2)
  // and `readiness` (max +3) questions were removed — preserves roughly the
  // same strong-tier pass rate against the new max total of 12 (vs prior 17).
  computeTier: (answers) => tierFromFlagsAndScore(hrtConfig, answers, { strong: 7 }),
  computeDerived: (answers) => {
    const primaryDriver =
      typeof answers.primary_symptom === "string"
        ? answers.primary_symptom
        : undefined;
    return {
      severity_score: totalScore(hrtConfig, answers),
      primary_driver: primaryDriver,
    };
  },
};

/* ──────────────────────────────────────────────────────────
   NAD+ Therapy
   ────────────────────────────────────────────────────────── */

const nadConfig: IntakeConfig = {
  slug: "nad",
  primary: "nad",
  eyebrow: "Cellular Health Assessment",
  headline: "Let's look at your cellular baseline.",
  subhead:
    "Six quick questions. Your Halo physician confirms dosing and delivery from here.",
  introCta: "Start assessment",
  captureHeadline: "Your NAD+ protocol is ready.",
  captureSubhead:
    "Enter your email to lock in founding pricing. A clinician reviews every intake.",
  questions: [
    {
      id: "age",
      label: "About you",
      prompt: "How old are you?",
      type: "single",
      options: AGE_OPTIONS,
    },
    {
      id: "primary_goal",
      label: "What brings you here",
      prompt: "What are you most hoping NAD+ will help with?",
      type: "single",
      options: [
        { label: "Daily energy", value: "energy", score: 2 },
        { label: "Mental clarity / focus", value: "clarity", score: 2 },
        { label: "Post-workout recovery", value: "recovery", score: 2 },
        { label: "Healthy aging / longevity", value: "longevity", score: 2 },
        {
          label: "Bounce back from a demanding stretch",
          value: "burnout",
          score: 3,
        },
      ],
    },
    {
      id: "drag_severity",
      label: "Day-to-day",
      prompt: "How often do you feel drained by mid-afternoon?",
      type: "single",
      options: SEVERITY_OPTIONS,
    },
    {
      id: "lifestyle",
      label: "Lifestyle",
      prompt: "Which of these describe the last six months?",
      type: "multi",
      options: [
        { label: "Heavy travel / jet lag", value: "travel", score: 1 },
        { label: "High alcohol intake", value: "alcohol", score: 2 },
        { label: "Poor sleep", value: "sleep", score: 1 },
        { label: "Intense training / competition", value: "training", score: 1 },
        { label: "Recent illness or procedure", value: "illness", score: 2 },
        { label: "None of the above", value: "none" },
      ],
      whyWeAsk:
        "NAD+ turnover accelerates under physical stress — these help the physician calibrate your starting dose.",
    },
    {
      id: "contraindications",
      label: "Safety check",
      prompt: "Any of the following apply?",
      type: "multi",
      options: [
        {
          label: "Active cancer treatment",
          value: "cancer",
          flag: "medical_review",
        },
        {
          label: "Severe kidney or liver disease",
          value: "organ",
          flag: "medical_review",
        },
        {
          label: "Currently pregnant or breastfeeding",
          value: "pregnant",
          flag: "better_elsewhere",
        },
        { label: "None of these", value: "none", score: 1 },
      ],
    },
    {
      id: "readiness",
      label: "Timing",
      prompt: "When are you looking to get started?",
      type: "single",
      options: READINESS_OPTIONS,
    },
  ],
  computeTier: (answers) => tierFromFlagsAndScore(nadConfig, answers, { strong: 7 }),
  computeDerived: (answers) => ({
    symptom_score: totalScore(nadConfig, answers),
    primary_driver:
      typeof answers.primary_goal === "string"
        ? answers.primary_goal
        : undefined,
  }),
};

/* ──────────────────────────────────────────────────────────
   Peptides
   ────────────────────────────────────────────────────────── */

const peptidesConfig: IntakeConfig = {
  slug: "peptides",
  primary: "peptides",
  eyebrow: "Peptide Assessment",
  headline: "Let's see which peptide stack fits.",
  subhead:
    "Six quick questions. Your Halo physician selects between Sermorelin and the B12/Glut/Lipo-C stack from here.",
  introCta: "Start assessment",
  captureHeadline: "Your peptide protocol is ready.",
  captureSubhead:
    "Enter your email to lock in founding pricing. A clinician reviews every intake.",
  questions: [
    {
      id: "age",
      label: "About you",
      prompt: "How old are you?",
      type: "single",
      options: AGE_OPTIONS,
    },
    {
      id: "primary_goal",
      label: "What brings you here",
      prompt: "What's the top thing you're targeting?",
      type: "single",
      options: [
        { label: "Faster workout recovery", value: "recovery", score: 2 },
        { label: "Lean mass / body composition", value: "body_comp", score: 2 },
        { label: "Deeper sleep", value: "sleep", score: 2 },
        { label: "Skin, hair, aging", value: "aesthetics", score: 1 },
        {
          label: "Metabolic / fat loss support",
          value: "metabolic",
          score: 2,
          meta: { prefer_stack: "b12_stack" },
        },
      ],
      whyWeAsk:
        "Sermorelin drives recovery and GH-adjacent benefits. B12/Glutathione/Lipo-C is our metabolic stack. Your answers point the physician to the right one.",
    },
    {
      id: "training_volume",
      label: "Activity",
      prompt: "How often do you train hard?",
      type: "single",
      options: [
        { label: "5+ days a week", value: "heavy", score: 2 },
        { label: "3-4 days a week", value: "moderate", score: 1 },
        { label: "1-2 days a week", value: "light", score: 1 },
        { label: "Not regularly", value: "none" },
      ],
    },
    {
      id: "sleep_quality",
      label: "Sleep",
      prompt: "How would you describe your sleep?",
      type: "single",
      options: [
        { label: "Restorative — I wake refreshed", value: "good" },
        { label: "Adequate — could be deeper", value: "okay", score: 1 },
        { label: "Poor — I wake tired", value: "poor", score: 2 },
      ],
    },
    {
      id: "contraindications",
      label: "Safety check",
      prompt: "Any of the following apply?",
      type: "multi",
      options: [
        {
          label: "Active cancer or recent cancer treatment",
          value: "cancer",
          flag: "medical_review",
        },
        {
          label: "Severe diabetes (uncontrolled)",
          value: "diabetes",
          flag: "medical_review",
        },
        {
          label: "Currently pregnant or breastfeeding",
          value: "pregnant",
          flag: "better_elsewhere",
        },
        { label: "None of these", value: "none", score: 1 },
      ],
    },
    {
      id: "readiness",
      label: "Timing",
      prompt: "When are you looking to get started?",
      type: "single",
      options: READINESS_OPTIONS,
    },
  ],
  computeTier: (answers) =>
    tierFromFlagsAndScore(peptidesConfig, answers, { strong: 7 }),
  computeDerived: (answers) => ({
    recovery_quotient: totalScore(peptidesConfig, answers),
    primary_driver:
      typeof answers.primary_goal === "string"
        ? answers.primary_goal
        : undefined,
  }),
};

/* ──────────────────────────────────────────────────────────
   Weight Loss (GLP-1)
   ────────────────────────────────────────────────────────── */

const weightLossConfig: IntakeConfig = {
  slug: "weight_loss",
  primary: "weight_loss",
  eyebrow: "Weight Loss Assessment",
  headline: "Let's see if GLP-1 is the right path.",
  subhead:
    "Eight quick questions. Your Halo physician selects between compounded and branded GLP-1 from here.",
  introCta: "Start assessment",
  captureHeadline: "Your weight-loss protocol is ready.",
  captureSubhead:
    "Enter your email to lock in founding pricing and see your plan. A clinician reviews every intake — many patients qualify for our Care Coach add-on.",
  questions: [
    {
      id: "age",
      label: "About you",
      prompt: "How old are you?",
      type: "single",
      options: AGE_OPTIONS,
    },
    {
      id: "height_in",
      label: "Height",
      prompt: "Your height (inches — 5'10\" = 70)",
      type: "number",
      placeholder: "70",
      min: 48,
      max: 84,
      whyWeAsk:
        "Height plus weight gives us your BMI, which shapes the physician's dosing plan.",
    },
    {
      id: "weight_lbs",
      label: "Weight",
      prompt: "Your current weight (pounds)",
      type: "number",
      placeholder: "180",
      min: 80,
      max: 600,
    },
    {
      id: "weight_goal",
      label: "Goal",
      prompt: "How much weight would you like to lose?",
      type: "single",
      options: [
        { label: "Under 15 lbs", value: "under_15", score: 1 },
        { label: "15 – 30 lbs", value: "15_30", score: 2 },
        { label: "30 – 50 lbs", value: "30_50", score: 3 },
        { label: "50+ lbs", value: "50_plus", score: 3 },
      ],
    },
    {
      id: "previous_glp1",
      label: "History",
      prompt: "Have you tried GLP-1 medication before?",
      type: "single",
      options: [
        { label: "No, new to GLP-1", value: "no", score: 1 },
        {
          label: "Yes, currently on it (want to continue)",
          value: "current",
          score: 2,
        },
        {
          label: "Yes, in the past — stopped and want to restart",
          value: "past",
          score: 2,
        },
      ],
    },
    {
      id: "metabolic_history",
      label: "Health history",
      prompt: "Any of the following apply?",
      type: "multi",
      options: [
        { label: "Type 2 diabetes", value: "t2d", score: 2 },
        {
          label: "Pre-diabetes / insulin resistance",
          value: "prediabetes",
          score: 1,
        },
        {
          label: "PCOS",
          value: "pcos",
          score: 1,
        },
        { label: "None of these", value: "none" },
      ],
      whyWeAsk:
        "Metabolic history helps the physician calibrate dose and track how you respond.",
    },
    {
      id: "contraindications",
      label: "Safety check",
      prompt: "Any of the following apply?",
      type: "multi",
      options: [
        {
          label: "Personal or family history of medullary thyroid cancer",
          value: "mtc",
          flag: "better_elsewhere",
        },
        {
          label: "MEN 2 (multiple endocrine neoplasia)",
          value: "men2",
          flag: "better_elsewhere",
        },
        {
          label: "Currently pregnant or trying to conceive",
          value: "pregnant",
          flag: "better_elsewhere",
        },
        {
          label: "History of pancreatitis",
          value: "pancreatitis",
          flag: "medical_review",
        },
        {
          label: "Severe gastroparesis",
          value: "gastroparesis",
          flag: "medical_review",
        },
        {
          label: "Active eating disorder",
          value: "eating_disorder",
          flag: "medical_review",
        },
        { label: "None of these", value: "none", score: 1 },
      ],
    },
    {
      id: "readiness",
      label: "Timing",
      prompt: "When are you looking to get started?",
      type: "single",
      options: READINESS_OPTIONS,
    },
  ],
  computeTier: (answers) => {
    // BMI gate — soft. Under 27 with no metabolic comorbidity → better_elsewhere
    // (GLP-1 off-label for low BMI without diabetes/PCOS).
    const height = Number(answers.height_in);
    const weight = Number(answers.weight_lbs);
    const bmi =
      isFinite(height) && isFinite(weight) && height > 0
        ? (weight / (height * height)) * 703
        : null;

    const baseTier = tierFromFlagsAndScore(weightLossConfig, answers, {
      strong: 8,
    });
    if (baseTier === "medical_review" || baseTier === "better_elsewhere") {
      return baseTier;
    }

    const metabolic = answers.metabolic_history;
    const hasMetabolic = Array.isArray(metabolic)
      ? metabolic.some((v) => v !== "none")
      : typeof metabolic === "string" && metabolic !== "none";

    if (bmi !== null && bmi < 27 && !hasMetabolic) {
      return "better_elsewhere";
    }
    return baseTier;
  },
  computeDerived: (answers) => {
    const height = Number(answers.height_in);
    const weight = Number(answers.weight_lbs);
    const bmi =
      isFinite(height) && isFinite(weight) && height > 0
        ? Math.round(((weight / (height * height)) * 703) * 10) / 10
        : undefined;
    const goal =
      typeof answers.weight_goal === "string" ? answers.weight_goal : undefined;
    return {
      bmi,
      primary_driver: goal,
      symptom_score: totalScore(weightLossConfig, answers),
    };
  },
};

/* ──────────────────────────────────────────────────────────
   Registry
   ────────────────────────────────────────────────────────── */

export const INTAKE_QUIZZES: Record<IntakeConfig["slug"], IntakeConfig> = {
  trt: trtConfig,
  hrt: hrtConfig,
  nad: nadConfig,
  peptides: peptidesConfig,
  weight_loss: weightLossConfig,
};

export const INTAKE_QUIZ_SLUGS = Object.keys(
  INTAKE_QUIZZES
) as IntakeConfig["slug"][];

export function getIntakeConfig(slug: string): IntakeConfig | null {
  return (INTAKE_QUIZZES as Record<string, IntakeConfig>)[slug] ?? null;
}
