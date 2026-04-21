/**
 * In-memory IP-keyed rate limiter for the quiz submission endpoint.
 *
 * Token-bucket semantics: each IP has N tokens; each request consumes one;
 * tokens refill at a steady rate. Resident in the Node process, so it's
 * only effective on a single instance. When we scale horizontally, swap
 * the storage to Redis / Upstash — the check() signature stays identical.
 *
 * This is a brute-force-and-accidental-double-submit backstop, not an
 * anti-DDoS layer. DDoS belongs at the edge (Render, Cloudflare).
 */

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const DEFAULT_CAPACITY = 10; // 10 submissions per window per IP
const DEFAULT_REFILL_MS = 60_000; // refills to full in 60s

const buckets = new Map<string, Bucket>();

// Garbage-collect idle buckets so the map doesn't grow unboundedly.
// An IP that's been silent for >10 minutes gets evicted.
const IDLE_EVICTION_MS = 10 * 60_000;
let lastSweep = Date.now();

function sweepIfDue(now: number): void {
  if (now - lastSweep < IDLE_EVICTION_MS) return;
  lastSweep = now;
  for (const [ip, b] of buckets) {
    if (now - b.lastRefill > IDLE_EVICTION_MS) buckets.delete(ip);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

/**
 * Consume one token for the given key (usually an IP address).
 * Returns { allowed, remaining, retryAfterMs }.
 */
export function check(
  key: string,
  capacity: number = DEFAULT_CAPACITY,
  refillMs: number = DEFAULT_REFILL_MS
): RateLimitResult {
  const now = Date.now();
  sweepIfDue(now);

  let b = buckets.get(key);
  if (!b) {
    b = { tokens: capacity, lastRefill: now };
    buckets.set(key, b);
  } else {
    // Refill proportional to elapsed time since lastRefill.
    const elapsed = now - b.lastRefill;
    if (elapsed > 0) {
      const refilled = (elapsed / refillMs) * capacity;
      b.tokens = Math.min(capacity, b.tokens + refilled);
      b.lastRefill = now;
    }
  }

  if (b.tokens >= 1) {
    b.tokens -= 1;
    return {
      allowed: true,
      remaining: Math.floor(b.tokens),
      retryAfterMs: 0,
    };
  }

  // Not enough tokens — compute how long until one is available.
  const needed = 1 - b.tokens;
  const retryAfterMs = Math.ceil((needed / capacity) * refillMs);
  return { allowed: false, remaining: 0, retryAfterMs };
}

/**
 * Extract a best-effort client IP from a Next.js Request.
 * Respects x-forwarded-for (Render, Vercel, Cloudflare) and falls back to
 * x-real-ip. Returns "unknown" if nothing usable is present — in that case
 * we still rate-limit, but against a single shared bucket (intentional;
 * an anonymous flood still gets throttled).
 */
export function clientIpFromRequest(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const xrip = req.headers.get("x-real-ip");
  if (xrip) return xrip.trim();
  return "unknown";
}
