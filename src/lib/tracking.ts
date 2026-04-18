/**
 * Centralized event tracking for Halo.
 *
 * All surveys, forms, gates, and CTAs flow through track().
 *
 * Current sinks:
 *   1. localStorage (always) — capped at MAX_EVENTS
 *   2. Google Analytics 4 (if NEXT_PUBLIC_GA_MEASUREMENT_ID is set)
 *
 * Adding a backend later requires changing only this file.
 */

"use client";

export type EventName =
  // Quiz lifecycle
  | "quiz_start"
  | "quiz_step_view"
  | "quiz_answer"
  | "quiz_gate_view"
  | "quiz_gate_continue"
  | "quiz_complete"
  | "quiz_abandoned"
  // Signups / forms
  | "founding_signup_attempt"
  | "founding_signup_success"
  | "founding_signup_error"
  | "founding_signup_duplicate"
  // Navigation / engagement
  | "cta_click"
  | "program_view";

type Payload = Record<
  string,
  string | number | boolean | null | undefined | string[]
>;

const STORAGE_KEY = "halo_events";
const MAX_EVENTS = 200;

interface StoredEvent {
  event: EventName;
  payload: Payload;
  ts: string;
}

// Type declaration for window.gtag so TS doesn't complain
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Write an event to localStorage, capped so it can't grow unboundedly. */
function writeLocal(event: EventName, payload: Payload): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const existing: StoredEvent[] = raw ? JSON.parse(raw) : [];
    existing.push({
      event,
      payload,
      ts: new Date().toISOString(),
    });
    const capped = existing.slice(-MAX_EVENTS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
  } catch {
    // localStorage might be full / blocked; silently drop
  }
}

/** Send to Google Analytics 4 if configured. No-op when gtag is absent. */
function sendToGA(event: EventName, payload: Payload): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", event, payload);
  } catch {
    // Never crash the UI for an analytics failure
  }
}

/**
 * Track an event. Fires to localStorage always; fires to GA4 when configured.
 * Safe to call during SSR (no-ops on the server).
 */
export function track(event: EventName, payload: Payload = {}): void {
  writeLocal(event, payload);
  sendToGA(event, payload);
}

/** Read all stored events (for debug/admin). */
export function getStoredEvents(): StoredEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Clear stored events. */
export function clearStoredEvents(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
