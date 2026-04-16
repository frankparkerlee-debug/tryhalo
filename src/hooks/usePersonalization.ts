"use client";

import { useState, useEffect } from "react";

export type PersonaType = "male" | "female" | "neutral";

interface QuizData {
  gender: string;
  age: string;
  goals: string[];
  primaryRec: string;
  secondaryRecs: string[];
  completedAt: string;
}

interface PersonalizationState {
  persona: PersonaType;
  hasCompletedQuiz: boolean;
  isFoundingMember: boolean;
  isReturnVisitor: boolean;
  primaryProgram: string | null;
  quizData: QuizData | null;
  utmCampaign: string | null;
}

const INITIAL_STATE: PersonalizationState = {
  persona: "neutral",
  hasCompletedQuiz: false,
  isFoundingMember: false,
  isReturnVisitor: false,
  primaryProgram: null,
  quizData: null,
  utmCampaign: null,
};

/**
 * Client-side personalization hook.
 *
 * PERFORMANCE: All localStorage + URL parsing work is deferred using
 * requestIdleCallback so it runs *after* the initial paint. The hook
 * returns the neutral state synchronously and upgrades once the browser
 * is idle — navigation feels instant, personalization appears seamlessly.
 */
export function usePersonalization(): PersonalizationState {
  const [state, setState] = useState<PersonalizationState>(INITIAL_STATE);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const compute = () => {
      let persona: PersonaType = "neutral";
      let hasCompletedQuiz = false;
      let isFoundingMember = false;
      let isReturnVisitor = false;
      let primaryProgram: string | null = null;
      let quizData: QuizData | null = null;
      let utmCampaign: string | null = null;

      try {
        // Batch all reads up front so we only hit localStorage once per key
        const rawQuiz = localStorage.getItem("halo_quiz");
        const rawUtm = localStorage.getItem("halo_utm");
        const rawSignup = localStorage.getItem("halo_signup_email");
        const rawVisited = localStorage.getItem("halo_visited");

        if (rawQuiz) {
          try {
            quizData = JSON.parse(rawQuiz);
            hasCompletedQuiz = true;
            if (quizData?.gender === "Man") persona = "male";
            else if (quizData?.gender === "Woman") persona = "female";
            primaryProgram = quizData?.primaryRec || null;
          } catch {}
        }

        // URL param UTM takes precedence over stored UTM
        const params = new URLSearchParams(window.location.search);
        const urlUtm = params.get("utm_campaign");
        utmCampaign = urlUtm || rawUtm;

        if (urlUtm) {
          // Persist for future visits (fire-and-forget)
          try {
            localStorage.setItem("halo_utm", urlUtm);
          } catch {}
        }

        if (!hasCompletedQuiz && utmCampaign) {
          const campaign = utmCampaign.toLowerCase();
          if (campaign.includes("trt") || campaign.includes("testosterone") || campaign.includes("men")) {
            persona = "male";
            primaryProgram = primaryProgram || "testosterone";
          } else if (campaign.includes("hrt") || campaign.includes("hormone") || campaign.includes("women")) {
            persona = "female";
            primaryProgram = primaryProgram || "hormoneTherapy";
          } else if (campaign.includes("peptide") || campaign.includes("recovery")) {
            primaryProgram = primaryProgram || "peptideTherapy";
          } else if (campaign.includes("nad") || campaign.includes("energy")) {
            primaryProgram = primaryProgram || "nadTherapy";
          } else if (campaign.includes("weight") || campaign.includes("glp")) {
            primaryProgram = primaryProgram || "weightLoss";
          }
        }

        isFoundingMember = !!rawSignup;
        isReturnVisitor = !!rawVisited;

        // Mark this visit (fire-and-forget — doesn't affect state)
        try {
          localStorage.setItem("halo_visited", new Date().toISOString());
        } catch {}
      } catch {
        // If localStorage is disabled (private mode, etc.), stay with neutral defaults
      }

      setState({
        persona,
        hasCompletedQuiz,
        isFoundingMember,
        isReturnVisitor,
        primaryProgram,
        quizData,
        utmCampaign,
      });
    };

    // Defer to idle time so the initial paint is never blocked.
    // This is the key fix: personalization no longer delays navigation.
    const rIC = (
      window as Window &
        typeof globalThis & {
          requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
          cancelIdleCallback?: (id: number) => void;
        }
    ).requestIdleCallback;

    if (rIC) {
      const id = rIC(compute, { timeout: 2000 });
      return () => {
        const cIC = (
          window as Window &
            typeof globalThis & { cancelIdleCallback?: (id: number) => void }
        ).cancelIdleCallback;
        if (cIC) cIC(id);
      };
    }

    // Safari fallback — use setTimeout to yield back to the browser
    const t = setTimeout(compute, 0);
    return () => clearTimeout(t);
  }, []);

  return state;
}
