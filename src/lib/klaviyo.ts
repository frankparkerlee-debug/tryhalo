/**
 * Klaviyo server-side client for Halo quiz submissions.
 *
 * Three operations, called in sequence from POST /api/quiz-submission:
 *   1. upsertProfile()  — create/update the email-keyed profile with properties
 *   2. trackEvent()     — fire a custom metric event against the profile
 *   3. subscribeToList() — add the profile to a list (if KLAVIYO_LIST_* is set)
 *
 * Each call is independently try/catch'd by the endpoint. A Klaviyo failure
 * never blocks the response to the client — the submission is still logged
 * and treated as successful from the user's perspective.
 *
 * Uses Klaviyo's 2024-10-15 API revision. Private key is server-only via
 * process.env.KLAVIYO_PRIVATE_API_KEY — never ship to the browser.
 */

const KLAVIYO_API_BASE = "https://a.klaviyo.com/api";
const KLAVIYO_REVISION = "2024-10-15";

function getApiKey(): string | null {
  const key = process.env.KLAVIYO_PRIVATE_API_KEY;
  if (!key || !key.trim()) return null;
  return key.trim();
}

function klaviyoHeaders(key: string): Record<string, string> {
  return {
    Authorization: `Klaviyo-API-Key ${key}`,
    accept: "application/vnd.api+json",
    "content-type": "application/vnd.api+json",
    revision: KLAVIYO_REVISION,
  };
}

/* ──────────────────────────────────────────────────────────
   Profile upsert — POST /api/profiles/ → 201 or 409
   On 409, extract the existing profile id and PATCH.
   Returns the profile_id on success, null on failure.
   ────────────────────────────────────────────────────────── */

export interface UpsertProfileInput {
  email: string;
  firstName?: string;
  phone?: string;
  /**
   * Custom properties (halo_ namespaced). These land under
   * profile.attributes.properties in Klaviyo and are segmentation-ready.
   */
  properties?: Record<string, unknown>;
}

export interface KlaviyoResult {
  ok: boolean;
  profileId?: string;
  error?: string;
}

export async function upsertProfile(
  input: UpsertProfileInput
): Promise<KlaviyoResult> {
  const key = getApiKey();
  if (!key) return { ok: false, error: "missing_api_key" };

  const attributes: Record<string, unknown> = { email: input.email };
  if (input.firstName) attributes.first_name = input.firstName;
  if (input.phone) attributes.phone_number = input.phone;
  if (input.properties && Object.keys(input.properties).length > 0) {
    attributes.properties = input.properties;
  }

  const body = JSON.stringify({
    data: { type: "profile", attributes },
  });

  // Try create. 201 → created, 409 → exists (response carries the id).
  const createRes = await fetch(`${KLAVIYO_API_BASE}/profiles/`, {
    method: "POST",
    headers: klaviyoHeaders(key),
    body,
  });

  if (createRes.status === 201) {
    const json = (await createRes.json()) as { data?: { id?: string } };
    return { ok: true, profileId: json.data?.id };
  }

  if (createRes.status === 409) {
    // Klaviyo returns the conflicting profile id inside errors[0].meta.duplicate_profile_id
    let existingId: string | undefined;
    try {
      const err = (await createRes.json()) as {
        errors?: Array<{ meta?: { duplicate_profile_id?: string } }>;
      };
      existingId = err.errors?.[0]?.meta?.duplicate_profile_id;
    } catch {
      // fall through
    }
    if (!existingId) return { ok: false, error: "duplicate_no_id" };

    // Patch the existing profile with new attributes.
    const patchBody = JSON.stringify({
      data: { type: "profile", id: existingId, attributes },
    });
    const patchRes = await fetch(
      `${KLAVIYO_API_BASE}/profiles/${existingId}/`,
      { method: "PATCH", headers: klaviyoHeaders(key), body: patchBody }
    );
    if (patchRes.ok) return { ok: true, profileId: existingId };
    return { ok: false, error: `patch_failed_${patchRes.status}` };
  }

  return { ok: false, error: `create_failed_${createRes.status}` };
}

/* ──────────────────────────────────────────────────────────
   Event tracking — POST /api/events/
   Creates a metric if it doesn't exist, records an event against
   the profile (keyed by email).
   ────────────────────────────────────────────────────────── */

export interface TrackEventInput {
  eventName: string;
  email: string;
  properties?: Record<string, unknown>;
  /** ISO timestamp; defaults to now on Klaviyo's side if omitted. */
  time?: string;
  /** Unique event id (for idempotency on retries). */
  uniqueId?: string;
}

export async function trackEvent(
  input: TrackEventInput
): Promise<KlaviyoResult> {
  const key = getApiKey();
  if (!key) return { ok: false, error: "missing_api_key" };

  const attributes: Record<string, unknown> = {
    properties: input.properties ?? {},
    metric: {
      data: {
        type: "metric",
        attributes: { name: input.eventName },
      },
    },
    profile: {
      data: {
        type: "profile",
        attributes: { email: input.email },
      },
    },
  };
  if (input.time) attributes.time = input.time;
  if (input.uniqueId) attributes.unique_id = input.uniqueId;

  const body = JSON.stringify({
    data: { type: "event", attributes },
  });

  const res = await fetch(`${KLAVIYO_API_BASE}/events/`, {
    method: "POST",
    headers: klaviyoHeaders(key),
    body,
  });

  // Klaviyo returns 202 Accepted for event tracking.
  if (res.status === 202 || res.ok) return { ok: true };
  return { ok: false, error: `event_failed_${res.status}` };
}

/* ──────────────────────────────────────────────────────────
   List subscribe — POST /api/lists/{list_id}/relationships/profiles/
   Adds an existing profile to a list. Silent no-op if the list id
   is missing/empty (graceful degradation pre-Klaviyo-setup).
   ────────────────────────────────────────────────────────── */

export interface SubscribeToListInput {
  listId: string | null | undefined;
  profileId: string;
}

export async function subscribeToList(
  input: SubscribeToListInput
): Promise<KlaviyoResult> {
  const key = getApiKey();
  if (!key) return { ok: false, error: "missing_api_key" };
  if (!input.listId || !input.listId.trim()) {
    return { ok: false, error: "missing_list_id" };
  }

  const body = JSON.stringify({
    data: [{ type: "profile", id: input.profileId }],
  });

  const res = await fetch(
    `${KLAVIYO_API_BASE}/lists/${input.listId.trim()}/relationships/profiles/`,
    { method: "POST", headers: klaviyoHeaders(key), body }
  );

  // 204 No Content on success; 200 also acceptable.
  if (res.status === 204 || res.ok) return { ok: true };
  return { ok: false, error: `list_failed_${res.status}` };
}

export function isKlaviyoConfigured(): boolean {
  return getApiKey() !== null;
}
