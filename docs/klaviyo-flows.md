# Klaviyo flow configs — Halo live contract

This document is the reference for configuring Klaviyo flows + segments on
top of the events the Halo app actually emits. **Do not invent new event
names** — if a flow needs a new trigger, add it to
`KLAVIYO_EVENT_NAME` in `src/lib/quiz-submission.ts` and wire it into the
submission endpoint first.

Last revised: 2026-04-21.

---

## 1. Source of truth

All event names, list env var mappings, and profile property names are
defined in `src/lib/quiz-submission.ts` and forwarded by
`src/app/api/quiz-submission/route.ts` via the helpers in `src/lib/klaviyo.ts`.

**Contract mechanics:**
- Every submission upserts the Klaviyo profile, sets profile properties,
  subscribes to the program's list (if consent = true), and fires a metric
  event.
- The event name is the exact string in `KLAVIYO_EVENT_NAME`. Flows trigger
  on this string.
- If a `KLAVIYO_LIST_*` env var is unset, list-subscribe silently skips;
  profile upsert + event tracking still run. Flows will still fire.

---

## 2. Event + list mapping (as shipped)

| Quiz slug | Klaviyo event name | List env var |
|---|---|---|
| `cellular_age` | `Completed Cellular Age Estimator` | `KLAVIYO_LIST_NAD` |
| `weight_loss_projection` | `Completed Weight Loss Projection` | `KLAVIYO_LIST_WEIGHT_LOSS` |
| `trt_drag` | `Completed TRT Drag Score` | `KLAVIYO_LIST_TRT` |
| `hrt_severity` | `Completed Menopause Severity Scale` | `KLAVIYO_LIST_HRT` |
| `peptides_recovery` | `Completed Peptides Recovery Score` | `KLAVIYO_LIST_PEPTIDES` |
| `nad` | `Completed NAD Quiz` | `KLAVIYO_LIST_NAD` |
| `trt` | `Completed TRT Quiz` | `KLAVIYO_LIST_TRT` |
| `hrt` | `Completed HRT Quiz` | `KLAVIYO_LIST_HRT` |
| `peptides` | `Completed Peptides Quiz` | `KLAVIYO_LIST_PEPTIDES` |
| `weight_loss` | `Completed Weight Loss Quiz` | `KLAVIYO_LIST_WEIGHT_LOSS` |
| `homepage` | `Completed Homepage Intake` | `KLAVIYO_LIST_HOMEPAGE` |
| `stack_built` | `Built Stack` | `KLAVIYO_LIST_FOUNDING_CIRCLE` |
| `intake_started` | `Started Intake` | `KLAVIYO_LIST_FOUNDING_CIRCLE` |
| `waitlist_joined` | `Joined Waitlist` | `KLAVIYO_LIST_FOUNDING_CIRCLE` |
| `founding_circle` (legacy) | `Joined Founding Circle` | `KLAVIYO_LIST_FOUNDING_CIRCLE` |

**Convention:** engagement tools share the same list as the full quiz for
that program. Flows branch off event name, not list membership.

---

## 3. Profile properties available to segments + flows

All properties are prefixed `halo_`. They persist across submissions (latest
value wins on overwrite). Full list in `PROFILE_PROP` in
`src/lib/quiz-submission.ts`; the most-used in flows:

| Property | Type | Use in flows |
|---|---|---|
| `halo_last_quiz` | string (QuizType) | Branch: "did they come from an engagement tool vs full quiz?" |
| `halo_last_quiz_tier` | `strong \| soft \| better_elsewhere \| medical_review` | Branch: "strong = push to schedule; soft = nurture" |
| `halo_primary_program` | `trt \| hrt \| nad \| peptides \| weight_loss` | Branch: program-specific content |
| `halo_cellular_age_delta` | integer | Segment: "cells older than chronological by 5+" |
| `halo_projected_weight_lbs_6mo` | integer | Personalization: show projected weight in email |
| `halo_symptom_score` / `halo_severity_score` / `halo_recovery_quotient` | integer 0–15 | Segment: severity tiers |
| `halo_stack` | array<string> | Segment: "selected TRT + NAD" |
| `halo_monthly_total` | integer | Personalization: dollar amount |
| `halo_waitlist_position` | integer | Personalization: "you're #247" |
| `halo_sms_consent` | boolean | **Required filter** on all SMS flows |
| `halo_email_consent_at` / `halo_sms_consent_at` | ISO datetime | Compliance audit trail |
| `halo_funnel_stage` | enum | Suppression: skip nurture if they've scheduled |
| `halo_utm_source` / `_medium` / `_campaign` | string | Attribution segments |

---

## 4. Flows to configure

### 4a. Intake Started nurture (triggered by `Started Intake`)

**Purpose:** The user started a full quiz but hasn't completed it. Recover them.

**Trigger:** Event = `Started Intake`.

**Filter:**
- `halo_last_quiz` has not been set in the last 30 minutes AND
  `halo_last_quiz` ≠ any full quiz event in the last 24h
  (avoid firing if they just completed a quiz).

**Timing + messages:**
1. **+30 min** — email: "You started looking at [program by primary_program]. Here's what happens next."
2. **+24 hr** — email: "Still thinking? Here are the three questions people ask us most."
3. **+72 hr** — email: "Last thought — the founding member spots are going fast." *(remove after launch)*
4. Flow exits on completed-quiz event (`Completed * Quiz`) or `Joined Waitlist`.

### 4b. Engagement tool nurture (triggered by any `Completed * Estimator / Score / Scale / Projection`)

**Purpose:** Email-only lead from a product page estimator. Move toward full quiz or /stack.

**Trigger:** Event = any of the 5 engagement events (one flow per program, or one shared flow branched on `halo_primary_program`).

**Filter:**
- `halo_last_quiz_tier` ≠ `better_elsewhere`  *(don't nurture people we told to look elsewhere)*
- Hasn't completed the matching full quiz in the last 90 days.

**Timing + messages:**
1. **+15 min** — email: result recap + "Here's what the number means." Link to `/stack?from={quiz_slug}`.
2. **+24 hr** — email: social proof ("What people like you have stacked"). Link to product page.
3. **+5 days** — email: "Take the full assessment for a personalized protocol" → link to `/stack` *(not `/quiz`; it redirects)*.
4. **+14 days** — email: "Still curious? Here's the founding member offer." (suppress post-launch)
5. Flow exits on `Built Stack`, `Joined Waitlist`, or completion of the matching full quiz.

### 4c. Waitlist welcome (triggered by `Joined Waitlist`)

**Purpose:** Confirm founding-member signup, set expectations, keep warm until access opens.

**Trigger:** Event = `Joined Waitlist`.

**Filter:** None (every waitlist submission should get this flow).

**Timing + messages:**
1. **Immediate** — transactional-feel email: "You're founding member #{{ person\|lookup:'halo_waitlist_position' }}. Here's what that means."
   - Include: locked-in Founding Circle pricing, access order, timing expectation.
2. **+3 days** — email: the founders' letter ("Why we built this for this moment in a man/woman's life").
3. **+10 days** — email: the science of your chosen stack ({{ halo_stack }}).
4. **Monthly until launch** — status email: "{{ total_members }} founding members. {{ weeks_until }} weeks to launch." *(requires a sendable Klaviyo list count metric or manual send)*
5. Flow exits on `Built Stack` → customers list (or when manually moved).

### 4d. Medical review escalation (triggered by tier = `medical_review`)

**Purpose:** User flagged a condition we can't treat via telehealth. Warm handoff.

**Trigger:** Any quiz completion event.

**Filter:** `halo_last_quiz_tier` = `medical_review`.

**Timing + messages:**
1. **Immediate** — email: "Your answers suggest working with your existing care team. Here's why, and here's what Halo can and can't help with." **No CTA to buy.**
2. (Internal Slack alert via Klaviyo webhook — optional; cross-reference `halo_last_quiz_source_url` for context.)
3. Flow does not re-trigger for 180 days.

### 4e. Better-elsewhere soft bounce (triggered by tier = `better_elsewhere`)

**Purpose:** We can help, but another provider fits better. Graceful off-ramp.

**Trigger:** Any quiz completion event.

**Filter:** `halo_last_quiz_tier` = `better_elsewhere`.

**Timing + messages:**
1. **Immediate** — email: honest reco + a recommended alternative category + "If your situation changes, we'll be here."
2. Flow terminates. Person stays on list; no further marketing for 90 days.

---

## 5. SMS flows (TCPA-gated)

**Every SMS flow must filter on `halo_sms_consent = true`.** Without this,
sending is a TCPA violation — the quiz UI only collects SMS consent when a
phone is provided and the separate SMS checkbox is ticked (one-to-one
consent, 2024 rule). Do not assume email consent = SMS consent.

**Minimum viable SMS flows:**
1. **Waitlist confirm (SMS)** — triggered by `Joined Waitlist` AND filter
   `halo_sms_consent = true`. One message, within 10 minutes: "Halo here — you're founding member #{{ halo_waitlist_position }}. Reply STOP to opt out."
2. **Launch day alert** — broadcast send to segment `halo_sms_consent = true AND halo_funnel_stage = waitlist`.

All SMS sends must include STOP/HELP compliance. Klaviyo handles this
automatically on SMS channel sends, but verify the sender profile in Klaviyo → SMS settings.

---

## 6. Segments worth building up front

| Segment name | Definition |
|---|---|
| `engaged_tool_only` | Has any `Completed * Estimator/Score/Scale/Projection` event, no `Completed * Quiz` event |
| `quiz_complete_no_stack` | Has any `Completed * Quiz`, no `Built Stack` |
| `stack_no_waitlist` | Has `Built Stack`, no `Joined Waitlist` |
| `founding_members` | Has `Joined Waitlist` |
| `high_severity_hrt` | `halo_last_quiz` = `hrt` or `hrt_severity` AND `halo_severity_score` ≥ 10 |
| `sms_subscribers` | `halo_sms_consent` = true |
| `needs_med_review` | `halo_last_quiz_tier` = `medical_review` |
| `ghosted_24h` | Has `Started Intake`, no completion in 24h |

---

## 7. Env vars to set on Render before launch

Without these, events still fire and profiles still update, but list-subscribe
is skipped (Klaviyo will still capture everyone as a profile, just not on the
intended list):

```
KLAVIYO_PRIVATE_API_KEY=<pk_*>
KLAVIYO_LIST_NAD=<list id>
KLAVIYO_LIST_TRT=<list id>
KLAVIYO_LIST_HRT=<list id>
KLAVIYO_LIST_PEPTIDES=<list id>
KLAVIYO_LIST_WEIGHT_LOSS=<list id>
KLAVIYO_LIST_HOMEPAGE=<list id>
KLAVIYO_LIST_FOUNDING_CIRCLE=<list id>
```

Create each list in Klaviyo admin first, copy the ID from the list URL, paste
into Render environment, redeploy.

---

## 8. How to test a flow before enabling

1. Put the flow in **Manual** status in Klaviyo.
2. Submit through the live app: e.g. run through `/peptide-therapy` Recovery Quotient with your own email.
3. Confirm the event shows up in the Klaviyo profile within ~30 seconds.
4. Confirm the expected profile properties are set (`halo_last_quiz_tier`, `halo_primary_program`, etc).
5. Use "Preview & Test" on each message, targeting your own profile, to confirm personalization renders.
6. Flip to **Live**.

---

## 9. Known gaps / TODO

- **Homepage router flow** is not defined here — the general `/quiz` homepage intake isn't live as an active full quiz (the route is a redirect to `/stack` as of 2026-04-21). When we actually build a homepage router quiz, add a flow for `Completed Homepage Intake`.
- **Post-launch customer list migration**: `stack_built`, `intake_started`, `waitlist_joined` currently all map to `KLAVIYO_LIST_FOUNDING_CIRCLE`. At launch, split so `Built Stack` routes to a new `KLAVIYO_LIST_CUSTOMERS` list.
- **Consent timestamp display**: `halo_email_consent_at` is set but not currently shown in any flow. Useful for audit.
