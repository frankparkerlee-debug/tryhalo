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
    question: "Who is Testosterone therapy for?",
    answer:
      "Men experiencing symptoms of low testosterone, typically ages 28-65. Symptoms include fatigue, low libido, difficulty building muscle, brain fog, mood changes, and poor recovery from exercise.",
  },
  {
    question: "Is TRT safe?",
    answer:
      "Testosterone replacement therapy is well-studied with decades of clinical data. Like any medical treatment, it carries risks that your provider will discuss with you. Halo protocols include regular lab monitoring to ensure safety.",
  },
  {
    question: "Will TRT affect my fertility?",
    answer:
      "Exogenous testosterone can reduce sperm production. If fertility is a concern, your provider may recommend HCG alongside TRT, or Enclomiphene as an alternative. This is discussed during your initial consultation.",
  },
  {
    question: "What labs do you order?",
    answer:
      "Total testosterone, free testosterone, SHBG, estradiol, LH, FSH, prolactin, CBC, CMP, lipid panel, PSA, thyroid panel, and additional markers based on your history.",
  },
  {
    question: "How quickly will I feel results?",
    answer:
      "Most men notice energy and mood improvements within 2-4 weeks. Body composition, strength, and libido typically improve over 6-12 weeks as levels optimize and stabilize.",
  },
  {
    question: "Can I add other Halo programs?",
    answer:
      "Yes. Many Testosterone members add Peptide Therapy (Sermorelin), NAD+ Therapy, or weight management programs. All at your founding member rate.",
  },
];

export default function VitalPage() {
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
            You&apos;re not getting old. You&apos;re getting undertreated.
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Halo Testosterone is physician-led testosterone and hormone
            optimization for men. Lab-tested, provider-monitored, shipped to
            your door.
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
                Low T isn&apos;t a punchline. It&apos;s a lab result.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-halo-charcoal/70 leading-relaxed mb-4">
                Tired by 3pm. Recovery takes twice as long. Workouts that used to
                work, don&apos;t. Sleep is broken. Focus is gone. Drive &mdash;
                all kinds &mdash; is fading.
              </p>
              <p className="text-halo-charcoal/70 leading-relaxed">
                You&apos;re not lazy. You&apos;re not depressed. Your
                testosterone may have been declining 1-2% per year since your
                late 20s, and nobody checked.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <StatRow
              stats={[
                { value: "25%", label: "drop in men's testosterone since the 1980s" },
                { value: "40%", label: "of men over 45 have clinically low testosterone" },
                { value: "5+", label: "years average wait before getting tested" },
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
                Data first. Protocol second.
              </h2>
              <p className="text-halo-charcoal/70 leading-relaxed max-w-3xl mx-auto">
                Halo Testosterone starts with a comprehensive hormone panel &mdash;
                not a quiz. Your provider reviews your labs alongside your
                symptoms, lifestyle, and goals to build a protocol grounded in
                your biology.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
              <div className="aos-child">
                <TreatmentCard title="Testosterone Cypionate" description="The gold standard for TRT. Injectable, precise dosing, well-studied. Your provider determines your optimal dose based on labs and response." />
              </div>
              <div className="aos-child">
                <TreatmentCard title="HCG" description="Maintains natural testosterone production and fertility during TRT. Important for men who may want children or want to preserve testicular function." />
              </div>
              <div className="aos-child">
                <TreatmentCard title="Anastrozole" description="Estrogen management. Some men on TRT convert excess testosterone to estrogen. Anastrozole keeps the ratio balanced." />
              </div>
              <div className="aos-child">
                <TreatmentCard title="Enclomiphene" description="An alternative to traditional TRT for men who want to optimize testosterone while preserving fertility. Stimulates your body's own production." />
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <p className="text-center text-sm text-halo-charcoal/50">
              Your provider may recommend one or several based on your labs.
              Protocols are adjusted based on follow-up bloodwork.
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
                What guys actually say after 90 days
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {[
                { category: "Energy", quote: "I wake up ready to go. No more dragging through the afternoon." },
                { category: "Body Composition", quote: "I'm building muscle again. The weight is finally responding." },
                { category: "Recovery", quote: "I can train hard and actually recover. Game changer." },
                { category: "Sleep", quote: "Deep sleep came back. I forgot what it felt like." },
                { category: "Mental Clarity", quote: "Sharper at work. Decisions come faster." },
                { category: "Drive", quote: "Everything came back. Everything." },
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
                Labs to treatment in about 2 weeks.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <div className="space-y-10">
              <div className="aos-child"><StepCard number={1} title="Week 1: Profile & Labs" description="Complete your health profile online (5 min). We send a lab order to Quest or Labcorp near you. Walk in anytime." /></div>
              <div className="aos-child"><StepCard number={2} title="Week 2: Provider Consultation" description="Video consultation with your Halo provider. They walk through your labs, discuss goals, assess risk factors, and build your protocol." /></div>
              <div className="aos-child"><StepCard number={3} title="Week 2-3: Medications Ship" description="Your medications ship from a licensed US pharmacy in temperature-controlled packaging. Everything you need, including supplies." /></div>
              <div className="aos-child"><StepCard number={4} title="Ongoing: Monitored & Optimized" description="Follow-up labs at 90 days. Async check-ins with your provider. Protocol adjustments based on your bloodwork and how you feel." /></div>
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
                One membership. Everything included.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <PricingCard
              programName="Halo Testosterone"
              founderPrice="$129"
              standardPrice="$149"
              includes={[
                "Initial video consultation with your provider",
                "Comprehensive hormone panel (first one free for founders)",
                "Testosterone + ancillaries included",
                "Ongoing async provider access",
                "Follow-up labs at 90 days",
                "Protocol adjustments as needed",
                "Supplies (syringes, needles, alcohol swabs) included",
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
              Stop wondering. Start knowing.
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

      <div className="py-6 px-6 section-light">
        <p className="text-center text-xs text-halo-charcoal/30 max-w-3xl mx-auto">
          Halo is a technology platform that connects patients with licensed healthcare providers. All clinical decisions are made by independent licensed providers. Individual results may vary. This content is not medical advice.
        </p>
      </div>
    </>
  );
}
