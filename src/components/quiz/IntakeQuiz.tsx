"use client";

/**
 * IntakeQuiz — the config-driven renderer for every full clinical intake quiz
 * on Halo (TRT, HRT, NAD+, Peptides, Weight Loss).
 *
 * One component, one look. You hand it an IntakeConfig from intake-quizzes.ts
 * and it produces the whole experience: intro → N questions → lead capture →
 * router.push("/stack?…"). The /quiz/[slug] route is just a config lookup and
 * a render call.
 *
 * Why a single renderer:
 *   - The homepage /quiz page is bespoke per-step (gender-persona coloring,
 *     science gate, branded hormone chart, five custom render blocks). That
 *     was the right call for the top-of-funnel experience. It is NOT the right
 *     call for five near-identical clinical intakes. We'd be copy-pasting and
 *     drifting on every tweak. Config-driven means one bug fix, five quizzes
 *     fixed. One A/B copy change, five quizzes updated.
 *
 * What we cover:
 *   - `single`   — one-of-many pill, auto-advance 300ms after pick
 *   - `multi`    — checkbox pills with "None of these" exclusivity,
 *                  continue button gated on ≥1 selection
 *   - `number`   — numeric input validated against question.min/max
 *   - `text`     — short freetext (unused today but cheap to keep)
 *   - `showIf`   — skip invisible questions; progress dots recompute
 *   - `whyWeAsk` — collapsible disclosure chip under the question
 *
 * On submit:
 *   1. QuizCapture posts to /api/quiz-submission with
 *        quiz  = config.slug
 *        answers = all collected answers
 *        derived = { tier, primary_program, ...config.computeDerived(answers) }
 *        primaryProgram = config.primary
 *   2. onSuccess fires — we router.push(/stack?from=<slug>&primary=<primary>&tier=<tier>)
 *   3. Per-tier messaging on /stack explains "a clinician will confirm" for
 *      medical_review, or a soft nudge for better_elsewhere. Neither blocks
 *      the funnel — soft qualification only.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Minus, Plus } from "lucide-react";
import HaloLogo from "@/components/HaloLogo";
import QuizCapture from "@/components/quiz/QuizCapture";
import { track } from "@/lib/tracking";
import type {
  IntakeConfig,
  IntakeAnswer,
  IntakeAnswers,
  IntakeOption,
  IntakeQuestion,
} from "@/lib/intake-quizzes";
import type { QuizDerived } from "@/lib/quiz-submission";

/* ──────────────────────────────────────────────────────────
   Shared option pills — module-level so they don't re-mount
   ────────────────────────────────────────────────────────── */

function PillOption({
  label,
  note,
  selected,
  onClick,
  disabled,
}: {
  label: string;
  note?: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group w-full flex items-start gap-3.5 px-5 py-4 rounded-full bg-white text-left transition-all duration-300 border ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      }`}
      style={{
        borderColor: selected ? "#1C1C1E" : "rgba(28, 28, 30, 0.08)",
        boxShadow: selected ? "0 4px 18px rgba(28, 28, 30, 0.08)" : "none",
      }}
    >
      <span
        className="mt-1 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border-[1.5px] transition-colors"
        style={{
          borderColor: selected ? "#1C1C1E" : "rgba(28, 28, 30, 0.25)",
          backgroundColor: selected ? "#1C1C1E" : "transparent",
        }}
        aria-hidden="true"
      >
        {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      <span className="flex-1">
        <span className="block text-halo-charcoal text-[15px] font-medium leading-tight">
          {label}
        </span>
        {note && (
          <span className="block text-[12px] text-halo-charcoal/50 leading-snug mt-1">
            {note}
          </span>
        )}
      </span>
    </button>
  );
}

function CheckOption({
  label,
  note,
  selected,
  onClick,
  disabled,
}: {
  label: string;
  note?: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group w-full flex items-start gap-3 px-5 py-4 rounded-2xl bg-white text-left transition-all duration-300 border ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      }`}
      style={{
        borderColor: selected ? "#1C1C1E" : "rgba(28, 28, 30, 0.08)",
        boxShadow: selected ? "0 4px 18px rgba(28, 28, 30, 0.08)" : "none",
      }}
    >
      <span
        className="mt-0.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border-[1.5px] transition-colors"
        style={{
          borderColor: selected ? "#1C1C1E" : "rgba(28, 28, 30, 0.25)",
          backgroundColor: selected ? "#1C1C1E" : "transparent",
        }}
        aria-hidden="true"
      >
        {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </span>
      <span className="flex-1">
        <span className="block text-halo-charcoal text-[14px] md:text-[15px] font-medium leading-tight">
          {label}
        </span>
        {note && (
          <span className="block text-[12px] text-halo-charcoal/50 leading-snug mt-1">
            {note}
          </span>
        )}
      </span>
    </button>
  );
}

/* ──────────────────────────────────────────────────────────
   Why We Ask — collapsible disclosure chip
   ────────────────────────────────────────────────────────── */

function WhyWeAsk({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-7">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-halo-charcoal/15 text-[10px] font-semibold uppercase tracking-[0.2em] text-halo-charcoal/60 hover:border-halo-charcoal/30 hover:text-halo-charcoal transition-colors"
        aria-expanded={open}
      >
        Why we ask
        {open ? (
          <Minus className="w-3 h-3" strokeWidth={2.5} />
        ) : (
          <Plus className="w-3 h-3" strokeWidth={2.5} />
        )}
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-[13px] text-halo-charcoal/60 leading-relaxed max-w-md">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Answer read helpers — coerce between IntakeAnswer union forms
   ────────────────────────────────────────────────────────── */

function asString(v: IntakeAnswer | undefined): string {
  return typeof v === "string" ? v : "";
}
function asArray(v: IntakeAnswer | undefined): string[] {
  return Array.isArray(v) ? v : [];
}
function asNumber(v: IntakeAnswer | undefined): string {
  return typeof v === "number" ? String(v) : typeof v === "string" ? v : "";
}

/* ──────────────────────────────────────────────────────────
   Validation — is the current question answered well enough to continue?
   ────────────────────────────────────────────────────────── */

function isQuestionComplete(q: IntakeQuestion, answers: IntakeAnswers): boolean {
  if (q.required === false) return true;
  const raw = answers[q.id];
  if (q.type === "single") return typeof raw === "string" && raw.length > 0;
  if (q.type === "multi") return Array.isArray(raw) && raw.length > 0;
  if (q.type === "number") {
    const n = typeof raw === "number" ? raw : Number(raw);
    if (!Number.isFinite(n)) return false;
    if (q.min != null && n < q.min) return false;
    if (q.max != null && n > q.max) return false;
    return true;
  }
  if (q.type === "text") return typeof raw === "string" && raw.trim().length > 0;
  return true;
}

/* ──────────────────────────────────────────────────────────
   Main component
   ────────────────────────────────────────────────────────── */

type Step = { kind: "question"; index: number } | { kind: "capture" };

export interface IntakeQuizProps {
  config: IntakeConfig;
}

export default function IntakeQuiz({ config }: IntakeQuizProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<IntakeAnswers>({});
  const [step, setStep] = useState<Step>({ kind: "question", index: 0 });
  const [numberError, setNumberError] = useState<string>("");

  /* ── Visible questions recompute whenever answers change.
        `showIf` lets a quiz skip questions based on earlier answers. ── */
  const visibleQuestions = useMemo<IntakeQuestion[]>(
    () => config.questions.filter((q) => (q.showIf ? q.showIf(answers) : true)),
    [config.questions, answers]
  );

  /* ── Lifecycle tracking ── */
  useEffect(() => {
    track("quiz_start", { quiz: config.slug });
  }, [config.slug]);

  useEffect(() => {
    if (step.kind === "question") {
      track("quiz_step_view", {
        quiz: config.slug,
        step: step.index + 1,
        question_id: visibleQuestions[step.index]?.id ?? null,
      });
    } else if (step.kind === "capture") {
      track("quiz_step_view", { quiz: config.slug, step: "capture" });
    }
  }, [step, config.slug, visibleQuestions]);

  useEffect(() => {
    const handleUnload = () => {
      if (step.kind !== "capture") {
        track("quiz_abandoned", {
          quiz: config.slug,
          step: step.index + 1,
        });
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [step, config.slug]);

  /* ── Navigation ── */
  const goToQuestion = useCallback((index: number) => {
    setNumberError("");
    setStep({ kind: "question", index });
  }, []);

  const goNext = useCallback(() => {
    if (step.kind !== "question") return;
    const next = step.index + 1;
    if (next >= visibleQuestions.length) {
      setNumberError("");
      setStep({ kind: "capture" });
    } else {
      goToQuestion(next);
    }
  }, [step, visibleQuestions.length, goToQuestion]);

  const goBack = useCallback(() => {
    if (step.kind === "capture") {
      goToQuestion(visibleQuestions.length - 1);
    } else if (step.kind === "question" && step.index > 0) {
      goToQuestion(step.index - 1);
    }
    // At Q1 (index 0), the header renders the Home link instead of a Back
    // button, so there's nothing to fall through to here.
  }, [step, visibleQuestions.length, goToQuestion]);

  /* ── Answer setters ── */
  const setAnswer = useCallback((id: string, value: IntakeAnswer) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const toggleMulti = useCallback(
    (question: IntakeQuestion, value: string) => {
      setAnswers((prev) => {
        const existing = Array.isArray(prev[question.id]) ? (prev[question.id] as string[]) : [];
        // "None of these" is always exclusive — picking it clears everything else,
        // picking anything else clears "None".
        const NONE_VALUES = new Set(["none", "none_of_these"]);
        const isNone = NONE_VALUES.has(value);
        if (isNone) {
          if (existing.includes(value)) {
            return { ...prev, [question.id]: [] };
          }
          return { ...prev, [question.id]: [value] };
        }
        const withoutNone = existing.filter((v) => !NONE_VALUES.has(v));
        const next = withoutNone.includes(value)
          ? withoutNone.filter((v) => v !== value)
          : [...withoutNone, value];
        return { ...prev, [question.id]: next };
      });
    },
    []
  );

  /* ── Single-select with auto-advance ── */
  const pickSingle = useCallback(
    (question: IntakeQuestion, option: IntakeOption) => {
      setAnswer(question.id, option.value);
      track("quiz_answer", {
        quiz: config.slug,
        question_id: question.id,
        value: option.value,
      });
      // Small delay so the user sees the selection register.
      window.setTimeout(() => {
        goNext();
      }, 280);
    },
    [setAnswer, goNext, config.slug]
  );

  /* ── Number input commit (on Continue) ── */
  const commitNumber = useCallback(
    (question: IntakeQuestion) => {
      const raw = answers[question.id];
      const n = typeof raw === "number" ? raw : Number(raw);
      if (!Number.isFinite(n)) {
        setNumberError("Please enter a number.");
        return false;
      }
      if (question.min != null && n < question.min) {
        setNumberError(`Please enter at least ${question.min}.`);
        return false;
      }
      if (question.max != null && n > question.max) {
        setNumberError(`Please enter at most ${question.max}.`);
        return false;
      }
      setAnswer(question.id, n);
      track("quiz_answer", {
        quiz: config.slug,
        question_id: question.id,
        value: n,
      });
      return true;
    },
    [answers, setAnswer, config.slug]
  );

  /* ── Derived payload for submit ── */
  const tier = useMemo(
    () => (step.kind === "capture" ? config.computeTier(answers) : null),
    [step, config, answers]
  );

  const derived = useMemo<QuizDerived>(() => {
    const extra = config.computeDerived?.(answers) ?? {};
    const payload: QuizDerived = {
      ...extra,
      primary_program: config.primary,
    };
    if (tier) payload.tier = tier;
    return payload;
  }, [config, answers, tier]);

  /* ── Progress dots (N questions + capture) ── */
  const totalDots = visibleQuestions.length + 1;
  const currentDot =
    step.kind === "question" ? step.index : totalDots - 1;

  /* ──────────────────────────────────────────────────────────
     Render
     ────────────────────────────────────────────────────────── */

  return (
    <>
      <style>{`
        body > *:not(main):not(script):not(style):not(next-route-announcer) {
          display: none !important;
        }
        body > main {
          display: block !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
        }
      `}</style>

      <div className="min-h-screen w-full flex flex-col bg-halo-stone relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 45% at 50% 0%, rgba(255, 232, 185, 0.45) 0%, transparent 60%)",
          }}
        />

        {/* ── TOP BAR ── */}
        <header className="relative z-20 flex items-center justify-between px-6 py-5 md:px-8 md:py-6">
          {step.kind === "question" && step.index === 0 ? (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-halo-charcoal/50 hover:text-halo-charcoal transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
          ) : (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-halo-charcoal/50 hover:text-halo-charcoal transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          <Link href="/" className="flex items-center">
            <HaloLogo size="md" variant="light" />
          </Link>

          <div className="w-16" />
        </header>

        {/* ── PROGRESS DOTS ── */}
        <div className="relative z-20 flex justify-center pt-1 pb-2">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalDots }).map((_, i) => {
              const isCurrent = i === currentDot;
              const isPast = i < currentDot;
              return (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    isCurrent ? "w-6" : "w-1.5"
                  }`}
                  style={{
                    backgroundColor: isCurrent
                      ? "#1C1C1E"
                      : isPast
                        ? "rgba(28, 28, 30, 0.55)"
                        : "rgba(28, 28, 30, 0.15)",
                  }}
                  aria-hidden="true"
                />
              );
            })}
          </div>
        </div>

        {/* ── TRUST STRIP ── */}
        <div className="relative z-20 flex justify-center px-4 pb-2">
          <p className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/40 text-center">
            Board-certified physicians
            <span className="mx-1.5 md:mx-2 text-halo-charcoal/25">&middot;</span>
            USP-compounded
            <span className="mx-1.5 md:mx-2 text-halo-charcoal/25">&middot;</span>
            HIPAA secure
          </p>
        </div>

        {/* ── MAIN ── */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 md:py-12 w-full">
          <div className="w-full max-w-xl mx-auto">
            {step.kind === "question" && visibleQuestions[step.index] && (
              <QuestionCard
                question={visibleQuestions[step.index]}
                answers={answers}
                numberError={numberError}
                clearNumberError={() => setNumberError("")}
                onPickSingle={pickSingle}
                onToggleMulti={toggleMulti}
                onSetAnswer={setAnswer}
                onContinue={() => {
                  const q = visibleQuestions[step.index];
                  if (q.type === "number" && !commitNumber(q)) return;
                  goNext();
                }}
              />
            )}

            {step.kind === "capture" && (
              <div className="w-full max-w-lg mx-auto">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-center mb-4 text-[#6B7B6E]">
                  {config.eyebrow}
                </p>
                <h1 className="font-serif text-[30px] md:text-[38px] leading-[1.1] text-halo-charcoal tracking-tight mb-3 text-center">
                  {config.captureHeadline}
                </h1>
                <p className="text-[14px] md:text-[15px] text-halo-charcoal/55 mb-6 text-center leading-relaxed">
                  {config.captureSubhead}
                </p>

                {tier === "medical_review" && (
                  <div className="mb-6 p-5 rounded-2xl border border-[#C8A96E]/40 bg-[#FEF8E9]">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#9C7F3E] mb-2">
                      Physician review
                    </p>
                    <p className="text-[14px] text-halo-charcoal/70 leading-relaxed">
                      You flagged a condition your clinician will want to review
                      carefully. Nothing you see next is a prescription —
                      it&rsquo;s a starting point for the conversation.
                    </p>
                  </div>
                )}

                {tier === "better_elsewhere" && (
                  <div className="mb-6 p-5 rounded-2xl border border-halo-charcoal/10 bg-white">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-halo-charcoal/60 mb-2">
                      A gentler starting point
                    </p>
                    <p className="text-[14px] text-halo-charcoal/70 leading-relaxed">
                      Based on your answers this specific program may not be the
                      best fit, but we&rsquo;ll show you what could be. Your
                      clinician confirms everything at intake.
                    </p>
                  </div>
                )}

                <QuizCapture
                  quiz={config.slug}
                  answers={answers}
                  derived={derived}
                  primaryProgram={config.primary}
                  headline=""
                  subhead=""
                  ctaLabel="Unlock my recommendation"
                  onSuccess={() => {
                    const params = new URLSearchParams();
                    params.set("from", config.slug);
                    params.set("primary", config.primary);
                    if (tier) params.set("tier", tier);
                    router.push(`/stack?${params.toString()}`);
                  }}
                />

                <p className="text-[11px] text-halo-charcoal/40 text-center mt-6 leading-relaxed">
                  No charges now. A Halo clinician reviews every intake before
                  any protocol is issued.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   Question card — dispatches on question.type
   ────────────────────────────────────────────────────────── */

function QuestionCard({
  question,
  answers,
  numberError,
  clearNumberError,
  onPickSingle,
  onToggleMulti,
  onSetAnswer,
  onContinue,
}: {
  question: IntakeQuestion;
  answers: IntakeAnswers;
  numberError: string;
  clearNumberError: () => void;
  onPickSingle: (q: IntakeQuestion, o: IntakeOption) => void;
  onToggleMulti: (q: IntakeQuestion, value: string) => void;
  onSetAnswer: (id: string, value: IntakeAnswer) => void;
  onContinue: () => void;
}) {
  const canContinue = isQuestionComplete(question, answers);

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-halo-charcoal/45 mb-3">
        {question.label}
      </p>
      <h1
        className="font-serif text-[28px] md:text-[34px] lg:text-[38px] leading-[1.12] text-halo-charcoal tracking-tight mb-8"
        style={{ fontFeatureSettings: '"kern", "liga"' }}
      >
        {question.prompt}
      </h1>

      {question.type === "single" && question.options && (
        <div className="flex flex-col gap-2.5">
          {question.options.map((option) => (
            <PillOption
              key={option.value}
              label={option.label}
              note={option.note}
              selected={asString(answers[question.id]) === option.value}
              onClick={() => onPickSingle(question, option)}
            />
          ))}
        </div>
      )}

      {question.type === "multi" && question.options && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {question.options.map((option) => (
              <CheckOption
                key={option.value}
                label={option.label}
                note={option.note}
                selected={asArray(answers[question.id]).includes(option.value)}
                onClick={() => onToggleMulti(question, option.value)}
              />
            ))}
          </div>
          <ContinueButton onClick={onContinue} disabled={!canContinue} />
        </>
      )}

      {question.type === "number" && (
        <div>
          <input
            type="number"
            inputMode="numeric"
            placeholder={question.placeholder}
            min={question.min}
            max={question.max}
            value={asNumber(answers[question.id])}
            onChange={(e) => {
              clearNumberError();
              const v = e.target.value;
              // Keep as string in state until Continue; commitNumber coerces.
              onSetAnswer(question.id, v === "" ? "" : v);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onContinue();
              }
            }}
            className="w-full px-5 py-4 rounded-2xl bg-white border border-halo-charcoal/[0.08] text-halo-charcoal text-[16px] placeholder:text-halo-charcoal/35 focus:border-halo-charcoal/40 focus:outline-none transition-colors"
          />
          {numberError && (
            <p className="text-[12px] text-red-500 mt-2 pl-1">{numberError}</p>
          )}
          <ContinueButton onClick={onContinue} disabled={!canContinue} />
        </div>
      )}

      {question.type === "text" && (
        <div>
          <input
            type="text"
            placeholder={question.placeholder}
            value={asString(answers[question.id])}
            onChange={(e) => onSetAnswer(question.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onContinue();
              }
            }}
            className="w-full px-5 py-4 rounded-2xl bg-white border border-halo-charcoal/[0.08] text-halo-charcoal text-[16px] placeholder:text-halo-charcoal/35 focus:border-halo-charcoal/40 focus:outline-none transition-colors"
          />
          <ContinueButton onClick={onContinue} disabled={!canContinue} />
        </div>
      )}

      {question.whyWeAsk && <WhyWeAsk text={question.whyWeAsk} />}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Continue CTA — matches the rest of the funnel
   ────────────────────────────────────────────────────────── */

function ContinueButton({
  onClick,
  disabled,
  label = "Continue",
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full bg-[#1C1C1E] text-white font-semibold text-sm transition-all duration-300 ${
        disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-[#333]"
      }`}
    >
      {label}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}
