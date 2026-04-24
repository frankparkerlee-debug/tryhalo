import type { Metadata } from "next";
import {
  cheapestMonthlyFounding,
  formatMonthlyRounded,
  getProgram,
} from "@/lib/programs";

const TITLE = "Testosterone Therapy (TRT)";
const TRT_FROM = formatMonthlyRounded(
  cheapestMonthlyFounding(getProgram("trt")!).price
);
const DESCRIPTION =
  `Physician-led testosterone replacement therapy for men 35\u201365. Full hormone panel, personalized protocol, medication delivered in 14 days. Injection, cream, or pill formats. Board-certified physicians and US-licensed 503A pharmacy. From ${TRT_FROM}/mo for founding members.`;
const URL = "https://tryhalo.co/testosterone-therapy";
const OG_IMAGE = "/trt/hero-portrait.png";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "testosterone replacement therapy",
    "TRT online",
    "low testosterone treatment",
    "men's hormone therapy",
    "testosterone cypionate",
    "online TRT clinic",
    "TRT telehealth",
    "testosterone injection online",
    "testosterone cream",
    "hypogonadism treatment",
    "physician-led TRT",
    "men's health optimization",
    "lab-driven TRT",
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
        width: 1024,
        height: 1280,
        alt: "Halo Testosterone Therapy \u2014 physician-led TRT for men",
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

export default function TestosteroneTherapyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
