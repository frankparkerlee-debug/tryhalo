import Link from "next/link";
import {
  ArrowRight,
  FlaskConical,
  Stethoscope,
  Package,
  Shield,
  Users,
  HeartPulse,
} from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata = {
  title: "About Halo — Physician-Led Hormone Optimization",
  description:
    "Halo is a physician-led health platform delivering hormone therapy, peptide programs, and precision wellness designed around your biology.",
};

const pillars = [
  {
    icon: FlaskConical,
    title: "Lab-driven",
    description:
      "Every protocol starts with comprehensive bloodwork. We do not prescribe based on symptoms alone. Your labs are the blueprint.",
  },
  {
    icon: Stethoscope,
    title: "Physician-led",
    description:
      "Board-certified providers licensed in your state review your labs, build your plan, and monitor your progress over time.",
  },
  {
    icon: Package,
    title: "Everything included",
    description:
      "Medications, lab panels, provider visits, and shipping are all included in your monthly membership. No surprise bills.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 px-6 section-dark relative overflow-hidden">
        <div
          className="absolute top-[10%] right-[10%] w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{
            background: "#C8A96E",
            filter: "blur(150px)",
            opacity: 0.1,
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10 pt-24 pb-8">
          <AnimateOnScroll>
            <p className="label-gold mb-4">About</p>
            <h1 className="headline-hero text-4xl md:text-5xl lg:text-6xl mb-6 text-white">
              About Halo
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              Halo is a new kind of health platform. Physician-led hormone
              optimization, peptide therapy, and wellness programs designed
              around your biology &mdash; not a quiz.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Mission */}
      <section className="py-20 px-6 section-light">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <p className="label-gold mb-4">Our Mission</p>
            <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal mb-6">
              We believe everyone deserves access to precision medicine.
            </h2>
            <p className="text-halo-charcoal/60 leading-relaxed text-lg mb-4">
              Traditional healthcare treats symptoms. Halo addresses root
              causes. We combine lab diagnostics with board-certified providers
              to build protocols tailored to your unique biology.
            </p>
            <p className="text-halo-charcoal/60 leading-relaxed text-lg">
              Too many people are told their symptoms are &ldquo;just part of
              aging.&rdquo; We disagree. Declining hormones, depleted cellular
              energy, and metabolic dysfunction are treatable &mdash; and the
              science has never been better.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* How we're different */}
      <section className="py-20 px-6 section-light">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="label-gold mb-4">Our Approach</p>
              <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal">
                How we are different.
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="aos-child bg-white rounded-2xl p-8 border border-black/[0.06] shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full border-[1.5px] border-halo-gold/30 flex items-center justify-center mb-5">
                    <pillar.icon className="w-5 h-5 text-halo-gold" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-halo-charcoal mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-halo-charcoal/60 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Provider credibility */}
      <section className="py-20 px-6 section-dark">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="label-gold mb-4">Our Providers</p>
              <h2 className="headline-section text-3xl md:text-4xl text-white mb-6">
                Board-certified. Credentialed in your state.
              </h2>
              <p className="text-white/50 max-w-2xl mx-auto leading-relaxed mb-10">
                Every Halo provider is a licensed physician or advanced practice
                provider with training in hormone optimization and preventive
                medicine. They are credentialed in your state and practice under
                strict clinical guidelines.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  icon: Shield,
                  title: "Licensed & insured",
                  desc: "All providers carry malpractice coverage and hold active licenses.",
                },
                {
                  icon: Users,
                  title: "Specialized training",
                  desc: "Focused on hormone optimization, peptide therapy, and preventive medicine.",
                },
                {
                  icon: HeartPulse,
                  title: "Ongoing monitoring",
                  desc: "Your provider reviews labs and adjusts protocols over time. Never set-and-forget.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="aos-child p-6 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center"
                >
                  <div className="w-10 h-10 rounded-full border border-halo-gold/30 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-4 h-4 text-halo-gold" />
                  </div>
                  <h3 className="font-serif text-base font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* CTA */}
      <section className="py-20 px-6 section-light">
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal mb-6">
              Ready to get started?
            </h2>
            <p className="text-halo-charcoal/60 mb-10 leading-relaxed">
              Take the 2-minute quiz and see which program is right for you.
            </p>
            <Link href="/quiz" className="btn-halo">
              Take the quiz
              <ArrowRight className="w-4 h-4 btn-arrow" />
            </Link>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
