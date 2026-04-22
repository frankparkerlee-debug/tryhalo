import type { Metadata } from "next";
import EngagementTool from "@/components/quiz/EngagementTool";

/**
 * /estimators — QA surface for the 5 engagement tools.
 *
 * Unlinked from nav (robots: noindex, nofollow) — its only purpose is to
 * render each tool standalone so we can validate question cadence, scoring,
 * capture flow, and reveal UX before dropping the component into each
 * product page. Once the tools are wired into the product pages directly,
 * this page can be deleted.
 */

export const metadata: Metadata = {
  title: "Halo — Estimators",
  robots: { index: false, follow: false },
};

const TOOLS = [
  {
    slug: "cellular_age",
    productPath: "/nad-therapy",
  },
  {
    slug: "weight_loss_projection",
    productPath: "/weight-loss",
  },
  {
    slug: "trt_drag",
    productPath: "/testosterone-therapy",
  },
  {
    slug: "hrt_severity",
    productPath: "/hormone-therapy",
  },
  {
    slug: "peptides_recovery",
    productPath: "/peptide-therapy",
  },
] as const;

export default function EstimatorsPage() {
  return (
    <main className="bg-[#F8F7F4] min-h-screen py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <header className="mb-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#6B7B6E] mb-3">
            Internal QA
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-[-0.03em] text-[#1C1C1E] mb-3">
            Engagement estimators
          </h1>
          <p className="text-sm text-[#86868B] leading-relaxed max-w-lg mx-auto">
            Five short self-assessment tools, one per product page. Each
            routes to <code className="text-[#1C1C1E]">/stack</code> with
            primary-program attribution on completion.
          </p>
        </header>

        <div className="flex flex-col gap-14">
          {TOOLS.map((t) => (
            <section key={t.slug}>
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#86868B] mb-3">
                Lives on{" "}
                <a
                  href={t.productPath}
                  className="text-[#1C1C1E] underline"
                >
                  {t.productPath}
                </a>
              </p>
              <EngagementTool slug={t.slug} variant="light" />
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
