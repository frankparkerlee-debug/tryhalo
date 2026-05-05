import LegalDocument from "@/components/LegalDocument";

export const metadata = {
  title: "Terms of Use — Halo",
  description:
    "Halo Terms of Use. The agreement governing your use of the Halo platform, telehealth services, and related products.",
};

export default function TermsOfUsePage() {
  return (
    <LegalDocument
      eyebrow="Terms of Use"
      title="Terms of Use"
      dek="Please read these terms carefully before using Halo. By accessing or using the platform, you agree to be bound by these terms and the documents they reference."
      effectiveDate="May 1, 2026"
      lastUpdated="May 1, 2026"
    >
      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>1. Introduction</h2>
        <p>
          These Terms of Use (the &ldquo;Terms&rdquo;) govern your access to and
          use of the website at <strong>tryhalo.co</strong>, the Halo mobile
          application, the Halo telehealth platform, and any related products,
          features, or services (collectively, the &ldquo;Site&rdquo; and the
          &ldquo;Services&rdquo;) provided by{" "}
          <strong>Halo Wellness, LLC</strong> (&ldquo;Halo,&rdquo;
          &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
        </p>
        <p>
          The Services connect you with independent licensed healthcare
          providers (the &ldquo;Halo Provider Network&rdquo;) and U.S.-licensed
          pharmacies. Clinical care is delivered by the Halo Provider Network,
          including OpenLoop Healthcare Partners PC and its affiliated
          state-specific professional corporations. Halo provides the
          technology platform; we are not a healthcare provider and do not
          practice medicine or pharmacy.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>2. Agreement to terms</h2>
        <p>
          By accessing or using the Services, you confirm that you have read,
          understood, and agree to be bound by these Terms, our{" "}
          <a href="/privacy">Privacy Policy</a>, our{" "}
          <a href="/notice-of-privacy-practices">
            Notice of Privacy Practices
          </a>
          , and any other policies we reference. If you do not agree, do not
          use the Services.
        </p>
        <p>
          We may modify these Terms from time to time. Material changes will
          be posted to this page with a new effective date. Your continued use
          of the Services after the effective date constitutes acceptance of
          the modified Terms. If you do not agree to the changes, stop using
          the Services.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>3. Eligibility and account registration</h2>
        <p>
          You must be at least 18 years old and a resident of a U.S. state or
          territory where Halo offers Services. You may be required to create
          an account to access certain features. When you register, you agree
          to:
        </p>
        <ul>
          <li>Provide accurate, current, and complete information about yourself.</li>
          <li>Maintain and promptly update your information to keep it accurate.</li>
          <li>Maintain the security of your account credentials and accept all risk of unauthorized access.</li>
          <li>Notify us immediately of any unauthorized use of your account.</li>
        </ul>
        <p>
          You are responsible for all activity that occurs under your account.
          We reserve the right to suspend or terminate accounts that violate
          these Terms or that we reasonably suspect are being misused.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>4. Your relationship with Halo</h2>
        <p>
          Halo is a technology platform. Halo is{" "}
          <strong>not</strong> a healthcare provider, medical group, pharmacy,
          or insurance company. Halo does not practice medicine, provide
          medical advice, prescribe medications, or dispense prescriptions.
        </p>
        <p>
          Clinical care is provided by the independent licensed providers in
          the Halo Provider Network. Each provider is responsible for the
          medical advice and care they deliver to you. The provider–patient
          relationship is between you and your provider, not between you and
          Halo.
        </p>
        <p>
          Pharmacy services are delivered by U.S.-licensed pharmacies that
          partner with Halo, including 503A compounding pharmacies. Those
          pharmacies are independent businesses; Halo does not own or operate
          them.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>5. Independent medical judgment</h2>
        <p>
          Halo does not direct, control, supervise, or interfere with the
          clinical decisions made by your Halo provider. The provider, in
          their sole professional judgment, decides whether a treatment is
          appropriate for you, what protocol to recommend, and whether to
          continue, modify, or end care. A provider may decline to prescribe
          a treatment, may recommend additional evaluation, or may refer you
          elsewhere if that is in your clinical interest.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>6. Telehealth disclaimer and emergencies</h2>
        <p>
          The Services use telehealth — the delivery of health-related
          services via secure video, messaging, and other electronic
          communications. Telehealth has limitations: your provider cannot
          examine you in person, certain conditions cannot be safely diagnosed
          remotely, and technology can fail. By using the Services you
          acknowledge these limitations and consent to receive care via
          telehealth.
        </p>
        <div className="legal-shout">
          The Services are not for medical emergencies. If you are
          experiencing a medical emergency, call 911 or go to the nearest
          emergency room immediately.
        </div>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>7. Pharmacy and product information</h2>
        <p>
          Compounded medications dispensed through the Services are prepared
          by U.S.-licensed 503A compounding pharmacies pursuant to a valid
          prescription written by your Halo provider. Compounded drugs are
          not FDA-approved and are not generic equivalents of branded drugs.
          They are produced under section 503A of the Federal Food, Drug, and
          Cosmetic Act.
        </p>
        <p>
          Branded medications, where offered, are dispensed by U.S.-licensed
          pharmacies that have been authorized by the manufacturer to
          distribute the branded product.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>8. Electronic communications and notices</h2>
        <p>
          By using the Services, you consent to receive communications from
          Halo and the Halo Provider Network electronically — including
          email, text message (where you have separately opted in), and
          in-app notifications. You agree that all agreements, notices,
          disclosures, and other communications we provide electronically
          satisfy any legal requirement that those communications be in
          writing.
        </p>
        <p>
          To stop receiving promotional communications, follow the
          unsubscribe instructions in any message or update your preferences
          in your account. You may not opt out of transactional or
          care-related communications while you have an active account.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>9. Protected Health Information</h2>
        <p>
          Information you share through the Services that relates to your
          health or healthcare is generally protected as Protected Health
          Information (PHI) under HIPAA when it is held by the Halo Provider
          Network. Halo handles PHI on behalf of the Provider Network as a
          business associate. For details on how PHI is used and disclosed,
          and your rights with respect to your PHI, see our{" "}
          <a href="/notice-of-privacy-practices">Notice of Privacy Practices</a>.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>10. Acceptable use</h2>
        <p>You agree not to:</p>
        <ol>
          <li>Use the Services for any unlawful purpose or in violation of any applicable law or regulation.</li>
          <li>Misrepresent your identity, age, location, or any other registration information.</li>
          <li>Access the Services on behalf of another person without their authorization or where you are not legally permitted to do so.</li>
          <li>Use any automated tool — bot, scraper, crawler, or similar — to access, copy, or extract data from the Services.</li>
          <li>Attempt to bypass, disable, or otherwise interfere with security or access-control features of the Services.</li>
          <li>Reverse-engineer, decompile, or otherwise attempt to derive the source code of the Services.</li>
          <li>Resell, sublicense, or otherwise redistribute access to the Services.</li>
          <li>Upload viruses, malicious code, or any content that infringes a third party&rsquo;s rights.</li>
          <li>Harass, threaten, or impersonate any person, including Halo personnel and Halo providers.</li>
          <li>Use the Services to obtain controlled substances in a manner inconsistent with applicable law or your provider&rsquo;s prescribing decision.</li>
        </ol>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>11. Payments, billing, and subscriptions</h2>
        <p>
          Membership fees, medication fees, and other charges are described
          on the relevant page of the Site at the time you sign up. By
          enrolling, you authorize Halo (or its payment processor) to charge
          your selected payment method on the cadence you select (monthly,
          quarterly, or annual).
        </p>
        <p>
          Subscriptions auto-renew at the end of each billing cycle until you
          cancel. You may cancel at any time by visiting your account
          dashboard or by emailing{" "}
          <a href="mailto:hello@tryhalo.co">hello@tryhalo.co</a>. Cancellation
          stops future renewals; it does not refund the current billing
          period unless required by applicable law.
        </p>
        <p>
          Fees for services already rendered, medications already dispensed,
          and lab panels already drawn are non-refundable. Halo may change
          its prices at any time, but price changes will not apply to your
          current billing cycle.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>12. Intellectual property</h2>
        <p>
          The Site, the Services, and all content, software, graphics, text,
          and other materials available through them (other than user
          content) are owned by Halo or its licensors and are protected by
          copyright, trademark, and other laws. We grant you a limited,
          non-exclusive, non-transferable, revocable license to access and
          use the Services for your personal, non-commercial use, subject to
          these Terms.
        </p>
        <p>
          &ldquo;Halo,&rdquo; the Halo logo, and other Halo marks are
          trademarks of Halo Wellness, LLC. You may not use them without our
          prior written consent.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>13. Third-party services and links</h2>
        <p>
          The Services may contain links to or integrate with third-party
          services (including pharmacy partners, lab providers, payment
          processors, and analytics tools). Halo is not responsible for the
          content, policies, or practices of any third party. Your use of a
          third-party service is governed by that party&rsquo;s own terms and
          privacy policy.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>14. Disclaimers</h2>
        <div className="legal-shout">
          The services and the site are provided &ldquo;as is&rdquo; and
          &ldquo;as available.&rdquo; To the fullest extent permitted by law,
          Halo disclaims all warranties, express or implied, including
          warranties of merchantability, fitness for a particular purpose,
          non-infringement, and any warranties arising from a course of
          dealing or usage of trade.
        </div>
        <p>
          Halo does not warrant that the Services will be uninterrupted,
          error-free, secure, or free of viruses or other harmful components.
          Halo does not warrant the accuracy, completeness, or usefulness of
          any content available through the Services. Reliance on any such
          content is at your sole risk.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>15. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, in no event will Halo, its
          affiliates, or its directors, officers, employees, or agents be
          liable for any indirect, incidental, special, consequential, or
          punitive damages — including loss of profits, data, or goodwill —
          arising out of or relating to your use of, or inability to use, the
          Services, even if Halo has been advised of the possibility of such
          damages.
        </p>
        <p>
          To the fullest extent permitted by law, Halo&rsquo;s aggregate
          liability for any claim arising out of or relating to these Terms
          or the Services will not exceed the greater of (a) the amount you
          paid Halo in the twelve (12) months preceding the event giving
          rise to the claim, or (b) one hundred dollars ($100).
        </p>
        <p>
          You agree that any claim or cause of action arising out of or
          related to your use of the Services must be filed within{" "}
          <strong>one (1) year</strong> after the claim or cause of action
          arose, or it will be permanently barred.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>16. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless Halo, its
          affiliates, and their respective directors, officers, employees,
          and agents from and against any claims, liabilities, damages,
          losses, and expenses (including reasonable attorneys&rsquo; fees)
          arising out of or in any way connected with your access to or use
          of the Services, your violation of these Terms, or your violation
          of any rights of another.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>17. Termination</h2>
        <p>
          You may stop using the Services and cancel your subscription at any
          time. Halo may suspend or terminate your access to the Services at
          any time, with or without cause and with or without notice, if we
          believe you have violated these Terms or if we discontinue the
          Services.
        </p>
        <p>
          Sections that by their nature should survive termination — including
          intellectual property, disclaimers, limitations of liability,
          indemnification, and dispute resolution — will survive termination
          of these Terms.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>18. Governing law and dispute resolution</h2>
        <p>
          These Terms are governed by the laws of the State of Texas
          without regard to its conflict-of-laws principles. Any dispute
          arising out of or relating to these Terms or the Services that is
          not resolved informally will be brought exclusively in the state
          or federal courts located in Dallas County, Texas, and you consent
          to personal jurisdiction and venue in those courts.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>19. Miscellaneous</h2>
        <p>
          These Terms, together with the documents they reference, are the
          entire agreement between you and Halo regarding the Services and
          supersede any prior agreements. If any provision of these Terms is
          held to be unenforceable, that provision will be modified to the
          minimum extent necessary, and the remaining provisions will remain
          in full force and effect. Halo&rsquo;s failure to enforce any
          provision is not a waiver of that provision.
        </p>
        <p>
          You may not assign these Terms without our prior written consent.
          Halo may assign these Terms freely.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>20. Contact us</h2>
        <p>Questions about these Terms? Contact us:</p>
        <div className="legal-callout">
          <strong>Halo Wellness, LLC</strong>
          <br />
          Email:{" "}
          <a href="mailto:hello@tryhalo.co">hello@tryhalo.co</a>
          <br />
          Privacy: <a href="mailto:privacy@tryhalo.co">privacy@tryhalo.co</a>
        </div>
      </section>
    </LegalDocument>
  );
}
