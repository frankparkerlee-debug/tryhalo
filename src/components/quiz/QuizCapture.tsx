"use client";

/**
 * QuizCapture — the single email-capture surface every Halo quiz and
 * engagement tool funnels into.
 *
 * Used on 11 surfaces today:
 *   Engagement tools (short tools that preview a result, then capture):
 *     - Cellular Age Estimator (/nad-therapy)
 *     - Weight Loss Projection (/weight-loss)
 *     - TRT Drag (/testosterone-therapy)
 *     - HRT Severity (/hormone-therapy)
 *     - Peptides Recovery (/peptide-therapy)
 *   Full quizzes (clinical intake questionnaires, capture before /stack):
 *     - Homepage router (/)
 *     - Per-program full quizzes (nad, trt, hrt, peptides, weight_loss)
 *
 * Design contract:
 *   1. One component handles email + phone + SMS consent for every surface.
 *      We never duplicate compliance copy; any change to TCPA/CAN-SPAM copy
 *      happens here and everywhere gets it.
 *   2. Caller provides `quiz` (QuizType) + `answers` + optional `derived` —
 *      we pass these straight to submitQuiz(). The server handles schema
 *      validation, rate limiting, honeypot, Klaviyo forwarding, and (for
 *      `waitlist_joined`) the atomic waitlist counter.
 *   3. Success UX is a render prop. Engagement tools render their result
 *      inline (cellular age number, projected weight curve, etc.). Full
 *      quizzes hand off via `onSuccess` — typically a router.push("/stack?...").
 *   4. Email consent is implicit on submit (CAN-SPAM). SMS consent is an
 *      explicit checkbox that ONLY renders when a phone is entered (TCPA
 *      2024 one-to-one rule). Clearing the phone auto-unchecks SMS.
 *
 * What this component does NOT do:
 *   - It does not drive the quiz question flow. Callers render their own
 *     questions and collect answers, then render <QuizCapture /> at the end
 *     (or behind a "See your result" wall for engagement tools).
 *   - It does not compute derived fields. Callers compute (bmi, cellular_age,
 *     symptom_score, etc.) and pass them in.
 *   - It does not navigate. If the post-submit action is a route push, pass
 *     an `onSuccess` handler.
 */

import { useCallback, useState } from "react";
import { ArrowRight } from "lucide-react";
import { submitQuiz } from "@/lib/quiz-client";
import { track, type EventName } from "@/lib/tracking";
import type {
  QuizType,
  QuizDerived,
  Program,
} from "@/lib/quiz-submission";

/** Minimal shape of the submit result surfaced to the success render prop. */
export interface QuizCaptureResult {
  /** Server-assigned submission id. */
  id: string;
  /** Normalized email (trimmed). */
  email: string;
  /** Normalized phone if provided. */
  phone?: string;
  /** Waitlist position when quiz === "waitlist_joined" and Redis is live. */
  position: number | null;
  /** True when the browser had already submitted this (quiz, email) pair. */
  deduped: boolean;
}

export interface QuizCaptureProps {
  /** Quiz type — used as the KLAVIYO event name and profile attribution. */
  quiz: QuizType;

  /** All non-PII answers the caller has collected. Forwarded verbatim. */
  answers?: Record<string, unknown>;

  /** Computed fields (bmi, tier, symptom_score, etc.) used for segmentation. */
  derived?: QuizDerived;

  /** Primary program for downstream stack ring + segmentation. Optional. */
  primaryProgram?: Program;

  /** Headline above the form. Keep it short — 4–8 words. */
  headline: string;

  /** One-line subhead under the headline. Optional. */
  subhead?: string;

  /** Submit button copy. Defaults to "See my results →". */
  ctaLabel?: string;

  /** Whether to collect phone. Defaults to true. */
  showPhone?: boolean;

  /** Visual treatment — matches surrounding section background. */
  variant?: "light" | "dark";

  /**
   * Render the success state. For engagement tools: return the revealed
   * result (cellular age number, projected weight line, etc). For full
   * quizzes: kick off navigation in an effect and return a "Loading…"
   * shell, or let `onSuccess` handle the route push and return null here.
   */
  successSlot?: (result: QuizCaptureResult) => React.ReactNode;

  /**
   * Fires after a successful submit (or local-dedupe short-circuit).
   * Parents typically use this to router.push("/stack?primary=…").
   */
  onSuccess?: (result: QuizCaptureResult) => void;

  /**
   * Optional custom analytics event to fire on successful submit. Defaults
   * to a per-quiz inference: engagement tools fire `estimator_complete`,
   * full quizzes fire `quiz_completed`. Override when a surface needs its
   * own event name.
   */
  successEventName?: EventName;
}

/* ──────────────────────────────────────────────────────────
   Validation helpers
   Light client-side only — the server Zod schema is the source of truth.
   ────────────────────────────────────────────────────────── */

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidPhone(v: string): boolean {
  const trimmed = v.trim();
  if (!trimmed) return true; // phone is optional
  return trimmed.replace(/\D/g, "").length >= 10;
}

/* ──────────────────────────────────────────────────────────
   Event inference
   Engagement tools fire `estimator_complete`; everything else `quiz_completed`.
   Keep in lock-step with tracking.ts EventName union.
   ────────────────────────────────────────────────────────── */

const ENGAGEMENT_QUIZZES: ReadonlySet<QuizType> = new Set<QuizType>([
  "cellular_age",
  "weight_loss_projection",
  "trt_drag",
  "hrt_severity",
  "peptides_recovery",
]);

function defaultSuccessEvent(quiz: QuizType): EventName {
  if (quiz === "waitlist_joined") return "waitlist_joined";
  if (ENGAGEMENT_QUIZZES.has(quiz)) return "estimator_complete";
  // Full clinical intakes + homepage router fire `quiz_complete`.
  return "quiz_complete";
}

/* ──────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────── */

type Status = "idle" | "submitting" | "success" | "error";

export default function QuizCapture({
  quiz,
  answers,
  derived,
  primaryProgram,
  headline,
  subhead,
  ctaLabel = "See my results",
  showPhone = true,
  variant = "light",
  successSlot,
  onSuccess,
  successEventName,
}: QuizCaptureProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<QuizCaptureResult | null>(null);

  const isDark = variant === "dark";

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Honeypot — bots trip this, we silent-200 to avoid leaking it.
      if (honeypot) {
        setStatus("success");
        return;
      }

      const emailTrimmed = email.trim();
      const phoneTrimmed = phone.trim();

      if (!emailTrimmed) {
        setErrorMsg("Please enter your email.");
        setStatus("error");
        return;
      }
      if (!isValidEmail(emailTrimmed)) {
        setErrorMsg("Please enter a valid email address.");
        setStatus("error");
        return;
      }
      if (phoneTrimmed && !isValidPhone(phoneTrimmed)) {
        setErrorMsg("Please enter a valid phone number (10+ digits).");
        setStatus("error");
        return;
      }

      setStatus("submitting");

      // Attribution: stash the primary program alongside caller-provided
      // derived fields so Klaviyo segments always know the entry point.
      const derivedWithAttribution: QuizDerived = {
        ...(derived ?? {}),
        ...(primaryProgram ? { primary_program: primaryProgram } : {}),
      };

      const res = await submitQuiz({
        quiz,
        contact: {
          email: emailTrimmed,
          phone: phoneTrimmed || undefined,
        },
        answers: answers ?? {},
        derived: derivedWithAttribution,
        consent: {
          acceptedTerms: true,
          acceptedSms: smsConsent && !!phoneTrimmed,
        },
      });

      if (!res.ok) {
        setErrorMsg(
          res.error === "rate_limited"
            ? "Too many attempts. Please try again in a minute."
            : "Something went wrong. Please try again."
        );
        setStatus("error");
        return;
      }

      const completed: QuizCaptureResult = {
        id: res.id,
        email: emailTrimmed,
        phone: phoneTrimmed || undefined,
        position: typeof res.position === "number" ? res.position : null,
        deduped: !!res.deduped,
      };

      setResult(completed);
      setStatus("success");

      const eventName = successEventName ?? defaultSuccessEvent(quiz);
      track(eventName, {
        quiz,
        primary_program: primaryProgram ?? null,
        has_phone: !!phoneTrimmed,
        sms_consent: smsConsent && !!phoneTrimmed,
        deduped: completed.deduped,
      });

      onSuccess?.(completed);
    },
    [
      honeypot,
      email,
      phone,
      quiz,
      answers,
      derived,
      primaryProgram,
      smsConsent,
      successEventName,
      onSuccess,
    ]
  );

  /* ── success ── */
  if (status === "success" && result) {
    if (successSlot) return <>{successSlot(result)}</>;
    return (
      <div className="text-center py-6">
        <p
          className={`text-[11px] uppercase tracking-[0.2em] font-semibold mb-2 ${
            isDark ? "text-[#9CAA9F]" : "text-[#6B7B6E]"
          }`}
        >
          You&apos;re in
        </p>
        <p
          className={`text-lg font-medium ${
            isDark ? "text-white" : "text-[#1C1C1E]"
          }`}
        >
          Check your inbox — your results are on the way.
        </p>
      </div>
    );
  }

  /* ── form ── */
  const inputClass = isDark
    ? "w-full px-5 py-3.5 bg-white/5 border border-white/15 focus:border-white/40 focus:outline-none rounded-xl text-sm text-white placeholder:text-white/35 transition-colors"
    : "w-full px-5 py-3.5 bg-white border border-[#E5E4E0] focus:border-[#1C1C1E]/30 focus:outline-none rounded-xl text-sm text-[#1C1C1E] placeholder:text-[#1C1C1E]/35 transition-colors";

  return (
    <div className="w-full">
      {/* headline + subhead */}
      <div className="text-center mb-5">
        <h3
          className={`font-serif text-2xl md:text-3xl tracking-[-0.02em] mb-2 ${
            isDark ? "text-white" : "text-[#1C1C1E]"
          }`}
        >
          {headline}
        </h3>
        {subhead && (
          <p
            className={`text-sm leading-relaxed ${
              isDark ? "text-white/60" : "text-[#86868B]"
            }`}
          >
            {subhead}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5 w-full">
        {/* Honeypot — invisible to humans, bots fill it and get silent-200'd */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{
            position: "absolute",
            left: "-9999px",
            opacity: 0,
            height: 0,
            width: 0,
            overflow: "hidden",
          }}
        />

        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          aria-label="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          className={inputClass}
        />

        {showPhone && (
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Phone (optional)"
            aria-label="Phone number (optional)"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              // Clearing the phone must un-consent SMS — can't hold an
              // opt-in for a number the user didn't provide.
              if (!e.target.value.trim()) setSmsConsent(false);
              if (status === "error") setStatus("idle");
            }}
            className={inputClass}
          />
        )}

        {/* TCPA 2024 one-to-one rule: SMS consent is explicit, separate from
            the implicit email consent, and only renders once a phone is
            actually typed. */}
        {showPhone && phone.trim() && (
          <label
            className={`flex items-start gap-2.5 pt-1 cursor-pointer select-none ${
              isDark ? "text-white/55" : "text-[#1C1C1E]/60"
            }`}
          >
            <input
              type="checkbox"
              checked={smsConsent}
              onChange={(e) => setSmsConsent(e.target.checked)}
              className={`mt-0.5 h-3.5 w-3.5 rounded border flex-shrink-0 ${
                isDark
                  ? "border-white/30 bg-white/10"
                  : "border-[#C9C7C0] bg-white"
              }`}
            />
            <span className="text-[10px] leading-snug">
              Send me text updates. Msg frequency varies. Msg &amp; data rates
              may apply. Reply STOP to cancel.{" "}
              <a
                href="/sms-terms"
                target="_blank"
                rel="noopener"
                className={`underline ${
                  isDark ? "text-white/70" : "text-[#1C1C1E]/75"
                }`}
              >
                SMS Terms
              </a>
              .
            </span>
          </label>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all ${
            isDark
              ? "bg-white text-[#1C1C1E] hover:bg-white/90"
              : "bg-[#1C1C1E] text-white hover:bg-[#333]"
          } ${status === "submitting" ? "opacity-60 cursor-wait" : ""}`}
        >
          {status === "submitting" ? "Working…" : ctaLabel}
          {status !== "submitting" && <ArrowRight className="w-4 h-4" />}
        </button>

        {status === "error" && (
          <p
            className={`text-xs pl-1 ${
              isDark ? "text-red-300" : "text-red-500"
            }`}
          >
            {errorMsg}
          </p>
        )}

        {/* CAN-SPAM + implicit email consent footnote. Links open in new tab
            so the user doesn't lose their in-progress form state. */}
        <p
          className={`text-[10px] text-center leading-snug pt-1 ${
            isDark ? "text-white/35" : "text-[#1C1C1E]/40"
          }`}
        >
          By submitting, you agree to Halo&apos;s{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noopener"
            className="underline"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener"
            className="underline"
          >
            Privacy Policy
          </a>
          , and to receive emails from Halo. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
