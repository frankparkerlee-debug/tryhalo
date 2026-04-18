import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import FAQ from "@/components/FAQ";

export const metadata = {
  title: "Pricing — Halo Health",
  description:
    "Transparent pricing for all Halo programs. Medications, labs, provider visits, and shipping included. No hidden fees.",
};

const programs = [
  {
    name: "Hormone Therapy",
    description: "For women navigating perimenopause, menopause, and hormonal imbalance.",
    compounds: "Estradiol, Progesterone, Testosterone",
    standardPrice: "$149",
    foundingPrice: "$129",
    href: "/hormone-therapy",
    available: true,
  },
  {
    name: "Testosterone",
    description: "Lab-driven testosterone optimization with ongoing monitoring.",
    compounds: "Testosterone Cypionate, HCG, Anastrozole",
    standardPrice: "$149",
    foundingPrice: "$129",
    href: "/testosterone-therapy",
    available: true,
  },
  {
    name: "Peptide Therapy",
    description: "Growth hormone peptide therapy for recovery, sleep, and body composition.",
    compounds: "Sermorelin",
    standardPrice: "$229",
    foundingPrice: "$179",
    href: "/peptide-therapy",
    available: true,
  },
  {
    name: "NAD+ Therapy",
    description: "Clinical-grade NAD+ for energy, mental clarity, and cellular health.",
    compounds: "NAD+ Injection, Glutathione",
    standardPrice: "$229",
    foundingPrice: "$179",
    href: "/nad-therapy",
    available: true,
  },
  {
    name: "Weight Loss",
    description: "GLP-1 therapy for sustainable weight management.",
    compounds: "Semaglutide, Tirzepatide",
    standardPrice: "$249",
    foundingPrice: "$199",
    href: "#",
    available: false,
  },
];

const included = [
  "Compounded medications",
  "Comprehensive lab panels",
  "Provider consultations (video + async)",
  "Ongoing provider messaging",
  "Protocol adjustments",
  "Free shipping",
];

const faqItems = [
  {
    question: "Are medications included in the monthly price?",
    answer:
      "Yes. Your monthly membership includes your compounded medications, lab panels, provider consultations, and shipping. There are no separate pharmacy bills.",
    category: "General",
  },
  {
    question: "What is the founding member rate?",
    answer:
      "Founding members receive a reduced monthly rate that is locked in for life. This rate applies as long as your membership remains active. Once the 999 founding spots are filled, pricing increases to standard rates.",
    category: "General",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No. The monthly price is the total cost. We do not charge consultation fees, enrollment fees, or platform fees. What you see is what you pay.",
    category: "General",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. There are no contracts and no cancellation fees. You can cancel from your account at any time. If you cancel and rejoin later, you will be subject to the pricing available at that time.",
    category: "General",
  },
  {
    question: "Is this covered by insurance?",
    answer:
      "Halo programs are not typically covered by insurance. However, we provide documentation you can submit for potential reimbursement. Many members use HSA or FSA funds.",
    category: "General",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 px-6 section-dark relative overflow-hidden">
        <div
          className="absolute top-[10%] right-[10%] w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{
            background: "#6B7B6E",
            filter: "blur(150px)",
            opacity: 0.1,
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10 pt-24 pb-8">
          <AnimateOnScroll>
            <p className="label-gold mb-4">Pricing</p>
            <h1 className="headline-hero text-4xl md:text-5xl lg:text-6xl mb-6 text-white">
              Transparent pricing.
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              Everything included. Medications, labs, provider visits, shipping.
              No hidden fees. No surprise bills.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Pricing table */}
      <section className="py-20 px-6 section-light">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="label-gold mb-4">Programs</p>
              <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal">
                Choose your program.
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="space-y-4">
              {programs.map((program) => (
                <div
                  key={program.name}
                  className={`aos-child rounded-2xl bg-white border border-black/[0.06] shadow-sm p-6 md:p-8 ${
                    !program.available ? "opacity-70" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-sans text-xl font-semibold text-halo-charcoal">
                          {program.name}
                        </h3>
                        {!program.available && (
                          <span className="text-[10px] px-2.5 py-1 rounded-full bg-halo-charcoal/[0.06] text-halo-charcoal/40 font-medium">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-halo-charcoal/60 mb-1">
                        {program.description}
                      </p>
                      <p className="text-xs text-halo-charcoal/40">
                        {program.compounds}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="text-right">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-halo-charcoal">
                            {program.foundingPrice}
                          </span>
                          <span className="text-halo-charcoal/40 text-sm">
                            /mo
                          </span>
                        </div>
                        <p className="text-xs text-halo-charcoal/30 line-through">
                          {program.standardPrice}/mo standard
                        </p>
                      </div>
                      {program.available ? (
                        <Link
                          href={program.href}
                          className="btn-halo !py-2.5 !px-5 !text-sm whitespace-nowrap"
                        >
                          Learn more
                          <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
                        </Link>
                      ) : (
                        <a
                          href="/#founding-circle"
                          className="btn-gold-outline !py-2.5 !px-5 !text-sm whitespace-nowrap"
                        >
                          Join waitlist
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* What's included */}
      <section className="py-20 px-6 section-dark">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="label-gold mb-4">Included</p>
              <h2 className="headline-section text-3xl md:text-4xl text-white">
                Everything is included.
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {included.map((item) => (
                <div
                  key={item}
                  className="aos-child flex items-center gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                >
                  <Check className="w-4 h-4 text-[#6B7B6E] flex-shrink-0" />
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="text-center p-6 rounded-2xl bg-[#6B7B6E]/10 border border-[#E5E4E0]/20">
              <p className="text-white font-medium mb-1">
                Medications are included.
              </p>
              <p className="text-sm text-white/50">
                Unlike other platforms, your monthly membership covers your
                compounded medications. No separate pharmacy bill.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Pricing FAQ */}
      <section className="py-20 px-6 section-light">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal">
                Pricing questions
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger>
            <FAQ items={faqItems} />
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* CTA */}
      <section className="py-20 px-6 section-dark">
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="headline-section text-3xl md:text-4xl text-white mb-6">
              Lock in your founding rate.
            </h2>
            <p className="text-white/50 mb-10 leading-relaxed">
              999 spots at reduced pricing. Once they are filled, prices
              increase.
            </p>
            <Link href="/quiz" className="btn-gold-filled">
              Take the quiz
              <ArrowRight className="w-4 h-4 btn-arrow" />
            </Link>
            <p className="mt-6 text-sm text-white/20">
              No commitment until your first consultation.
            </p>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
