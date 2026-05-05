import LegalDocument from "@/components/LegalDocument";

export const metadata = {
  title: "Telehealth Consent — Halo",
  description:
    "Halo Telehealth Informed Consent. What you are consenting to when you receive care via the Halo platform — modalities, technology, limitations, and your rights.",
};

export default function TelehealthConsentPage() {
  return (
    <LegalDocument
      eyebrow="Telehealth Informed Consent"
      title="Telehealth Consent"
      dek="By using the Halo platform to receive clinical care, you are consenting to the items below. Read carefully — and ask your provider any questions before clicking through."
      effectiveDate="May 1, 2026"
      lastUpdated="May 1, 2026"
    >
      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>Consent to telehealth</h2>
        <p>
          Halo connects you with independent licensed healthcare providers
          (the &ldquo;Halo Provider Network,&rdquo; including OpenLoop
          Healthcare Partners PC and its affiliated state-specific
          professional corporations) who deliver care through{" "}
          <strong>videoconferencing, telephonic, and asynchronous
          (messaging-based)</strong> technology. By accessing or using the
          Halo platform to receive care, you consent to receive that care
          via these telehealth modalities.
        </p>
        <p>
          The technology platform is provided by{" "}
          <strong>Halo Wellness, LLC</strong>. Clinical decisions remain
          with the provider in the Halo Provider Network.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>Treatment-specific consent</h2>
        <p>By proceeding, you confirm that you understand and consent to the following:</p>

        <ol>
          <li>
            Care will be delivered via telehealth (video, phone, or async
            messaging) rather than in-person evaluation. You consent to
            receive care this way for as long as you remain a Halo member,
            unless your provider determines an in-person visit is needed.
          </li>
          <li>
            You authorize Halo and the Halo Provider Network to access,
            import, and use medical records, prescription histories, and
            related health information to deliver and coordinate your care,
            consistent with our{" "}
            <a href="/notice-of-privacy-practices">Notice of Privacy Practices</a>.
          </li>
          <li>
            You will participate in telehealth visits from a private
            location free from observation by anyone you have not
            authorized to be present.
          </li>
          <li>
            Telehealth has technical risks — interruption, dropped
            connections, data loss, delayed transmission, or unauthorized
            access despite reasonable safeguards. You accept these risks
            and agree to hold Halo and your provider harmless from
            technical failures outside their control.
          </li>
          <li>
            Halo and your provider may use AI-assisted technology for
            transcription, clinical decision support, quality assurance,
            and analysis of voice, image, or other information generated
            during your visit. You may ask your provider whether AI is in
            use and may request that AI not be used in particular aspects
            of your care where reasonably feasible.
          </li>
          <li>
            Visits may be recorded (audio or video) for documentation,
            quality, and training purposes. You will be notified at the
            start of any recorded visit. You may decline to have the
            recording retained, in which case the visit will continue
            without one.
          </li>
          <li>
            Halo or its contracted vendors may use ambient-listening
            technology to assist with note generation. You may ask for
            ambient listening to be disabled at any visit.
          </li>
          <li>
            Care may be provided by a physician, nurse practitioner, or
            physician associate licensed in your state. Provider
            credentials are listed on your visit summary.
          </li>
          <li>
            Telehealth has limitations compared to in-person care. Some
            conditions cannot be diagnosed or treated remotely. If your
            provider determines telehealth is not appropriate for your
            situation, they may refer you to in-person care or decline to
            issue a prescription.
          </li>
          <li>
            Halo may use beta or developmental versions of its platform.
            New features may have bugs or unexpected behavior. You agree
            to report issues so we can improve the product.
          </li>
          <li>
            The information you provide to Halo and to your provider is
            true, correct, and complete to the best of your knowledge. You
            will keep it accurate and up to date.
          </li>
          <li>
            Your provider has sole discretion over whether telehealth is
            appropriate for any condition. They may decline to evaluate or
            prescribe based on safety, scope, or appropriateness, with or
            without disclosing the reason.
          </li>
          <li>
            Receiving a consultation does not guarantee that a prescription
            will be issued. Whether a treatment is appropriate is the
            provider&rsquo;s clinical judgment.
          </li>
          <li>
            You may use the pharmacy or laboratory of your choice if
            available; Halo&rsquo;s default pharmacy and laboratory partners
            are described elsewhere in the Halo experience.
          </li>
          <li>
            You are responsible for paying applicable fees for the Halo
            membership, medications, lab panels, and any out-of-pocket
            charges. See our{" "}
            <a href="/cancellation-and-refund-policy">
              Cancellation and Refund Policy
            </a>{" "}
            for refund-eligibility rules.
          </li>
          <li>
            <strong>Telehealth is not for emergencies.</strong> If you are
            experiencing a medical emergency, call 911 or go to the
            nearest emergency room.
          </li>
          <li>
            For minor patients (age 13+) where Halo offers care, parental
            or legal-guardian consent is required for treatment orders and
            diagnoses; the parent or guardian acknowledges this consent
            covers ongoing care.
          </li>
          <li>
            You acknowledge there are no third-party beneficiaries of this
            consent — only you and your provider are parties to the
            clinical relationship.
          </li>
          <li>
            You consent to disclosure of Protected Health Information to
            providers, pharmacies, laboratories, and Halo personnel as
            described in our{" "}
            <a href="/notice-of-privacy-practices">Notice of Privacy Practices</a>.
          </li>
          <li>
            You may revoke this consent at any time by emailing{" "}
            <a href="mailto:privacy@tryhalo.co">privacy@tryhalo.co</a>.
            Revocation does not apply retroactively to disclosures already
            made or services already rendered.
          </li>
          <li>
            By clicking &ldquo;I Agree&rdquo; — or by continuing to use the
            Halo platform after this consent has been presented to you —
            you confirm you have read, understood, and accepted these
            terms.
          </li>
        </ol>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>Compounded medications — additional consent</h2>
        <p>
          If your protocol includes compounded medication, you understand:
        </p>
        <ul>
          <li>
            Compounded drugs are <strong>not FDA-approved</strong> and have
            not been reviewed for safety or effectiveness in the way
            branded drugs have. They are produced under section 503A of
            the Federal Food, Drug, and Cosmetic Act by U.S.-licensed
            compounding pharmacies pursuant to your provider&rsquo;s
            prescription.
          </li>
          <li>
            Compounded drugs are not generic equivalents of branded
            products and may have different formulations, vehicles,
            strengths, or release characteristics than the branded version
            of the active ingredient.
          </li>
          <li>
            Federal law generally prohibits the return of dispensed
            prescription medications. Refunds for medications already
            dispensed are not available except in cases of damage or
            error, as described in the{" "}
            <a href="/cancellation-and-refund-policy">Cancellation and Refund Policy</a>.
          </li>
        </ul>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>Laboratory products and services</h2>
        <p>
          Lab tests have inherent limitations. Results may include false
          positives, false negatives, or values that fall outside reference
          ranges for reasons unrelated to your underlying health. Your
          provider interprets results in the context of your full clinical
          picture; a single result is not a diagnosis. If your provider
          recommends repeat testing, additional panels, or in-person
          evaluation, follow that recommendation.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>Authorization to bill insurance</h2>
        <p>
          If you elect to use insurance for any covered service, you
          authorize Halo and the Halo Provider Network to submit claims to
          your insurer and to receive payment directly. You assign
          benefits payable for those claims to the appropriate Halo
          Provider Network entity. You remain financially responsible for
          any amount not covered by insurance, including copayments,
          coinsurance, and deductibles.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>Email and SMS communications</h2>
        <p>
          You consent to receive appointment, refill, and care-related
          communications by email and (where you have separately opted in)
          by SMS text message. These messages may include reminders,
          educational content, and AI-generated summaries. Standard
          message and data rates may apply. You can opt out of marketing
          messages by following the unsubscribe instructions in any
          message; transactional and care-related messages cannot be
          opted out of while you have an active account. See our{" "}
          <a href="/sms-terms">SMS Terms</a> for details.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>Your rights</h2>
        <ul>
          <li>You may ask questions about anything in this consent at any time.</li>
          <li>You may request information on how AI is used in your care.</li>
          <li>You may request that AI not be used in particular aspects of your care, where reasonably feasible.</li>
          <li>You may decline a recording or request that ambient listening be disabled.</li>
          <li>You may decline a prescription, lab test, or service at any time without affecting future care.</li>
          <li>You may revoke this consent in writing to <a href="mailto:privacy@tryhalo.co">privacy@tryhalo.co</a>; revocation does not apply retroactively.</li>
        </ul>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>State-specific disclosures</h2>
        <p>
          State law may require additional disclosures or grant additional
          rights. Halo and the Halo Provider Network comply with the
          telehealth-specific rules of every state in which they operate.
          For state-specific complaint procedures and medical board
          contact information, contact us using the information below and
          we will direct you to the correct authority for your state of
          residence.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>Acknowledgment</h2>
        <div className="legal-shout">
          By clicking &ldquo;I Agree,&rdquo; checking the consent box, or
          continuing to use the Halo platform to receive care, you confirm
          you have read this consent, understand it, and accept its terms.
        </div>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>Contact us</h2>
        <p>Questions about this consent? Contact:</p>
        <div className="legal-callout">
          <strong>Halo Wellness, LLC</strong>
          <br />
          PO Box 600715
          <br />
          Dallas, TX 75206
          <br />
          <br />
          Email: <a href="mailto:privacy@tryhalo.co">privacy@tryhalo.co</a>
          <br />
          For clinical questions, contact your provider through the Halo
          platform.
        </div>
      </section>
    </LegalDocument>
  );
}
