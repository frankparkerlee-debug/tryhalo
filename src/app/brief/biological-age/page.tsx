import BriefArticle from "@/components/BriefArticle";

export const metadata = {
  title: "Biological age, explained — The Brief — Halo",
  description:
    "The methylation, phenotypic, and pace-of-aging clocks behind longevity intelligence — and which one Halo uses to project where you actually stand.",
};

export default function BiologicalAgeBrief() {
  return (
    <BriefArticle
      category="Primer"
      eyebrow="Methodology"
      title="Biological age, explained."
      dek="Three different clocks, three different questions. A 90-second primer on how biological age is actually measured — and why the version Halo uses is the one we&rsquo;d trust to make a treatment decision."
      readTime="90 second read"
      publishedAt="April 2026"
      accentColor="#8F7438"
      related={[
        {
          href: "/brief/nad-decline",
          eyebrow: "Data · Cellular energy",
          title: "Why NAD+ falls 50% by age 70.",
          dek: "Tissue NAD+ decline and the floor where mitochondrial output gives way.",
          accentColor: "#7B6B8F",
        },
        {
          href: "/brief/fda-peptide-review",
          eyebrow: "Current event · Regulatory",
          title: "The 2026 FDA peptide review.",
          dek: "Seven peptides up for reclassification at the July PCAC meeting.",
          accentColor: "#C8A96E",
        },
      ]}
    >
      <p>
        &ldquo;Biological age&rdquo; is shorthand for a real question:
        compared to a population-level reference, how worn is your body? Three
        established methods answer that question — and they&rsquo;re not
        interchangeable.
      </p>

      <h2>The three clocks</h2>

      <h3>1. Methylation clocks (epigenetic age)</h3>
      <p>
        The most studied class. They measure DNA methylation at a few hundred
        CpG sites — chemical tags that change predictably with age — and
        regress them against chronological age. The original Horvath clock
        (2013) and the more recent <strong>GrimAge</strong> and{" "}
        <strong>PhenoAge</strong> are this family.
      </p>
      <p>
        <strong>What it&rsquo;s good for:</strong> long-horizon mortality
        and disease-risk prediction. GrimAge in particular outperforms
        chronological age at predicting all-cause mortality.
      </p>
      <p>
        <strong>The catch:</strong> methylation drifts slowly. A clock built
        on lifetime drift moves slowly back. You won&rsquo;t see a 90-day
        readout shift much, even if the underlying biology has improved
        dramatically.
      </p>

      <h3>2. Phenotypic age</h3>
      <p>
        Built from a panel of nine clinical biomarkers — albumin, creatinine,
        glucose, CRP, lymphocyte percent, mean corpuscular volume, red cell
        distribution width, alkaline phosphatase, and white blood cell count —
        plus chronological age. <strong>Levine&rsquo;s PhenoAge</strong>{" "}
        (2018) is the canonical implementation.
      </p>
      <p>
        <strong>What it&rsquo;s good for:</strong> capturing the systems that
        actually move on a treatment timeline. Inflammation drops, glucose
        normalizes, kidney markers improve — phenotypic age tracks all of it
        within months.
      </p>
      <p>
        <strong>The catch:</strong> it&rsquo;s only as good as your most
        recent labs. It&rsquo;s a snapshot, not a trajectory.
      </p>

      <h3>3. Pace of aging (DunedinPACE)</h3>
      <p>
        A second-generation methylation clock that measures the{" "}
        <em>rate</em> of biological aging — not where you are, but how fast
        you&rsquo;re moving. A pace of 1.0 is average. 0.85 means you&rsquo;re
        aging 15% slower than the population. 1.2 means 20% faster.
      </p>
      <p>
        <strong>What it&rsquo;s good for:</strong> evaluating whether an
        intervention is changing the trajectory, even when the absolute
        biological age hasn&rsquo;t had time to catch up.
      </p>
      <p>
        <strong>The catch:</strong> needs a methylation array, and it&rsquo;s
        less established than the older Horvath/GrimAge family.
      </p>

      <div className="data-callout">
        <span className="stat">3</span>
        <span className="label">
          Clocks, three questions: <em>How worn am I?</em> (methylation) /{" "}
          <em>What state are my systems in right now?</em> (phenotypic) /{" "}
          <em>How fast am I moving?</em> (pace).
        </span>
        <span className="source">
          Horvath 2013; Levine et al., Aging 2018; Belsky et al., eLife 2022
        </span>
      </div>

      <h2>Why Halo uses phenotypic age as the primary readout</h2>

      <p>
        Phenotypic age has three properties methylation doesn&rsquo;t:
      </p>

      <ul>
        <li>
          <strong>It moves on a treatment timeline.</strong> The biomarkers
          PhenoAge tracks shift within the first 3–6 months of a real
          protocol. That&rsquo;s the window where members need feedback.
        </li>
        <li>
          <strong>It runs on standard labs.</strong> No specialty array, no
          $300 swab — the panel is part of the comprehensive workup
          everyone gets at intake.
        </li>
        <li>
          <strong>It&rsquo;s explainable.</strong> If your phenotypic age
          drops, we can show you which biomarkers moved. Methylation clocks,
          even when accurate, are largely a black box.
        </li>
      </ul>

      <p>
        For members who want the deeper signal, we layer DunedinPACE on top
        — quarterly methylation reads to confirm the trajectory the
        biomarkers suggest. But the primary readout, the number on your
        dashboard, is phenotypic.
      </p>

      <blockquote>
        The right clock is the one that responds to what you&rsquo;re
        actually doing. Otherwise you&rsquo;re measuring inertia.
        <cite>Halo editorial team</cite>
      </blockquote>

      <h2>What &ldquo;cellular age&rdquo; means in our framework</h2>

      <p>
        Halo separates three concepts deliberately:
      </p>

      <ul>
        <li>
          <strong>Chronological age</strong> — your DOB. Doesn&rsquo;t move.
        </li>
        <li>
          <strong>Biological age</strong> — the system-level snapshot.
          Phenotypic age, with DunedinPACE as a secondary read.
        </li>
        <li>
          <strong>Cellular age</strong> — the deeper layer: NAD<sup>+</sup>{" "}
          status, mitochondrial markers, inflammatory tone. The substrate
          that biological age is built on.
        </li>
      </ul>

      <p>
        The configurator on the homepage projects all three. You enter your
        chronological age and a few inputs about your starting state, and
        the model returns where biological and cellular age likely sit
        today — with confidence intervals, because point estimates of
        anything in this space are dishonest.
      </p>

      <h2>The honest limitation</h2>

      <p>
        No biological-age estimate is exact. The best published clocks have
        median absolute errors around 2–4 years against chronological age in
        validation cohorts, and the variance grows in subgroups
        underrepresented in training data. We treat the number as a moving
        signal, not a verdict — and we report the change over time more
        prominently than the absolute value, because the change is the
        thing that&rsquo;s actually meaningful.
      </p>

      <div className="footnotes">
        <p>
          <strong>Sources.</strong> Horvath S. <em>Genome Biology</em> 2013
          (epigenetic clock); Levine ME et al. <em>Aging</em> 2018
          (PhenoAge); Lu AT et al. <em>Aging</em> 2019 (GrimAge); Belsky DW
          et al. <em>eLife</em> 2022 (DunedinPACE); Bell CG et al.{" "}
          <em>Genome Biology</em> 2019 (epigenetic clock validation review).
        </p>
      </div>
    </BriefArticle>
  );
}
