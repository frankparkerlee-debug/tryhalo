import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  TestTube2,
  Video,
  Package,
  Check,
  Pill,
  Microscope,
  MessageCircle,
  Truck,
} from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata = {
  title: "How Halo Works — From Sign-Up to Treatment in 3 Weeks",
  description:
    "Four steps from sign-up to feeling different. Health profile, labs, provider consultation, and medications shipped to your door.",
};

const steps = [
  {
    num: "01",
    title: "Complete Your Health Profile",
    desc: "A 5-minute questionnaire covering your health history, symptoms, goals, and lifestyle. This gives your provider a comprehensive starting point before reviewing your labs.",
    icon: ClipboardList,
    color: "#C8A96E",
    timeline: "Day 1 (5 minutes)",
  },
  {
    num: "02",
    title: "Get Your Labs Done",
    desc: "We send a lab order to Quest Diagnostics or Labcorp. Walk into any of their thousands of locations at your convenience, no appointment needed. Results are typically back within 3-5 business days.",
    icon: TestTube2,
    color: "#E8927C",
    timeline: "Days 2-7",
  },
  {
    num: "03",
    title: "Meet Your Provider",
    desc: "A video consultation with your board-certified Halo provider. They review your labs, discuss your symptoms and goals, and build a personalized protocol. This is not a rushed 5-minute chat.",
    icon: Video,
    color: "#4A6FA5",
    timeline: "Week 2",
  },
  {
    num: "04",
    title: "Medications Delivered",
    desc: "Your compounded medications are prepared by a licensed US pharmacy and shipped to your door in temperature-controlled packaging. Refills ship automatically with quick async check-ins.",
    icon: Package,
    color: "#7A8B6F",
    timeline: "Week 2-3",
  },
];

const included = [
  { icon: Pill, label: "Compounded medications" },
  { icon: Microscope, label: "Lab panels (first one free for founders)" },
  { icon: Video, label: "Provider consultations (video + async)" },
  { icon: MessageCircle, label: "Ongoing provider messaging" },
  { icon: Truck, label: "Free shipping on all orders" },
  { icon: Check, label: "Protocol adjustments over time" },
];

export default function HowItWorksPage() {
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
            <p className="label-gold mb-4">Process</p>
            <h1 className="headline-hero text-4xl md:text-5xl lg:text-6xl mb-6 text-white">
              How Halo Works
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              From sign-up to feeling different in about three weeks. Four
              simple steps, no guesswork.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Expanded steps */}
      <section className="py-20 px-6 section-light">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="label-gold mb-4">The Process</p>
              <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal">
                Four steps. No surprises.
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="space-y-8">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="aos-child flex gap-6 p-6 rounded-2xl bg-white border border-black/[0.06] shadow-sm"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${step.color}15`,
                        border: `1px solid ${step.color}30`,
                      }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: step.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-halo-gold/50">
                          {step.num}
                        </span>
                        <h3 className="font-serif text-xl font-semibold text-halo-charcoal">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-sm text-halo-charcoal/60 leading-relaxed mb-2">
                        {step.desc}
                      </p>
                      <p className="text-xs text-halo-gold font-medium">
                        {step.timeline}
                      </p>
                    </div>
                  </div>
                );
              })}
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
              <p className="label-gold mb-4">Membership</p>
              <h2 className="headline-section text-3xl md:text-4xl text-white">
                Everything is included.
              </h2>
              <p className="text-white/50 max-w-xl mx-auto mt-4">
                No hidden fees. No surprise pharmacy bills. Your monthly
                membership covers the full clinical experience.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {included.map((item) => (
                <div
                  key={item.label}
                  className="aos-child flex items-center gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                >
                  <item.icon className="w-5 h-5 text-halo-gold flex-shrink-0" />
                  <span className="text-sm text-white/70">{item.label}</span>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Who is Halo for */}
      <section className="py-20 px-6 section-light">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="label-gold mb-4">For You</p>
              <h2 className="headline-section text-3xl md:text-4xl text-halo-charcoal">
                Who is Halo for?
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  title: "Women in perimenopause or menopause",
                  desc: "Experiencing hot flashes, brain fog, sleep disruption, weight changes, or low energy.",
                },
                {
                  title: "Men with low testosterone symptoms",
                  desc: "Fatigue, low libido, difficulty building muscle, brain fog, or poor recovery.",
                },
                {
                  title: "Adults focused on performance and longevity",
                  desc: "Looking for growth hormone peptides, NAD+ therapy, or cellular optimization.",
                },
                {
                  title: "Anyone tired of generic healthcare",
                  desc: "You want a provider who reviews your labs, listens to your goals, and builds a plan around your biology.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="aos-child bg-white rounded-2xl p-7 border border-black/[0.06] shadow-sm"
                >
                  <h3 className="font-serif text-lg font-semibold text-halo-charcoal mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-halo-charcoal/60 leading-relaxed">
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
      <section className="py-20 px-6 section-dark">
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="headline-section text-3xl md:text-4xl text-white mb-6">
              Ready to start?
            </h2>
            <p className="text-white/50 mb-10 leading-relaxed">
              Take the 2-minute quiz and see which program is right for you.
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
