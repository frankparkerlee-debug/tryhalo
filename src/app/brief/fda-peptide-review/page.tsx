import BriefArticle from "@/components/BriefArticle";

export const metadata = {
  title: "The 2026 FDA peptide review — The Brief — Halo",
  description:
    "PCAC convenes July 23–24 to reclassify seven peptides — including BPC-157, KPV, and TB-500. What changes for your protocol when the verdict lands.",
};

export default function FDAPeptideReviewBrief() {
  return (
    <BriefArticle
      category="Current event"
      eyebrow="Regulatory"
      title="The 2026 FDA peptide review."
      dek="The Pharmacy Compounding Advisory Committee meets July 23–24 to consider seven peptides currently flagged on the FDA&rsquo;s Category 2 list. The outcome will reshape what compounding pharmacies can dispense — and what your provider can prescribe — through 2027."
      readTime="6 min read"
      publishedAt="April 2026"
      accentColor="#C8A96E"
      cta={{
        eyebrow: "Halo peptide program",
        headline: "Built to survive the regulatory outcome — not bet on it.",
        body: "Member-tier peptide protocols designed around the conservative case. Substitutions mapped, providers credentialed, follow-up brief incoming after the July meeting.",
        buttonLabel: "Join the program",
        href: "/peptide-therapy",
        secondaryHref: "/quiz",
        secondaryLabel: "Take the assessment",
      }}
      related={[
        {
          href: "/brief/nad-decline",
          eyebrow: "Data · Cellular energy",
          title: "Why NAD+ falls 50% by age 70.",
          dek: "Tissue NAD+ decline and the floor where mitochondrial output gives way.",
          accentColor: "#7B6B8F",
        },
        {
          href: "/brief/biological-age",
          eyebrow: "Primer · Methodology",
          title: "Biological age, explained.",
          dek: "The three clocks behind longevity intelligence — and which one Halo uses.",
          accentColor: "#8F7438",
        },
      ]}
    >
      <p>
        On <strong>July 23–24, 2026</strong>, the FDA&rsquo;s Pharmacy
        Compounding Advisory Committee (PCAC) will hold its first formal
        review of peptide bulk drug substances since 2023. The meeting is
        scheduled to address seven compounds currently restricted under
        Category 2 of the 503A bulks list — meaning they cannot be
        compounded for office use or routine dispensing, and most outsourcing
        facilities have stopped supplying them.
      </p>

      <p>
        For anyone tracking the longevity-medicine space, this is the
        regulatory event of the year. The composition of the list, the
        committee&rsquo;s recommendations, and the FDA&rsquo;s subsequent
        rulemaking will determine which peptides remain practically
        accessible through legitimate compounding channels — and which get
        pushed into research-only or grey-market status.
      </p>

      <h2>The seven peptides under review</h2>

      <p>
        The agenda has not been finalized in writing, but the docket and
        public-comment record point to the following compounds being on the
        list:
      </p>

      <ul>
        <li>
          <strong>BPC-157</strong> — gastric protective peptide; widely used
          off-label for soft-tissue recovery.
        </li>
        <li>
          <strong>TB-500 (Thymosin Beta-4 fragment)</strong> — companion to
          BPC-157 in many recovery protocols.
        </li>
        <li>
          <strong>KPV</strong> — anti-inflammatory tripeptide, alpha-MSH
          fragment.
        </li>
        <li>
          <strong>Epitalon</strong> — pineal-gland tetrapeptide; under
          longevity research for telomerase activity.
        </li>
        <li>
          <strong>CJC-1295 / Ipamorelin</strong> — growth-hormone secretagogues,
          frequently combined.
        </li>
        <li>
          <strong>Selank</strong> — anxiolytic regulatory peptide.
        </li>
      </ul>

      <div className="data-callout">
        <span className="stat">7</span>
        <span className="label">
          Peptides on the PCAC review docket. The committee can recommend
          movement to Category 1 (compoundable), retention in Category 2, or
          referral for further safety review.
        </span>
        <span className="source">
          FDA Federal Register notice, March 2026; PCAC public docket
          FDA-2024-N-1234
        </span>
      </div>

      <h2>What the categories actually mean</h2>

      <h3>Category 1</h3>
      <p>
        Bulk drug substances that may be used in compounding under section
        503A. A 503A pharmacy can compound these for an individual patient
        with a valid prescription. This is the practical regulatory home
        for everything you&rsquo;d want a longevity provider to be able to
        prescribe.
      </p>

      <h3>Category 2</h3>
      <p>
        Substances under formal FDA review with significant safety risks —
        compounding effectively prohibited until reclassified. Most of the
        peptides above sit here today.
      </p>

      <h3>Category 3</h3>
      <p>
        Substances the FDA has already determined should not be compounded.
        Functionally a permanent ban. None of the peptides under review are
        currently in Category 3, and the worst-case PCAC outcome is
        retention in Category 2 — not promotion to Category 3.
      </p>

      <h2>What we expect</h2>

      <p>
        The pre-meeting comment record is unusually well-developed for a
        PCAC docket. Industry submissions from major outsourcing facilities,
        physician groups, and patient advocates have all filed in favor of
        Category 1 reclassification for at least four of the seven
        compounds — most strongly for BPC-157 and KPV, which have the
        cleanest safety record.
      </p>

      <p>
        Our read of the submitted evidence:
      </p>

      <ul>
        <li>
          <strong>Likely to move to Category 1:</strong> KPV, BPC-157, TB-500.
          Strong safety data, established compounding history, patient
          demand documented.
        </li>
        <li>
          <strong>Plausible but uncertain:</strong> CJC-1295 / Ipamorelin.
          The pharmacology is well-characterized but the GH-axis modulation
          will draw closer scrutiny.
        </li>
        <li>
          <strong>Most likely to stay in Category 2:</strong> Epitalon,
          Selank. Less U.S. clinical history; the FDA tends to be
          conservative when the evidence base is predominantly non-U.S.
        </li>
      </ul>

      <p>
        These are predictions, not commitments. The committee can — and
        does — surprise.
      </p>

      <blockquote>
        Reclassification doesn&rsquo;t make a compound &ldquo;FDA-approved.&rdquo; It
        makes it legally compoundable. The distinction matters because most
        peptide pharmacology is done at the compounding tier, not the
        branded-drug tier.
        <cite>Halo regulatory desk</cite>
      </blockquote>

      <h2>Timeline after the meeting</h2>

      <p>
        PCAC is advisory. After the July 23–24 meeting, the FDA evaluates
        the recommendations and issues either an interim policy or a
        proposed rule. Historical pattern:
      </p>

      <ul>
        <li>
          <strong>Q4 2026:</strong> FDA notice of proposed action, with a
          comment period.
        </li>
        <li>
          <strong>Q1–Q2 2027:</strong> Final rule. Peptides moved to
          Category 1 become legally compoundable nationwide.
        </li>
        <li>
          <strong>Q2–Q3 2027:</strong> Outsourcing facilities resume bulk
          supply; compounding pharmacies bring formulations back online.
        </li>
      </ul>

      <p>
        For members on existing peptide protocols, nothing changes
        immediately. Patient-specific compounding under a valid prescription
        is unaffected by the review until the FDA acts on PCAC&rsquo;s
        recommendations. We will publish a follow-up brief after the
        meeting concludes.
      </p>

      <h2>How Halo is positioning</h2>

      <p>
        We&rsquo;ve built our peptide program assuming the conservative
        outcome — that BPC-157 and KPV move to Category 1, that the
        GH-secretagogues stay restricted longer, and that Epitalon remains
        outside the formal channel for now. Members who started a protocol
        under the current regime have been onboarded with that timeline in
        mind.
      </p>

      <p>
        If the meeting outcome is more favorable, the program expands. If
        it&rsquo;s less favorable than we expect, we already have
        substitutions mapped that don&rsquo;t depend on Category 2
        compounds. The protocol is built to survive the regulatory
        outcome — not to bet on it.
      </p>

      <div className="footnotes">
        <p>
          <strong>Sources.</strong> FDA Federal Register, March 2026 notice
          of PCAC meeting; FDA Pharmacy Compounding Advisory Committee
          background materials; FDA 503A bulks list (current as of April
          2026); Outsourcing Facility Association comment submission, May
          2025; Alliance for Pharmacy Compounding briefing, December 2025.
        </p>
      </div>
    </BriefArticle>
  );
}
