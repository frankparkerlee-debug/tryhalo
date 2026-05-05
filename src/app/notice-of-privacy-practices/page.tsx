import LegalDocument from "@/components/LegalDocument";

export const metadata = {
  title: "Notice of Privacy Practices — Halo",
  description:
    "Halo Notice of Privacy Practices. How protected health information is used and disclosed and your rights as a patient under HIPAA.",
};

export default function NoticeOfPrivacyPracticesPage() {
  return (
    <LegalDocument
      eyebrow="Notice of Privacy Practices"
      title="Notice of Privacy Practices"
      dek="This notice describes how protected health information about you may be used and disclosed and how you can get access to this information. Please review it carefully."
      effectiveDate="May 1, 2026"
      lastUpdated="May 1, 2026"
    >
      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>Who we are</h2>
        <p>
          This Notice of Privacy Practices is provided by{" "}
          <strong>Halo Health Inc.</strong> (&ldquo;Halo,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;) and the affiliated covered
          entities (&ldquo;ACE&rdquo;) that provide clinical care through the
          Halo platform. The clinical practice is delivered by{" "}
          <strong>OpenLoop Healthcare Partners PC</strong>, its state-specific
          professional corporations, and other independent licensed providers
          (collectively, the &ldquo;Halo Provider Network&rdquo;).
        </p>
        <p>
          Halo and the Halo Provider Network are designated as a single{" "}
          <em>affiliated covered entity</em> for purposes of the Health
          Insurance Portability and Accountability Act of 1996 (&ldquo;HIPAA&rdquo;).
          That means we share Protected Health Information (PHI) among
          ourselves as needed to deliver and coordinate your care.
        </p>
        <div className="legal-shout">
          We are required by law to maintain the privacy of your PHI, provide
          you with this notice of our legal duties and privacy practices, and
          follow the terms of the notice currently in effect.
        </div>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>Your rights</h2>
        <p>
          When it comes to your health information, you have specific rights.
          This section explains your rights and some of our responsibilities
          to help you.
        </p>

        <h3>Get a copy of your medical record</h3>
        <p>
          You can ask to see or get an electronic or paper copy of your
          medical record and other health information we maintain about you.
          We will provide a copy or a summary of your information, usually
          within 30 days of your request. We may charge a reasonable,
          cost-based fee.
        </p>

        <h3>Ask us to correct your medical record</h3>
        <p>
          You can ask us to correct health information about you that you
          think is incorrect or incomplete. We may say no to your request,
          but we will tell you why in writing within 60 days.
        </p>

        <h3>Request confidential communications</h3>
        <p>
          You can ask us to contact you in a specific way (for example, by
          home or office phone) or to send mail to a different address. We
          will say yes to all reasonable requests.
        </p>

        <h3>Ask us to limit what we use or share</h3>
        <p>
          You can ask us not to use or share certain health information for
          treatment, payment, or our operations. We are not required to agree
          to your request, and we may say no if it would affect your care. If
          you pay for a service or healthcare item out-of-pocket in full, you
          can ask us not to share that information for the purpose of payment
          or our operations with your health insurer. We will say yes unless
          a law requires us to share that information.
        </p>

        <h3>Get a list of those with whom we&rsquo;ve shared information</h3>
        <p>
          You can ask for a list (an &ldquo;accounting&rdquo;) of the times
          we&rsquo;ve shared your health information for six years prior to
          the date you ask, who we shared it with, and why. We will include
          all the disclosures except for those about treatment, payment, and
          healthcare operations, and certain other disclosures (such as any
          you asked us to make). We will provide one accounting per year for
          free but will charge a reasonable, cost-based fee if you ask for
          another within 12 months.
        </p>

        <h3>Get a copy of this privacy notice</h3>
        <p>
          You can ask for a paper copy of this notice at any time, even if
          you have agreed to receive the notice electronically. We will
          provide you with a paper copy promptly.
        </p>

        <h3>Choose someone to act for you</h3>
        <p>
          If you have given someone medical power of attorney or if someone
          is your legal guardian, that person can exercise your rights and
          make choices about your health information. We will make sure the
          person has this authority and can act for you before we take any
          action.
        </p>

        <h3>File a complaint if you feel your rights are violated</h3>
        <p>
          You can complain if you feel we have violated your rights by
          contacting us using the information at the end of this notice. You
          can also file a complaint with the U.S. Department of Health and
          Human Services Office for Civil Rights by sending a letter to 200
          Independence Avenue, S.W., Washington, D.C. 20201, calling
          1-877-696-6775, or visiting{" "}
          <a
            href="https://www.hhs.gov/hipaa/filing-a-complaint/"
            target="_blank"
            rel="noopener noreferrer"
          >
            hhs.gov/hipaa/filing-a-complaint
          </a>
          . We will not retaliate against you for filing a complaint.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>Your choices</h2>
        <p>
          For certain health information, you can tell us your choices about
          what we share. If you have a clear preference for how we share your
          information in the situations described below, talk to us. Tell us
          what you want us to do, and we will follow your instructions.
        </p>

        <h3>You have both the right and choice to tell us to:</h3>
        <ul>
          <li>Share information with your family, close friends, or others involved in your care</li>
          <li>Share information in a disaster relief situation</li>
          <li>Include your information in a hospital or facility directory (not applicable to most Halo care, which is delivered remotely)</li>
        </ul>
        <p>
          If you are not able to tell us your preference (for example, if you
          are unconscious), we may go ahead and share your information if we
          believe it is in your best interest. We may also share your
          information when needed to lessen a serious and imminent threat to
          health or safety.
        </p>

        <h3>In these cases we never share your information unless you give us written permission:</h3>
        <ul>
          <li>Marketing purposes</li>
          <li>Sale of your information</li>
          <li>Most sharing of psychotherapy notes</li>
        </ul>

        <h3>In the case of fundraising:</h3>
        <p>
          We may contact you for fundraising efforts, but you can tell us not
          to contact you again.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>Our uses and disclosures</h2>
        <p>
          We typically use or share your health information in the following
          ways.
        </p>

        <h3>Treat you</h3>
        <p>
          We can use your health information and share it with other
          professionals who are treating you. For example, your Halo
          physician may share your medical history with the compounding
          pharmacy that prepares your prescription, or with a specialist
          consultant if your protocol benefits from coordinated care.
        </p>

        <h3>Run our organization</h3>
        <p>
          We can use and share your health information to run our practice,
          improve your care, and contact you when necessary. For example, we
          use your health information to manage your treatment and services,
          to evaluate the quality of care you receive, and to perform care
          coordination across the Halo Provider Network.
        </p>

        <h3>Bill for your services</h3>
        <p>
          We can use and share your health information to bill and get
          payment from you, your health plan, or any third-party payer
          authorized to receive payment on your behalf. For example, we give
          information about you to your health plan so it will pay for your
          services.
        </p>

        <h3>Help with public health and safety issues</h3>
        <p>
          We can share health information about you for certain situations
          such as preventing disease, helping with product recalls, reporting
          adverse reactions to medications, reporting suspected abuse or
          neglect, or preventing or reducing a serious threat to anyone&rsquo;s
          health or safety.
        </p>

        <h3>Do research</h3>
        <p>
          We can use or share your information for de-identified health
          research. Identifiable research uses require your written
          authorization unless permitted by law.
        </p>

        <h3>Comply with the law</h3>
        <p>
          We will share information about you if state or federal laws
          require it, including with the Department of Health and Human
          Services if it wants to see that we&rsquo;re complying with federal
          privacy law.
        </p>

        <h3>Respond to organ and tissue donation requests</h3>
        <p>
          We can share health information about you with organ procurement
          organizations.
        </p>

        <h3>Work with a medical examiner or funeral director</h3>
        <p>
          We can share health information with a coroner, medical examiner,
          or funeral director when an individual dies.
        </p>

        <h3>Address workers&rsquo; compensation, law enforcement, and other government requests</h3>
        <ul>
          <li>For workers&rsquo; compensation claims</li>
          <li>For law enforcement purposes or with a law enforcement official</li>
          <li>With health oversight agencies for activities authorized by law</li>
          <li>For special government functions such as military, national security, and presidential protective services</li>
        </ul>

        <h3>Respond to lawsuits and legal actions</h3>
        <p>
          We can share health information about you in response to a court
          or administrative order, or in response to a subpoena.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>Our responsibilities</h2>
        <ul>
          <li>We are required by law to maintain the privacy and security of your protected health information.</li>
          <li>
            We will let you know promptly if a breach occurs that may have
            compromised the privacy or security of your information.
          </li>
          <li>We must follow the duties and privacy practices described in this notice and give you a copy of it.</li>
          <li>
            We will not use or share your information other than as described
            here unless you tell us we can in writing. If you tell us we can,
            you may change your mind at any time. Let us know in writing if
            you change your mind.
          </li>
        </ul>
        <p>
          For more information see:{" "}
          <a
            href="https://www.hhs.gov/hipaa/for-individuals/notice-privacy-practices/index.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            hhs.gov/hipaa/for-individuals/notice-privacy-practices
          </a>
          .
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>Changes to the terms of this notice</h2>
        <p>
          We can change the terms of this notice, and the changes will apply
          to all information we have about you. The new notice will be
          available upon request, on our website at tryhalo.co, and we will
          mail or email a copy to you on request.
        </p>
      </section>

      {/* ────────────────────────────────────────────── */}
      <section>
        <h2>Contact us</h2>
        <p>
          To exercise any of the rights described in this notice, to ask
          questions, or to file a complaint, contact our Privacy Officer:
        </p>
        <div className="legal-callout">
          <strong>Halo Privacy Officer</strong>
          <br />
          Halo Health Inc.
          <br />
          Email:{" "}
          <a href="mailto:privacy@tryhalo.co">privacy@tryhalo.co</a>
          <br />
          For complaints relating to clinical care, you may also contact the
          OpenLoop ACE Privacy Officer at{" "}
          <a href="mailto:privacy@openloophealth.com">
            privacy@openloophealth.com
          </a>{" "}
          or by calling (844) 819-7956.
        </div>
        <p className="text-sm" style={{ fontSize: "13px", color: "rgba(28,30,32,0.55)" }}>
          A paper copy of this notice is available on request. This notice
          applies to the privacy practices of Halo Health Inc. and the Halo
          Provider Network ACE designated above.
        </p>
      </section>
    </LegalDocument>
  );
}
