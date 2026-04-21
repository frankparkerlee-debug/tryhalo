/**
 * Halo quiz submission — shared types, Zod schema, and Klaviyo naming maps.
 *
 * Every quiz on the site (NAD+, TRT, HRT, peptides, weight-loss, homepage
 * catchall, cellular age estimator, founding circle signup) funnels through
 * the same POST /api/quiz-submission endpoint with payloads that conform to
 * QuizSubmissionSchema. That endpoint forwards to Klaviyo for marketing
 * (profile upsert + event track + optional list subscribe) and — eventually —
 * to OpenLoop for clinical intake.
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
  "nad",
  "trt",
  "hrt",
  "peptides",
  "weight_loss",
  "homepage",
  "cellular_age",
  "founding_circle",
] as const;

export type QuizType = (typeof QUIZ_TYPES)[number];

export const TIERS = [
  "strong",
  "soft",
  "better_elsewhere",
  "medical_review",
] as const;

export type Tier = (typeof TIERS)[number];

/* ──────────────────────────────────────────────────────────
   Zod schemas — the endpoint validates every payload.
   PII fields are length-capped to bound abuse.
   ────────────────────────────────────────────────────────── */

const safeString = (max: number) => z.string().trim().max(max);

export const ContactSchema = z.object({
  firstName: safeString(100).optional(),
  email: safeString(200).email(),
  phone: safeString(50).optional(),
});

export const DerivedSchema = z
  .object({
    tier: z.enum(TIERS).optional(),
    primary_program: safeString(100).optional(),
    primary_driver: safeString(100).optional(),
    flags: z.array(safeString(100)).max(20).optional(),
    cellular_age: z.number().int().min(0).max(150).optional(),
    cellular_age_delta: z.number().int().min(-50).max(50).optional(),
    nad_deficit_percent: z.number().int().min(0).max(100).optional(),
  })
  .strict();

export const ConsentSchema = z.object({
  acceptedTerms: z.boolean().optional(),
  acceptedHipaa: z.boolean().optional(),
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
  nad: "Completed NAD Quiz",
  trt: "Completed TRT Quiz",
  hrt: "Completed HRT Quiz",
  peptides: "Completed Peptides Quiz",
  weight_loss: "Completed Weight Loss Quiz",
  homepage: "Completed Homepage Intake",
  cellular_age: "Completed Cellular Age Estimator",
  founding_circle: "Joined Founding Circle",
};

/* ──────────────────────────────────────────────────────────
   Klaviyo list env var names.
   If an env var is unset, list-subscribe is skipped gracefully
   (profile upsert + event tracking still run). Lists are created
   in the Klaviyo admin; the resulting IDs go into Render env.
   ────────────────────────────────────────────────────────── */

export const KLAVIYO_LIST_ENV: Record<QuizType, string> = {
  nad: "KLAVIYO_LIST_NAD",
  trt: "KLAVIYO_LIST_TRT",
  hrt: "KLAVIYO_LIST_HRT",
  peptides: "KLAVIYO_LIST_PEPTIDES",
  weight_loss: "KLAVIYO_LIST_WEIGHT_LOSS",
  homepage: "KLAVIYO_LIST_HOMEPAGE",
  cellular_age: "KLAVIYO_LIST_CELLULAR_AGE",
  founding_circle: "KLAVIYO_LIST_FOUNDING_CIRCLE",
};

/* ──────────────────────────────────────────────────────────
   Profile property names — live contract.
   Every halo_-prefixed key is a custom Klaviyo profile property
   that marketing segments off. Keep snake_case, flat, typed.
   ────────────────────────────────────────────────────────── */

export const PROFILE_PROP = {
  LAST_QUIZ: "halo_last_quiz",
  LAST_QUIZ_TIER: "halo_last_quiz_tier",
  PRIMARY_PROGRAM: "halo_primary_program",
  PRIMARY_DRIVER: "halo_primary_driver",
  PROGRAMS_FLAGGED: "halo_programs_flagged",
  CELLULAR_AGE: "halo_cellular_age",
  CELLULAR_AGE_DELTA: "halo_cellular_age_delta",
  NAD_DEFICIT_PERCENT: "halo_nad_deficit_percent",
  LAST_QUIZ_SOURCE_URL: "halo_last_quiz_source_url",
  LAST_QUIZ_SUBMITTED_AT: "halo_last_quiz_submitted_at",
  UTM_SOURCE: "halo_utm_source",
  UTM_MEDIUM: "halo_utm_medium",
  UTM_CAMPAIGN: "halo_utm_campaign",
} as const;
