import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import StatRow from "@/components/StatRow";
import TreatmentCard from "@/components/TreatmentCard";
import TestimonialCard from "@/components/TestimonialCard";
import StepCard from "@/components/StepCard";
import PricingCard from "@/components/PricingCard";
import FAQ from "@/components/FAQ";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const faqItems = [
  {
    question: "Who is Hormone Therapy for?",
    answer:
      "Women experiencing perimenopause or menopause symptoms, typically ages 35-65. Also appropriate for women with premature ovarian insufficiency, surgical menopause, or hormonal imbalances affecting quality of life.",
  },
  {
    question: "Is hormone therapy safe?",
    answer:
      "Modern bioidentical hormone therapy has been extensively studied. Subsequent research has shown that bioidentical hormones, especially when started within 10 years of menopause, have a favorable safety profile. Your Halo provider will review your individual risk factors during your consultation.",
  },
  {
    question: "What labs do you order?",
    answer:
      "A comprehensive panel including estradiol, progesterone, total and free testosterone, DHEA-S, thyroid panel (TSH, free T3, free T4), metabolic panel, CBC, and additional markers based on your history.",
  },
  {
    question: "How quickly will I feel results?",
    answer:
      "Most women notice improvements in sleep and mood within 2-4 weeks. Full effects on body composition, energy, and libido typically develop over 2-3 months as levels stabilize.",
  },
  {
    question: "Can I add other Halo programs?",
    answer:
      "Yes. Many Hormone Therapy members add Sexual Wellness (PT-141), Peptide Therapy (Sermorelin), or NAD+ Therapy programs. All at your founding member rate.",
  },
];

export default function RenewPage() {
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
            Menopause isn&apos;t a diagnosis. It&apos;s a settings adjustment.
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Halo Hormone Therapy is physician-led hormone optimization for women
            navigating perimenopause, menopause, and beyond. And no, it&apos;s
            not &ldquo;just part of aging.&rdquo;
          </p>
          <a href="/#founding-circle" className="btn-gold-filled">
            Tell me more
            <ArrowRight className="w-4 h-4 btn-arrow" />
          </a>
          <p className="mt-8 text-sm text-white/35 flex items-center justify-center gap-3 flex-wrap">
            <span>Licensed providers</span>
            <span className="w-1 h-1 rounded-full bg-halo-gold" />
            <span>Lab-driven protocols</span>
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
                You&apos;ve been told to just deal with it. That&apos;s bad advice.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-halo-charcoal/70 leading-relaxed mb-4">
                Hot flashes. Brain fog. Exhaustion. Weight that won&apos;t budge.
                Sleep that disappeared. Libido that&apos;s gone quiet.
              </p>
              <p className="text-halo-charcoal/70 leading-relaxed mb-4">
                Your doctor might have said &ldquo;it&apos;s just part of
                aging.&rdquo; Or offered an antidepressant instead of a hormone
                panel.
              </p>
              <p className="text-halo-charcoal/70 leading-relaxed font-medium">
                That&apos;s not care. That&apos;s a shrug.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <StatRow
              stats={[
                { value: "85%", label: "of women experience menopause symptoms" },
                { value: "7%", label: "receive hormone therapy" },
                { value: "4+", label: "years to proper diagnosis on average" },
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
                Your hormones speak a language. We learned it.
              </h2>
              <p className="text-halo-charcoal/70 leading-relaxed max-w-3xl mx-auto">
                Halo Hormone Therapy starts with comprehensive labs &mdash; not a symptom
                checklist. Your provider reviews your full hormone panel, metabolic
                markers, and health history to build a protocol that&apos;s actually yours.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
              <div className="aos-child">
                <TreatmentCard
                  title="Estradiol"
                  description="The primary estrogen your body produces less of during menopause. Restores what's been declining, delivered as a patch, cream, or oral formulation based on your needs."
                />
              </div>
              <div className="aos-child">
                <TreatmentCard
                  title="Progesterone"
                  description="Essential for sleep, mood, and uterine health. Bioidentical micronized progesterone, compounded to your dose."
                />
              </div>
              <div className="aos-child">
                <TreatmentCard
                  title="Testosterone (for women)"
                  description="Most providers don't test women's testosterone. We do. Low-dose testosterone can transform energy, libido, and body composition."
                />
              </div>
              <div className="aos-child">
                <TreatmentCard
                  title="DHEA"
                  description="Adrenal support for women whose cortisol and DHEA levels have shifted with age."
                />
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <p className="text-center text-sm text-halo-charcoal/50">
              Your provider may recommend one or several of these based on your
              labs. Nothing is prescribed without data.
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
                What women actually say after 90 days
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {[
                { category: "Sleep", quote: "I sleep through the night for the first time in years." },
                { category: "Energy", quote: "I stopped needing a nap at 2pm." },
                { category: "Mental Clarity", quote: "The brain fog lifted. I can think again." },
                { category: "Body Composition", quote: "My body started responding to exercise again." },
                { category: "Mood", quote: "I feel like myself. Not the version that was just surviving." },
                { category: "Intimacy", quote: "I didn't realize how much I'd lost until it came back." },
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
              Individual results vary. These are anonymized patient experiences,
              not guaranteed outcomes.
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
                From sign-up to feeling different: about 3 weeks.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <div className="space-y-10">
              <div className="aos-child">
                <StepCard number={1} title="Week 1: Profile & Labs" description="Complete your health profile online (5 min). We send a lab order to Quest or Labcorp near you. Walk in anytime, no appointment needed." />
              </div>
              <div className="aos-child">
                <StepCard number={2} title="Week 2: Provider Consultation" description="Once labs are back, you meet your Halo provider via video. They review everything, labs, symptoms, history, goals, and build your protocol." />
              </div>
              <div className="aos-child">
                <StepCard number={3} title="Week 2-3: Medications Ship" description="Your compounded medications are prepared by a licensed US pharmacy and shipped in temperature-controlled packaging." />
              </div>
              <div className="aos-child">
                <StepCard number={4} title="Ongoing: Monitored & Adjusted" description="Async check-ins with your provider. Labs repeated at 90 days. Protocol adjusted based on how your body responds, not a static prescription." />
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
                Straightforward pricing. No surprises.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <PricingCard
              programName="Halo Hormone Therapy"
              founderPrice="$129"
              standardPrice="$149"
              includes={[
                "Initial video consultation with your provider",
                "Comprehensive hormone panel (first one free for founders)",
                "Compounded medications included",
                "Ongoing async provider access",
                "Follow-up labs at 90 days",
                "Medication adjustments as needed",
              ]}
              medicationRange="Included"
              ctaText="Get started"
              note="No contracts. Cancel anytime. Your locked-in rate is permanent as long as your membership is active."
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
              You deserve better than &ldquo;just deal with it.&rdquo;
            </h2>
            <p className="text-white/50 mb-10">
              Free for founding members. No commitment until your consultation.
            </p>
            <Link href="/quiz" className="btn-gold-filled">
              Get started
              <ArrowRight className="w-4 h-4 btn-arrow" />
            </Link>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Medical disclaimer */}
      <div className="py-6 px-6 section-light">
        <p className="text-center text-xs text-halo-charcoal/30 max-w-3xl mx-auto">
          Halo is a technology platform that connects patients with licensed healthcare providers. All clinical decisions are made by independent licensed providers. Individual results may vary. This content is not medical advice.
        </p>
      </div>
    </>
  );
}
