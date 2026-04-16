"use client";

import { useState } from "react";
import { ArrowRight, Mail, Clock } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder form action
    setSubmitted(true);
  };

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
            <p className="label-gold mb-4">Contact</p>
            <h1 className="headline-hero text-4xl md:text-5xl lg:text-6xl mb-6 text-white">
              Get in touch.
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              Have a question about Halo? We are here to help.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Contact info + form */}
      <section className="py-20 px-6 section-light">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left: info */}
            <AnimateOnScroll>
              <div>
                <h2 className="headline-section text-2xl md:text-3xl text-halo-charcoal mb-6">
                  Contact information
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full border border-[#E5E4E0]/30 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-[#6B7B6E]" />
                    </div>
                    <div>
                      <p className="font-medium text-halo-charcoal mb-1">
                        Email
                      </p>
                      <a
                        href="mailto:hello@tryhalo.co"
                        className="text-sm text-[#6B7B6E] hover:underline"
                      >
                        hello@tryhalo.co
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full border border-[#E5E4E0]/30 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-[#6B7B6E]" />
                    </div>
                    <div>
                      <p className="font-medium text-halo-charcoal mb-1">
                        Hours
                      </p>
                      <p className="text-sm text-halo-charcoal/60">
                        Monday &ndash; Friday
                        <br />
                        9:00 AM &ndash; 5:00 PM CST
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 p-5 rounded-xl bg-white border border-black/[0.06]">
                  <p className="text-sm text-halo-charcoal/60">
                    We typically respond within one business day. For urgent
                    medical concerns, please contact your provider directly
                    through the Halo platform or call 911.
                  </p>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Right: form */}
            <AnimateOnScroll>
              <div>
                <h2 className="headline-section text-2xl md:text-3xl text-halo-charcoal mb-6">
                  Send us a message
                </h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <p className="text-[#6B7B6E] font-semibold text-lg mb-2">
                      Message sent.
                    </p>
                    <p className="text-sm text-halo-charcoal/60">
                      We will get back to you within one business day.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-halo-charcoal mb-1.5"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-halo-charcoal/10 bg-white text-sm text-halo-charcoal outline-none focus:border-[#E5E4E0] transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-halo-charcoal mb-1.5"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-halo-charcoal/10 bg-white text-sm text-halo-charcoal outline-none focus:border-[#E5E4E0] transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-halo-charcoal mb-1.5"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-halo-charcoal/10 bg-white text-sm text-halo-charcoal outline-none focus:border-[#E5E4E0] transition-colors resize-none"
                        placeholder="How can we help?"
                      />
                    </div>
                    <button type="submit" className="btn-halo">
                      Send message
                      <ArrowRight className="w-4 h-4 btn-arrow" />
                    </button>
                  </form>
                )}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </>
  );
}
