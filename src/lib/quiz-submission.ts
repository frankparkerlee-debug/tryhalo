/**
 * Halo quiz submission — shared types, Zod schema, and Klaviyo naming maps.
 *
 * Every interactive surface on the site funnels through the same POST
 * /api/quiz-submission endpoint with payloads that conform to
 * QuizSubmissionSchema. That endpoint forwards to Klaviyo for marketing
 * (profile upsert + event track + optional list subscribe) and — eventually —
 * to OpenLoop for clinical intake.
 *
 * Surface inventory:
 *
 *   Engagement tools (top-of-funnel, 3–6 questions, email captured at end):
 *     cellular_age            — /nad-therapy Cellular Age Estimator
 *     weight_loss_projection  — /weight-loss 6-month projection
 *     trt_drag                — /testosterone-therapy drag score
 *     hrt_severity            — /hormone-therapy menopause severity scale
 *     peptides_recovery       — /peptide-therapy recovery quotient
 *
 *   Full quizzes (mid-funnel, 4–6 questions, clinical intake):
 *     nad, trt, hrt, peptides, weight_loss
 *
 *   Router quiz (for users who aren't sure):
 *     homepage               — /quiz 3-question anchor → primary program
 *
 *   Milestone events (not quizzes — user actions downstream):
 *     stack_built            — committed stack on /stack
 *     intake_started         — clicked "Start my intake" (post-launch)
 *     waitlist_joined        — reserved a founding spot (pre-launch)
 *     founding_circle        — legacy homepage signup; kept for waitlist
 *
 * This file is the one source of truth for the naming conventions. Do not
 * change values here without coordinating with the Klaviyo flows built off
 * them — event names and property names are live contracts.
 */

import { z } from "zod";

/* ──────────────────────────────────────────────────────────
   Enums — the only values that appear in Klaviyo data.
   Wire values are snake_case; Klaviyo-facing display names
   (event names, title-case) are mapped below.
   ────────────────────────────────────────────────────────── */

export const QUIZ_TYPES = [
  // Engagement tools (estimators)
  "cellular_age",
  "weight_loss_projection",
  "trt_drag",
  "hrt_severity",
  "peptides_recovery",
  // Full per-program quizzes
  "nad",
  "trt",
  "hrt",
  "peptides",
  "weight_loss",
  // Router quiz (homepage catchall / general)
  "homepage",
  // Milestone events
  "stack_built",
  "intake_started",
  "waitlist_joined",
  // Legacy — founding-circle email capture (pre-launch waitlist)
  "founding_circle",
] as const;

export type QuizType = (typeof QUIZ_TYPES)[number];

/**
 * Engagement-tool subset. These surfaces are top-of-funnel and capture email
 * alongside a shorter-form score; they route into the matching full quiz.
 */
export const ENGAGEMENT_QUIZZES: readonly QuizType[] = [
  "cellular_age",
  "weight_loss_projection",
  "trt_drag",
  "hrt_severity",
  "peptides_recovery",
] as const;

/**
 * Full clinical-intake quiz subset.
 */
export const FULL_QUIZZES: readonly QuizType[] = [
  "nad",
  "trt",
  "hrt",
  "peptides",
  "weight_loss",
] as const;

/**
 * Milestone events that aren't question-answered quizzes but share the same
 * transport. Useful for Klaviyo flow triggers that fire off a user action
 * rather than a form submission.
 */
export const MILESTONE_EVENTS: readonly QuizType[] = [
  "stack_built",
  "intake_started",
  "waitlist_joined",
] as const;

export const TIERS = [
  "strong",
  "soft",
  "better_elsewhere",
  "medical_review",
] as const;

export type Tier = (typeof TIERS)[number];

/**
 * Canonical program slugs used in every stack, recommendation, and segment.
 * Stays in sync with the eight cards on /stack and the per-program pages.
 */
export const PROGRAMS = [
  "nad",
  "trt",
  "hrt",
  "womens_testosterone",
  "peptides",
  "weight_loss",
  "sexual_wellness",
  "sleep",
  "skin",
  // Add-on: only offered in-stack when weight_loss is selected.
  // Not a standalone program — always supplemental.
  "care_coach",
] as const;

export type Program = (typeof PROGRAMS)[number];

/**
 * Formulation preferences the user can express at stack-build time. Not a
 * prescription — the physician confirms during consult. Sent as an answer,
 * not a derived field, since it's user-stated.
 */
export const FORMULATIONS = [
  "injection",
  "pill",
  "cream",
  "patch",
  "dropper",
  "no_preference",
] as const;

export type Formulation = (typeof FORMULATIONS)[number];

/* ──────────────────────────────────────────────────────────
   Zod schemas — the endpoint validates every payload.
   PII fields are length-capped to bound abuse.
   ────────────────────────────────────────────────────────── */

const safeString = (max: number) => z.string().trim().max(max);

export const ContactSchema = z.object({
  firstName: safeString(100).optional(),
  email: safeString(200).email(),
  phone: safeString(50).optional(),
  /**
   * Two-letter US state code (optional until /intake). Gated for sync-required
   * states on OpenLoop's side — we just capture it; no client-side branching.
   */
  state: safeString(2).optional(),
});

/**
 * Derived schema — fields the client computes or the server fills in, keyed
 * off a quiz response. Kept flat + strict so Klaviyo segmentation is
 * predictable; each field has a bounded range.
 */
export const DerivedSchema = z
  .object({
    // Common routing
    tier: z.enum(TIERS).optional(),
    primary_program: safeString(100).optional(),
    primary_driver: safeString(100).optional(),
    flags: z.array(safeString(100)).max(20).optional(),

    // NAD / Cellular Age
    cellular_age: z.number().int().min(0).max(150).optional(),
    cellular_age_delta: z.number().int().min(-50).max(50).optional(),
    nad_deficit_percent: z.number().int().min(0).max(100).optional(),

    // Weight Loss / Projection
    bmi: z.number().min(0).max(100).optional(),
    projected_weight_lbs_6mo: z.number().min(0).max(1000).optional(),
    pace_preference: safeString(40).optional(),

    // TRT Drag Score / HRT Severity Scale / Peptides Recovery
    symptom_score: z.number().int().min(0).max(100).optional(),
    severity_score: z.number().int().min(0).max(100).optional(),
    recovery_quotient: z.number().int().min(0).max(100).optional(),

    // Stack / intake / milestone snapshot
    stack: z.array(z.string().max(40)).max(12).optional(),
    monthly_total: z.number().min(0).max(10_000).optional(),
    annual_total: z.number().min(0).max(120_000).optional(),
    formulation_preference: safeString(40).optional(),

    // Waitlist
    waitlist_position: z.number().int().min(0).max(1_000_000).optional(),
  })
  .strict();

export const ConsentSchema = z.object({
  acceptedTerms: z.boolean().optional(),
  acceptedHipaa: z.boolean().optional(),
  /**
   * TCPA express written consent for marketing SMS. Only set to true when
   * the user explicitly checks the SMS opt-in box AND has provided a phone
   * number. Forwarded to Klaviyo as the `halo_sms_consent` profile property.
   */
  acceptedSms: z.boolean().optional(),
});

export const MetaSchema = z.object({
  userAgent: safeString(500).optional(),
  referrer: safeString(500).optional(),
  utm: z
    .record(safeString(50), safeString(200))
    .refine((r) => Object.keys(r).length <= 20, { message: "too_many_utm_keys" })
    .optional(),
});

export const QuizSubmissionSchema = z.object({
  quiz: z.enum(QUIZ_TYPES),
  submittedAt: z.string().datetime().optional(),
  source: safeString(500),
  contact: ContactSchema,
  answers: z.record(z.string().max(100), z.unknown()).default({}),
  derived: DerivedSchema.optional(),
  consent: ConsentSchema.optional(),
  meta: MetaSchema.optional(),
  /**
   * Honeypot — rendered off-screen in all quiz forms. If populated by a bot,
   * the endpoint returns a fake success and performs no work.
   */
  website: z.string().max(200).optional(),
});

export type QuizSubmission = z.infer<typeof QuizSubmissionSchema>;
export type QuizContact = z.infer<typeof ContactSchema>;
export type QuizDerived = z.infer<typeof DerivedSchema>;

/* ──────────────────────────────────────────────────────────
   Klaviyo event names — live contract.
   Marketing flows in Klaviyo trigger off these exact strings.
   Do not rename without coordinating a flow migration.
   ────────────────────────────────────────────────────────── */

export const KLAVIYO_EVENT_NAME: Record<QuizType, string> = {
  // Engagement tools
  cellular_age: "Completed Cellular Age Estimator",
  weight_loss_projection: "Completed Weight Loss Projection",
  trt_drag: "Completed TRT Drag Score",
  hrt_severity: "Completed Menopause Severity Scale",
  peptides_recovery: "Completed Peptides Recovery Score",
  // Full quizzes
  nad: "Completed NAD Quiz",
  trt: "Completed TRT Quiz",
  hrt: "Completed HRT Quiz",
  peptides: "Completed Peptides Quiz",
  weight_loss: "Completed Weight Loss Quiz",
  // Router quiz
  homepage: "Completed Homepage Intake",
  // Milestones
  stack_built: "Built Stack",
  intake_started: "Started Intake",
  waitlist_joined: "Joined Waitlist",
  // Legacy
  founding_circle: "Joined Founding Circle",
};

/* ──────────────────────────────────────────────────────────
   Klaviyo list env var names.
   If an env var is unset, list-subscribe is skipped gracefully
   (profile upsert + event tracking still run). Lists are created
   in the Klaviyo admin; the resulting IDs go into Render env.

   Convention: engagement tools drop into the SAME list as the full quiz
   for that program (e.g. cellular_age → KLAVIYO_LIST_NAD). One list per
   program, multiple touchpoints per list. Flows branch off event name,
   not list membership.
   ────────────────────────────────────────────────────────── */

export const KLAVIYO_LIST_ENV: Record<QuizType, string> = {
  // Engagement tools share the per-program list
  cellular_age: "KLAVIYO_LIST_NAD",
  weight_loss_projection: "KLAVIYO_LIST_WEIGHT_LOSS",
  trt_drag: "KLAVIYO_LIST_TRT",
  hrt_severity: "KLAVIYO_LIST_HRT",
  peptides_recovery: "KLAVIYO_LIST_PEPTIDES",
  // Full quizzes
  nad: "KLAVIYO_LIST_NAD",
  trt: "KLAVIYO_LIST_TRT",
  hrt: "KLAVIYO_LIST_HRT",
  peptides: "KLAVIYO_LIST_PEPTIDES",
  weight_loss: "KLAVIYO_LIST_WEIGHT_LOSS",
  // Router
  homepage: "KLAVIYO_LIST_HOMEPAGE",
  // Milestones — go to waitlist list pre-launch; customers list post-launch.
  // For now all three point at the waitlist list.
  stack_built: "KLAVIYO_LIST_FOUNDING_CIRCLE",
  intake_started: "KLAVIYO_LIST_FOUNDING_CIRCLE",
  waitlist_joined: "KLAVIYO_LIST_FOUNDING_CIRCLE",
  // Legacy
  founding_circle: "KLAVIYO_LIST_FOUNDING_CIRCLE",
};

/* ──────────────────────────────────────────────────────────
   Profile property names — live contract.
   Every halo_-prefixed key is a custom Klaviyo profile property
   that marketing segments off. Keep snake_case, flat, typed.
   ────────────────────────────────────────────────────────── */

export const PROFILE_PROP = {
  // Most-recent-quiz snapshot
  LAST_QUIZ: "halo_last_quiz",
  LAST_QUIZ_TIER: "halo_last_quiz_tier",
  LAST_QUIZ_SOURCE_URL: "halo_last_quiz_source_url",
  LAST_QUIZ_SUBMITTED_AT: "halo_last_quiz_submitted_at",

  // Program routing
  PRIMARY_PROGRAM: "halo_primary_program",
  PRIMARY_DRIVER: "halo_primary_driver",
  PROGRAMS_FLAGGED: "halo_programs_flagged",

  // Engagement tool scores (persist latest)
  CELLULAR_AGE: "halo_cellular_age",
  CELLULAR_AGE_DELTA: "halo_cellular_age_delta",
  NAD_DEFICIT_PERCENT: "halo_nad_deficit_percent",
  BMI: "halo_bmi",
  PROJECTED_WEIGHT_LBS_6MO: "halo_projected_weight_lbs_6mo",
  SYMPTOM_SCORE: "halo_symptom_score",
  SEVERITY_SCORE: "halo_severity_score",
  RECOVERY_QUOTIENT: "halo_recovery_quotient",

  // Stack + intake snapshot
  STACK: "halo_stack",
  MONTHLY_TOTAL: "halo_monthly_total",
  FORMULATION_PREFERENCE: "halo_formulation_preference",

  // Waitlist + funnel stage
  WAITLIST_POSITION: "halo_waitlist_position",
  FOUNDING_SLOT: "halo_founding_slot",
  FUNNEL_STAGE: "halo_funnel_stage",

  // Attribution
  UTM_SOURCE: "halo_utm_source",
  UTM_MEDIUM: "halo_utm_medium",
  UTM_CAMPAIGN: "halo_utm_campaign",

  /**
   * TCPA consent flags. Setting these to true is a durable statement that the
   * user agreed to receive marketing SMS / email at the time of capture.
   * Segments in Klaviyo filter off these before sending marketing messages.
   */
  SMS_CONSENT: "halo_sms_consent",
  SMS_CONSENT_AT: "halo_sms_consent_at",
  EMAIL_CONSENT_AT: "halo_email_consent_at",
} as const;
