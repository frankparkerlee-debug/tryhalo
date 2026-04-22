# OpenLoop × Halo Reference

**Purpose.** Single source of truth for what Halo charges per program, and the operational constraints each program carries under the MSA (Membership Services Agreement with OpenLoop Telehealth Services Inc.).

**Pricing model.** The number the patient pays on `tryhalo.co` is the number in the OpenLoop contract. There is no wholesale/retail split to reason about. The contract anchors each program on a **12-month rate** — that rate is the base Halo advertises. Halo sets the 6-month, 3-month, and monthly rates as flexibility premiums on top of the contract base.

This doc lives in-repo (not served as a route) so engineering, ops, and leadership share one reference.

---

## Source hierarchy

1. **MSA Schedule E** — binding. Contract rate per program = the `monthly12` base. Never charge less than this.
2. **`src/lib/programs.ts`** — the catalog rendered on `/stack` and product pages.
3. **`src/lib/programs.ts#PRICE_RATIOS`** — multipliers Halo applies to the contract base for 6/3/monthly cadences.

When Schedule E changes, update this doc AND `programs.ts` in the same PR. They must never drift.

---

## Cadence ratios

Halo derives four cadence tiers from a single contract base per program:

| Plan | Ratio | Delta |
|---|---|---|
| 12 months (committed) | 1.00 | contract base |
| 6 months (balanced) | 1.10 | +10% |
| 3 months (flexible) | 1.20 | +20% |
| Monthly (month-to-month) | 1.35 | +35% |

Longest commitment = lowest monthly. `cheapestPrice()` in `programs.ts` computes which cadence is cheapest per program at render time — never assumes 12-month is cheapest. If a future program inverts the curve, `StackBuilder.tsx` adapts without code changes.

---

## Program-by-program table

### ⚠️ Numbers marked `[CONFIRM]` are placeholders pending MSA Schedule E cross-check

Entries below use confirmed numbers where the user has called them out explicitly in conversation; all others are placeholders. Before Halo charges a real patient, every `[CONFIRM]` row must be replaced with the exact Schedule E number.

---

### 1. Testosterone Therapy — Men (`trt`)

| Field | Value |
|---|---|
| MSA base (12-mo rate, patient-facing) | **$149/mo** *(user-confirmed)* |
| Halo — 6 mo | $164/mo *(base × 1.10)* |
| Halo — 3 mo | $179/mo *(base × 1.20)* |
| Halo — monthly | $201/mo *(base × 1.35)* |
| Labs included | Yes |
| Formulations | Injection (testosterone cypionate) · Pill · Cream — all via 50-state pharmacy network |
| Sync-required states | AR, DC, DE, KS, MS, NM, RI, WV (initial Rx requires synchronous visit) |
| Age gate | 18–65 (out-of-range → medical review flag) |
| Comments | Injection has the most clinical data; cream and pill are legitimate alternatives the physician selects. Don't oversell needle-averse paths as "equivalent." |

### 2. Hormone Therapy — Women (`hrt`)

| Field | Value |
|---|---|
| MSA base (12-mo rate, patient-facing) | **$79/mo** *(user-confirmed)*, billed quarterly at $237 |
| Halo — 6 mo | $87/mo |
| Halo — 3 mo | $95/mo |
| Halo — monthly | $107/mo |
| Labs included | Yes |
| Formulations | Pill · Patch · Cream (estradiol; progesterone and testosterone added as indicated) |
| Sync-required states | Same list as TRT |
| Safety screen | Breast cancer history · blood clots · liver disease · pregnancy — any "yes" flags a medical-review hold |
| Comments | Quarterly billing on the 12-mo plan is a contract quirk. Copy: "Billed quarterly at the 12-mo rate." Don't advertise the $237 quarterly figure — just the $79/mo equivalent. |

### 3. Medical Weight Loss (`weight_loss`)

| Field | Value |
|---|---|
| MSA base (12-mo rate, patient-facing) | **`[CONFIRM]`** — currently placeholder $279/mo |
| Halo — 6 mo | $307/mo |
| Halo — 3 mo | $335/mo |
| Halo — monthly | $377/mo |
| Labs included | Yes |
| Formulations | Injection (weekly GLP-1) · Oral (compounded daily) |
| Sync-required states | Same list |
| Age gate | **18–74** (hard cap per MSA) |
| BMI guidance | 27+ typical; under-27 is a physician judgment call |
| Care Coaching | **Included on 12-mo plan**; $10/mo add-on on 6/3/monthly plans |
| GLP-1 compound options | Schedule E lists 10 compound variants (Options 1–10). These are the clinician's dosing decision matrix, not separately marketable products. Halo surfaces "Semaglutide or Tirzepatide" at most — physician picks the exact compound. |
| Comments | Contract rate must be verified. $279/mo is a placeholder. |

### 4. NAD+ Therapy (`nad`)

| Field | Value |
|---|---|
| MSA base (12-mo rate, patient-facing) | **`[CONFIRM]`** — currently placeholder $149/mo |
| Halo — 6 mo | $164/mo |
| Halo — 3 mo | $179/mo |
| Halo — monthly | $201/mo |
| Labs included | Yes |
| Formulations | Injection (sub-cu) · Oral dropper — both via pharmacy network |
| Sync-required states | Same list |
| Comments | Cellular Age Estimator on `/nad-therapy` is the primary acquisition path. |

### 5. Peptide Therapy (`peptides`)

| Field | Value |
|---|---|
| MSA base (12-mo rate, patient-facing) | **`[CONFIRM]`** — currently placeholder $199/mo |
| Halo — 6 mo | $219/mo |
| Halo — 3 mo | $239/mo |
| Halo — monthly | $269/mo |
| Labs included | No (peptide protocols don't require standing labs the way TRT/HRT do) |
| Formulations | Injection only (sub-cu, tiny insulin-gauge needle) |
| Sync-required states | Same list |
| Compounds | BPC-157 · TB-500 · CJC/ipamorelin (physician selects by protocol) |
| Comments | Needle-aversion is the #1 drop-off reason. Quiz includes reassurance: "4mm needle, thinner than a human hair." |

### 6. Sexual Wellness (`sexual_wellness`) — *Coming soon*

| Field | Value |
|---|---|
| Status | Coming soon, not selectable on /stack |
| MSA base | **`[CONFIRM]`** — currently placeholder $59/mo |
| Formulations | Sildenafil · Tadalafil (oral) |
| Comments | Straightforward OpenLoop offering; launch when marketing is ready. |

---

## Operational constraints (MSA-derived, apply across all programs)

| Constraint | Value |
|---|---|
| Initial Term | 12 months from first patient shipment |
| Cancellation policy (patient) | May cancel **after first order ships**. Pre-shipment cancellation is free with full refund. This is the "No commitment until meds ship" marketing hook. |
| Payment methods accepted | Visa · Mastercard · FSA/HSA · Apple Pay · Google Pay |
| Payment methods NOT accepted | **American Express** (explicitly excluded in MSA) |
| Settlement cadence | Weekly Wednesday (OpenLoop draws Membership Services Fee) |
| Labs vendor | Quest Diagnostics · Labcorp (OpenLoop orders, OpenLoop pays) |
| Medical records ownership | OpenLoop (as covered entity). Halo is Business Associate under a signed BAA. |
| 24/7 support | **Medical / clinical only** — physician access on-demand. Not concierge chat. Trust-signal copy must say "24/7 medical support," never generic "24/7 support." |
| HIPAA marketing rule | Halo marketing emails can reference that a user completed a quiz, never their specific labs or diagnosis. |
| Care Coaching availability | Medical Weight Loss only. Biweekly CMA sessions. Bundled free on 12-mo plan; $10/mo on shorter plans. |

---

## Disclosures required on-site (for legal review)

Already stubbed in-repo. Each page draft-pending-legal-review:

- `/terms` — Section 10 covers email and SMS consent (CAN-SPAM + TCPA)
- `/sms-terms` — TCPA carrier disclosure, STOP/HELP language, eligibility, PO Box
- `/privacy` — **not yet updated** to reflect SMS data handling; needs a pass before launch
- Footer bottom-bar — Halo Health Inc. · PO Box 600715, Dallas, TX 75206 (CAN-SPAM requires the physical postal address to be visible wherever emails originate)

---

## Things I'm waiting on confirmation for

1. **MSA Schedule E base rates** for NAD+, Weight Loss, Peptides, Sexual Wellness. TRT and HRT bases are user-confirmed.
2. **Whether OpenLoop specifies non-12-month cadence pricing in the contract** or if Halo is free to set 6/3/monthly premiums. Current `PRICE_RATIOS` (+10/+20/+35%) are Halo's choice; confirm they don't violate any MSA pricing clauses.
3. **Founding-rate mechanics** — first 999 *purchasing* members. Requires durable counter (Upstash Redis in flight). Waitlist position ≠ founding slot; must communicate this clearly.

---

## Change log

- 2026-04-21 — Initial doc. Retail tiers encoded in `programs.ts`. MSA base rates confirmed for TRT and HRT; four others pending.
- 2026-04-21 — Clarified pricing model: contract rate = patient-facing rate. No wholesale/retail split. The 12-month contract number is what Halo charges; 6/3/monthly cadences are Halo-set premiums on top.
