import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IntakeQuizBySlug from "@/components/quiz/IntakeQuizBySlug";
import { INTAKE_QUIZ_SLUGS } from "@/lib/intake-quizzes";

/**
 * Dynamic per-program intake quiz route.
 *
 * Paths:
 *   /quiz/trt, /quiz/hrt, /quiz/nad, /quiz/peptides, /quiz/weight_loss
 *
 * Each landing/product page CTA routes here with a slug. The config catalog
 * in intake-quizzes.ts owns the questions, scoring, and copy. This page is
 * a thin shell that validates the slug server-side (so unknown slugs 404
 * cleanly) and hands it off to the client wrapper — the wrapper looks up
 * the config. IntakeConfig carries functions (computeTier, computeDerived)
 * that can't cross the server→client prop boundary, hence the split.
 *
 * `generateStaticParams` pre-renders the known slugs at build time; static
 * HTML ships, client hydrates into the renderer.
 */

const SLUG_SET: ReadonlySet<string> = new Set(INTAKE_QUIZ_SLUGS);

export function generateStaticParams() {
  return INTAKE_QUIZ_SLUGS.map((slug) => ({ slug }));
}

const QUIZ_META: Record<
  (typeof INTAKE_QUIZ_SLUGS)[number],
  { title: string; description: string }
> = {
  trt: {
    title: "Testosterone assessment",
    description:
      "A short clinical intake for Halo Testosterone. Takes about two minutes — a Halo physician reviews every submission before any protocol is issued.",
  },
  hrt: {
    title: "Hormone assessment",
    description:
      "A short clinical intake for Halo Hormone Therapy. Takes about two minutes — a Halo physician reviews every submission before any protocol is issued.",
  },
  nad: {
    title: "Cellular health assessment",
    description:
      "A short clinical intake for Halo NAD+ therapy. Takes about two minutes — a Halo physician reviews every submission before any protocol is issued.",
  },
  peptides: {
    title: "Peptide assessment",
    description:
      "A short clinical intake for Halo peptide therapy. Takes about two minutes — a Halo physician reviews every submission before any protocol is issued.",
  },
  weight_loss: {
    title: "Weight loss assessment",
    description:
      "A short clinical intake for Halo weight loss (GLP-1). Takes about two minutes — a Halo physician reviews every submission before any protocol is issued.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = QUIZ_META[slug as (typeof INTAKE_QUIZ_SLUGS)[number]];
  if (!meta) {
    return { title: "Assessment", robots: { index: false, follow: true } };
  }
  return {
    title: `${meta.title} — Halo`,
    description: meta.description,
    alternates: { canonical: `https://tryhalo.co/quiz/${slug}` },
    robots: { index: false, follow: true },
    openGraph: {
      title: `${meta.title} — Halo`,
      description: meta.description,
      url: `https://tryhalo.co/quiz/${slug}`,
      type: "website",
    },
  };
}

export default async function QuizSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!SLUG_SET.has(slug)) notFound();
  return <IntakeQuizBySlug slug={slug} />;
}
