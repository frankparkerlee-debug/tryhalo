export const metadata = {
  title: "Privacy Policy — Halo Health",
  description: "Halo Health privacy policy. How we collect, use, and protect your personal and health information.",
};

export default function PrivacyPage() {
  return (
    <section className="py-20 px-6 section-light">
      <div className="max-w-3xl mx-auto pt-20">
        <p className="label-gold mb-4">Legal</p>
        <h1 className="headline-hero text-3xl md:text-4xl lg:text-5xl text-halo-charcoal mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-halo-charcoal/40 mb-12">
          Effective Date: April 22, 2026
        </p>

        <div className="prose-halo space-y-8">
          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              1. Introduction
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              Halo Health Inc. (&ldquo;Halo,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
              is committed to protecting your privacy. This Privacy Policy describes how we collect,
              use, disclose, and safeguard your personal information when you use our website at
              tryhalo.co and our telehealth platform (collectively, the &ldquo;Services&rdquo;).
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              2. Information We Collect
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed mb-3">
              We collect several types of information to provide and improve our Services:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-halo-charcoal/70">
              <li>
                <strong>Personal Information:</strong> Name, email address, date of birth, phone number,
                shipping address, and payment information.
              </li>
              <li>
                <strong>SMS/Text Messaging Data:</strong> When you provide a mobile number and opt in to
                receive text messages, we retain a record of your consent (the date, the page where consent
                was given, and the exact language you agreed to), along with your message history for
                support and compliance purposes.
              </li>
              <li>
                <strong>Health Information:</strong> Medical history, symptoms, lab results, treatment
                records, provider communications, and prescription information. This information is
                classified as Protected Health Information (PHI) under HIPAA.
              </li>
              <li>
                <strong>Usage Data:</strong> Browser type, IP address, pages visited, time spent on
                pages, and referring URLs.
              </li>
              <li>
                <strong>Device Information:</strong> Device type, operating system, and unique device
                identifiers.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-halo-charcoal/70">
              <li>To provide telehealth services and facilitate your care with licensed providers</li>
              <li>To process orders, prescriptions, and shipments</li>
              <li>To communicate with you about your treatment and account</li>
              <li>To improve our Services and develop new features</li>
              <li>To send you updates about your account, programs, and relevant health information</li>
              <li>To comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              4. How We Share Your Information
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed mb-3">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-halo-charcoal/70">
              <li>
                <strong>Healthcare Providers:</strong> Licensed providers who deliver your care through
                our platform.
              </li>
              <li>
                <strong>Pharmacies:</strong> Licensed compounding pharmacies that prepare and ship your
                medications.
              </li>
              <li>
                <strong>Laboratories:</strong> Quest Diagnostics, Labcorp, and other CLIA-certified labs
                that process your bloodwork.
              </li>
              <li>
                <strong>Service Providers:</strong> Third-party companies that assist with payment
                processing, email communications, hosting, and analytics.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, regulation, or legal process.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              5. Text Messaging (SMS)
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed mb-3">
              Halo offers text message (SMS) communications to patients who provide a mobile phone
              number and expressly opt in. SMS consent is handled separately from email consent and
              is never implied by any other interaction with Halo.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-halo-charcoal/70">
              <li>
                <strong>Consent (TCPA).</strong> By checking the SMS opt-in box at signup or intake, you
                agree that Halo may send you text messages about your care, appointments, orders,
                shipments, and — if you have opted in — promotional updates. Consent is not a condition
                of purchase or of receiving care.
              </li>
              <li>
                <strong>Message types.</strong> Transactional (appointment reminders, shipping updates,
                two-factor codes, provider messages) and, where you have opted in, marketing (new
                programs, price changes, founding-member offers).
              </li>
              <li>
                <strong>Frequency &amp; cost.</strong> Message frequency varies by care stage. Message and
                data rates may apply based on your mobile plan — Halo does not charge for text messages.
              </li>
              <li>
                <strong>Opting out.</strong> Reply <strong>STOP</strong> to any Halo text message to
                unsubscribe from that message category. Reply <strong>HELP</strong> for support. You may
                also contact{" "}
                <a
                  href="mailto:privacy@tryhalo.co"
                  className="text-[#6B7B6E] hover:underline"
                >
                  privacy@tryhalo.co
                </a>{" "}
                to remove your number from all SMS lists.
              </li>
              <li>
                <strong>Mobile opt-in data is not shared or sold.</strong> No mobile information
                (including your phone number, SMS consent record, or message content) will be shared
                with third parties or affiliates for their marketing or promotional purposes. Information
                is shared only with service providers acting on Halo&rsquo;s behalf to deliver the
                messages (e.g. our SMS gateway) and only as required to provide the Services.
              </li>
              <li>
                <strong>Carriers.</strong> T-Mobile, AT&amp;T, Verizon, and other carriers are not
                liable for delayed or undelivered messages.
              </li>
            </ul>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed mt-3">
              For the full terms governing Halo&rsquo;s SMS program, see our{" "}
              <a href="/sms-terms" className="text-[#6B7B6E] hover:underline">
                SMS Terms
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              6. HIPAA Compliance
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              Halo complies with the Health Insurance Portability and Accountability Act (HIPAA).
              Your Protected Health Information (PHI) is handled in accordance with our Notice of
              Privacy Practices. We maintain administrative, physical, and technical safeguards to
              protect your PHI. All business associates who access PHI are bound by HIPAA Business
              Associate Agreements.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              7. Data Security
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              We implement industry-standard security measures to protect your information, including
              encryption in transit (TLS) and at rest, access controls, regular security assessments,
              and employee training. While no method of transmission over the Internet is completely
              secure, we take reasonable steps to protect your data.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              8. Your Rights
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-halo-charcoal/70">
              <li>Access your personal and health information</li>
              <li>Request corrections to inaccurate information</li>
              <li>Request deletion of your personal information (subject to legal retention requirements)</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your health records</li>
              <li>File a complaint if you believe your privacy rights have been violated</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              9. Cookies and Tracking
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              We use cookies and similar technologies to improve your experience, analyze usage
              patterns, and deliver relevant content. You can control cookie settings through your
              browser preferences. Disabling cookies may affect the functionality of our Services.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              10. Changes to This Policy
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any
              material changes by posting the updated policy on our website and updating the
              &ldquo;Effective Date&rdquo; above. Your continued use of our Services after changes
              are posted constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              11. Contact Us
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="text-sm text-halo-charcoal/70 mt-2">
              Halo Health Inc.
              <br />
              Email:{" "}
              <a href="mailto:privacy@tryhalo.co" className="text-[#6B7B6E] hover:underline">
                privacy@tryhalo.co
              </a>
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
