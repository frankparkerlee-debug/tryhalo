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

/**
 * Client-side personalization hook.
 *
 * Data sources (priority order):
 * 1. Quiz answers saved in localStorage (`halo_quiz`)
 * 2. UTM params from ad campaigns (`?utm_campaign=trt-men`)
 * 3. Founding Circle signup (`halo_signup_email`)
 * 4. Return visitor detection (`halo_visited`)
 *
 * Determines persona (male/female/neutral) and which program to feature.
 */
export function usePersonalization(): PersonalizationState {
  const [state, setState] = useState<PersonalizationState>({
    persona: "neutral",
    hasCompletedQuiz: false,
    isFoundingMember: false,
    isReturnVisitor: false,
    primaryProgram: null,
    quizData: null,
    utmCampaign: null,
  });

  useEffect(() => {
    let persona: PersonaType = "neutral";
    let hasCompletedQuiz = false;
    let isFoundingMember = false;
    let isReturnVisitor = false;
    let primaryProgram: string | null = null;
    let quizData: QuizData | null = null;
    let utmCampaign: string | null = null;

    // 1. Check quiz data (highest priority — they told us directly)
    try {
      const raw = localStorage.getItem("halo_quiz");
      if (raw) {
        quizData = JSON.parse(raw);
        hasCompletedQuiz = true;

        if (quizData?.gender === "Man") persona = "male";
        else if (quizData?.gender === "Woman") persona = "female";

        primaryProgram = quizData?.primaryRec || null;
      }
    } catch {}

    // 2. Check UTM params (second priority — they came from a targeted ad)
    try {
      const params = new URLSearchParams(window.location.search);
      utmCampaign = params.get("utm_campaign");

      // If no quiz data, infer persona from UTM
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

      // Save UTM to localStorage for subsequent visits
      if (utmCampaign) {
        localStorage.setItem("halo_utm", utmCampaign);
      } else {
        // Check if they had a UTM on a previous visit
        utmCampaign = localStorage.getItem("halo_utm");
      }
    } catch {}

    // 3. Check founding member status
    try {
      isFoundingMember = !!localStorage.getItem("halo_signup_email");
    } catch {}

    // 4. Check return visitor
    try {
      isReturnVisitor = !!localStorage.getItem("halo_visited");
      // Mark this visit
      localStorage.setItem("halo_visited", new Date().toISOString());
    } catch {}

    setState({
      persona,
      hasCompletedQuiz,
      isFoundingMember,
      isReturnVisitor,
      primaryProgram,
      quizData,
      utmCampaign,
    });
  }, []);

  return state;
}
