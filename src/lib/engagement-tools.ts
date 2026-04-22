/**
 * Engagement tool configs — the 5 short self-assessment widgets that live
 * on each product page as top-of-funnel hooks.
 *
 * Each config describes:
 *   - 3-4 single-select chip questions (identical UX across all tools)
 *   - A scoring function that reduces answers to a numeric result
 *   - A result shape: big primary number + context line + derived fields
 *     stamped into the `derived` payload of the Klaviyo event
 *
 * Why config instead of 5 bespoke components:
 *   The tools exist to acquire email, not to diagnose. They share question
 *   cadence (3-4 chip questions), reveal shape (big number + context),
 *   and capture gate. Keeping them config-driven means copy/scoring tweaks
 *   happen in one place — marketing doesn't need an engineering PR per tool.
 *
 * Note on numeric inputs: the full clinical quizzes collect real height/weight
 * values. Engagement tools use range chips so every tool shares the same
 * chip-only interaction pattern. The result is directional ("most patients
 * in your range see…"), not prescriptive.
 */

import type { QuizDerived, QuizType, Program } from "./quiz-submission";

/* ──────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────── */

export interface EngagementOption {
  /** Chip label shown to the user. */
  label: string;
  /** Wire value stamped into the answers payload. */
  value: string;
  /** Score contribution — lower is typically "better" (less drag, less severity). */
  score: number;
  /** Optional extra data for result math (e.g. weight midpoint in lbs). */
  meta?: Record<string, number>;
}

export interface EngagementQuestion {
  /** Answer key used in the submission payload (snake_case). */
  id: string;
  /** Section label above the prompt (e.g. "Energy"). */
  label: string;
  /** Question prompt shown to the user. */
  prompt: string;
  options: EngagementOption[];
}

export interface EngagementResult {
  /** Big headline value shown in the reveal step (e.g. "44", "moderate"). */
  primary: string;
  /** Qualifier under the primary (e.g. "cellular age vs. chronological 38"). */
  context: string;
  /** Short paragraph or secondary framing shown in the reveal card. */
  explainer: string;
  /**
   * Stamped into the Klaviyo event and profile. These feed segmentation
   * flows ("cellular_age_delta > 5") and the /stack primary ring.
   */
  derived: QuizDerived;
}

export interface EngagementConfig {
  /** Which KLAVIYO event this tool fires (must be an ENGAGEMENT_QUIZZES slug). */
  quiz: Extract<
    QuizType,
    | "cellular_age"
    | "weight_loss_projection"
    | "trt_drag"
    | "hrt_severity"
    | "peptides_recovery"
  >;
  /** Program the tool ultimately routes to on /stack. */
  primary: Program;
  /** Label shown above the widget (eyebrow). */
  eyebrow: string;
  /** Main headline for the widget's intro card. */
  headline: string;
  /** One-line subhead. */
  subhead: string;
  /** Copy on the start button ("Begin estimator", "See my drag score", etc.). */
  startLabel: string;
  /** Copy on the final submit that reveals results. */
  ctaLabel: string;
  /** Headline of the capture step (after questions, before reveal). */
  captureHeadline: string;
  /** Subhead of the capture step. */
  captureSubhead: string;
  /** Questions. */
  questions: EngagementQuestion[];
  /**
   * Compute the revealed result from the raw answer map. The function
   * receives `{ [question_id]: option_value }` and looks up scores via the
   * config's question definitions. Keeping this a pure function means
   * `derived` is deterministic for a given answer set — analytics can
   * reconstruct results from the event payload alone.
   */
  computeResult: (answers: Record<string, string>) => EngagementResult;
}

/* ──────────────────────────────────────────────────────────
   Shared scoring utility
   ────────────────────────────────────────────────────────── */

/**
 * Sum scores across a question set given the user's answer map.
 * Missing or unknown answers contribute 0.
 */
function sumScores(
  questions: EngagementQuestion[],
  answers: Record<string, string>
): number {
  let total = 0;
  for (const q of questions) {
    const chosen = q.options.find((o) => o.value === answers[q.id]);
    if (chosen) total += chosen.score;
  }
  return total;
}

/** Clamp n into [lo, hi]. */
function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/* ──────────────────────────────────────────────────────────
   1. Cellular Age Estimator  (/nad-therapy)
   ────────────────────────────────────────────────────────── */

const CELLULAR_AGE: EngagementConfig = {
  quiz: "cellular_age",
  primary: "nad",
  eyebrow: "Cellular Age Estimator",
  headline: "How old are your cells really?",
  subhead:
    "Four questions. We estimate how your cellular age compares to your chronological age, using the same signals physicians screen for.",
  startLabel: "Start estimator",
  ctaLabel: "See my cellular age",
  captureHeadline: "Your estimate is ready",
  captureSubhead: "Where should we send your full report?",
  questions: [
    {
      id: "age_band",
      label: "Age",
      prompt: "What's your age range?",
      options: [
        { label: "30–39", value: "30_39", score: 0, meta: { midpoint: 35 } },
        { label: "40–49", value: "40_49", score: 0, meta: { midpoint: 45 } },
        { label: "50–59", value: "50_59", score: 0, meta: { midpoint: 55 } },
        { label: "60+", value: "60_plus", score: 0, meta: { midpoint: 65 } },
      ],
    },
    {
      id: "energy",
      label: "Energy",
      prompt: "Which best describes your day-to-day energy?",
      options: [
        { label: "Steady through the day", value: "steady", score: 0 },
        { label: "Afternoon slump", value: "afternoon_slump", score: 2 },
        { label: "Tired most days", value: "tired", score: 3 },
        { label: "Depleted, even after sleep", value: "depleted", score: 4 },
      ],
    },
    {
      id: "sleep",
      label: "Sleep",
      prompt: "How often do you wake up feeling rested?",
      options: [
        { label: "Almost always", value: "rested", score: 0 },
        { label: "A few nights a week", value: "some_nights", score: 2 },
        { label: "Rarely", value: "rarely", score: 3 },
        { label: "Never — I wake up exhausted", value: "never", score: 4 },
      ],
    },
    {
      id: "brain_fog",
      label: "Focus",
      prompt: "How often do you notice brain fog or forgetting words?",
      options: [
        { label: "Rarely", value: "rarely", score: 0 },
        { label: "A few times a month", value: "monthly", score: 2 },
        { label: "Most weeks", value: "weekly", score: 3 },
        { label: "Daily", value: "daily", score: 4 },
      ],
    },
  ],
  computeResult(answers) {
    const ageBand = CELLULAR_AGE.questions[0].options.find(
      (o) => o.value === answers.age_band
    );
    const chronological = ageBand?.meta?.midpoint ?? 40;
    const symptomScore = sumScores(CELLULAR_AGE.questions.slice(1), answers);
    // Each severity point adds ~1 "cellular year" on top of chronological.
    // Range: 0–12 additional years (3 questions × max 4).
    const cellularAge = clamp(chronological + symptomScore, 18, 100);
    const delta = cellularAge - chronological;
    // NAD deficit: scale symptom score (0–12) onto 0–100, clamped.
    const nadDeficit = clamp(Math.round((symptomScore / 12) * 100), 0, 100);

    // Severity bucket is a local display concern — not a Klaviyo tier.
    // Match-strength tier (`strong` vs `soft`) is what we stamp so flows
    // can segment "strong match" cadences vs. "borderline" ones.
    const severity: "low" | "medium" | "high" =
      delta <= 2 ? "low" : delta <= 6 ? "medium" : "high";
    const tier: QuizDerived["tier"] = severity === "high" ? "strong" : "soft";

    return {
      primary: `${cellularAge}`,
      context: `Cellular age vs. chronological ${chronological}`,
      explainer:
        severity === "low"
          ? "Your signals are close to your chronological age. NAD+ and recovery protocols can preserve the edge you already have."
          : severity === "medium"
            ? "Your cells are running a few years ahead. NAD+ therapy is designed to close exactly this gap."
            : "Your signals suggest meaningful cellular drag. A physician-led NAD+ protocol is where most patients in your range start.",
      derived: {
        tier,
        primary_program: "nad",
        cellular_age: cellularAge,
        cellular_age_delta: delta,
        nad_deficit_percent: nadDeficit,
      },
    };
  },
};

/* ──────────────────────────────────────────────────────────
   2. Weight Loss Projection  (/weight-loss)
   ────────────────────────────────────────────────────────── */

const WEIGHT_LOSS_PROJECTION: EngagementConfig = {
  quiz: "weight_loss_projection",
  primary: "weight_loss",
  eyebrow: "6-Month Weight Projection",
  headline: "How much could you lose in 6 months?",
  subhead:
    "Four questions. We project where most patients in your range land at the 6-month mark on a physician-supervised GLP-1 protocol.",
  startLabel: "Start projection",
  ctaLabel: "See my 6-month projection",
  captureHeadline: "Your projection is ready",
  captureSubhead: "Where should we send your full plan?",
  questions: [
    {
      id: "current_range",
      label: "Current weight",
      prompt: "Which range are you in today?",
      options: [
        { label: "Under 175 lbs", value: "under_175", score: 0, meta: { midpoint: 165 } },
        { label: "175–210 lbs", value: "175_210", score: 0, meta: { midpoint: 192 } },
        { label: "210–250 lbs", value: "210_250", score: 0, meta: { midpoint: 230 } },
        { label: "250+ lbs", value: "250_plus", score: 0, meta: { midpoint: 270 } },
      ],
    },
    {
      id: "goal",
      label: "Goal",
      prompt: "How much do you want to lose?",
      options: [
        { label: "10–15 lbs", value: "10_15", score: 0, meta: { target: 12 } },
        { label: "15–30 lbs", value: "15_30", score: 0, meta: { target: 22 } },
        { label: "30–50 lbs", value: "30_50", score: 0, meta: { target: 40 } },
        { label: "50+ lbs", value: "50_plus", score: 0, meta: { target: 60 } },
      ],
    },
    {
      id: "pace",
      label: "Pace",
      prompt: "Which pace fits your life?",
      options: [
        // Rate = lbs/week at 6-month mark
        { label: "Fast — committed", value: "fast", score: 0, meta: { rate: 2.0 } },
        { label: "Steady — balanced", value: "steady", score: 0, meta: { rate: 1.5 } },
        { label: "Gentle — sustainable", value: "gentle", score: 0, meta: { rate: 1.0 } },
      ],
    },
    {
      id: "tried_before",
      label: "History",
      prompt: "Have you tried to lose weight before?",
      options: [
        { label: "Never seriously", value: "never", score: 0 },
        { label: "A few attempts", value: "few", score: 1 },
        { label: "Many — it always comes back", value: "many", score: 2 },
      ],
    },
  ],
  computeResult(answers) {
    const current = WEIGHT_LOSS_PROJECTION.questions[0].options.find(
      (o) => o.value === answers.current_range
    );
    const goal = WEIGHT_LOSS_PROJECTION.questions[1].options.find(
      (o) => o.value === answers.goal
    );
    const pace = WEIGHT_LOSS_PROJECTION.questions[2].options.find(
      (o) => o.value === answers.pace
    );

    const currentLbs = current?.meta?.midpoint ?? 200;
    const targetDrop = goal?.meta?.target ?? 20;
    const rate = pace?.meta?.rate ?? 1.5;

    // 26 weeks = 6 months. GLP-1 real-world averages settle below linear
    // trend as appetite normalizes; we use 0.75 of linear as a realistic
    // 6-month delta, capped by user's stated goal so we never overpromise.
    const linearDrop = rate * 26;
    const projectedDrop = Math.round(Math.min(targetDrop, linearDrop * 0.75));
    const projectedWeight = Math.max(120, currentLbs - projectedDrop);

    const severity: "low" | "medium" | "high" =
      targetDrop <= 15 ? "low" : targetDrop <= 30 ? "medium" : "high";
    // Anyone looking for a real drop is a "strong" match for the weight-loss
    // program — only trivial goals map to "soft". Void of `better_elsewhere`
    // because the tool is already scoped to weight loss.
    const tier: QuizDerived["tier"] = severity === "low" ? "soft" : "strong";

    return {
      primary: `${projectedDrop} lbs`,
      context: `Projected 6-month drop — about ${projectedWeight} lbs by month 6`,
      explainer:
        "Most patients in your range, on your pace, land within a few pounds of this number on a physician-supervised GLP-1 protocol with care coaching included.",
      derived: {
        tier,
        primary_program: "weight_loss",
        projected_weight_lbs_6mo: projectedWeight,
        pace_preference: (pace?.value as string) ?? undefined,
      },
    };
  },
};

/* ──────────────────────────────────────────────────────────
   3. TRT Drag Score  (/testosterone-therapy)
   ────────────────────────────────────────────────────────── */

const TRT_DRAG: EngagementConfig = {
  quiz: "trt_drag",
  primary: "trt",
  eyebrow: "Testosterone Drag Score",
  headline: "How much drag are you carrying?",
  subhead:
    "Four questions on the four signals physicians watch for. Your drag score is a directional read on whether low testosterone is likely holding you back.",
  startLabel: "Start drag score",
  ctaLabel: "See my drag score",
  captureHeadline: "Your drag score is ready",
  captureSubhead: "Where should we send your full breakdown?",
  questions: [
    {
      id: "energy",
      label: "Energy",
      prompt: "How's your day-to-day energy?",
      options: [
        { label: "Strong all day", value: "strong", score: 0 },
        { label: "Steady with an afternoon dip", value: "steady", score: 1 },
        { label: "Flat most days", value: "flat", score: 2 },
        { label: "Running on fumes", value: "depleted", score: 3 },
      ],
    },
    {
      id: "libido",
      label: "Libido",
      prompt: "Where's your drive at right now?",
      options: [
        { label: "Where it used to be", value: "strong", score: 0 },
        { label: "Normal-ish", value: "normal", score: 1 },
        { label: "Declining", value: "declining", score: 2 },
        { label: "Nearly absent", value: "absent", score: 3 },
      ],
    },
    {
      id: "morning",
      label: "Morning",
      prompt: "How often do you have morning erections?",
      options: [
        { label: "Most mornings", value: "daily", score: 0 },
        { label: "A few times a week", value: "weekly", score: 1 },
        { label: "Rarely", value: "rare", score: 2 },
        { label: "Never anymore", value: "never", score: 3 },
      ],
    },
    {
      id: "recovery",
      label: "Recovery",
      prompt: "How's gym recovery compared to your 20s?",
      options: [
        { label: "Basically the same", value: "same", score: 0 },
        { label: "Slightly slower", value: "slight", score: 1 },
        { label: "Noticeably declining", value: "noticeable", score: 2 },
        { label: "A real struggle", value: "struggle", score: 3 },
      ],
    },
  ],
  computeResult(answers) {
    const raw = sumScores(TRT_DRAG.questions, answers); // 0–12
    // Map to 0–10 drag score for display; clinic-style "bigger is worse".
    const dragScore = Math.round((raw / 12) * 10);
    const severity: "low" | "medium" | "high" =
      raw <= 3 ? "low" : raw <= 7 ? "medium" : "high";
    const tier: QuizDerived["tier"] = severity === "high" ? "strong" : "soft";

    return {
      primary: `${dragScore}/10`,
      context:
        severity === "low"
          ? "Likely within normal range"
          : severity === "medium"
            ? "Consistent with early low-T signals"
            : "Consistent with a low-T pattern",
      explainer:
        severity === "low"
          ? "Your signals look normal. If symptoms persist, full labs are the next step."
          : severity === "medium"
            ? "A few classic signals are present. Labs confirm — most men in this range benefit from TRT."
            : "Multiple classic low-T signals. Labs typically confirm, and TRT has the most clinical data behind it.",
      derived: {
        tier,
        primary_program: "trt",
        symptom_score: Math.round((raw / 12) * 100),
      },
    };
  },
};

/* ──────────────────────────────────────────────────────────
   4. HRT Severity Scale  (/hormone-therapy)
   ────────────────────────────────────────────────────────── */

const HRT_SEVERITY: EngagementConfig = {
  quiz: "hrt_severity",
  primary: "hrt",
  eyebrow: "Hormone Severity Scale",
  headline: "How intense are your symptoms?",
  subhead:
    "Four questions on the four most common patterns — hot flashes, sleep, mood, and libido. Your severity score indicates where most women like you start.",
  startLabel: "Start severity scale",
  ctaLabel: "See my severity score",
  captureHeadline: "Your severity read is ready",
  captureSubhead: "Where should we send your full breakdown?",
  questions: [
    {
      id: "hot_flashes",
      label: "Hot flashes",
      prompt: "How often do hot flashes or night sweats hit?",
      options: [
        { label: "Never", value: "none", score: 0 },
        { label: "A few times a month", value: "rare", score: 1 },
        { label: "Weekly", value: "weekly", score: 2 },
        { label: "Daily and disruptive", value: "daily", score: 3 },
      ],
    },
    {
      id: "sleep",
      label: "Sleep",
      prompt: "How's your sleep?",
      options: [
        { label: "Sound — I wake rested", value: "sound", score: 0 },
        { label: "Some disruption", value: "some", score: 1 },
        { label: "Frequent waking", value: "frequent", score: 2 },
        { label: "Regular insomnia", value: "insomnia", score: 3 },
      ],
    },
    {
      id: "mood",
      label: "Mood",
      prompt: "How are mood swings or irritability?",
      options: [
        { label: "Stable", value: "stable", score: 0 },
        { label: "Occasional", value: "occasional", score: 1 },
        { label: "Frequent", value: "frequent", score: 2 },
        { label: "Unpredictable and intense", value: "unstable", score: 3 },
      ],
    },
    {
      id: "libido",
      label: "Libido",
      prompt: "Where's your drive?",
      options: [
        { label: "Strong", value: "strong", score: 0 },
        { label: "Moderate", value: "moderate", score: 1 },
        { label: "Low", value: "low", score: 2 },
        { label: "Absent", value: "absent", score: 3 },
      ],
    },
  ],
  computeResult(answers) {
    const raw = sumScores(HRT_SEVERITY.questions, answers); // 0–12
    const severityScore = Math.round((raw / 12) * 100);
    const severity: "low" | "medium" | "high" =
      raw <= 3 ? "low" : raw <= 7 ? "medium" : "high";
    const tier: QuizDerived["tier"] = severity === "high" ? "strong" : "soft";
    const label =
      severity === "low" ? "Mild" : severity === "medium" ? "Moderate" : "High";

    return {
      primary: label,
      context: `Severity index ${severityScore}/100`,
      explainer:
        severity === "low"
          ? "Symptoms are in the mild range today. Labs can confirm baseline — monitoring is reasonable."
          : severity === "medium"
            ? "You're in the range most women start HRT. Labs confirm, and estradiol-led protocols address this directly."
            : "Symptoms are significant. Women in this range typically see the largest improvement on physician-led HRT.",
      derived: {
        tier,
        primary_program: "hrt",
        severity_score: severityScore,
      },
    };
  },
};

/* ──────────────────────────────────────────────────────────
   5. Peptides Recovery Quotient  (/peptide-therapy)
   ────────────────────────────────────────────────────────── */

const PEPTIDES_RECOVERY: EngagementConfig = {
  quiz: "peptides_recovery",
  primary: "peptides",
  eyebrow: "Recovery Quotient",
  headline: "How fast do you recover?",
  subhead:
    "Four questions on sleep, soreness, injury, and training quality. Your recovery quotient — higher is better — is the same read peptide protocols target.",
  startLabel: "Start recovery quotient",
  ctaLabel: "See my recovery quotient",
  captureHeadline: "Your recovery quotient is ready",
  captureSubhead: "Where should we send your full breakdown?",
  questions: [
    {
      id: "sleep_depth",
      label: "Sleep depth",
      prompt: "How deep is your sleep?",
      options: [
        { label: "Deep — I wake rested", value: "deep", score: 0 },
        { label: "Moderate", value: "moderate", score: 1 },
        { label: "Light — I wake often", value: "light", score: 2 },
        { label: "Poor — chronic issues", value: "poor", score: 3 },
      ],
    },
    {
      id: "soreness",
      label: "Soreness",
      prompt: "How long does post-workout soreness last?",
      options: [
        { label: "Under 24 hours", value: "24_under", score: 0 },
        { label: "24–48 hours", value: "24_48", score: 1 },
        { label: "48–72 hours", value: "48_72", score: 2 },
        { label: "Chronic — it lingers", value: "chronic", score: 3 },
      ],
    },
    {
      id: "injury",
      label: "Injury",
      prompt: "How well do you recover from nagging injuries?",
      options: [
        { label: "Fast — bounce right back", value: "fast", score: 0 },
        { label: "Average", value: "average", score: 1 },
        { label: "Slow", value: "slow", score: 2 },
        { label: "Stalled — things don't heal", value: "stalled", score: 3 },
      ],
    },
    {
      id: "quality",
      label: "Training",
      prompt: "Training quality vs. your prime?",
      options: [
        { label: "Same as prime", value: "same", score: 0 },
        { label: "Slight drop", value: "slight", score: 1 },
        { label: "Noticeable drop", value: "noticeable", score: 2 },
        { label: "Significant drop", value: "significant", score: 3 },
      ],
    },
  ],
  computeResult(answers) {
    const raw = sumScores(PEPTIDES_RECOVERY.questions, answers); // 0–12
    // Recovery quotient is inverted: high raw = low recovery.
    const quotient = clamp(100 - Math.round((raw / 12) * 100), 0, 100);
    // Severity of *need* (lower quotient ⇒ higher need ⇒ stronger match).
    const severity: "low" | "medium" | "high" =
      quotient >= 70 ? "low" : quotient >= 40 ? "medium" : "high";
    const tier: QuizDerived["tier"] = severity === "high" ? "strong" : "soft";

    return {
      primary: `${quotient}/100`,
      context:
        quotient >= 70
          ? "Strong recovery baseline"
          : quotient >= 40
            ? "Mid recovery — meaningful ceiling above you"
            : "Compromised recovery — biggest gains available",
      explainer:
        quotient >= 70
          ? "You recover well already. Peptides like BPC-157 can push this ceiling higher for dedicated training blocks."
          : quotient >= 40
            ? "There's clear room above you. Protocol-selected peptides (BPC-157, TB-500, CJC/ipamorelin) directly target these signals."
            : "Recovery is the bottleneck. Physician-selected peptide protocols address sleep, tissue repair, and lean mass — where you need it most.",
      derived: {
        tier,
        primary_program: "peptides",
        recovery_quotient: quotient,
      },
    };
  },
};

/* ──────────────────────────────────────────────────────────
   Public catalog + lookup
   ────────────────────────────────────────────────────────── */

export const ENGAGEMENT_TOOLS = {
  cellular_age: CELLULAR_AGE,
  weight_loss_projection: WEIGHT_LOSS_PROJECTION,
  trt_drag: TRT_DRAG,
  hrt_severity: HRT_SEVERITY,
  peptides_recovery: PEPTIDES_RECOVERY,
} as const satisfies Record<string, EngagementConfig>;

export type EngagementSlug = keyof typeof ENGAGEMENT_TOOLS;

export function getEngagementConfig(slug: EngagementSlug): EngagementConfig {
  return ENGAGEMENT_TOOLS[slug];
}
