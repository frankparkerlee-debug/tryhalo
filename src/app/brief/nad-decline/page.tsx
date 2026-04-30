import BriefArticle from "@/components/BriefArticle";

export const metadata = {
  title: "Why NAD+ falls 50% by age 70 — The Brief — Halo",
  description:
    "Tissue NAD+ decline from age 30 to 70, what drives it, and the floor below which mitochondrial output stops keeping up.",
};

export default function NADDeclineBrief() {
  return (
    <BriefArticle
      category="Data"
      eyebrow="Cellular energy"
      title="Why NAD+ falls 50% by age 70."
      dek="Nicotinamide adenine dinucleotide is the cofactor your mitochondria run on. Tissue concentrations halve between age 30 and 70 — and the consequences look a lot like the symptoms most people blame on aging itself."
      readTime="4 min read"
      publishedAt="April 2026"
      accentColor="#7B6B8F"
      related={[
        {
          href: "/brief/biological-age",
          eyebrow: "Primer · Methodology",
          title: "Biological age, explained.",
          dek: "Methylation, phenotypic, and pace-of-aging clocks — and which one Halo uses.",
          accentColor: "#8F7438",
        },
        {
          href: "/brief/fda-peptide-review",
          eyebrow: "Current event · Regulatory",
          title: "The 2026 FDA peptide review.",
          dek: "PCAC convenes July 23–24 to reclassify seven peptides.",
          accentColor: "#C8A96E",
        },
      ]}
    >
      <p>
        Every cell you have runs on the same metabolic currency:
        <strong> nicotinamide adenine dinucleotide</strong>, NAD<sup>+</sup>{" "}
        for short. It carries electrons through the mitochondrial chain that
        produces ATP. It activates the sirtuin enzymes that maintain DNA
        repair. It fuels PARP — the cleanup crew that fixes oxidative damage
        before it becomes mutation.
      </p>

      <p>
        At age 30, tissue NAD<sup>+</sup> sits at a working baseline. By age
        70, it&rsquo;s down roughly half. That decline isn&rsquo;t cosmetic.
        It&rsquo;s the metabolic scaffolding under most of what we call
        &ldquo;feeling older.&rdquo;
      </p>

      <div className="data-callout">
        <span className="stat">~50%</span>
        <span className="label">
          Decline in tissue NAD<sup>+</sup> from age 30 to age 70 — measured
          across skeletal muscle, liver, and skin biopsies.
        </span>
        <span className="source">
          Massudi et al., PLOS ONE, 2012; Gomes et al., Cell, 2013
        </span>
      </div>

      <h2>Why it falls</h2>

      <p>
        NAD<sup>+</sup> isn&rsquo;t a fixed reservoir. Cells build it from
        precursors (NR, NMN, niacin) and burn it through three primary
        consumers: sirtuins, PARPs, and CD38. As you age, two things happen
        in parallel.
      </p>

      <ul>
        <li>
          <strong>Synthesis slows.</strong> The salvage pathway that recycles
          NAD<sup>+</sup> from nicotinamide loses efficiency. Key enzymes
          (NAMPT, NMNAT) decline.
        </li>
        <li>
          <strong>Demand rises.</strong> CD38 — an NAD<sup>+</sup>-degrading
          enzyme expressed by immune and endothelial cells — climbs steadily
          with age. Chronic low-grade inflammation drains the pool faster
          than the salvage pathway can refill it.
        </li>
      </ul>

      <p>
        The net effect: a slow-motion energy deficit. Mitochondria still
        function, but with less headroom. Sirtuins still police the genome,
        but with less bandwidth. The body adapts by quietly down-regulating
        the things it can&rsquo;t afford to run at full power — recovery,
        repair, cognition under load.
      </p>

      <blockquote>
        NAD<sup>+</sup> doesn&rsquo;t cause aging. But aging cannot proceed
        without losing it.
        <cite>Eric Verdin, MD — Buck Institute on Aging</cite>
      </blockquote>

      <h2>What the decline looks like in a person</h2>

      <p>
        The phenotype is recognizable because it&rsquo;s how most people
        describe their forties and fifties:
      </p>

      <ul>
        <li>Energy that crashes by mid-afternoon and never fully returns.</li>
        <li>Workouts that take three days to recover from instead of one.</li>
        <li>Sleep that stays the same hours but stops feeling restorative.</li>
        <li>Cognitive load — context-switching, recall — that&rsquo;s harder than it used to be.</li>
        <li>A baseline that drifts downward over years, not weeks.</li>
      </ul>

      <p>
        None of those are diagnoses on their own. Together, they map onto a
        well-documented metabolic shift: less ATP per unit of mitochondrial
        substrate, fewer working mitochondria per cell, and more inflammatory
        pressure on the NAD<sup>+</sup> pool.
      </p>

      <h2>What restoration actually does</h2>

      <p>
        NAD<sup>+</sup> precursors — nicotinamide riboside (NR) and
        nicotinamide mononucleotide (NMN), or NAD<sup>+</sup> itself
        delivered IV or subcutaneously — bypass the bottlenecks in the
        salvage pathway. In published trials, supplementation raises blood
        and tissue NAD<sup>+</sup> within weeks. The downstream effects
        people notice tend to follow the same pattern in reverse:
      </p>

      <ul>
        <li>Sustained afternoon energy without stimulant escalation.</li>
        <li>Recovery windows that compress back toward 24–36 hours.</li>
        <li>Sleep architecture that consolidates — fewer micro-arousals.</li>
        <li>A gradual lift in working-memory load capacity.</li>
      </ul>

      <p>
        These aren&rsquo;t universal and the magnitude varies. The mechanism
        is what&rsquo;s consistent: restore the cofactor and the systems that
        depend on it have more headroom to do their jobs.
      </p>

      <div className="data-callout">
        <span className="stat">2–4 wks</span>
        <span className="label">
          Time to peak tissue NAD<sup>+</sup> with consistent precursor
          supplementation. The energy-and-recovery phenotype tends to follow
          a few weeks behind the biochemistry.
        </span>
        <span className="source">
          Martens et al., Nature Communications, 2018; Yoshino et al., Cell
          Metabolism, 2021
        </span>
      </div>

      <h2>Where Halo fits</h2>

      <p>
        Halo&rsquo;s NAD+ program is built around the failure mode this
        brief describes. We measure NAD<sup>+</sup> indirectly — through the
        downstream markers that move when the cofactor is restored — and we
        adjust the protocol when they don&rsquo;t. Most members start with
        injectable NAD<sup>+</sup> for the first eight weeks, then transition
        to oral NMN once the pool is repaired.
      </p>

      <p>
        The decline isn&rsquo;t inevitable in the way wrinkles are. It&rsquo;s
        a downstream consequence of a single cofactor running low. That
        makes it one of the more tractable problems in longevity medicine —
        and one of the few where the intervention timeline is measured in
        weeks rather than years.
      </p>

      <div className="footnotes">
        <p>
          <strong>Sources.</strong> Massudi H et al. <em>PLOS ONE</em> 2012;
          Gomes AP et al. <em>Cell</em> 2013; Martens CR et al.{" "}
          <em>Nature Communications</em> 2018; Yoshino M et al.{" "}
          <em>Cell Metabolism</em> 2021; Camacho-Pereira J et al.{" "}
          <em>Cell Metabolism</em> 2016 (CD38 and age-related NAD decline);
          Verdin E. <em>Science</em> 2015 (NAD+ in mitochondrial homeostasis).
        </p>
      </div>
    </BriefArticle>
  );
}
