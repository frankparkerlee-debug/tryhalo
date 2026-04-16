import Link from "next/link";
import { ArrowRight, Heart, Users, Sparkles, User } from "lucide-react";
import StatRow from "@/components/StatRow";
import TreatmentCard from "@/components/TreatmentCard";
import StepCard from "@/components/StepCard";
import PricingCard from "@/components/PricingCard";
import FAQ from "@/components/FAQ";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const faqItems = [
  {
    question: "Is this just like those ED pill websites?",
    answer:
      "No. Halo Sexual Wellness focuses on desire and intimacy, which is different from erectile function. PT-141 works on the brain, not blood flow. We also offer ED treatments for men who need them, but Sexual Wellness is designed for the full spectrum of sexual health.",
  },
  {
    question: "Can women use these treatments?",
    answer:
      "Yes. PT-141 (Bremelanotide/Vyleesi) is specifically FDA-approved for women with HSDD. Oxytocin is commonly prescribed for women as well. This is not a men-only program.",
  },
  {
    question: "Is it really private?",
    answer:
      "Completely. All packaging is discreet with no indication of contents. Your health information is HIPAA-protected. No pharmacy benefit claims unless you choose to submit them.",
  },
  {
    question: "Can I combine this with Hormone Therapy or Testosterone?",
    answer:
      "Absolutely. Many patients find that hormone optimization combined with Sexual Wellness produces the most complete results. Your provider can coordinate across programs.",
  },
];

export default function ConnectPage() {
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
            Desire isn&apos;t gone. It&apos;s just not getting any help.
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Halo Sexual Wellness offers FDA-approved therapies for sexual health
            &mdash; for both women and men. Private, physician-led, and
            delivered to your door.
          </p>
          <a href="/#founding-circle" className="btn-gold-filled">
            Tell me more
            <ArrowRight className="w-4 h-4 btn-arrow" />
          </a>
          <p className="mt-8 text-sm text-white/35 flex items-center justify-center gap-3 flex-wrap">
            <span>FDA-approved therapies</span>
            <span className="w-1 h-1 rounded-full bg-[#6B7B6E]" />
            <span>Licensed providers</span>
            <span className="w-1 h-1 rounded-full bg-[#6B7B6E]" />
            <span>Discreet shipping</span>
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
                Nobody talks about it. Everyone thinks about it.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-halo-charcoal/70 leading-relaxed mb-4">
                Low libido. Decreased desire. Disconnection from your partner
                &mdash; or yourself. It&apos;s one of the most common health
                concerns in adults over 30, and one of the least treated.
              </p>
              <p className="text-halo-charcoal/70 leading-relaxed font-medium">
                It&apos;s not in your head. It&apos;s in your biology.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <StatRow
              stats={[
                { value: "43%", label: "of women report some form of sexual difficulty" },
                { value: "31%", label: "of men experience sexual health concerns" },
                { value: "<25%", label: "ever discuss it with a provider" },
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
                Clinically proven. Not a supplement. Not a candle.
              </h2>
              <p className="text-halo-charcoal/70 leading-relaxed max-w-3xl mx-auto">
                Halo Sexual Wellness uses FDA-approved and physician-prescribed
                therapies that work on the neuroscience of desire &mdash; not
                just blood flow.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-6">
              <div className="aos-child">
                <TreatmentCard title="PT-141 (Bremelanotide)" description="FDA-approved for hypoactive sexual desire disorder. Works on the brain's desire pathways, not just mechanics. For women and men." />
              </div>
              <div className="aos-child">
                <TreatmentCard title="Oxytocin (compounded intranasal)" description="The connection molecule. Compounded for intimacy support, mood, and bonding. Used alongside PT-141 or independently." />
              </div>
              <div className="aos-child">
                <TreatmentCard title="Tadalafil / Sildenafil (for men)" description="Proven, well-studied treatments for erectile function. Available as daily low-dose or on-demand." />
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <p className="text-center text-sm text-halo-charcoal/50">
              Your provider recommends treatment based on your health profile,
              symptoms, and goals. All prescriptions require clinical evaluation.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* WHO IT'S FOR */}
      <section className="py-20 px-6 section-dark">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="label-gold mb-4">For You</p>
              <h2 className="headline-section text-3xl md:text-4xl text-white">
                Built for real people with real lives.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {[
                {
                  icon: Heart,
                  title: "Women in perimenopause/menopause",
                  desc: "Hormonal shifts directly impact desire. Sexual Wellness addresses the neurological side, especially when paired with Hormone Therapy.",
                },
                {
                  icon: User,
                  title: "Men experiencing low libido beyond ED",
                  desc: "ED medications help with mechanics. PT-141 helps with desire. Different problem, different solution.",
                },
                {
                  icon: Users,
                  title: "Couples",
                  desc: "Both partners can join Halo Sexual Wellness independently, each with their own provider and treatment plan.",
                },
                {
                  icon: Sparkles,
                  title: "Anyone who misses how they used to feel",
                  desc: "You don't need a clinical diagnosis. If your desire has shifted and you want to explore safe, physician-led options, this is for you.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="aos-child p-6 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                >
                  <div className="w-10 h-10 rounded-full border border-[#E5E4E0]/30 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-[#6B7B6E]" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
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
                Private, fast, delivered.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <div className="space-y-10">
              <div className="aos-child"><StepCard number={1} title="Quick Evaluation" description="Complete a short health questionnaire online. Entirely private." /></div>
              <div className="aos-child"><StepCard number={2} title="Provider Review" description="Your Halo provider reviews your profile and health history. Most evaluations are completed async, no video visit required unless you prefer one." /></div>
              <div className="aos-child"><StepCard number={3} title="Prescription & Delivery" description="If appropriate, your provider prescribes treatment. Medications ship in plain, discreet packaging from a licensed US pharmacy." /></div>
              <div className="aos-child"><StepCard number={4} title="Follow Up" description="Check in with your provider anytime through async messaging. Adjust dosing or try alternatives as needed." /></div>
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
                No awkward conversations. No surprise bills.
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <PricingCard
              programName="Halo Sexual Wellness"
              founderPrice="$99"
              standardPrice="$149"
              includes={[
                "Clinical evaluation",
                "Provider consultation (async or video)",
                "Ongoing provider access for adjustments",
                "Care coordination",
              ]}
              medicationRange="$40-120/mo"
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
              You don&apos;t have to just settle.
            </h2>
            <p className="text-white/50 mb-10">
              Discreet. Private. No commitment until you are ready.
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
