"use client";

import { useState } from "react";
import {
  ArrowRight,
  Mail,
  Clock,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { submitQuiz } from "@/lib/quiz-client";

/* ==============================
   PERSONA — Contact = system slate (neutral, trustworthy)
   ============================== */
const PERSONA = "#5A6B82";
const PERSONA_SOFT = "#8B9BAF";
const PERSONA_DEEP = "#3F4E66";

/* Reasons a member typically writes in. Helps them frame the message and
   gives us routing chips on Klaviyo (we tag the inquiry with `topic`). */
const TOPICS: { value: string; label: string }[] = [
  { value: "billing", label: "Billing & pricing" },
  { value: "clinical", label: "Clinical question" },
  { value: "media", label: "Press / partnerships" },
  { value: "general", label: "General question" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<string>("general");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      const result = await submitQuiz({
        quiz: "support_inquiry",
        source: "/contact",
        contact: {
          email: email.trim(),
          firstName: name.trim() || undefined,
        },
        answers: {
          // Server forwards to Klaviyo as event properties. Topic becomes a
          // Klaviyo profile property `halo_support_topic` for routing.
          topic,
          message: message.trim(),
        },
      });

      if (result.ok) {
        setSubmitted(true);
      } else {
        setError(
          result.error === "rate_limited"
            ? "You've sent a few messages already. We'll get back to the earlier ones first."
            : "Something went wrong sending your message. Please email hello@tryhalo.co directly."
        );
      }
    } catch {
      setError(
        "Couldn't reach our servers. Please email hello@tryhalo.co directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════
          1 · HERO BENTO
          ═══════════════════════════════════════════════ */}
      <section className="relative section-light overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(80% 60% at 70% 30%, ${PERSONA}12 0%, transparent 60%), radial-gradient(60% 40% at 20% 20%, rgba(139,155,175,0.08) 0%, transparent 50%)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-10 md:pt-14 lg:pt-16 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
            {/* HERO TEXT CARD — dominant */}
            <div
              className="lg:col-span-7 rounded-[24px] bg-white border border-halo-charcoal/[0.06] p-7 md:p-10 lg:p-12 flex flex-col justify-end"
              style={{ minHeight: "320px" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="block w-8 h-px"
                  style={{ background: PERSONA }}
                  aria-hidden
                />
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                  style={{ color: PERSONA }}
                >
                  Contact
                </span>
              </div>

              <h1
                className="headline-hero text-halo-charcoal leading-[0.95] tracking-tight mb-5"
                style={{
                  fontSize: "clamp(2.25rem, 4.8vw, 3.75rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                Get in touch.
              </h1>

              <p
                className="text-[16px] md:text-[17px] leading-relaxed max-w-lg"
                style={{ color: "rgba(28,28,30,0.65)" }}
              >
                Real people read every message. We typically reply within one
                business day — faster on weekday mornings. For anything
                urgent or clinical that&rsquo;s already in your protocol,
                message your provider directly through the Halo platform.
              </p>
            </div>

            {/* RIGHT COLUMN — two stacked info cards */}
            <div className="lg:col-span-5 flex flex-col gap-3 md:gap-4">
              {/* Email card */}
              <a
                href="mailto:hello@tryhalo.co"
                className="group rounded-[24px] p-6 md:p-7 flex flex-col justify-between text-white relative overflow-hidden transition-transform hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(155deg, ${PERSONA_DEEP} 0%, #2C384A 100%)`,
                  minHeight: "150px",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <Mail className="w-4 h-4" style={{ color: PERSONA_SOFT }} />
                  </div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.24em]"
                    style={{ color: PERSONA_SOFT }}
                  >
                    Email
                  </span>
                </div>
                <div>
                  <p
                    className="font-serif font-light leading-tight tracking-tight text-white mb-1"
                    style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.625rem)" }}
                  >
                    hello@tryhalo.co
                  </p>
                  <p className="text-[12px] text-white/50 inline-flex items-center gap-1.5">
                    Email us directly
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </div>
              </a>

              {/* Hours card */}
              <div
                className="rounded-[24px] p-6 md:p-7 flex flex-col justify-between"
                style={{
                  background: "#F0EBE0",
                  minHeight: "150px",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: `${PERSONA}1A` }}
                  >
                    <Clock className="w-4 h-4" style={{ color: PERSONA_DEEP }} />
                  </div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.24em]"
                    style={{ color: PERSONA }}
                  >
                    Hours
                  </span>
                </div>
                <div>
                  <p
                    className="font-serif font-light leading-tight tracking-tight text-halo-charcoal mb-1"
                    style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.625rem)" }}
                  >
                    Mon&ndash;Fri &middot; 9&ndash;5 CST
                  </p>
                  <p className="text-[12px] text-halo-charcoal/55">
                    Reply within one business day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="relative border-t border-halo-charcoal/[0.08] bg-white/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-halo-charcoal/60">
            <span>Real humans, not chatbots</span>
            <span className="text-halo-charcoal/20">&middot;</span>
            <span>HIPAA-aware support</span>
            <span className="text-halo-charcoal/20">&middot;</span>
            <span>One-business-day response</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2 · FORM — primary action
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 section-light border-t border-halo-charcoal/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 md:gap-12 lg:gap-16">
            {/* Form */}
            <AnimateOnScroll>
              <div
                className="rounded-[24px] bg-white border border-halo-charcoal/[0.08] p-7 md:p-9 lg:p-10 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.16)]"
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3"
                  style={{ color: PERSONA }}
                >
                  Send a message
                </p>
                <h2
                  className="font-serif font-light text-halo-charcoal leading-tight tracking-tight mb-6"
                  style={{
                    fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Tell us what you need.
                </h2>

                {submitted ? (
                  <div
                    className="rounded-[16px] p-7 md:p-8 text-center"
                    style={{
                      background: `${PERSONA}0E`,
                      border: `1px solid ${PERSONA}33`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: `${PERSONA}22` }}
                    >
                      <Mail className="w-5 h-5" style={{ color: PERSONA_DEEP }} />
                    </div>
                    <p
                      className="font-serif font-light text-[20px] md:text-[22px] text-halo-charcoal leading-tight tracking-tight mb-2"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      Message received.
                    </p>
                    <p className="text-[14px] text-halo-charcoal/65 leading-relaxed max-w-sm mx-auto">
                      We&rsquo;ll reply to{" "}
                      <span className="font-semibold text-halo-charcoal">
                        {email}
                      </span>{" "}
                      within one business day.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Topic chips */}
                    <div>
                      <label
                        className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-halo-charcoal/55 mb-2.5"
                      >
                        What&rsquo;s this about?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {TOPICS.map((t) => {
                          const active = topic === t.value;
                          return (
                            <button
                              key={t.value}
                              type="button"
                              onClick={() => setTopic(t.value)}
                              className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                              style={{
                                background: active ? PERSONA : "transparent",
                                color: active ? "white" : PERSONA_DEEP,
                                border: `1px solid ${active ? PERSONA : `${PERSONA_SOFT}55`}`,
                              }}
                            >
                              {t.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-halo-charcoal/55 mb-1.5"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-[10px] border border-halo-charcoal/12 bg-white text-[14px] text-halo-charcoal outline-none transition-colors focus:border-halo-charcoal/40"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-halo-charcoal/55 mb-1.5"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-[10px] border border-halo-charcoal/12 bg-white text-[14px] text-halo-charcoal outline-none transition-colors focus:border-halo-charcoal/40"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-halo-charcoal/55 mb-1.5"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        minLength={10}
                        rows={6}
                        className="w-full px-4 py-3 rounded-[10px] border border-halo-charcoal/12 bg-white text-[14px] text-halo-charcoal outline-none transition-colors focus:border-halo-charcoal/40 resize-none"
                        placeholder="What can we help with? The more detail, the better the answer."
                      />
                    </div>

                    {error && (
                      <div
                        className="rounded-[10px] p-3 text-[13px]"
                        style={{
                          background: "rgba(196,82,57,0.08)",
                          border: "1px solid rgba(196,82,57,0.25)",
                          color: "#9A3F26",
                        }}
                      >
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold text-[13px] transition-all hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                      style={{ background: "#1C1C1E" }}
                    >
                      {submitting ? "Sending…" : "Send message"}
                      {!submitting && (
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      )}
                    </button>

                    <p className="text-[11px] text-halo-charcoal/45 leading-relaxed">
                      By sending, you agree to our{" "}
                      <a
                        href="/privacy"
                        className="underline decoration-halo-charcoal/30 hover:decoration-halo-charcoal/70"
                      >
                        privacy policy
                      </a>
                      . We don&rsquo;t share contact details and we&rsquo;ll
                      only email you back about your request.
                    </p>
                  </form>
                )}
              </div>
            </AnimateOnScroll>

            {/* Sidebar — what to expect / urgent care guidance */}
            <AnimateOnScroll>
              <div className="space-y-5 lg:sticky lg:top-28">
                <div
                  className="rounded-[20px] p-6 md:p-7"
                  style={{
                    background: `${PERSONA}0E`,
                    border: `1px solid ${PERSONA}26`,
                  }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <MessageSquare
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: PERSONA_DEEP }}
                      strokeWidth={1.8}
                    />
                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                      style={{ color: PERSONA_DEEP }}
                    >
                      What we&rsquo;re fast at
                    </p>
                  </div>
                  <ul className="space-y-2 text-[13px] text-halo-charcoal/75 leading-relaxed">
                    <li>&middot; Pricing &amp; founding-member questions</li>
                    <li>&middot; Program comparisons (HRT vs TRT vs NAD+)</li>
                    <li>&middot; Lab logistics + pharmacy timing</li>
                    <li>&middot; Cancellations &amp; account changes</li>
                  </ul>
                </div>

                <div
                  className="rounded-[20px] p-6 md:p-7"
                  style={{
                    background: "rgba(28,28,30,0.04)",
                    border: "1px solid rgba(28,28,30,0.06)",
                  }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <ShieldCheck
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: "#9A3F26" }}
                      strokeWidth={1.8}
                    />
                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                      style={{ color: "#9A3F26" }}
                    >
                      For urgent medical concerns
                    </p>
                  </div>
                  <p className="text-[13px] text-halo-charcoal/75 leading-relaxed">
                    Don&rsquo;t use this form for anything time-sensitive.
                    Active members should message their provider directly
                    through the Halo platform. For an emergency, call 911 or
                    go to your nearest ER.
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Footer disclaimer */}
      <div className="py-6 px-6 section-light border-t border-halo-charcoal/[0.06]">
        <p className="text-center text-xs text-halo-charcoal/35 max-w-3xl mx-auto leading-relaxed">
          Halo is a technology platform that connects patients with licensed
          healthcare providers. This contact form is for general inquiries
          only and is not a substitute for clinical communication with your
          provider.
        </p>
      </div>
    </>
  );
}
