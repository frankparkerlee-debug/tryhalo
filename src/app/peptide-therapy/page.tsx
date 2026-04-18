import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StatRow from "@/components/StatRow";
import TreatmentCard from "@/components/TreatmentCard";
import StepCard from "@/components/StepCard";
import PricingCard from "@/components/PricingCard";
import FAQ from "@/components/FAQ";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const faqItems = [
  {
    question: "What are peptides?",
    answer:
      "Peptides are short chains of amino acids that signal specific functions in your body. Growth hormone secretagogue peptides signal your pituitary gland to produce more growth hormone naturally, unlike synthetic HGH, which replaces your own production.",
  },
  {
    question: "Is this the same as HGH?",
    answer:
      "No. Halo Peptide Therapy uses secretagogues that stimulate your body's own GH production. This is fundamentally different from synthetic HGH (somatropin), which is a controlled substance requiring different clinical oversight.",
  },
  {
    question: "What's the difference between Sermorelin and CJC-1295/Ipamorelin?",
    answer:
      "Sermorelin is a GHRH analog available for compounding now. CJC-1295/Ipamorelin is a combination that provides more sustained GH release, currently under FDA review but expected to return in 2026. Both are effective; CJC/Ipa is considered the premium option.",
  },
  {
    question: "How is it administered?",
    answer:
      "Subcutaneous injection, typically before bed (GH is primarily released during deep sleep). Your provider will walk you through self-administration. Most patients are comfortable within 1-2 days.",
  },
  {
    question: "Can I combine Peptide Therapy with other Halo programs?",
    answer:
      "Yes. Peptide Therapy pairs particularly well with Testosterone (TRT for men) and Hormone Therapy (HRT for women). Your provider can coordinate across programs.",
  },
];

export default function RestorePage() {
  return (
    <>
      {/* HERO (Dark) */}
      <section className="py-20 px-6 section-dark relative overflow-hidden">
        <div
          className="absolute top-[10%] right-[10%] w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: "#6B7B6E", filter: "blur(150px)", opacity: 0.1 }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10 pt-24 pb-8">
          <h1 className="headline-hero text-4xl md:text-5xl lg:text-6xl mb-8 text-white">
            Recovery isn&apos;t about rest days. It&apos;s about optimization.
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Halo Peptide Therapy uses physician-prescribed growth hormone peptide
            therapy to support sleep, recovery, body composition, and
            performance.
          </p>
          <a href="/#founding-circle" className="btn-gold-filled">
            Tell me more
            <ArrowRight className="w-4 h-4 btn-arrow" />
          </a>
          <p className="mt-8 text-sm text-white/35 flex items-center justify-center gap-3 flex-wrap">
            <span>Licensed providers</span>
            <span className="w-1 h-1 rounded-full bg-[#6B7B6E]" />
            <span>Compounded peptides</span>
            <span className="w-1 h-1 rounded-full bg-[#6B7B6E]" />
            <span>Shipped to your door</span>
          </p>
        </div>
      </section>

      <div className="gold-divider" />

      {/* THE PROBLEM */}
      <section className="py-20 px-6 section-light">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="label-gold mb-4">The Problem</p>
              <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal">
                You&apos;re doing everything right. Your body isn&apos;t keeping up.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-halo-charcoal/70 leading-relaxed mb-4">
                You train. You eat well. You try to sleep. But recovery takes
                longer than it used to. Sleep isn&apos;t deep. The body
                composition that came easy at 25 now feels impossible at 40.
              </p>
              <p className="text-halo-charcoal/70 leading-relaxed">
                Your growth hormone output peaks in your 20s and declines roughly
                14% per decade after that. By 40, you&apos;re operating at a
                fraction of your younger self.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <StatRow
              stats={[
                { value: "~14%", label: "GH production decline per decade after age 25" },
                { value: "35%", label: "of adults over 40 report poor sleep quality" },
                { value: "2x", label: "recovery time increase between ages 30 and 50" },
              ]}
            />
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* THE SOLUTION */}
      <section className="py-20 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="label-gold mb-4">Treatment</p>
              <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal mb-4">
                Peptide therapy that reminds your body how to recover.
              </h2>
              <p className="text-halo-charcoal/70 leading-relaxed max-w-3xl mx-auto">
                Halo Peptide Therapy uses growth hormone secretagogue peptides &mdash;
                compounds that signal your body to produce more of its own growth
                hormone naturally. They work with your biology to restore what&apos;s been declining.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
              <div className="aos-child">
                <TreatmentCard title="Sermorelin" description="A growth hormone releasing hormone (GHRH) analog with decades of clinical use. Stimulates your pituitary to produce GH naturally. Widely studied, well-tolerated." />
              </div>
              <div className="aos-child">
                <TreatmentCard title="CJC-1295 / Ipamorelin" description="The gold standard GH peptide stack. CJC-1295 extends GH release windows while Ipamorelin triggers clean GH pulses without cortisol spikes. Expected to return to legal compounding status in 2026." comingSoon />
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <p className="text-center text-sm text-halo-charcoal/50">
              CJC-1295/Ipamorelin is not currently available for compounding.
              Founding members will receive first access when availability is
              restored. Sermorelin is available now.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* WHAT CHANGES */}
      <section className="py-20 px-6 section-dark">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="label-gold mb-4">Results</p>
              <h2 className="headline-section text-3xl md:text-4xl text-white">
                What patients report in the first 90 days
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {[
                { category: "Sleep", quote: "Deep sleep came back. I wake up actually rested." },
                { category: "Recovery", quote: "Soreness clears faster. I can train consecutive days again." },
                { category: "Body Composition", quote: "Leaner without changing diet. My body finally responds." },
                { category: "Skin & Hair", quote: "My skin looks better. People ask what I changed." },
                { category: "Energy", quote: "Steady energy all day. No crash." },
                { category: "Mental Clarity", quote: "Focus improved noticeably within the first month." },
              ].map((t, i) => (
                <div key={i} className="aos-child p-6 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                  <p className="text-xs font-medium text-[#6B7B6E] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6B7B6E]/50" />
                    {t.category}
                  </p>
                  <p className="text-sm text-white/60 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <p className="text-center text-xs text-white/20">
              Individual results vary. These are anonymized patient experiences, not guaranteed outcomes.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 section-light">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="label-gold mb-4">Process</p>
              <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal">
                Start with a conversation, not a commitment.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <div className="space-y-10">
              <div className="aos-child"><StepCard number={1} title="Health Profile" description="Complete your online evaluation. We ask about sleep, recovery, training, body composition goals, and health history." /></div>
              <div className="aos-child"><StepCard number={2} title="Provider Consult" description="Your Halo provider reviews your profile. Most evaluations are handled async, with video available if you want it." /></div>
              <div className="aos-child"><StepCard number={3} title="Prescription & Delivery" description="If appropriate, your provider prescribes Sermorelin (or CJC-1295/Ipamorelin when available). Ships from a licensed US pharmacy." /></div>
              <div className="aos-child"><StepCard number={4} title="Optimize" description="Check in with your provider at 30 and 90 days. Adjust dosing based on how you respond." /></div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* PRICING */}
      <section className="py-20 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="label-gold mb-4">Pricing</p>
              <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal">
                Performance care, accessible pricing.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <PricingCard
              programName="Halo Peptide Therapy"
              founderPrice="$179"
              standardPrice="$229"
              includes={[
                "Clinical evaluation",
                "Provider consultation",
                "Compounded peptides included",
                "Ongoing async provider access",
                "Protocol adjustments",
              ]}
              medicationRange="Included"
              ctaText="Get started"
            />
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* COMING SOON */}
      <section className="py-20 px-6 section-dark">
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto text-center">
            <p className="label-gold mb-4">Coming Soon</p>
            <h2 className="headline-section text-3xl md:text-4xl text-white mb-5">
              CJC-1295 + Ipamorelin &mdash; returning soon.
            </h2>
            <p className="text-white/50 leading-relaxed mb-4">
              The most popular GH peptide combination is currently under FDA
              review and expected to return to legal compounding status in 2026.
              Halo founding members will be first to access these therapies.
            </p>
            <p className="text-white/50 leading-relaxed mb-10">
              In the meantime, Sermorelin offers a proven, legal, and effective
              GH peptide protocol available today.
            </p>
            <a href="/#founding-circle" className="btn-gold-filled">
              Join the Founding Circle
              <ArrowRight className="w-4 h-4 btn-arrow" />
            </a>
          </div>
        </AnimateOnScroll>
      </section>

      <div className="gold-divider" />

      {/* FAQ */}
      <section className="py-20 px-6 section-light">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal">
                Frequently asked questions
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <FAQ items={faqItems} />
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* FINAL CTA (Dark) */}
      <section className="py-20 px-6 section-dark">
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl text-white mb-6">
              Your body still knows how to do this. It just needs the signal.
            </h2>
            <p className="text-white/50 mb-10">
              Founding members get first access to new peptides as they become available.
            </p>
            <Link href="/quiz" className="btn-gold-filled">
              Get started
              <ArrowRight className="w-4 h-4 btn-arrow" />
            </Link>
          </div>
        </AnimateOnScroll>
      </section>

      <div className="py-6 px-6 section-light">
        <p className="text-center text-xs text-halo-charcoal/30 max-w-3xl mx-auto">
          Halo is a technology platform that connects patients with licensed healthcare providers. All clinical decisions are made by independent licensed providers. Individual results may vary. This content is not medical advice.
        </p>
      </div>
    </>
  );
}
