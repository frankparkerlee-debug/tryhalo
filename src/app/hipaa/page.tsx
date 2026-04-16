export const metadata = {
  title: "HIPAA Notice of Privacy Practices — Halo Health",
  description: "Halo Health HIPAA Notice of Privacy Practices. How your health information is used and your rights as a patient.",
};

export default function HipaaPage() {
  return (
    <section className="py-20 px-6 section-light">
      <div className="max-w-3xl mx-auto pt-20">
        <p className="label-gold mb-4">Legal</p>
        <h1 className="headline-hero text-3xl md:text-4xl lg:text-5xl text-halo-charcoal mb-4">
          HIPAA Notice of Privacy Practices
        </h1>
        <p className="text-sm text-halo-charcoal/40 mb-12">
          Effective Date: April 1, 2026
        </p>

        <div className="space-y-8">
          <section>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed font-medium mb-3">
              THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED
              AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              1. Who We Are
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              This notice is provided by Halo Health Inc. and the independent licensed healthcare
              providers who deliver care through our telehealth platform. We are required by law to
              maintain the privacy of your Protected Health Information (PHI), provide you with this
              notice of our legal duties and privacy practices, and follow the terms of this notice
              currently in effect.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              2. How We Use and Disclose Your Health Information
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed mb-3">
              We may use and disclose your PHI for the following purposes without your written
              authorization:
            </p>
            <ul className="list-disc pl-5 space-y-3 text-sm text-halo-charcoal/70">
              <li>
                <strong>Treatment:</strong> To provide, coordinate, and manage your healthcare. This
                includes sharing information with your provider, pharmacies that compound and
                dispense your medications, and laboratories that process your bloodwork.
              </li>
              <li>
                <strong>Payment:</strong> To bill and collect payment for the services we provide.
                This includes verifying coverage, processing claims, and managing your account.
              </li>
              <li>
                <strong>Healthcare Operations:</strong> For quality assurance, credentialing,
                compliance audits, and operational activities necessary to run our platform.
              </li>
              <li>
                <strong>As Required by Law:</strong> When required by federal, state, or local law,
                including public health reporting, communicable disease prevention, and court orders.
              </li>
              <li>
                <strong>Health and Safety:</strong> To prevent or lessen a serious and imminent
                threat to your health or safety or the health or safety of the public.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              3. Uses and Disclosures Requiring Your Authorization
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              We will obtain your written authorization before using or disclosing your PHI for
              purposes not described in this notice, including marketing communications, sale of
              your PHI, and most uses of psychotherapy notes. You may revoke your authorization
              at any time in writing, except to the extent we have already taken action in reliance
              on it.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              4. Your Rights
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed mb-3">
              You have the following rights regarding your health information:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-halo-charcoal/70">
              <li>
                <strong>Right to Access:</strong> You may request copies of your health records.
                We will provide them within 30 days of your request.
              </li>
              <li>
                <strong>Right to Amend:</strong> You may request that we correct inaccurate or
                incomplete information in your health records.
              </li>
              <li>
                <strong>Right to an Accounting of Disclosures:</strong> You may request a list of
                certain disclosures we have made of your PHI.
              </li>
              <li>
                <strong>Right to Request Restrictions:</strong> You may request restrictions on
                certain uses and disclosures of your PHI, though we are not always required to
                agree.
              </li>
              <li>
                <strong>Right to Confidential Communications:</strong> You may request that we
                communicate with you by alternative means or at alternative locations.
              </li>
              <li>
                <strong>Right to a Paper Copy:</strong> You may request a paper copy of this notice
                at any time.
              </li>
              <li>
                <strong>Right to Be Notified of a Breach:</strong> You will be notified if a breach
                of your unsecured PHI occurs.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              5. Our Responsibilities
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-halo-charcoal/70">
              <li>We are required by law to maintain the privacy and security of your PHI.</li>
              <li>We will notify you promptly if a breach occurs that may have compromised your PHI.</li>
              <li>We will not use or share your information other than as described in this notice unless you give us written permission.</li>
              <li>We will not use your information for marketing purposes without your authorization.</li>
              <li>We will not sell your information without your authorization.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              6. Filing a Complaint
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed mb-3">
              If you believe your privacy rights have been violated, you may file a complaint with:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-halo-charcoal/70">
              <li>
                <strong>Halo Health Inc.</strong> &mdash; Contact our Privacy Officer at{" "}
                <a href="mailto:privacy@tryhalo.co" className="text-[#6B7B6E] hover:underline">
                  privacy@tryhalo.co
                </a>
              </li>
              <li>
                <strong>U.S. Department of Health and Human Services</strong> &mdash; Office for Civil
                Rights. You may file a complaint online at hhs.gov/ocr/complaints or by mail.
              </li>
            </ul>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed mt-3">
              You will not be penalized or retaliated against for filing a complaint.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              7. Changes to This Notice
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              We reserve the right to change this notice and to make the revised notice effective for
              PHI we already have as well as any information we receive in the future. The current
              notice will always be posted on our website at tryhalo.co/hipaa.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-halo-charcoal mb-3">
              8. Contact Information
            </h2>
            <p className="text-sm text-halo-charcoal/70 leading-relaxed">
              For questions about this notice or to exercise your rights, contact:
            </p>
            <p className="text-sm text-halo-charcoal/70 mt-2">
              Halo Health Inc.
              <br />
              Privacy Officer
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
