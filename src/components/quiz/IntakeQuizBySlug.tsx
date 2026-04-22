"use client";

/**
 * Thin client wrapper that resolves an IntakeConfig by slug. Exists because
 * IntakeConfig carries functions (computeTier, computeDerived) which cannot
 * be serialized across the server→client props boundary. The server page
 * hands us the slug string; we look up the config on the client.
 */

import { notFound } from "next/navigation";
import IntakeQuiz from "@/components/quiz/IntakeQuiz";
import { getIntakeConfig } from "@/lib/intake-quizzes";

export default function IntakeQuizBySlug({ slug }: { slug: string }) {
  const config = getIntakeConfig(slug);
  if (!config) {
    notFound();
  }
  return <IntakeQuiz config={config} />;
}
