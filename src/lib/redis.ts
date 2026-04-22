/**
 * Upstash Redis client — lazy singleton, gracefully no-ops when env vars
 * aren't configured.
 *
 * We use Redis for exactly two things today:
 *   1. Global waitlist counter (atomic INCR on first waitlist_joined per email)
 *   2. Per-email waitlist position map (so replays don't double-increment)
 *
 * Env vars expected:
 *   UPSTASH_REDIS_REST_URL    — HTTPS endpoint from Upstash dashboard
 *   UPSTASH_REDIS_REST_TOKEN  — bearer token (read+write)
 *
 * If either is missing, isRedisConfigured() returns false and every helper
 * below silently short-circuits. That keeps preview deploys, local dev, and
 * pre-Upstash environments working — the site degrades to "no live counter
 * number" instead of throwing.
 *
 * Never log the token. Never include it in error messages.
 */

import { Redis } from "@upstash/redis";
import { createHash } from "crypto";

let cached: Redis | null = null;

export function isRedisConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

function client(): Redis | null {
  if (cached) return cached;
  if (!isRedisConfigured()) return null;
  cached = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  return cached;
}

/* ──────────────────────────────────────────────────────────
   Key constants — snake_case, colon-separated namespace.
   Don't hardcode key names in callers; always import these.
   ────────────────────────────────────────────────────────── */

export const REDIS_KEYS = {
  /** Monotonic global counter — INCR on each new waitlist signup. */
  WAITLIST_COUNT: "halo:waitlist:count",
  /** Hash mapping email-hash → assigned position, for replay idempotency. */
  WAITLIST_POSITIONS: "halo:waitlist:positions",
} as const;

/**
 * Hash an email for use as a Redis hash field. We SHA-256 the lowercased
 * email so we never persist raw PII as a key name. One-way only — we don't
 * need to recover the email from the hash.
 */
export function emailFingerprint(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

/* ──────────────────────────────────────────────────────────
   Waitlist helpers
   ────────────────────────────────────────────────────────── */

export interface WaitlistReservation {
  position: number;
  /** True if this email had not been on the waitlist before. */
  isNew: boolean;
}

/**
 * Reserve (or look up) a waitlist position for an email. Idempotent — the
 * same email always yields the same position even across multiple calls.
 *
 * Concurrency: if two requests for the same email race, one INCR may be
 * "wasted" (counter advances by 2 instead of 1). The counter is a vanity
 * number, not a billing number, so the minor drift is acceptable. Both
 * requests will observe the same final position after the race resolves.
 *
 * Returns null if Redis isn't configured. Caller is responsible for the
 * UX fallback ("Your spot is reserved" vs. "You're founding member #247").
 */
export async function reserveWaitlistPosition(
  email: string
): Promise<WaitlistReservation | null> {
  const r = client();
  if (!r) return null;

  const field = emailFingerprint(email);

  // 1. Existing position? Replay — return the same number.
  const existing = await r.hget<number | string>(
    REDIS_KEYS.WAITLIST_POSITIONS,
    field
  );
  if (existing !== null && existing !== undefined) {
    const n = typeof existing === "number" ? existing : Number(existing);
    if (Number.isFinite(n) && n > 0) {
      return { position: n, isNew: false };
    }
  }

  // 2. New email — atomic increment, record in hash.
  const position = await r.incr(REDIS_KEYS.WAITLIST_COUNT);
  await r.hset(REDIS_KEYS.WAITLIST_POSITIONS, { [field]: position });
  return { position, isNew: true };
}

/**
 * Read the current waitlist count (without incrementing). Returns null if
 * Redis isn't configured, or if the key doesn't exist yet (no signups).
 */
export async function readWaitlistCount(): Promise<number | null> {
  const r = client();
  if (!r) return null;
  const raw = await r.get<number | string>(REDIS_KEYS.WAITLIST_COUNT);
  if (raw === null || raw === undefined) return 0;
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) ? n : null;
}
