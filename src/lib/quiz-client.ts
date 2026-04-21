/**
 * Client-side helper for submitting any Halo quiz to /api/quiz-submission.
 *
 * Every quiz component (NAD cellular-age, homepage catchall, /quiz/trt,
 * founding-circle, etc.) calls submitQuiz() instead of talking to the
 * endpoint directly. That keeps three things consistent across the site:
 *
 *   1. Timeout + abort behavior (no hanging UI on bad network)
 *   2. Enrichment with browser-side meta (userAgent, referrer, UTM)
 *   3. localStorage dedupe — same pattern we already use for FoundingCircleForm
 *
 * The endpoint is the source of truth; this helper is the thin convenience
 * layer. Never put business logic here — it lives on the server.
 */

import type { QuizSubmission, QuizType } from "./quiz-submission";

const ENDPOINT = "/api/quiz-submission";
const DEFAULT_TIMEOUT_MS = 8_000;

/* ──────────────────────────────────────────────────────────
   localStorage dedupe — "I already submitted this quiz"
   Matches the existing FoundingCircleForm pattern so we don't
   fire duplicate events when users refresh the thank-you screen.
   ────────────────────────────────────────────────────────── */

function dedupeKey(quiz: QuizType, email: string): string {
  return `halo.submitted.${quiz}.${email.trim().toLowerCase()}`;
}

export function hasAlreadySubmitted(quiz: QuizType, email: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !!window.localStorage.getItem(dedupeKey(quiz, email));
  } catch {
    return false;
  }
}

function markSubmitted(quiz: QuizType, email: string, id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      dedupeKey(quiz, email),
      JSON.stringify({ id, at: new Date().toISOString() })
    );
  } catch {
    // quota or disabled — not fatal, the server already has the record
  }
}

/* ──────────────────────────────────────────────────────────
   Meta enrichment — browser-side context the server can't see
   ────────────────────────────────────────────────────────── */

function readUtmFromLocation(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const params = new URL(window.location.href).searchParams;
    const utm: Record<string, string> = {};
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    for (const k of keys) {
      const v = params.get(k);
      if (v) utm[k] = v.slice(0, 200);
    }
    return utm;
  } catch {
    return {};
  }
}

function buildMeta(): QuizSubmission["meta"] {
  if (typeof window === "undefined") return undefined;
  const meta: NonNullable<QuizSubmission["meta"]> = {};
  if (typeof navigator !== "undefined" && navigator.userAgent) {
    meta.userAgent = navigator.userAgent.slice(0, 500);
  }
  if (document.referrer) meta.referrer = document.referrer.slice(0, 500);
  const utm = readUtmFromLocation();
  if (Object.keys(utm).length > 0) meta.utm = utm;
  return Object.keys(meta).length > 0 ? meta : undefined;
}

function currentSource(): string {
  if (typeof window === "undefined") return "server";
  try {
    return window.location.href.slice(0, 500);
  } catch {
    return "unknown";
  }
}

/* ──────────────────────────────────────────────────────────
   Public API
   ────────────────────────────────────────────────────────── */

/**
 * Payload shape a caller provides. We enrich with meta + source automatically
 * so components don't have to thread those through. Callers can still override
 * any field — caller's value wins.
 */
export type SubmitQuizInput = Omit<QuizSubmission, "source" | "meta"> & {
  source?: string;
  meta?: QuizSubmission["meta"];
};

export type SubmitQuizResult =
  | { ok: true; id: string; deduped?: boolean }
  | { ok: false; error: string; fields?: string[] };

export async function submitQuiz(
  input: SubmitQuizInput,
  options: { timeoutMs?: number; signal?: AbortSignal } = {}
): Promise<SubmitQuizResult> {
  const email = input.contact.email.trim();

  // Dedupe — if we've already submitted this (quiz, email) pair in this
  // browser, short-circuit with a synthetic success. The server-side
  // record is already there; firing again would double-count the event.
  if (hasAlreadySubmitted(input.quiz, email)) {
    return { ok: true, id: "local_dedupe", deduped: true };
  }

  const payload: QuizSubmission = {
    ...input,
    contact: { ...input.contact, email },
    source: input.source ?? currentSource(),
    submittedAt: input.submittedAt ?? new Date().toISOString(),
    meta: input.meta ?? buildMeta(),
  };

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  // Link caller's signal, if provided, so an external abort also cancels
  if (options.signal) {
    if (options.signal.aborted) controller.abort();
    else options.signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      credentials: "same-origin",
    });

    let json: unknown;
    try {
      json = await res.json();
    } catch {
      return { ok: false, error: `bad_response_${res.status}` };
    }

    if (!res.ok) {
      const body = json as { error?: string; fields?: string[] };
      return {
        ok: false,
        error: body?.error ?? `http_${res.status}`,
        fields: body?.fields,
      };
    }

    const body = json as { ok?: boolean; id?: string; error?: string };
    if (body.ok && body.id) {
      markSubmitted(input.quiz, email, body.id);
      return { ok: true, id: body.id };
    }
    return { ok: false, error: body.error ?? "unknown_response" };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false, error: "timeout" };
    }
    return { ok: false, error: "network_error" };
  } finally {
    clearTimeout(timer);
  }
}
