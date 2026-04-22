"use client";

/**
 * EngagementTool — shared renderer for all 5 top-of-funnel estimators.
 *
 * State machine:
 *   intro     → single card: headline + subhead + start button
 *   question  → one question at a time, chip select, auto-advance on pick
 *   capture   → <QuizCapture /> with the tool's capture headline
 *   reveal    → big result card (primary/context/explainer) + "Build my stack" CTA
 *
 * Why email capture happens BEFORE reveal:
 *   Every comparable tool (Hims' erectile health quiz, Ro's weight intake,
 *   Noom's BMI tool) gates the revealed number on email submit. Users expect
 *   it, and the reveal is meaningful enough that the conversion rate on the
 *   gate is high. If we show the number first and then ask for email, we lose
 *   the reason the visitor opened the widget.
 *
 * Routing on "Build my stack":
 *   /stack?from={quiz}&primary={program}[&flags=csv]
 *   StackBuilder reads these to pre-select the primary card (gold ring) and
 *   attribute the session.
 */

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { track } from "@/lib/tracking";
import QuizCapture, { type QuizCaptureResult } from "./QuizCapture";
import {
  getEngagementConfig,
  type EngagementConfig,
  type EngagementResult,
  type EngagementSlug,
} from "@/lib/engagement-tools";

interface EngagementToolProps {
  slug: EngagementSlug;
  /** Visual variant — match surrounding section background. */
  variant?: "light" | "dark";
  /** Optional className applied to the outer container. */
  className?: string;
}

type Step =
  | { kind: "intro" }
  | { kind: "question"; index: number }
  | { kind: "capture" }
  | { kind: "reveal" };

export default function EngagementTool({
  slug,
  variant = "light",
  className = "",
}: EngagementToolProps) {
  const config: EngagementConfig = getEngagementConfig(slug);
  const [step, setStep] = useState<Step>({ kind: "intro" });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<EngagementResult | null>(null);

  const isDark = variant === "dark";
  const total = config.questions.length;

  /* ── handlers ── */

  const start = useCallback(() => {
    track("estimator_start", { quiz: config.quiz });
    setStep({ kind: "question", index: 0 });
  }, [config.quiz]);

  const pick = useCallback(
    (questionId: string, value: string, questionIndex: number) => {
      const next = { ...answers, [questionId]: value };
      setAnswers(next);

      if (questionIndex + 1 < total) {
        setStep({ kind: "question", index: questionIndex + 1 });
      } else {
        // Last question answered — compute result so the capture step can
        // carry the derived fields into the event payload, then advance
        // into the email gate.
        const computed = config.computeResult(next);
        setResult(computed);
        setStep({ kind: "capture" });
      }
    },
    [answers, total, config]
  );

  const back = useCallback(() => {
    if (step.kind !== "question") return;
    if (step.index === 0) {
      setStep({ kind: "intro" });
    } else {
      setStep({ kind: "question", index: step.index - 1 });
    }
  }, [step]);

  const onCaptureSuccess = useCallback(
    (_res: QuizCaptureResult) => {
      // QuizCapture already fired `estimator_complete` with the Klaviyo
      // event; we just transition the UI to reveal.
      setStep({ kind: "reveal" });
    },
    []
  );

  /* ── derived display data ── */

  const currentQuestion = useMemo(() => {
    if (step.kind !== "question") return null;
    return config.questions[step.index];
  }, [step, config.questions]);

  /* ── styling tokens ── */

  const cardBg = isDark
    ? "bg-white/[0.03] border-white/10"
    : "bg-[#F0EFEC] border-[#E5E4E0]";
  const textPrimary = isDark ? "text-white" : "text-[#1C1C1E]";
  const textMuted = isDark ? "text-white/60" : "text-[#86868B]";
  const eyebrowColor = isDark ? "text-[#9CAA9F]" : "text-[#6B7B6E]";
  const filledBtn = isDark
    ? "bg-white text-[#1C1C1E] hover:bg-white/90"
    : "bg-[#1C1C1E] text-white hover:bg-[#333]";

  const chipBase = isDark
    ? "bg-white/[0.04] border-white/10 text-white hover:border-white/30 hover:bg-white/[0.07]"
    : "bg-white border-[#E5E4E0] text-[#1C1C1E] hover:border-[#6B7B6E] hover:bg-[#F8F7F4]";

  /* ── render ── */

  return (
    <section
      className={`rounded-2xl border ${cardBg} p-6 md:p-8 ${className}`}
    >
      {/* eyebrow is constant across steps — it's the brand of the widget */}
      <p
        className={`text-[11px] uppercase tracking-[0.2em] font-semibold mb-4 ${eyebrowColor}`}
      >
        {config.eyebrow}
      </p>

      {step.kind === "intro" && (
        <div>
          <h3
            className={`font-serif text-2xl md:text-3xl tracking-[-0.02em] mb-3 ${textPrimary}`}
          >
            {config.headline}
          </h3>
          <p className={`text-sm leading-relaxed mb-6 ${textMuted}`}>
            {config.subhead}
          </p>
          <button
            type="button"
            onClick={start}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${filledBtn}`}
          >
            {config.startLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {step.kind === "question" && currentQuestion && (
        <div>
          {/* progress + back */}
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={back}
              className={`inline-flex items-center gap-1.5 text-xs ${textMuted} hover:opacity-80 transition-opacity`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <span className={`text-[11px] uppercase tracking-[0.2em] ${textMuted}`}>
              {step.index + 1} / {total}
            </span>
          </div>

          <p
            className={`text-[10px] uppercase tracking-[0.2em] font-semibold mb-2 ${eyebrowColor}`}
          >
            {currentQuestion.label}
          </p>
          <h3
            className={`font-serif text-xl md:text-2xl tracking-[-0.02em] mb-5 ${textPrimary}`}
          >
            {currentQuestion.prompt}
          </h3>

          <div className="flex flex-col gap-2.5">
            {currentQuestion.options.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => pick(currentQuestion.id, opt.value, step.index)}
                  className={`text-left px-4 py-3.5 rounded-xl border text-sm transition-all ${chipBase} ${
                    isSelected
                      ? isDark
                        ? "!border-white/60"
                        : "!border-[#6B7B6E]"
                      : ""
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step.kind === "capture" && result && (
        <QuizCapture
          quiz={config.quiz}
          answers={answers}
          derived={result.derived}
          primaryProgram={config.primary}
          headline={config.captureHeadline}
          subhead={config.captureSubhead}
          ctaLabel={config.ctaLabel}
          variant={variant}
          onSuccess={onCaptureSuccess}
          // Render nothing on success — we handle the reveal transition
          // at the EngagementTool level to keep the card swap smooth.
          successSlot={() => null}
        />
      )}

      {step.kind === "reveal" && result && (
        <div>
          {/* Big number reveal */}
          <div className="text-center mb-6">
            <p
              className={`text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 ${eyebrowColor}`}
            >
              Your result
            </p>
            <div
              className={`font-serif text-6xl md:text-7xl tracking-[-0.03em] leading-none mb-3 ${textPrimary}`}
            >
              {result.primary}
            </div>
            <p className={`text-sm ${textMuted}`}>{result.context}</p>
          </div>

          {/* Explainer */}
          <p
            className={`text-[15px] leading-relaxed text-center mb-6 max-w-lg mx-auto ${textPrimary}`}
          >
            {result.explainer}
          </p>

          {/* CTA → /stack with attribution */}
          <div className="flex justify-center">
            <Link
              href={stackHref(config, result)}
              onClick={() =>
                track("cta_click", {
                  location: `engagement_tool_${config.quiz}`,
                  destination: "stack",
                })
              }
              className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all ${filledBtn}`}
            >
              Build my stack
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * Build the /stack URL with attribution so StackBuilder can pre-select the
 * primary card (gold ring) and log entry attribution on waitlist_joined.
 *
 * Tier is included as a flag so Klaviyo segments on /stack waitlist events
 * can reach back to the engagement tool's severity read without re-querying.
 */
function stackHref(
  config: EngagementConfig,
  result: EngagementResult
): string {
  const params = new URLSearchParams();
  params.set("from", config.quiz);
  params.set("primary", config.primary);
  const flags: string[] = [];
  if (result.derived.tier) flags.push(`tier_${result.derived.tier}`);
  if (flags.length) params.set("flags", flags.join(","));
  return `/stack?${params.toString()}`;
}
