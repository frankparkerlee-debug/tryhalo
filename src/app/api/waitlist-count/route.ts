/**
 * GET /api/waitlist-count
 *
 * Returns the current global waitlist count. Pre-launch this is the
 * "founding member #N" ticker shown on /stack. Post-launch it will track
 * paid founding signups (capped at 999).
 *
 * Response shape:
 *   {
 *     count: number | null,   // null = not configured / not yet signed up
 *     remaining: number | null,
 *     cap: 999,
 *     mode: "waitlist" | "customers",
 *   }
 *
 * Caching: 30 seconds at the edge. The ticker doesn't need to be
 * second-accurate; the ragged number feels more organic than perfectly live.
 */

import { NextResponse } from "next/server";
import { isRedisConfigured, readWaitlistCount } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FOUNDING_CAP = 999;

export async function GET() {
  if (!isRedisConfigured()) {
    return NextResponse.json(
      { count: null, remaining: null, cap: FOUNDING_CAP, mode: "waitlist" },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const count = await readWaitlistCount();
  const remaining =
    typeof count === "number" ? Math.max(0, FOUNDING_CAP - count) : null;

  return NextResponse.json(
    {
      count,
      remaining,
      cap: FOUNDING_CAP,
      mode: "waitlist",
    },
    {
      headers: {
        // Short edge cache keeps the endpoint cheap under bursts without
        // making the ticker feel frozen.
        "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=60",
      },
    }
  );
}
