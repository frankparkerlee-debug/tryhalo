"use client";

/**
 * WeightLossProjector — live, slider-driven projection for the
 * weight-loss page. No steps, no email gate. Visitor drags two sliders +
 * picks a pace; the projection updates in real time. The CTA below
 * routes to the proper intake at /quiz/weight-loss.
 *
 * Math is the same realistic-rate model used by the prior step-based
 * engagement tool: linear-rate × 0.75 to account for real-world
 * GLP-1 settling below trend.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Warm gold persona — matches the locked GLP-1 program color.
const GOLD = "#B8974E";
const GOLD_DEEP = "#8F7438";
const GOLD_SOFT = "#E0CB94";
const TEXT = "#1C1C1E";
const MUTED = "#86868B";
const BORDER = "#E5E7EB";

const PACES = [
  { id: "gentle", label: "Gentle", sub: "Sustainable", rate: 1.0 },
  { id: "steady", label: "Steady", sub: "Most members", rate: 1.5 },
  { id: "fast", label: "Fast", sub: "Committed", rate: 2.0 },
] as const;

type PaceId = typeof PACES[number]["id"];

interface SliderProps {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

function GoldSlider({ label, hint, value, min, max, step = 1, unit, onChange }: SliderProps) {
  const fillPct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <span style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>
            {label}
          </span>
          {hint && (
            <span style={{ fontSize: "0.6875rem", color: MUTED, marginLeft: "0.5rem", letterSpacing: "0.04em" }}>
              {hint}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span
            style={{
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: TEXT,
              letterSpacing: "-0.02em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value}
          </span>
          {unit && <span style={{ fontSize: "0.75rem", color: MUTED, letterSpacing: "0.04em" }}>{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="halo-projector-slider"
        style={{
          // CSS variable powers the gradient fill on the track.
          ["--halo-fill" as string]: `${fillPct}%`,
        } as React.CSSProperties}
      />
    </div>
  );
}

export default function WeightLossProjector() {
  const [currentLbs, setCurrentLbs] = useState(210);
  const [goalLbs, setGoalLbs] = useState(35);
  const [paceId, setPaceId] = useState<PaceId>("steady");

  const projection = useMemo(() => {
    const pace = PACES.find((p) => p.id === paceId) ?? PACES[1];
    const realisticPerWeek = pace.rate * 0.75; // real-world settles below linear
    const weeksToGoal = goalLbs / realisticPerWeek;
    const monthsToGoal = weeksToGoal / 4.33;
    const targetWeight = Math.max(110, currentLbs - goalLbs);
    // 6-month projection: capped by stated goal, never overpromise
    const sixMonthDrop = Math.min(goalLbs, realisticPerWeek * 26);
    const sixMonthWeight = Math.max(110, currentLbs - sixMonthDrop);

    return {
      monthsToGoal: Math.round(monthsToGoal * 10) / 10,
      weeksToGoal: Math.ceil(weeksToGoal),
      targetWeight,
      sixMonthDrop: Math.round(sixMonthDrop),
      sixMonthWeight,
      // Progress fraction toward the user's stated goal, clamped 0..1
      progressAt6mo: Math.min(1, sixMonthDrop / goalLbs),
    };
  }, [currentLbs, goalLbs, paceId]);

  // Format months as "5" or "5.5" depending on integer-ness
  const monthsLabel = Number.isInteger(projection.monthsToGoal)
    ? `${projection.monthsToGoal}`
    : projection.monthsToGoal.toFixed(1);

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: `1px solid ${BORDER}`,
        borderRadius: "24px",
        padding: "2rem 1.75rem",
        maxWidth: "640px",
        margin: "0 auto",
        boxShadow: "0 24px 60px -36px rgba(15,17,21,0.18)",
      }}
    >
      {/* Slider styling — scoped via styled-jsx so it doesn't leak */}
      <style jsx>{`
        .halo-projector-slider {
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
          background: transparent;
          cursor: pointer;
          height: 24px;
        }
        .halo-projector-slider::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(
            to right,
            ${GOLD} 0%,
            ${GOLD} var(--halo-fill, 50%),
            ${GOLD_SOFT}55 var(--halo-fill, 50%),
            ${GOLD_SOFT}55 100%
          );
        }
        .halo-projector-slider::-moz-range-track {
          height: 6px;
          border-radius: 999px;
          background: ${GOLD_SOFT}55;
        }
        .halo-projector-slider::-moz-range-progress {
          height: 6px;
          border-radius: 999px;
          background: ${GOLD};
        }
        .halo-projector-slider::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          margin-top: -8px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${GOLD};
          border: 3px solid #ffffff;
          box-shadow: 0 2px 10px rgba(184, 151, 78, 0.4);
          cursor: grab;
          transition: transform 120ms ease;
        }
        .halo-projector-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.08);
        }
        .halo-projector-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${GOLD};
          border: 3px solid #ffffff;
          box-shadow: 0 2px 10px rgba(184, 151, 78, 0.4);
          cursor: grab;
        }
        .halo-projector-slider:focus-visible {
          outline: none;
        }
        .halo-projector-slider:focus-visible::-webkit-slider-thumb {
          box-shadow: 0 0 0 4px rgba(184, 151, 78, 0.25), 0 2px 10px rgba(184, 151, 78, 0.4);
        }
      `}</style>

      {/* Eyebrow + headline */}
      <div className="mb-7">
        <div className="flex items-center gap-2.5 mb-3">
          <span style={{ display: "block", width: "20px", height: "1px", background: GOLD }} />
          <span
            style={{
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "0.625rem",
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: GOLD_DEEP,
            }}
          >
            Live projection
          </span>
        </div>
        <h3
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "clamp(1.5rem, 3.4vw, 2rem)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            color: TEXT,
            marginBottom: "0.5rem",
          }}
        >
          What does six months look like?
        </h3>
        <p style={{ fontSize: "0.9375rem", lineHeight: 1.55, color: MUTED }}>
          Drag the sliders. Watch the projection move in real time. Math reflects realistic GLP-1 outcomes — protocol still gets designed by your physician.
        </p>
      </div>

      {/* Sliders */}
      <div className="space-y-6 mb-7">
        <GoldSlider
          label="Current weight"
          value={currentLbs}
          min={140}
          max={350}
          step={1}
          unit="lbs"
          onChange={setCurrentLbs}
        />
        <GoldSlider
          label="Want to lose"
          value={goalLbs}
          min={5}
          max={Math.max(10, currentLbs - 110)} // cap so you can't slide past a 110 lb floor
          step={1}
          unit="lbs"
          onChange={setGoalLbs}
        />
      </div>

      {/* Pace toggle */}
      <div className="mb-7">
        <span
          style={{
            display: "block",
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: MUTED,
            marginBottom: "0.625rem",
          }}
        >
          Pace
        </span>
        <div className="grid grid-cols-3 gap-2">
          {PACES.map((p) => {
            const active = p.id === paceId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPaceId(p.id)}
                style={{
                  padding: "0.75rem 0.5rem",
                  borderRadius: "12px",
                  background: active ? `linear-gradient(155deg, ${GOLD} 0%, ${GOLD_DEEP} 100%)` : "#FFFFFF",
                  color: active ? "#FFFFFF" : TEXT,
                  border: active ? `1px solid ${GOLD}` : `1px solid ${BORDER}`,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 200ms",
                  boxShadow: active ? "0 8px 22px -10px rgba(184,151,78,0.5)" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    letterSpacing: "-0.01em",
                    marginBottom: "0.125rem",
                  }}
                >
                  {p.label}
                </div>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    color: active ? "rgba(255,255,255,0.75)" : MUTED,
                    letterSpacing: "0.02em",
                  }}
                >
                  {p.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Result card */}
      <div
        style={{
          background: `linear-gradient(155deg, ${GOLD_DEEP} 0%, #6F5A2C 100%)`,
          color: "#FFFFFF",
          borderRadius: "18px",
          padding: "1.75rem 1.5rem",
          boxShadow: "0 24px 60px -32px rgba(184,151,78,0.5)",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: "0.625rem",
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: GOLD_SOFT,
            marginBottom: "0.875rem",
          }}
        >
          At your pace
        </span>

        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
          <div>
            <div
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.75rem, 6vw, 4rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                color: "#FFFFFF",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {monthsLabel}
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: GOLD_SOFT,
                  marginLeft: "0.5rem",
                  letterSpacing: "-0.005em",
                }}
              >
                months to your goal
              </span>
            </div>
          </div>

          <div className="text-right">
            <div
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "1.625rem",
                color: "#FFFFFF",
                letterSpacing: "-0.025em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {projection.targetWeight}
              <span style={{ fontSize: "0.75rem", color: GOLD_SOFT, marginLeft: "0.375rem", fontWeight: 500 }}>
                lbs
              </span>
            </div>
            <div style={{ fontSize: "0.6875rem", color: GOLD_SOFT, letterSpacing: "0.04em" }}>
              from {currentLbs} today
            </div>
          </div>
        </div>

        {/* 6-month progress bar */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span style={{ fontSize: "0.6875rem", color: GOLD_SOFT, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>
              At 6 months
            </span>
            <span style={{ fontSize: "0.75rem", color: "#FFFFFF", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
              −{projection.sixMonthDrop} lbs · {projection.sixMonthWeight} lbs
            </span>
          </div>
          <div
            style={{
              position: "relative",
              height: "8px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.14)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: `${projection.progressAt6mo * 100}%`,
                background: `linear-gradient(90deg, ${GOLD_SOFT}, #FFFFFF)`,
                borderRadius: "999px",
                transition: "width 240ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>
          <div className="flex justify-between mt-2" style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>
            <span>start</span>
            <span>your goal</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          href="/quiz/weight-loss"
          className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            background: TEXT,
            color: "#FFFFFF",
            letterSpacing: "0.01em",
          }}
        >
          See if a Halo protocol fits
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p style={{ fontSize: "0.75rem", color: MUTED, lineHeight: 1.5 }}>
          Real outcomes vary. Your physician sets the actual protocol from your labs and history.
        </p>
      </div>
    </div>
  );
}
