import type { Metadata } from "next";
import {
  cheapestMonthlyFounding,
  formatMonthlyRounded,
  getProgram,
} from "@/lib/programs";

const TITLE = "GLP-1 Weight Loss";
const GLP_FROM = formatMonthlyRounded(
  cheapestMonthlyFounding(getProgram("weight_loss")!).price
);
const DESCRIPTION =
  `Physician-led GLP-1 weight loss for men and women. Compounded semaglutide, plus branded Ozempic® and Zepbound® as indicated. Full metabolic panel, physician-designed titration, ongoing monitoring. Board-certified physicians and US-licensed 503A pharmacy. Founding pricing from ${GLP_FROM}/mo for compounded.`;
const URL = "https://tryhalo.co/weight-loss";
const OG_IMAGE = "/glp/og-weight-loss.jpg";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "GLP-1 weight loss",
    "compounded semaglutide",
    "weight loss online",
    "telehealth weight loss",
    "Zepbound online",
    "Ozempic weight loss",
    "Ozempic online",
    "metabolic health",
    "physician-led weight loss",
    "prescription weight loss",
    "503A compounded GLP-1",
    "weight loss injection",
    "weight management program",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: `${TITLE} \u2014 Halo`,
    description: DESCRIPTION,
    url: URL,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Halo GLP-1 Weight Loss \u2014 physician-led, lab-driven",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} \u2014 Halo`,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function WeightLossLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
