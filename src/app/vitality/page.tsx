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
    question: "What is NAD+ and why does it matter?",
    answer:
      "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme found in every cell. It is essential for converting food to energy, repairing DNA, regulating circadian rhythm, and supporting immune function.",
  },
  {
    question: "How is this different from supplements?",
    answer:
      "Supplements like NR and NMN are precursors that your body must convert to NAD+. Conversion rates vary and are debated in research. Halo NAD+ Therapy uses actual NAD+, compounded, pharmaceutical-grade, prescribed by a provider.",
  },
  {
    question: "How is it administered?",
    answer:
      "Subcutaneous injection, typically 2-3 times per week. Quick, simple, and most patients are comfortable after their first self-administration.",
  },
  {
    question: "Are there side effects?",
    answer:
      "Some patients experience mild flushing, nausea, or warmth during the first few doses. This typically resolves quickly. Your provider will start with a conservative dose and adjust upward.",
  },
  {
    question: "Can I combine NAD+ Therapy with other Halo programs?",
    answer:
      "Yes. NAD+ pairs well with every Halo program. It is especially complementary to Hormone Therapy, Testosterone, and Peptide Therapy as part of a comprehensive optimization protocol.",
  },
  {
    question: "How does this compare to IV NAD+ clinics?",
    answer:
      "IV clinics charge $500-1,500 per session and require in-person visits. Halo NAD+ Therapy delivers comparable NAD+ at home, prescribed by your provider, at a fraction of the cost.",
  },
];

export default function VitalityPage() {
  return (
    <>
      {/* HERO (Dark) */}
      <section className="py-20 px-6 section-dark relative overflow-hidden">
        <div
          className="absolute top-[10%] right-[10%] w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: "#C8A96E", filter: "blur(150px)", opacity: 0.1 }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10 pt-24 pb-8">
          <h1 className="headline-hero text-4xl md:text-5xl lg:text-6xl mb-8 text-white">
            Energy isn&apos;t a mindset problem. It&apos;s a cellular one.
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Halo NAD+ Therapy delivers physician-prescribed NAD+ for energy,
            mental clarity, and cellular health. Your cells run on NAD+. After
            40, you have half of what you did at 20.
          </p>
          <a href="/#founding-circle" className="btn-gold-filled">
            Tell me more
            <ArrowRight className="w-4 h-4 btn-arrow" />
          </a>
          <p className="mt-8 text-sm text-white/35 flex items-center justify-center gap-3 flex-wrap">
            <span>Licensed providers</span>
            <span className="w-1 h-1 rounded-full bg-halo-gold" />
            <span>Compounded NAD+</span>
            <span className="w-1 h-1 rounded-full bg-halo-gold" />
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
                Caffeine isn&apos;t solving the real problem.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-halo-charcoal/70 leading-relaxed mb-4">
                You&apos;ve tried the supplements. The sleep hacks. The cold
                plunges. And still &mdash; the energy you had 10 years ago
                hasn&apos;t come back.
              </p>
              <p className="text-halo-charcoal/70 leading-relaxed mb-4">
                NAD+ is a coenzyme present in every living cell. It&apos;s
                essential for energy production, DNA repair, and cellular
                function. Your NAD+ levels decline approximately 50% between
                ages 40 and 60.
              </p>
              <p className="text-halo-charcoal/70 leading-relaxed font-medium">
                No amount of coffee fixes a NAD+ deficit.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <StatRow
              stats={[
                { value: "~50%", label: "NAD+ decline between ages 40 and 60" },
                { value: "500+", label: "enzymatic reactions require NAD+" },
                { value: "$500-1.5K", label: "per session at IV NAD+ clinics" },
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
                Clinical-grade NAD+. Not another Amazon supplement.
              </h2>
              <p className="text-halo-charcoal/70 leading-relaxed max-w-3xl mx-auto">
                Halo NAD+ Therapy delivers pharmaceutical-grade NAD+ prescribed
                by a licensed provider &mdash; not the nicotinamide riboside
                supplements you find online.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-6">
              <div className="aos-child">
                <TreatmentCard title="NAD+ Injectable (subcutaneous)" description="Self-administered at home. Most bioavailable route outside of IV. Your provider determines optimal dosing and frequency based on your goals." />
              </div>
              <div className="aos-child">
                <TreatmentCard title="NAD+ Sublingual" description="For patients who prefer non-injection options. Sublingual formulations are being developed with our pharmacy partners." comingSoon />
              </div>
              <div className="aos-child">
                <TreatmentCard title="Glutathione (add-on)" description="The body's master antioxidant. Often paired with NAD+ for comprehensive cellular support. Available as an add-on to your NAD+ Therapy protocol." />
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <p className="text-center text-sm text-halo-charcoal/50">
              Halo NAD+ Therapy uses compounded NAD+ from licensed 503A
              pharmacies &mdash; not supplements. This requires a prescription.
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
                What patients notice first
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {[
                { category: "Mental Clarity", quote: "The fog lifted within the first week. Thinking is sharper, faster." },
                { category: "Sustained Energy", quote: "Not jittery energy like caffeine. Just... awake. All day." },
                { category: "Recovery", quote: "Post-workout recovery improved significantly." },
                { category: "Sleep Quality", quote: "Falling asleep faster and waking up feeling actually rested." },
                { category: "Mood", quote: "More even. Less reactive. A general sense of wellbeing." },
                { category: "Skin", quote: "My skin looks healthier. Brighter. People noticed." },
              ].map((t, i) => (
                <div key={i} className="aos-child p-6 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                  <p className="text-xs font-medium text-halo-gold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-halo-gold/50" />
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
                From evaluation to your first dose: about 10 days.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <div className="space-y-10">
              <div className="aos-child"><StepCard number={1} title="Quick Evaluation" description="Complete a brief health questionnaire about your energy, cognition, sleep, and health history." /></div>
              <div className="aos-child"><StepCard number={2} title="Provider Review" description="Your Halo provider reviews your profile and determines if NAD+ therapy is appropriate. Most evaluations are async, results within 24-48 hours." /></div>
              <div className="aos-child"><StepCard number={3} title="Delivered" description="Your compounded NAD+ ships from a licensed US pharmacy with supplies and instructions. Easy self-administration at home." /></div>
              <div className="aos-child"><StepCard number={4} title="Optimize" description="Check in with your provider. Adjust dose and frequency based on response. Add Glutathione if appropriate." /></div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* COMPARISON TABLE */}
      <section className="py-20 px-6 section-light">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="label-gold mb-4">Comparison</p>
              <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal mb-4">
                NR and NMN are precursors. This is the real thing.
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="bg-white rounded-2xl border border-halo-gold/15 overflow-hidden">
              <div className="grid grid-cols-3 text-sm">
                <div className="p-4 md:p-5 font-medium text-halo-charcoal border-b border-halo-charcoal/5"></div>
                <div className="p-4 md:p-5 font-medium text-halo-charcoal/50 border-b border-l border-halo-charcoal/5 text-center">
                  NAD+ Supplements (OTC)
                </div>
                <div className="p-4 md:p-5 font-medium text-halo-charcoal border-b border-l border-halo-charcoal/5 text-center bg-halo-gold/5">
                  Halo NAD+ Therapy (Rx)
                </div>
                {[
                  ["Form", "Oral capsule", "Subcutaneous injection"],
                  ["What you get", "NR or NMN (precursors)", "Actual NAD+"],
                  ["Conversion required", "Yes", "No"],
                  ["Bioavailability", "Low-moderate", "High"],
                  ["Quality control", "Supplement-grade", "Pharmaceutical-grade"],
                  ["Provider oversight", "No", "Yes"],
                  ["IV clinic equivalent", "No", "Yes (at-home, fraction of cost)"],
                ].map(([label, otc, rx], i) => (
                  <div key={i} className="contents">
                    <div className={`p-4 md:p-5 text-sm text-halo-charcoal/70 ${i < 6 ? "border-b border-halo-charcoal/5" : ""}`}>
                      {label}
                    </div>
                    <div className={`p-4 md:p-5 text-sm text-halo-charcoal/50 border-l text-center ${i < 6 ? "border-b border-halo-charcoal/5" : ""}`}>
                      {otc}
                    </div>
                    <div className={`p-4 md:p-5 text-sm text-halo-charcoal font-medium border-l text-center bg-halo-gold/5 ${i < 6 ? "border-b border-halo-charcoal/5" : ""}`}>
                      {rx}
                    </div>
                  </div>
                ))}
              </div>
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
                IV clinic results without the IV clinic price.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <PricingCard
              programName="Halo NAD+ Therapy"
              founderPrice="$179"
              standardPrice="$229"
              includes={[
                "Clinical evaluation",
                "Provider consultation (async or video)",
                "Compounded NAD+ included",
                "Ongoing provider access",
                "Dosing adjustments",
              ]}
              medicationRange="Included"
              ctaText="Get started"
            />
          </AnimateOnScroll>
        </div>
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
              Your cells don&apos;t need motivation. They need fuel.
            </h2>
            <p className="text-white/50 mb-10">
              Founding members get first access to new longevity therapies.
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
