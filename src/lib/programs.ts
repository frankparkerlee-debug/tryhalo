/**
 * Halo program catalog — single source of truth for card data shown in
 * /stack, on per-program pages, and anywhere else we need to render a
 * program. Quiz results map into this via the `slug` field.
 *
 * Pricing model (2026-04-22 rewrite):
 *   - Each program lists explicit prices per billing term (monthly / quarterly
 *     / yearly). Terms are optional — a product can offer only `monthly` (e.g.
 *     branded GLP-1) or only `monthly + quarterly` (compounded GLP-1).
 *   - `monthly` is always required. `quarterly` covers 3 months, `yearly`
 *     covers 12 months. The displayed per-month headline updates to the
 *     effective per-month rate for whatever term the user picks.
 *   - Some programs have product-level variants (peptides → Sermorelin vs
 *     B12-stack; weight_loss → Compounded Semaglutide vs Ozempic® vs
 *     Zepbound®). Each variant has its own pricing. The card's variant picker
 *     replaces the formulation picker for these programs.
 *   - `flat: true` on a variant means branded / no term discount: render a
 *     single monthly price with no term selector on that card.
 *
 * Founding pricing:
 *   - The first FOUNDING_CAP (999) members lock in a flat FOUNDING_DISCOUNT
 *     (10%) off every term on every program — EXCEPT variants marked
 *     `foundingExempt: true` (branded Ozempic®/Zepbound® — pass-through costs).
 *   - Founding total = round(standardTotal × 0.9). Effective monthly derives
 *     from the discounted total as usual. Helper: resolveFoundingPrice().
 *   - Once the cap is hit the discount toggles off at the server; the client
 *     can read liveSlotsRemaining() to decide which price to headline.
 *
 * Add-ons:
 *   - Care Coach ($10/mo) is a gated supplemental that only appears in the
 *     stack when `weight_loss` is in the selected stack. Set via
 *     `requiresStackSlug`.
 *
 * Cancellation:
 *   - All programs: cancel anytime after the first order ships.
 *     Pre-shipment cancellation is free and full refund.
 */

import type { Formulation, Program } from "./quiz-submission";

export type Gender = "male" | "female" | "all";

/**
 * Billing term — the three cadences we sell. Not every product offers every
 * term; term availability is per-variant (or per-program if no variants).
 */
export type BillingTerm = "monthly" | "quarterly" | "yearly";

/**
 * Number of months covered by each term, used to derive effective-monthly
 * display on the cards and annualized totals at the bottom bar.
 */
export const TERM_MONTHS: Record<BillingTerm, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
};

/**
 * Display labels for the term tabs. Short enough for the 3-tab row on mobile.
 */
export const TERM_LABEL: Record<BillingTerm, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Annual",
};

/** Pricing per term — amount is the total paid for that term's cycle. */
export type TermPricing = Partial<Record<BillingTerm, number>>;

export interface ProgramVariant {
  /** Stable id used in analytics + stack payload. */
  id: string;
  /** User-facing name, e.g. "Compounded GLP-1". */
  label: string;
  /** One-line subtitle under the name. */
  subtitle?: string;
  /** Prices per term. monthly is required on every variant. */
  pricing: TermPricing & { monthly: number };
  /** Branded / flat-price products have no term discount — hide the term
   *  selector's influence on this card. Always priced at `monthly`. */
  flat?: boolean;
  /** Exempt from the founding-member discount. Used for pass-through costs
   *  (branded Ozempic®, Zepbound®) where 10% off would cut into margin. */
  foundingExempt?: boolean;
  /** Small-print note on the variant. */
  note?: string;
}

export interface ProgramCard {
  slug: Program;
  name: string;
  /** The specific compound(s) the physician may prescribe. */
  compound: string;
  /** 7–10 word benefit line shown under the name. */
  benefit: string;
  /** Who this is relevant for — drives visibility on /stack. */
  gender: Gender;
  /** Default pre-selected formulation, and the alternatives offered.
   *  For programs with `variants`, this is informational only (the card
   *  renders a variant picker instead of a formulation picker). */
  formulations: Formulation[];
  /** Base pricing. If `variants` is set, each variant's own pricing wins. */
  pricing: TermPricing & { monthly: number };
  /** Optional: product-level variants (e.g. Sermorelin vs B12-stack). When
   *  present, the card renders a variant picker and pricing reads from the
   *  selected variant rather than the card root. */
  variants?: ProgramVariant[];
  /** Whether labs are included in the monthly price. */
  labsIncluded: boolean;
  /** Not yet available — render as "Coming soon" card, not selectable. */
  comingSoon?: boolean;
  /** Link to the product page for more info. */
  href: string;
  /** Program-specific pricing footnote (optional). */
  pricingNote?: string;
  /** If set, this card is only rendered in /stack when the listed program
   *  slug is currently selected. Used for add-ons like Care Coach. */
  requiresStackSlug?: Program;
  /** Exempt from the founding-member discount at the whole-card level.
   *  Variant-level `foundingExempt` wins if both are set. */
  foundingExempt?: boolean;
}

/* ──────────────────────────────────────────────────────────
   Founding-member pricing
   ────────────────────────────────────────────────────────── */

/**
 * Flat discount off every term on every program for founding members.
 * Applied by resolveFoundingPrice() to the total for the selected term;
 * the effective monthly derives from the discounted total.
 */
export const FOUNDING_DISCOUNT = 0.10;

/**
 * Number of founding-member slots available. After this many waitlist
 * entrants, the discount toggles off. Marketing copy pairs this with
 * FOUNDING_OPEN — when that flips, this number becomes the claimed ceiling.
 */
export const FOUNDING_CAP = 999;

/**
 * MASTER TOGGLE for founding pricing across the entire site.
 *
 * While `true` (pre-launch and during the first FOUNDING_CAP signups), every
 * catalog-derived price helper applies the 10% founding discount. When the
 * FOUNDING_CAP is reached, flip this to `false` and redeploy — every
 * marketing surface, product page, and /stack card will show standard pricing
 * automatically because the helpers below gate on this flag.
 *
 * Branded Ozempic®/Zepbound® variants are `foundingExempt` regardless of this
 * flag and always render at their standard monthly price.
 *
 * NOTE: flipping to `false` does NOT auto-rewrite user-facing copy that says
 * "Founding members from…" — do a one-pass sweep at cutover to soften that
 * language. Numbers update automatically; narrative does not.
 */
export const FOUNDING_OPEN = true;

/* ──────────────────────────────────────────────────────────
   Catalog
   ────────────────────────────────────────────────────────── */

export const PROGRAM_CATALOG: ProgramCard[] = [
  {
    slug: "nad",
    name: "NAD+ Therapy",
    compound: "NAD+ precursor",
    benefit: "Cellular energy, recovery, and cognitive clarity",
    gender: "all",
    formulations: ["injection", "dropper"],
    pricing: {
      monthly: 229,
      quarterly: 537,
      yearly: 1937,
    },
    labsIncluded: true,
    href: "/nad-therapy",
  },
  {
    slug: "trt",
    name: "Testosterone (Men)",
    compound: "Testosterone cypionate / topical / oral",
    benefit: "Energy, strength, libido, and sharper focus",
    gender: "male",
    formulations: ["injection", "cream", "pill"],
    pricing: {
      monthly: 149,
      quarterly: 447,
      yearly: 1650,
    },
    labsIncluded: true,
    href: "/testosterone-therapy",
  },
  {
    slug: "hrt",
    name: "Hormone Therapy (Women)",
    compound: "Estradiol and progesterone as indicated",
    benefit: "Hot flashes, sleep, mood, and libido — rebalanced",
    gender: "female",
    formulations: ["pill", "patch", "cream"],
    pricing: {
      monthly: 79,
      quarterly: 237,
      yearly: 930,
    },
    labsIncluded: true,
    href: "/hormone-therapy",
  },
  {
    slug: "womens_testosterone",
    name: "Testosterone (Women)",
    compound: "Low-dose testosterone cypionate or compounded cream",
    benefit: "Libido, energy, mood, and lean-mass support",
    gender: "female",
    formulations: ["cream", "injection", "pill"],
    pricing: {
      monthly: 149,
      quarterly: 447,
      yearly: 1650,
    },
    labsIncluded: true,
    href: "/hormone-therapy",
    pricingNote: "Dosed at ~1/10th of male TRT. Often paired with HRT.",
  },
  {
    slug: "weight_loss",
    name: "Medical Weight Loss",
    compound: "GLP-1 therapy + physician oversight",
    benefit: "Sustained loss with physician oversight and coaching",
    gender: "all",
    formulations: ["injection"],
    // Root pricing falls through to variant[0] on render.
    pricing: {
      monthly: 219,
      quarterly: 657,
    },
    variants: [
      {
        id: "compound_glp1",
        label: "Compounded Semaglutide",
        subtitle: "503A/503B compounded semaglutide",
        pricing: {
          monthly: 219,
          quarterly: 657,
        },
        note: "Compounded formulation — same active ingredient as Ozempic®.",
      },
      {
        id: "ozempic",
        label: "Ozempic® (branded)",
        subtitle: "Branded semaglutide",
        pricing: {
          monthly: 1299,
        },
        flat: true,
        foundingExempt: true,
        note: "Requires prescription. Flat monthly price — no term or founding discount.",
      },
      {
        id: "zepbound",
        label: "Zepbound® (branded)",
        subtitle: "Branded tirzepatide",
        pricing: {
          monthly: 1399,
        },
        flat: true,
        foundingExempt: true,
        note: "Requires prescription. Flat monthly price — no term or founding discount.",
      },
    ],
    labsIncluded: true,
    href: "/weight-loss",
    pricingNote: "Care coaching available as a $10/mo add-on below.",
  },
  {
    slug: "peptides",
    name: "Peptide Therapy",
    compound: "Sermorelin or B12 / Glutathione / Lipo-C stack",
    benefit: "Recovery, lean mass, sleep depth, and metabolism",
    gender: "all",
    formulations: ["injection"],
    pricing: {
      monthly: 229,
      quarterly: 537,
      yearly: 1937,
    },
    variants: [
      {
        id: "sermorelin",
        label: "Sermorelin",
        subtitle: "GH-releasing peptide",
        pricing: {
          monthly: 229,
          quarterly: 537,
          yearly: 1937,
        },
      },
      {
        id: "b12_stack",
        label: "B12 / Glutathione / Lipo-C",
        subtitle: "Metabolic + recovery injectables",
        pricing: {
          monthly: 145,
          quarterly: 387,
          yearly: 1417,
        },
      },
    ],
    labsIncluded: false,
    href: "/peptide-therapy",
  },
  {
    slug: "sexual_wellness",
    name: "Sexual Wellness",
    compound: "Sildenafil / tadalafil",
    benefit: "Performance on demand — discreet, physician-managed",
    gender: "male",
    formulations: ["pill"],
    pricing: {
      monthly: 59,
    },
    labsIncluded: false,
    href: "/hormone-therapy",
    comingSoon: true,
  },
  // Add-on: Care Coach. Only rendered when weight_loss is selected.
  {
    slug: "care_coach",
    name: "Weight Loss Care Coach",
    compound: "1:1 coach + accountability check-ins",
    benefit:
      "Personal coach to keep you on track and protect your progress.",
    gender: "all",
    formulations: ["no_preference"],
    pricing: {
      monthly: 10,
    },
    labsIncluded: false,
    href: "/weight-loss",
    requiresStackSlug: "weight_loss",
    pricingNote: "Included as a $10/mo add-on with any Medical Weight Loss plan.",
  },
];

/* ──────────────────────────────────────────────────────────
   Price helpers
   ────────────────────────────────────────────────────────── */

/**
 * Return the effective per-month price for a given total paid at a term. For
 * monthly this is the total itself; for quarterly it's total/3; for yearly
 * total/12. Result is a float — format at display time.
 */
export function effectiveMonthly(
  total: number,
  term: BillingTerm
): number {
  return total / TERM_MONTHS[term];
}

/**
 * Given a pricing map and the user's selected term, return the price actually
 * shown on the card. If the selected term isn't offered on this product, fall
 * back to monthly (which every product has).
 */
export function resolveTermPrice(
  pricing: TermPricing & { monthly: number },
  term: BillingTerm
): { total: number; effectiveMonthly: number; appliedTerm: BillingTerm } {
  const offered = pricing[term];
  const appliedTerm: BillingTerm = offered !== undefined ? term : "monthly";
  const total = pricing[appliedTerm] ?? pricing.monthly;
  return {
    total,
    effectiveMonthly: effectiveMonthly(total, appliedTerm),
    appliedTerm,
  };
}

/**
 * Pick the default variant for a card. Always index 0 if present.
 */
export function defaultVariant(program: ProgramCard): ProgramVariant | null {
  return program.variants?.[0] ?? null;
}

/**
 * Given a program + a selected variant id + a term, return the effective
 * pricing the UI should show. Falls back to root pricing if no variants.
 */
export function resolveProgramPrice(
  program: ProgramCard,
  variantId: string | null,
  term: BillingTerm
): {
  total: number;
  effectiveMonthly: number;
  appliedTerm: BillingTerm;
  variant: ProgramVariant | null;
} {
  const variant =
    (program.variants?.find((v) => v.id === variantId)) ??
    defaultVariant(program);

  const pricing = variant?.pricing ?? program.pricing;
  // Flat variants (branded GLP-1s) always price at monthly regardless of term.
  const effectiveTerm: BillingTerm = variant?.flat ? "monthly" : term;
  const { total, effectiveMonthly, appliedTerm } = resolveTermPrice(
    pricing,
    effectiveTerm
  );
  return { total, effectiveMonthly, appliedTerm, variant };
}

/**
 * Return the lowest monthly price across all terms on a program (or its first
 * variant). Used for "From $X/mo*" headlines on marketing surfaces.
 */
export function cheapestMonthly(program: ProgramCard): {
  price: number;
  term: BillingTerm;
} {
  const variant = defaultVariant(program);
  const pricing = variant?.pricing ?? program.pricing;
  let best: { price: number; term: BillingTerm } = {
    price: effectiveMonthly(pricing.monthly, "monthly"),
    term: "monthly",
  };
  if (pricing.quarterly !== undefined && !variant?.flat) {
    const eff = effectiveMonthly(pricing.quarterly, "quarterly");
    if (eff < best.price) best = { price: eff, term: "quarterly" };
  }
  if (pricing.yearly !== undefined && !variant?.flat) {
    const eff = effectiveMonthly(pricing.yearly, "yearly");
    if (eff < best.price) best = { price: eff, term: "yearly" };
  }
  return best;
}

/* ──────────────────────────────────────────────────────────
   Founding-member pricing helpers
   ────────────────────────────────────────────────────────── */

/**
 * True if the given program + variant combination is eligible for the
 * founding-member discount. Variant-level `foundingExempt` wins over the
 * card-level flag, so a card can mix discounted and exempt variants (as
 * Medical Weight Loss does: compounded is discounted, branded is not).
 *
 * Gated on FOUNDING_OPEN — once the master toggle flips, nothing is eligible.
 */
export function isFoundingEligible(
  program: ProgramCard,
  variant: ProgramVariant | null
): boolean {
  if (!FOUNDING_OPEN) return false;
  if (variant?.foundingExempt) return false;
  if (program.foundingExempt && !variant) return false;
  return true;
}

/**
 * Apply the founding discount to a single total dollar amount. Rounds to the
 * nearest whole dollar so the displayed total is always clean. When
 * FOUNDING_OPEN is false this is a no-op — the input is returned unchanged,
 * so callers that reach for this helper directly (without checking variant
 * exemption) still get the right behavior after cutover.
 */
export function applyFoundingDiscount(total: number): number {
  if (!FOUNDING_OPEN) return total;
  return Math.round(total * (1 - FOUNDING_DISCOUNT));
}

/**
 * Founding-member equivalent of resolveProgramPrice(). Returns the discounted
 * total + effective monthly for the selected program/variant/term. If the
 * variant (or card) is founding-exempt, returns the standard pricing as-is
 * with `discounted: false`, so callers can decide whether to show a founding
 * badge.
 */
export function resolveFoundingPrice(
  program: ProgramCard,
  variantId: string | null,
  term: BillingTerm
): {
  total: number;
  effectiveMonthly: number;
  appliedTerm: BillingTerm;
  variant: ProgramVariant | null;
  discounted: boolean;
} {
  const standard = resolveProgramPrice(program, variantId, term);
  const eligible = isFoundingEligible(program, standard.variant);
  if (!eligible) {
    return { ...standard, discounted: false };
  }
  const total = applyFoundingDiscount(standard.total);
  return {
    total,
    effectiveMonthly: effectiveMonthly(total, standard.appliedTerm),
    appliedTerm: standard.appliedTerm,
    variant: standard.variant,
    discounted: true,
  };
}

/**
 * Founding-member version of cheapestMonthly(). Returns the lowest founding
 * effective-monthly across offered terms. Falls back to standard pricing for
 * founding-exempt programs/variants.
 */
export function cheapestMonthlyFounding(program: ProgramCard): {
  price: number;
  term: BillingTerm;
  discounted: boolean;
} {
  const variant = defaultVariant(program);
  const eligible = isFoundingEligible(program, variant);
  const std = cheapestMonthly(program);
  if (!eligible) {
    return { ...std, discounted: false };
  }
  const pricing = variant?.pricing ?? program.pricing;
  const offered: BillingTerm[] = (["monthly", "quarterly", "yearly"] as const).filter(
    (t) => pricing[t] !== undefined
  );
  // Flat variants can't enjoy term discounts — only the monthly price.
  const terms = variant?.flat ? (["monthly"] as const) : offered;
  let best: { price: number; term: BillingTerm } = {
    price: effectiveMonthly(applyFoundingDiscount(pricing.monthly), "monthly"),
    term: "monthly",
  };
  for (const t of terms) {
    const totalStd = pricing[t]!;
    const totalFounding = applyFoundingDiscount(totalStd);
    const eff = effectiveMonthly(totalFounding, t);
    if (eff < best.price) best = { price: eff, term: t };
  }
  return { ...best, discounted: true };
}

/**
 * Look up a program by slug. Returns null if the slug isn't in the catalog —
 * safer than throwing for URL-driven routing.
 */
export function getProgram(slug: string): ProgramCard | null {
  return PROGRAM_CATALOG.find((p) => p.slug === slug) ?? null;
}

/**
 * Filter the catalog by a gender context. Used by /stack to hide TRT from
 * women-identifying users and HRT from men-identifying users. Pass "all" (or
 * omit) to show everything.
 */
export function catalogForGender(gender?: Gender): ProgramCard[] {
  if (!gender || gender === "all") return PROGRAM_CATALOG;
  return PROGRAM_CATALOG.filter(
    (p) => p.gender === "all" || p.gender === gender
  );
}

/**
 * Given a quiz slug (from `?from=`), return the program that quiz primarily
 * routes to. The homepage quiz is a router, not a primary — callers should
 * also read `?primary=` for that case.
 */
export function primaryFromQuiz(quizSlug: string | null): Program | null {
  switch (quizSlug) {
    case "nad":
    case "cellular_age":
      return "nad";
    case "trt":
    case "trt_drag":
      return "trt";
    case "hrt":
    case "hrt_severity":
      return "hrt";
    case "weight_loss":
    case "weight_loss_projection":
      return "weight_loss";
    case "peptides":
    case "peptides_recovery":
      return "peptides";
    default:
      return null;
  }
}

/**
 * Format a price for display. Whole dollars; no cents.
 */
export function formatPrice(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

/**
 * Format an effective monthly price — whole dollars unless the value is under
 * $200 and has non-integer cents worth showing. Keeps headlines legible.
 */
export function formatMonthly(n: number): string {
  if (Math.abs(n - Math.round(n)) < 0.01) {
    return `$${Math.round(n).toLocaleString("en-US")}`;
  }
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Always-whole-dollar formatter for marketing headlines — collapses effective
 * monthly math (e.g. $1937/12 = $161.42) to a clean "$161/mo". Prefer this
 * over formatMonthly() in meta descriptions and marketing page copy.
 */
export function formatMonthlyRounded(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

/**
 * Copy constants for the trust-signal row. Centralized so they stay in sync
 * across /stack, product pages, and quiz result screens.
 */
export const TRUST_SIGNALS = [
  "24/7 medical support",
  "FSA/HSA accepted",
  "Labs included",
  "Cancel after first order ships",
] as const;
