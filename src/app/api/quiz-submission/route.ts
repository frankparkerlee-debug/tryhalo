/**
 * POST /api/quiz-submission
 *
 * Single secure endpoint for every Halo quiz submission (NAD+, TRT, HRT,
 * peptides, weight-loss, homepage catchall, cellular age estimator,
 * founding-circle signup). Validates the payload, forwards to Klaviyo
 * (profile upsert → event track → optional list subscribe), and writes a
 * structured audit line to stdout.
 *
 * Security layers, in order:
 *   1. Method gate (POST only)
 *   2. Origin / Referer allow-list
 *   3. Rate limit (IP-keyed, in-memory)
 *   4. Honeypot (silent 200 for bots)
 *   5. Zod schema validation (never echo PII in errors)
 *
 * Klaviyo forwarding is best-effort: a Klaviyo failure is logged but does
 * NOT fail the client response. The submission is already captured in logs.
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  QuizSubmissionSchema,
  KLAVIYO_EVENT_NAME,
  KLAVIYO_LIST_ENV,
  PROFILE_PROP,
  type QuizSubmission,
  type QuizType,
} from "@/lib/quiz-submission";
import {
  upsertProfile,
  trackEvent,
  subscribeToList,
  isKlaviyoConfigured,
} from "@/lib/klaviyo";
import { check as rateLimitCheck, clientIpFromRequest } from "@/lib/rate-limit";
import { reserveWaitlistPosition } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ──────────────────────────────────────────────────────────
   Origin allow-list
   ────────────────────────────────────────────────────────── */

function isOriginAllowed(req: NextRequest): boolean {
  const origin = req.headers.get("origin") ?? req.headers.get("referer") ?? "";
  if (!origin) return false;

  // Parse out just the origin piece even if we got a full referer URL
  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    return false;
  }
  const originHost = `${originUrl.protocol}//${originUrl.host}`;

  const allowed = new Set<string>();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) {
    try {
      const u = new URL(appUrl);
      allowed.add(`${u.protocol}//${u.host}`);
    } catch {
      // ignore
    }
  }

  // Canonical production host
  allowed.add("https://tryhalo.co");
  allowed.add("https://www.tryhalo.co");

  // Dev origins — only accepted outside production.
  // Next.js may fall back to an alternate port (3001, 3002…) when 3000 is taken,
  // so allow any localhost/127.0.0.1 origin in non-prod rather than a fixed port.
  if (process.env.NODE_ENV !== "production") {
    if (originUrl.hostname === "localhost" || originUrl.hostname === "127.0.0.1") {
      return true;
    }
  }

  // Render preview / review apps — allow any *.onrender.com origin
  if (originUrl.hostname.endsWith(".onrender.com")) return true;

  return allowed.has(originHost);
}

/* ──────────────────────────────────────────────────────────
   Audit logging — structured stdout; Render captures.
   Email is truncated (first char + domain) so PII isn't in logs verbatim.
   ────────────────────────────────────────────────────────── */

function truncateEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  return `${local[0]}***@${domain}`;
}

function auditLog(
  submissionId: string,
  submission: QuizSubmission,
  klaviyo: {
    profile: boolean;
    event: boolean;
    list: boolean | "skipped";
  }
): void {
  const line = {
    at: new Date().toISOString(),
    kind: "quiz_submission",
    submission_id: submissionId,
    quiz: submission.quiz,
    source: submission.source,
    email: truncateEmail(submission.contact.email),
    has_name: !!submission.contact.firstName,
    has_phone: !!submission.contact.phone,
    tier: submission.derived?.tier ?? null,
    primary_program: submission.derived?.primary_program ?? null,
    flags_count: submission.derived?.flags?.length ?? 0,
    klaviyo,
  };
  // One JSON line per submission, easy to grep/parse.
  console.log(JSON.stringify(line));
}

/* ──────────────────────────────────────────────────────────
   Klaviyo forwarding — best-effort, each step isolated.
   ────────────────────────────────────────────────────────── */

function buildProfileProperties(submission: QuizSubmission): Record<string, unknown> {
  const submittedAt = submission.submittedAt ?? new Date().toISOString();
  const p: Record<string, unknown> = {
    [PROFILE_PROP.LAST_QUIZ]: submission.quiz,
    [PROFILE_PROP.LAST_QUIZ_SOURCE_URL]: submission.source,
    [PROFILE_PROP.LAST_QUIZ_SUBMITTED_AT]: submittedAt,
    // Email consent is implicit by submitting the form (CAN-SPAM). Stamp the
    // moment so suppression decisions have a provable timestamp.
    [PROFILE_PROP.EMAIL_CONSENT_AT]: submittedAt,
  };

  // TCPA express written consent — only true when the user checked the SMS
  // opt-in AND provided a phone number. Stamp the moment so marketing-SMS
  // segments have a provable consent timestamp tied to this submission.
  const c = submission.consent;
  if (c?.acceptedSms === true && submission.contact.phone) {
    p[PROFILE_PROP.SMS_CONSENT] = true;
    p[PROFILE_PROP.SMS_CONSENT_AT] = submittedAt;
  } else if (c?.acceptedSms === false) {
    p[PROFILE_PROP.SMS_CONSENT] = false;
  }

  const d = submission.derived;
  if (d) {
    if (d.tier) p[PROFILE_PROP.LAST_QUIZ_TIER] = d.tier;
    if (d.primary_program) p[PROFILE_PROP.PRIMARY_PROGRAM] = d.primary_program;
    if (d.primary_driver) p[PROFILE_PROP.PRIMARY_DRIVER] = d.primary_driver;
    if (d.flags && d.flags.length > 0) {
      p[PROFILE_PROP.PROGRAMS_FLAGGED] = d.flags;
    }
    if (typeof d.cellular_age === "number") {
      p[PROFILE_PROP.CELLULAR_AGE] = d.cellular_age;
    }
    if (typeof d.cellular_age_delta === "number") {
      p[PROFILE_PROP.CELLULAR_AGE_DELTA] = d.cellular_age_delta;
    }
    if (typeof d.nad_deficit_percent === "number") {
      p[PROFILE_PROP.NAD_DEFICIT_PERCENT] = d.nad_deficit_percent;
    }
    if (typeof d.bmi === "number") p[PROFILE_PROP.BMI] = d.bmi;
    if (typeof d.projected_weight_lbs_6mo === "number") {
      p[PROFILE_PROP.PROJECTED_WEIGHT_LBS_6MO] = d.projected_weight_lbs_6mo;
    }
    if (typeof d.symptom_score === "number") {
      p[PROFILE_PROP.SYMPTOM_SCORE] = d.symptom_score;
    }
    if (typeof d.severity_score === "number") {
      p[PROFILE_PROP.SEVERITY_SCORE] = d.severity_score;
    }
    if (typeof d.recovery_quotient === "number") {
      p[PROFILE_PROP.RECOVERY_QUOTIENT] = d.recovery_quotient;
    }
    if (d.stack && d.stack.length > 0) p[PROFILE_PROP.STACK] = d.stack;
    if (typeof d.monthly_total === "number") {
      p[PROFILE_PROP.MONTHLY_TOTAL] = d.monthly_total;
    }
    if (d.formulation_preference) {
      p[PROFILE_PROP.FORMULATION_PREFERENCE] = d.formulation_preference;
    }
    if (typeof d.waitlist_position === "number") {
      p[PROFILE_PROP.WAITLIST_POSITION] = d.waitlist_position;
    }
  }

  const utm = submission.meta?.utm;
  if (utm) {
    if (utm.utm_source) p[PROFILE_PROP.UTM_SOURCE] = utm.utm_source;
    if (utm.utm_medium) p[PROFILE_PROP.UTM_MEDIUM] = utm.utm_medium;
    if (utm.utm_campaign) p[PROFILE_PROP.UTM_CAMPAIGN] = utm.utm_campaign;
  }

  return p;
}

function buildEventProperties(
  submission: QuizSubmission,
  submissionId: string
): Record<string, unknown> {
  const props: Record<string, unknown> = {
    quiz_type: submission.quiz,
    submission_id: submissionId,
    source_url: submission.source,
  };

  if (submission.meta?.referrer) props.referrer = submission.meta.referrer;
  if (submission.meta?.userAgent) props.user_agent = submission.meta.userAgent;

  // Flatten answers with `answer_` prefix
  for (const [k, v] of Object.entries(submission.answers ?? {})) {
    props[`answer_${k}`] = v;
  }

  // Derived fields at the top level — flows branch on these directly
  const d = submission.derived;
  if (d) {
    if (d.tier) props.tier = d.tier;
    if (d.primary_program) props.primary_program = d.primary_program;
    if (d.primary_driver) props.primary_driver = d.primary_driver;
    if (d.flags) props.flags = d.flags;
    if (typeof d.cellular_age === "number") props.cellular_age = d.cellular_age;
    if (typeof d.cellular_age_delta === "number") {
      props.cellular_age_delta = d.cellular_age_delta;
    }
    if (typeof d.nad_deficit_percent === "number") {
      props.nad_deficit_percent = d.nad_deficit_percent;
    }
    if (typeof d.bmi === "number") props.bmi = d.bmi;
    if (typeof d.projected_weight_lbs_6mo === "number") {
      props.projected_weight_lbs_6mo = d.projected_weight_lbs_6mo;
    }
    if (d.pace_preference) props.pace_preference = d.pace_preference;
    if (typeof d.symptom_score === "number") props.symptom_score = d.symptom_score;
    if (typeof d.severity_score === "number") props.severity_score = d.severity_score;
    if (typeof d.recovery_quotient === "number") {
      props.recovery_quotient = d.recovery_quotient;
    }
    if (d.stack) props.stack = d.stack;
    if (typeof d.monthly_total === "number") props.monthly_total = d.monthly_total;
    if (d.formulation_preference) {
      props.formulation_preference = d.formulation_preference;
    }
    if (typeof d.waitlist_position === "number") {
      props.waitlist_position = d.waitlist_position;
    }
  }

  return props;
}

async function forwardToKlaviyo(
  submission: QuizSubmission,
  submissionId: string
): Promise<{ profile: boolean; event: boolean; list: boolean | "skipped" }> {
  if (!isKlaviyoConfigured()) {
    console.warn(
      JSON.stringify({
        at: new Date().toISOString(),
        kind: "klaviyo_not_configured",
        submission_id: submissionId,
      })
    );
    return { profile: false, event: false, list: "skipped" };
  }

  let profileOk = false;
  let eventOk = false;
  let listOk: boolean | "skipped" = "skipped";
  let profileId: string | undefined;

  // 1) Upsert profile
  try {
    const res = await upsertProfile({
      email: submission.contact.email,
      firstName: submission.contact.firstName,
      phone: submission.contact.phone,
      properties: buildProfileProperties(submission),
    });
    profileOk = res.ok;
    profileId = res.profileId;
    if (!res.ok) {
      console.warn(
        JSON.stringify({
          at: new Date().toISOString(),
          kind: "klaviyo_profile_failed",
          submission_id: submissionId,
          error: res.error,
        })
      );
    }
  } catch (err) {
    console.warn(
      JSON.stringify({
        at: new Date().toISOString(),
        kind: "klaviyo_profile_threw",
        submission_id: submissionId,
        error: err instanceof Error ? err.message : "unknown",
      })
    );
  }

  // 2) Track event (still try even if profile upsert failed — profile
  // attribute on the event will upsert implicitly via email)
  try {
    const eventName = KLAVIYO_EVENT_NAME[submission.quiz];
    const res = await trackEvent({
      eventName,
      email: submission.contact.email,
      properties: buildEventProperties(submission, submissionId),
      time: submission.submittedAt,
      uniqueId: submissionId,
    });
    eventOk = res.ok;
    if (!res.ok) {
      console.warn(
        JSON.stringify({
          at: new Date().toISOString(),
          kind: "klaviyo_event_failed",
          submission_id: submissionId,
          error: res.error,
        })
      );
    }
  } catch (err) {
    console.warn(
      JSON.stringify({
        at: new Date().toISOString(),
        kind: "klaviyo_event_threw",
        submission_id: submissionId,
        error: err instanceof Error ? err.message : "unknown",
      })
    );
  }

  // 3) List subscribe — requires profile_id
  const listEnvName = KLAVIYO_LIST_ENV[submission.quiz as QuizType];
  const listId = process.env[listEnvName];
  if (profileId && listId && listId.trim()) {
    try {
      const res = await subscribeToList({ listId, profileId });
      listOk = res.ok;
      if (!res.ok) {
        console.warn(
          JSON.stringify({
            at: new Date().toISOString(),
            kind: "klaviyo_list_failed",
            submission_id: submissionId,
            error: res.error,
            env: listEnvName,
          })
        );
      }
    } catch (err) {
      console.warn(
        JSON.stringify({
          at: new Date().toISOString(),
          kind: "klaviyo_list_threw",
          submission_id: submissionId,
          error: err instanceof Error ? err.message : "unknown",
        })
      );
    }
  }
  // If listId missing/empty — stays "skipped" (graceful degradation).

  return { profile: profileOk, event: eventOk, list: listOk };
}

/* ──────────────────────────────────────────────────────────
   Handler
   ────────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  // 1) Origin gate
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ ok: false, error: "origin_not_allowed" }, { status: 403 });
  }

  // 2) Rate limit
  const ip = clientIpFromRequest(req);
  const rl = rateLimitCheck(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)),
        },
      }
    );
  }

  // 3) Parse body
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // 4) Honeypot — if the bot filled in `website`, return fake success silently
  if (
    raw &&
    typeof raw === "object" &&
    typeof (raw as Record<string, unknown>).website === "string" &&
    (raw as Record<string, unknown>).website !== ""
  ) {
    return NextResponse.json({ ok: true, id: randomUUID() });
  }

  // 5) Validate
  const parsed = QuizSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    // Never echo PII; give a generic message + the field paths that failed.
    const paths = parsed.error.issues
      .map((i) => i.path.join("."))
      .filter(Boolean)
      .slice(0, 10);
    return NextResponse.json(
      { ok: false, error: "invalid_payload", fields: paths },
      { status: 400 }
    );
  }

  const submission = parsed.data;
  const submissionId = randomUUID();

  // 6) Waitlist position — if this is a waitlist signup, atomically reserve
  // (or look up) the member's position BEFORE forwarding to Klaviyo so the
  // position lands on the profile/event in a single round-trip and the client
  // receives it on the same response (no follow-up /api/waitlist-count fetch).
  //
  // Idempotent: replays for the same email return the same number. Graceful:
  // when Redis isn't configured, position stays null and the UI falls back to
  // "Your spot is reserved" copy.
  let waitlistPosition: number | null = null;
  if (submission.quiz === "waitlist_joined") {
    try {
      const reservation = await reserveWaitlistPosition(submission.contact.email);
      if (reservation) {
        waitlistPosition = reservation.position;
        submission.derived = {
          ...(submission.derived ?? {}),
          waitlist_position: reservation.position,
        };
      }
    } catch (err) {
      // Never block the signup on a Redis hiccup; just log and move on.
      console.warn(
        JSON.stringify({
          at: new Date().toISOString(),
          kind: "waitlist_reserve_threw",
          submission_id: submissionId,
          error: err instanceof Error ? err.message : "unknown",
        })
      );
    }
  }

  // 7) Forward to Klaviyo (best-effort; failures logged but don't block)
  const klaviyo = await forwardToKlaviyo(submission, submissionId);

  // 8) Audit log
  auditLog(submissionId, submission, klaviyo);

  return NextResponse.json({
    ok: true,
    id: submissionId,
    position: waitlistPosition,
  });
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "method_not_allowed" }, { status: 405 });
}
