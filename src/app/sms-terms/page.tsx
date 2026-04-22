export const metadata = {
  title: "SMS Terms — Halo Health",
  description:
    "Terms for Halo Health SMS messaging. Consent, opt-out, message frequency, and carrier disclosures.",
};

export default function SmsTermsPage() {
  return (
    <section className="py-20 px-6 section-light">
      <div className="max-w-3xl mx-auto pt-20">
        <p className="label-gold mb-4">Legal</p>
        <h1 className="headline-hero text-3xl md:text-4xl lg:text-5xl text-halo-charcoal mb-4">
          SMS Terms &amp; Conditions
        </h1>
        <p className="text-sm text-halo-charcoal/40 mb-12">
          Effective Date: April 1, 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              1. Program Description
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              By providing your mobile number and opting in, you agree to receive
              recurring automated marketing and transactional text messages
              (including those sent using an automatic telephone dialing system)
              from Halo Health Inc. (&ldquo;Halo&rdquo;) at the number you
              provided. Consent is not a condition of purchase. Message frequency
              varies. Message and data rates may apply.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              2. Types of Messages
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed mb-3">
              Messages may include:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-halo-charcoal/70">
              <li>Marketing updates about Halo programs, pricing, and availability</li>
              <li>Appointment and consult reminders (transactional)</li>
              <li>Shipment and refill notifications (transactional)</li>
              <li>Account and security notifications (transactional)</li>
            </ul>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed mt-3">
              Marketing messages require your express written consent via the SMS
              opt-in checkbox. Transactional messages tied to an active membership
              may be sent regardless of marketing consent.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              3. How to Opt Out
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              You can cancel SMS marketing at any time by texting{" "}
              <strong>STOP</strong> to any message you receive from us. After
              texting STOP you will receive one confirmation message that you
              have been unsubscribed. You will no longer receive marketing SMS
              messages from us, though you may continue to receive transactional
              messages related to an active membership. To resume, reply{" "}
              <strong>START</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              4. Help
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              For help at any time, text <strong>HELP</strong> to any message
              from us, or email{" "}
              <a
                href="mailto:support@tryhalo.co"
                className="text-[#6B7B6E] hover:underline"
              >
                support@tryhalo.co
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              5. Carrier Disclosure
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              Carriers are not liable for delayed or undelivered messages.
              Supported carriers include AT&amp;T, T-Mobile, Verizon, Sprint,
              U.S. Cellular, Boost, MetroPCS, Cricket, and other major carriers.
              Not all handsets or service plans support SMS.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              6. Privacy
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              Your phone number will not be shared with third parties for their
              marketing purposes. Phone numbers collected through SMS opt-in are
              used only by Halo and our service providers (such as our SMS
              delivery platform) to send the messages described here. See our{" "}
              <a href="/privacy" className="text-[#6B7B6E] hover:underline">
                Privacy Policy
              </a>{" "}
              for full details.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              7. Eligibility
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              You must be 18 years or older and the account holder or authorized
              user of the mobile number provided to opt in to SMS messaging.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              8. Contact
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              Questions about these SMS Terms should be directed to:
            </p>
            <p className="text-sm text-halo-charcoal/70 mt-2">
              Halo Health Inc.
              <br />
              PO Box 600715
              <br />
              Dallas, TX 75206
              <br />
              Email:{" "}
              <a
                href="mailto:legal@tryhalo.co"
                className="text-[#6B7B6E] hover:underline"
              >
                legal@tryhalo.co
              </a>
            </p>
          </section>

          <section className="border-t border-[#E5E4E0] pt-8 mt-8">
            <p className="text-xs text-halo-charcoal/50 leading-relaxed italic">
              This page is a draft pending legal review. Halo will finalize
              carrier, volume, and program-specific disclosures before launch.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
