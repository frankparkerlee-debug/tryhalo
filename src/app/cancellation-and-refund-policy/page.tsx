import LegalDocument from "@/components/LegalDocument";

export const metadata = {
  title: "Cancellation and Refund Policy — Halo",
  description:
    "Halo Cancellation and Refund Policy. How subscriptions auto-renew, cancellation windows, what's refundable, and how prescription medication refunds work.",
};

export default function CancellationAndRefundPolicyPage() {
  return (
    <LegalDocument
      eyebrow="Cancellation and Refund Policy"
      title="Cancellation &amp; Refund Policy"
      dek="How Halo subscriptions, medications, and lab fees are billed — and the rules that apply when you want to cancel or request a refund."
      effectiveDate="May 1, 2026"
      lastUpdated="May 1, 2026"
    >
      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>1. Subscription services</h2>
        <p>
          Halo membership is a recurring subscription. When you enroll,
          you authorize <strong>Halo Wellness, LLC</strong> (and our
          payment processor) to charge your selected payment method on the
          cadence you choose:
        </p>
        <ul>
          <li><strong>Monthly</strong> — billed every 30 days</li>
          <li><strong>Quarterly</strong> — billed every 90 days at the discounted bundled rate</li>
          <li><strong>Annual</strong> — billed once every 365 days at the deepest discount</li>
        </ul>
        <p>
          Your subscription auto-renews at the end of each cycle until you
          cancel. The price you see at signup is locked in for as long as
          your membership stays active and uninterrupted; founding-member
          pricing in particular is grandfathered for the life of your
          membership.
        </p>
        <p>
          Lab panels and out-of-pocket fees (for example, branded
          medications priced separately from the membership) are billed in
          addition to the subscription. Those charges are itemized in your
          account dashboard before they post.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>2. Cancellation policy</h2>
        <p>
          You may cancel your Halo membership at any time. There are no
          long-term contracts and no cancellation fees.
        </p>

        <h3>How to cancel</h3>
        <ul>
          <li>From your account dashboard at <strong>tryhalo.co</strong>, under <em>Membership &rarr; Cancel</em></li>
          <li>By email to <a href="mailto:hello@tryhalo.co">hello@tryhalo.co</a> from the address associated with your account</li>
        </ul>

        <h3>Cancellation timing</h3>
        <p>
          To stop the next billing cycle, your cancellation request must
          reach us at least <strong>72 hours before your next billing
          date</strong>. Requests received inside that 72-hour window will
          process the upcoming charge as scheduled and take effect on the
          following cycle.
        </p>

        <h3>What happens after you cancel</h3>
        <ul>
          <li>
            Your access to the Halo platform — including provider
            messaging and care continuity — continues through the end of
            your current billing cycle.
          </li>
          <li>
            Any medication that has already been prepared or shipped will
            still be delivered, since federal law prohibits the return of
            dispensed prescription medications.
          </li>
          <li>
            Your account is closed at the end of the cycle. We retain
            medical records as required by HIPAA and state law; see our{" "}
            <a href="/notice-of-privacy-practices">
              Notice of Privacy Practices
            </a>{" "}
            for details.
          </li>
          <li>
            You may rejoin Halo at any time. Founding-member pricing is
            tied to continuous membership; if you cancel and rejoin later,
            you re-enroll at the prevailing public price.
          </li>
        </ul>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>3. Refund policy</h2>

        <h3>Subscription fees</h3>
        <p>
          Membership fees for the current billing cycle are{" "}
          <strong>refundable only if no medication has been dispensed for
          that cycle.</strong> Once your provider has issued a prescription
          and a pharmacy has filled it, federal pharmacy regulations
          prohibit the return of the medication, so the cycle&rsquo;s fees
          are non-refundable.
        </p>
        <p>
          For quarterly and annual subscriptions, if you cancel partway
          through the bundled period, we refund a prorated amount based on
          the number of complete months remaining, less the difference
          between the bundled discount and the standard monthly rate for
          months already used. In plain terms: you don&rsquo;t pay for
          unused months, but you do give up the bundle discount on the
          months you used.
        </p>

        <h3>Medications</h3>
        <p>
          <strong>Federal law generally prohibits the return of
          prescription medications.</strong> Once dispensed, prescription
          medications cannot be returned, resold, or refunded — this is a
          regulatory rule that applies across all licensed U.S.
          pharmacies, not a Halo policy.
        </p>
        <p>Two exceptions where we provide a replacement (not a cash refund):</p>
        <ul>
          <li>
            <strong>Damaged in transit</strong> — if your medication
            arrives broken, leaking, or otherwise compromised, we will
            replace it at no charge. Email{" "}
            <a href="mailto:hello@tryhalo.co">hello@tryhalo.co</a> with a
            photo within 7 days of delivery.
          </li>
          <li>
            <strong>Pharmacy or fulfillment error</strong> — if the wrong
            medication, dose, or strength is shipped, we will correct the
            order at no charge. Notify us within 14 days of delivery.
          </li>
        </ul>

        <h3>Lab fees</h3>
        <p>
          Lab orders that have not yet been drawn are refundable in full —
          contact us before your draw date and we will cancel the order.
          Once your blood has been drawn at a Quest or Labcorp location,
          the lab fee is non-refundable, even if you cancel your Halo
          membership before the results are returned.
        </p>

        <h3>Consultation fees</h3>
        <p>
          Standalone consultation fees, where applicable, are refundable
          if you cancel the appointment at least 24 hours in advance.
          Inside the 24-hour window, the fee is non-refundable. If your
          provider determines telehealth is not appropriate for your
          situation and declines to issue a prescription, your
          consultation fee for that visit is refunded in full.
        </p>

        <h3>Promotional credits and gift cards</h3>
        <p>
          Promotional credits, founding-member discounts, and gift cards
          are not redeemable for cash and are not refundable. They expire
          according to the terms shown at the time of issue.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>4. State-specific provisions</h2>
        <p>
          Some states require longer cancellation windows or specific
          refund disclosures for telehealth or compounded-medication
          subscriptions. Where state law is more protective than this
          policy, the more protective rule applies. Contact us if
          you&rsquo;d like to know the specific rule for your state of
          residence.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>5. Frequently asked</h2>

        <h3>Will I be charged again after I cancel?</h3>
        <p>
          No, as long as your cancellation reaches us at least 72 hours
          before your next billing date. If it&rsquo;s inside the 72-hour
          window, the upcoming charge will process and your cancellation
          takes effect on the following cycle.
        </p>

        <h3>Can I pause instead of canceling?</h3>
        <p>
          Yes. Members on quarterly or annual plans can pause their
          subscription for up to 90 days while keeping founding-member
          pricing locked in. Email{" "}
          <a href="mailto:hello@tryhalo.co">hello@tryhalo.co</a> to
          request a pause.
        </p>

        <h3>What if I had a bad experience with the medication?</h3>
        <p>
          Talk to your provider through the Halo platform first — most
          medication issues are dosing or titration issues that your
          provider can adjust. If you&rsquo;ve had a serious adverse
          reaction, stop the medication and contact your provider
          immediately, then report the event to the FDA MedWatch program
          at{" "}
          <a
            href="https://www.fda.gov/safety/medwatch"
            target="_blank"
            rel="noopener noreferrer"
          >
            fda.gov/safety/medwatch
          </a>
          .
        </p>

        <h3>Are there cancellation fees?</h3>
        <p>None. Halo does not charge cancellation fees, early-termination fees, or restocking fees.</p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>6. Contact us</h2>
        <p>For all cancellation and refund requests:</p>
        <div className="legal-callout">
          <strong>Halo Wellness, LLC</strong>
          <br />
          PO Box 600715
          <br />
          Dallas, TX 75206
          <br />
          <br />
          Email: <a href="mailto:hello@tryhalo.co">hello@tryhalo.co</a>
          <br />
          Account dashboard: <a href="https://tryhalo.co/account">tryhalo.co/account</a>
        </div>
        <p>
          See also our <a href="/terms-of-use">Terms of Use</a> for the
          broader agreement governing your Halo membership.
        </p>
      </section>
    </LegalDocument>
  );
}
