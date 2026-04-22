"use client";

/**
 * StackBuilder — the terminal decision screen every quiz funnels into.
 *
 * URL contract:
 *   ?from={quiz_slug}       — which quiz the user came from (drives analytics)
 *   ?primary={program_slug} — which card is pre-selected and ringed gold
 *   ?gender=male|female|all — filters programs; omit to show all
 *   ?tier=strong|soft|...   — forwarded for Klaviyo segmentation
 *   ?flags=csv              — forwarded into the waitlist event (e.g.
 *                             "needle_averse,over_40") for Klaviyo segments
 *
 * Pricing model (2026-04-22):
 *   - Three billing terms: Monthly / Quarterly / Annual. Per-card headline
 *     shows the effective-monthly for the selected term. Bottom bar shows
 *     both the effective monthly (sum across stack) and the annualized total.
 *   - Variant products (peptides, weight_loss) render a variant picker in
 *     place of the formulation picker. Branded GLP-1 variants ignore the
 *     term toggle — they're always flat monthly.
 *   - Care Coach ($10/mo) is a gated add-on: only rendered when `weight_loss`
 *     is in the selected stack. Using `requiresStackSlug` on the catalog.
 *
 * Pre-launch behavior:
 *   - Terminal CTA captures email + phone + SMS consent and submits a
 *     `waitlist_joined` event with the full stack snapshot.
 *   - Submission endpoint atomically reserves a waitlist position in Upstash
 *     Redis and returns it on the same response.
 */

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";
import {
  PROGRAM_CATALOG,
  catalogForGender,
  formatPrice,
  formatMonthly,
  primaryFromQuiz,
  resolveProgramPrice,
  defaultVariant,
  TERM_LABEL,
  TERM_MONTHS,
  TRUST_SIGNALS,
  type ProgramCard,
  type ProgramVariant,
  type Gender,
  type BillingTerm,
} from "@/lib/programs";
import type { Formulation, Program } from "@/lib/quiz-submission";
import { submitQuiz } from "@/lib/quiz-client";
import { track } from "@/lib/tracking";

/* ──────────────────────────────────────────────────────────
   Billing term metadata
   ────────────────────────────────────────────────────────── */

/**
 * Order matters: left-to-right on the toggle row, most-committed first so the
 * user's eye lands on the highest-value option.
 */
const TERM_ORDER: BillingTerm[] = ["yearly", "quarterly", "monthly"];

/**
 * Flavor text under each tab. Not hardcoded as "Best price" — the toggle
 * computes the cheapest term dynamically across the visible catalog so the
 * badge stays honest if pricing changes.
 */
const TERM_FLAVOR: Record<BillingTerm, string> = {
  yearly: "Committed",
  quarterly: "Balanced",
  monthly: "Month-to-month",
};

/* ──────────────────────────────────────────────────────────
   Formulation display labels
   ────────────────────────────────────────────────────────── */

const FORMULATION_LABEL: Record<Formulation, string> = {
  injection: "Injection",
  pill: "Pill",
  cream: "Cream",
  patch: "Patch",
  dropper: "Dropper",
  no_preference: "No preference",
};

/* ──────────────────────────────────────────────────────────
   Card state per program
   ────────────────────────────────────────────────────────── */

interface CardState {
  selected: boolean;
  formulation: Formulation;
  /** Selected variant id (only meaningful when the program has variants). */
  variantId: string | null;
}

function initialCardState(
  catalog: ProgramCard[],
  primary: Program | null
): Record<Program, CardState> {
  const state: Record<string, CardState> = {};
  for (const p of catalog) {
    const variant = defaultVariant(p);
    state[p.slug] = {
      // Primary is pre-selected + locked. Add-ons (requiresStackSlug) are
      // selected by default if their parent is primary, otherwise off.
      selected:
        p.slug === primary ||
        (p.requiresStackSlug === primary && primary !== null),
      formulation: p.formulations[0],
      variantId: variant?.id ?? null,
    };
  }
  return state as Record<Program, CardState>;
}

/* ──────────────────────────────────────────────────────────
   Main component
   ────────────────────────────────────────────────────────── */

export default function StackBuilder() {
  return (
    <Suspense fallback={<StackBuilderSkeleton />}>
      <StackBuilderInner />
    </Suspense>
  );
}

function StackBuilderInner() {
  const params = useSearchParams();
  const from = params.get("from");
  const primaryParam = params.get("primary");
  const genderParam = (params.get("gender") as Gender | null) ?? "all";
  const flagsParam = params.get("flags");
  const tierParam = params.get("tier");

  const primary: Program | null = useMemo(() => {
    // Explicit ?primary wins; else derive from ?from
    if (primaryParam && PROGRAM_CATALOG.some((p) => p.slug === primaryParam)) {
      return primaryParam as Program;
    }
    return primaryFromQuiz(from);
  }, [from, primaryParam]);

  const catalog = useMemo(() => catalogForGender(genderParam), [genderParam]);

  // Default billing term — the cheapest effective-monthly across the catalog.
  // Yearly is the default for nearly every product; we compute to stay honest
  // if a future product's cheapest term isn't yearly.
  const cheapestTerm: BillingTerm = useMemo(() => {
    const totals: Record<BillingTerm, number> = {
      monthly: 0,
      quarterly: 0,
      yearly: 0,
    };
    for (const p of catalog) {
      if (p.comingSoon) continue;
      // Effective monthly for a term, using the default variant.
      for (const term of TERM_ORDER) {
        const { effectiveMonthly } = resolveProgramPrice(
          p,
          defaultVariant(p)?.id ?? null,
          term
        );
        totals[term] += effectiveMonthly;
      }
    }
    return (Object.entries(totals) as [BillingTerm, number][]).reduce(
      (best, entry) => (entry[1] < best[1] ? entry : best)
    )[0];
  }, [catalog]);

  const [term, setTerm] = useState<BillingTerm>(cheapestTerm);
  const [cardState, setCardState] = useState<Record<Program, CardState>>(() =>
    initialCardState(catalog, primary)
  );

  // Fire a stack_viewed impression for analytics once per mount.
  useEffect(() => {
    track("stack_viewed", {
      from: from ?? "direct",
      primary: primary ?? "none",
      gender: genderParam,
      tier: tierParam ?? "none",
    });
  }, [from, primary, genderParam, tierParam]);

  const toggleSelected = useCallback(
    (slug: Program) => {
      // Primary card is locked on — can't unselect.
      if (slug === primary) return;
      setCardState((prev) => ({
        ...prev,
        [slug]: { ...prev[slug], selected: !prev[slug].selected },
      }));
      track("stack_toggle", { program: slug });
    },
    [primary]
  );

  const setFormulation = useCallback(
    (slug: Program, formulation: Formulation) => {
      setCardState((prev) => ({
        ...prev,
        [slug]: { ...prev[slug], formulation },
      }));
      track("stack_formulation_change", { program: slug, formulation });
    },
    []
  );

  const setVariant = useCallback((slug: Program, variantId: string) => {
    setCardState((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], variantId },
    }));
    track("stack_variant_change", { program: slug, variant: variantId });
  }, []);

  // Visibility filter: add-ons (e.g. Care Coach) only render when their
  // required parent slug is selected in the current stack.
  const visibleCatalog = useMemo(
    () =>
      catalog.filter((p) => {
        if (!p.requiresStackSlug) return true;
        return cardState[p.requiresStackSlug]?.selected === true;
      }),
    [catalog, cardState]
  );

  const selectedPrograms = useMemo(
    () =>
      visibleCatalog
        .filter((p) => cardState[p.slug]?.selected && !p.comingSoon)
        .map((p) => {
          const state = cardState[p.slug];
          const price = resolveProgramPrice(p, state.variantId, term);
          return {
            slug: p.slug,
            formulation: state.formulation,
            variantId: state.variantId,
            total: price.total,
            effectiveMonthly: price.effectiveMonthly,
            appliedTerm: price.appliedTerm,
          };
        }),
    [visibleCatalog, cardState, term]
  );

  // Sum of each selected program's effective monthly (what users see per-card)
  const monthlyTotal = useMemo(
    () => selectedPrograms.reduce((sum, p) => sum + p.effectiveMonthly, 0),
    [selectedPrograms]
  );

  // Annualized total = effective monthly × 12 for each program.
  const annualTotal = useMemo(
    () => monthlyTotal * 12,
    [monthlyTotal]
  );

  // Per-cycle total = what they pay at checkout for the currently-selected
  // term. For monthly, that's the monthly sum; for quarterly, the sum of
  // each program's quarterly total (flat-priced variants always resolve to
  // monthly and contribute their monthly × months-in-term).
  const perCycleTotal = useMemo(() => {
    return selectedPrograms.reduce((sum, p) => {
      const months = TERM_MONTHS[term];
      if (p.appliedTerm === term) return sum + p.total;
      // Flat variant: always monthly. Show equivalent for the selected term
      // as monthly × months-in-cycle to keep the bottom bar coherent.
      return sum + p.total * months;
    }, 0);
  }, [selectedPrograms, term]);

  return (
    <>
      <Header from={from} />
      <TermToggle term={term} cheapest={cheapestTerm} onChange={setTerm} />
      <CardGrid
        catalog={visibleCatalog}
        primary={primary}
        cardState={cardState}
        term={term}
        onToggle={toggleSelected}
        onFormulationChange={setFormulation}
        onVariantChange={setVariant}
      />
      <TotalBar
        monthlyTotal={monthlyTotal}
        annualTotal={annualTotal}
        perCycleTotal={perCycleTotal}
        term={term}
        count={selectedPrograms.length}
      />
      <TrustSignalRow />
      <ReserveCTA
        selectedPrograms={selectedPrograms.map((p) => ({
          slug: p.slug,
          formulation: p.formulation,
          variantId: p.variantId,
        }))}
        monthlyTotal={monthlyTotal}
        annualTotal={annualTotal}
        term={term}
        from={from}
        flagsParam={flagsParam}
        primary={primary}
        tier={tierParam}
      />
      <Footnote />
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────────────────────── */

function Header({ from }: { from: string | null }) {
  const sourceLabel = from ? "Based on your quiz" : "Your plan";
  return (
    <section className="pt-24 md:pt-32 pb-8 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#6B7B6E] font-semibold mb-4">
          {sourceLabel}
        </p>
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#1C1C1E] font-bold tracking-tight mb-4">
          Build your plan.
        </h1>
        <p className="text-base md:text-lg text-[#86868B] max-w-xl mx-auto leading-relaxed">
          Pick the programs that fit. Add or remove anything. Your physician
          confirms everything at consult.
        </p>
      </div>
    </section>
  );
}

function TermToggle({
  term,
  cheapest,
  onChange,
}: {
  term: BillingTerm;
  cheapest: BillingTerm;
  onChange: (t: BillingTerm) => void;
}) {
  return (
    <div className="px-6 pb-8">
      <div className="max-w-2xl mx-auto">
        <div
          role="tablist"
          aria-label="Billing term"
          className="flex rounded-xl bg-white border border-[#E5E4E0] p-1"
        >
          {TERM_ORDER.map((t) => {
            const active = term === t;
            const isCheapest = t === cheapest;
            return (
              <button
                key={t}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  onChange(t);
                  track("stack_term_change", { term: t });
                }}
                className={`flex-1 px-2 md:px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  active
                    ? "bg-[#1C1C1E] text-white shadow-sm"
                    : "text-[#1C1C1E]/60 hover:text-[#1C1C1E]"
                }`}
              >
                <span className="block whitespace-nowrap">{TERM_LABEL[t]}</span>
                {isCheapest ? (
                  <span
                    className={`block text-[9px] md:text-[10px] uppercase tracking-wider mt-0.5 text-[#C8A96E]`}
                  >
                    Best price
                  </span>
                ) : (
                  <span
                    className={`block text-[9px] md:text-[10px] uppercase tracking-wider mt-0.5 ${
                      active ? "text-white/50" : "text-[#86868B]"
                    }`}
                  >
                    {TERM_FLAVOR[t]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CardGrid({
  catalog,
  primary,
  cardState,
  term,
  onToggle,
  onFormulationChange,
  onVariantChange,
}: {
  catalog: ProgramCard[];
  primary: Program | null;
  cardState: Record<Program, CardState>;
  term: BillingTerm;
  onToggle: (slug: Program) => void;
  onFormulationChange: (slug: Program, formulation: Formulation) => void;
  onVariantChange: (slug: Program, variantId: string) => void;
}) {
  // Primary first, supplementals after. Add-ons (requiresStackSlug) group at
  // the end of supplementals so they're visually adjacent to "more coaching".
  const primaryCard = primary
    ? catalog.find((p) => p.slug === primary) ?? null
    : null;
  const supplementalCards = catalog.filter(
    (p) => !primaryCard || p.slug !== primaryCard.slug
  );

  const renderCard = (program: ProgramCard) => {
    const state = cardState[program.slug];
    if (!state) return null;
    const isPrimary = program.slug === primary;
    const comingSoon = !!program.comingSoon;
    const price = resolveProgramPrice(program, state.variantId, term);

    return (
      <StackCard
        key={program.slug}
        program={program}
        isPrimary={isPrimary}
        selected={state.selected}
        comingSoon={comingSoon}
        formulation={state.formulation}
        variantId={state.variantId}
        effectiveMonthly={price.effectiveMonthly}
        variant={price.variant}
        term={term}
        onToggle={() => onToggle(program.slug)}
        onFormulationChange={(f) => onFormulationChange(program.slug, f)}
        onVariantChange={(v) => onVariantChange(program.slug, v)}
      />
    );
  };

  return (
    <section className="px-6 pb-10">
      <div className="max-w-5xl mx-auto">
        {primaryCard && (
          <>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#6B7B6E] font-semibold mb-3 px-1">
              Your Halo
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {renderCard(primaryCard)}
            </div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#86868B] font-semibold mb-3 px-1">
              Supplemental protocols
            </p>
          </>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supplementalCards.map(renderCard)}
        </div>
      </div>
    </section>
  );
}

function StackCard({
  program,
  isPrimary,
  selected,
  comingSoon,
  formulation,
  variantId,
  effectiveMonthly,
  variant,
  term,
  onToggle,
  onFormulationChange,
  onVariantChange,
}: {
  program: ProgramCard;
  isPrimary: boolean;
  selected: boolean;
  comingSoon: boolean;
  formulation: Formulation;
  variantId: string | null;
  effectiveMonthly: number;
  variant: ProgramVariant | null;
  term: BillingTerm;
  onToggle: () => void;
  onFormulationChange: (f: Formulation) => void;
  onVariantChange: (v: string) => void;
}) {
  // Gold ring only on primary. Sage ring on selected non-primary. Neutral
  // otherwise. Coming-soon cards are muted.
  const ringClass = isPrimary
    ? "ring-2 ring-[#C8A96E]/70 ring-offset-2 ring-offset-[#F8F7F4]"
    : selected
      ? "ring-1 ring-[#6B7B6E]/50"
      : "ring-1 ring-[#E5E4E0]";

  // When the card has variants, render variant picker instead of formulation
  // picker. Variant picker is richer — it shows product options, not delivery
  // methods.
  const hasVariants = (program.variants?.length ?? 0) > 1;
  const showFormulationPicker =
    !hasVariants && program.formulations.length > 1 && !comingSoon;

  const isFlatVariant = variant?.flat === true;
  const activeVariant =
    program.variants?.find((v) => v.id === variantId) ??
    program.variants?.[0] ??
    null;

  return (
    <article
      className={`relative bg-white rounded-2xl p-6 transition-all ${ringClass} ${
        comingSoon ? "opacity-60" : ""
      }`}
    >
      {isPrimary && (
        <span className="absolute -top-2.5 left-5 px-2.5 py-0.5 bg-[#C8A96E] text-white text-[10px] font-semibold tracking-wider uppercase rounded-full">
          Recommended
        </span>
      )}
      {comingSoon && (
        <span className="absolute -top-2.5 right-5 px-2.5 py-0.5 bg-[#86868B] text-white text-[10px] font-semibold tracking-wider uppercase rounded-full">
          Coming soon
        </span>
      )}
      {program.requiresStackSlug && !isPrimary && (
        <span className="absolute -top-2.5 right-5 px-2.5 py-0.5 bg-[#6B7B6E] text-white text-[10px] font-semibold tracking-wider uppercase rounded-full">
          Add-on
        </span>
      )}

      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="min-w-0">
          <h3 className="font-serif text-xl md:text-2xl text-[#1C1C1E] font-bold tracking-tight">
            {program.name}
          </h3>
          <p className="text-xs text-[#86868B] mt-0.5 truncate">
            {activeVariant?.subtitle ?? program.compound}
          </p>
        </div>
        <ToggleSwitch
          checked={selected}
          disabled={isPrimary || comingSoon}
          locked={isPrimary}
          onChange={onToggle}
        />
      </div>

      <p className="text-sm text-[#1C1C1E]/75 leading-relaxed mb-4">
        {program.benefit}
      </p>

      {/* Variant picker — replaces formulation picker on variant-based cards */}
      {hasVariants && !comingSoon && (
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-[#86868B] font-semibold mb-1.5">
            Choose your protocol
          </p>
          <div className="flex flex-wrap gap-1.5">
            {program.variants!.map((v) => {
              const active = variantId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onVariantChange(v.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    active
                      ? "bg-[#1C1C1E] text-white"
                      : "bg-[#F0EFEC] text-[#1C1C1E]/70 hover:bg-[#E5E4E0]"
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
          {activeVariant?.note && (
            <p className="text-[10px] text-[#86868B] mt-1.5 italic">
              {activeVariant.note}
            </p>
          )}
        </div>
      )}

      {/* Formulation picker — standard delivery-method picker */}
      {showFormulationPicker && (
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-[#86868B] font-semibold mb-1.5">
            Delivery method
          </p>
          <div className="flex flex-wrap gap-1.5">
            {program.formulations.map((f) => {
              const active = formulation === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => onFormulationChange(f)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    active
                      ? "bg-[#1C1C1E] text-white"
                      : "bg-[#F0EFEC] text-[#1C1C1E]/70 hover:bg-[#E5E4E0]"
                  }`}
                >
                  {FORMULATION_LABEL[f]}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-[#86868B] mt-1.5 italic">
            Your physician confirms at consult.
          </p>
        </div>
      )}

      {/* Price — effective monthly for the selected term */}
      <div className="flex items-baseline justify-between pt-3 border-t border-[#E5E4E0]">
        <span className="text-sm text-[#86868B]">
          {isFlatVariant ? "Price" : TERM_LABEL[term]}
        </span>
        <div className="text-right">
          <span className="font-serif text-2xl text-[#1C1C1E] font-bold">
            {formatMonthly(effectiveMonthly)}
          </span>
          <span className="text-sm text-[#86868B] ml-1">/mo</span>
        </div>
      </div>
      {program.pricingNote && (
        <p className="text-[11px] text-[#86868B] mt-1.5 leading-snug">
          {program.pricingNote}
        </p>
      )}

      <div className="mt-4 flex gap-3 text-[11px] text-[#86868B]">
        {program.labsIncluded && (
          <span className="inline-flex items-center gap-1">
            <Check className="w-3 h-3 text-[#6B7B6E]" /> Labs included
          </span>
        )}
        <Link
          href={program.href}
          className="inline-flex items-center gap-1 text-[#6B7B6E] hover:underline ml-auto"
        >
          Learn more
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
}

function ToggleSwitch({
  checked,
  disabled,
  locked,
  onChange,
}: {
  checked: boolean;
  disabled: boolean;
  locked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors flex-shrink-0 ${
        checked ? "bg-[#1C1C1E]" : "bg-[#E5E4E0]"
      } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      title={locked ? "Recommended — required to build a stack" : undefined}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
      {locked && (
        <Lock className="absolute -bottom-4 right-0 w-3 h-3 text-[#C8A96E]" />
      )}
    </button>
  );
}

function TotalBar({
  monthlyTotal,
  annualTotal,
  perCycleTotal,
  term,
  count,
}: {
  monthlyTotal: number;
  annualTotal: number;
  perCycleTotal: number;
  term: BillingTerm;
  count: number;
}) {
  // Headline: effective monthly — the number that matches the cards. Under it,
  // we show both per-cycle (what they pay at checkout) and annualized total.
  const termLabel = TERM_LABEL[term].toLowerCase();
  return (
    <section className="px-6 pb-8">
      <div className="max-w-5xl mx-auto bg-[#1C1C1E] text-white rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-1">
            Your plan
          </p>
          <p className="text-white/70 text-sm">
            {count} program{count === 1 ? "" : "s"} · {termLabel} billing
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-baseline justify-end gap-2">
            <span className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
              {formatMonthly(monthlyTotal)}
            </span>
            <span className="text-white/60 text-sm md:text-base">/mo</span>
          </div>
          <p className="text-white/50 text-[11px] mt-1">
            {term === "monthly"
              ? `${formatPrice(perCycleTotal)} billed monthly · ${formatPrice(
                  annualTotal
                )}/yr equivalent`
              : term === "quarterly"
                ? `${formatPrice(perCycleTotal)} billed every 3 months · ${formatPrice(
                    annualTotal
                  )}/yr total`
                : `${formatPrice(perCycleTotal)} billed annually`}
          </p>
        </div>
      </div>
    </section>
  );
}

function TrustSignalRow() {
  return (
    <section className="px-6 pb-10">
      <div className="max-w-5xl mx-auto border-t border-[#E5E4E0] pt-6">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[#1C1C1E]/70">
          {TRUST_SIGNALS.map((signal, i) => (
            <span key={signal} className="inline-flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#6B7B6E]" />
              {signal}
              {i < TRUST_SIGNALS.length - 1 && (
                <span className="text-[#E5E4E0] ml-4 hidden md:inline">·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReserveCTA({
  selectedPrograms,
  monthlyTotal,
  annualTotal,
  term,
  from,
  flagsParam,
  primary,
  tier,
}: {
  selectedPrograms: Array<{
    slug: Program;
    formulation: Formulation;
    variantId: string | null;
  }>;
  monthlyTotal: number;
  annualTotal: number;
  term: BillingTerm;
  from: string | null;
  flagsParam: string | null;
  primary: Program | null;
  tier: string | null;
}) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [position, setPosition] = useState<number | null>(null);

  const isValidEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const isValidPhone = (p: string) => {
    const t = p.trim();
    if (!t) return true;
    return t.replace(/\D/g, "").length >= 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email.");
      setStatus("error");
      return;
    }
    if (!isValidPhone(phone)) {
      setErrorMsg("Please enter a valid phone number (10+ digits).");
      setStatus("error");
      return;
    }
    if (selectedPrograms.length === 0) {
      setErrorMsg("Select at least one program to reserve your spot.");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    const flags = flagsParam
      ? flagsParam
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 20)
      : undefined;

    const res = await submitQuiz({
      quiz: "waitlist_joined",
      contact: {
        email: email.trim(),
        phone: phone.trim() || undefined,
      },
      answers: {
        stack: selectedPrograms.map((p) => ({
          slug: p.slug,
          formulation: p.formulation,
          variant: p.variantId,
        })),
        term,
        from: from ?? "direct",
      },
      derived: {
        primary_program: primary ?? undefined,
        stack: selectedPrograms.map((p) => p.slug),
        monthly_total: Math.round(monthlyTotal),
        annual_total: Math.round(annualTotal),
        formulation_preference: selectedPrograms[0]?.formulation,
        flags,
      },
      consent: {
        acceptedTerms: true,
        acceptedSms: smsConsent && !!phone.trim(),
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

    if (typeof res.position === "number") {
      setPosition(res.position);
    }

    setStatus("success");
    track("waitlist_joined", {
      from: from ?? "direct",
      primary: primary ?? "none",
      tier: tier ?? "none",
      stack_size: selectedPrograms.length,
      monthly_total: Math.round(monthlyTotal),
      annual_total: Math.round(annualTotal),
      term,
      sms_consent: smsConsent,
    });
  };

  if (status === "success") {
    return (
      <section className="px-6 pb-16">
        <div className="max-w-2xl mx-auto bg-[#F0EFEC] rounded-2xl p-8 md:p-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B7B6E] font-semibold mb-3">
            You&apos;re on the list
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-[#1C1C1E] font-bold mb-3 tracking-tight">
            {position
              ? `You're founding member #${position}.`
              : "Your spot is reserved."}
          </h2>
          <p className="text-sm text-[#1C1C1E]/70 max-w-md mx-auto leading-relaxed">
            We&apos;ll email when your access opens. Founding Circle pricing
            locks in the moment you start service — first 999 members only.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 pb-20">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 md:p-8 border border-[#E5E4E0]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#6B7B6E] font-semibold mb-3 text-center">
          Founding Circle — launching soon
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-[#1C1C1E] font-bold mb-2 text-center tracking-tight">
          Reserve your founding spot.
        </h2>
        <p className="text-sm text-[#86868B] text-center mb-6 leading-relaxed">
          First 999 members lock this price for life.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
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
            className="w-full px-5 py-3.5 bg-white border border-[#E5E4E0] focus:border-[#1C1C1E]/30 focus:outline-none rounded-xl text-sm text-[#1C1C1E] placeholder:text-[#86868B] transition-colors"
          />
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Phone (optional)"
            aria-label="Phone number (optional)"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (!e.target.value.trim()) setSmsConsent(false);
              if (status === "error") setStatus("idle");
            }}
            className="w-full px-5 py-3.5 bg-white border border-[#E5E4E0] focus:border-[#1C1C1E]/30 focus:outline-none rounded-xl text-sm text-[#1C1C1E] placeholder:text-[#86868B] transition-colors"
          />

          {phone.trim() && (
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none text-[#1C1C1E]/60">
              <input
                type="checkbox"
                checked={smsConsent}
                onChange={(e) => setSmsConsent(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 rounded border border-[#C9C7C0] bg-white flex-shrink-0"
              />
              <span className="text-[10px] leading-snug">
                Send me text updates. Msg frequency varies. Msg &amp; data rates
                may apply. Reply STOP to cancel.{" "}
                <a
                  href="/sms-terms"
                  target="_blank"
                  rel="noopener"
                  className="underline"
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
            className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all bg-[#1C1C1E] text-white hover:bg-[#333] ${
              status === "submitting" ? "opacity-60 cursor-wait" : ""
            }`}
          >
            {status === "submitting" ? "Reserving..." : "Reserve my spot"}
            {status !== "submitting" && <ArrowRight className="w-4 h-4" />}
          </button>

          {status === "error" && (
            <p className="text-xs text-red-500 pl-1">{errorMsg}</p>
          )}

          <p className="text-[10px] text-center leading-snug pt-1 text-[#86868B]">
            By submitting, you agree to Halo&apos;s{" "}
            <a href="/terms" target="_blank" rel="noopener" className="underline">
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
    </section>
  );
}

function Footnote() {
  return (
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <p className="text-[11px] text-[#86868B] leading-relaxed text-center">
          Prices shown are effective monthly rates for the selected term.
          Your physician confirms prescription, formulation, and dose at
          consult. All medications dispensed by a pharmacy in our 50-state
          network closest to you. Branded GLP-1 products (Ozempic, Zepbound)
          are priced monthly without term discounts. Labs included where
          indicated. Cancel anytime after your first order ships.
        </p>
      </div>
    </section>
  );
}

function StackBuilderSkeleton() {
  return (
    <section className="pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="h-6 w-32 bg-[#E5E4E0] rounded mb-4 mx-auto animate-pulse" />
        <div className="h-12 w-72 bg-[#E5E4E0] rounded mb-3 mx-auto animate-pulse" />
        <div className="h-4 w-96 max-w-full bg-[#E5E4E0] rounded mx-auto animate-pulse" />
      </div>
    </section>
  );
}
