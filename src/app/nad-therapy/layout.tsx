import type { Metadata } from "next";

const TITLE = "NAD+ Therapy";
const DESCRIPTION =
  "Physician-prescribed NAD+ injection therapy delivered monthly. Full metabolic panel, lab-monitored protocol, paired glutathione, cancel anytime. Starts at $179/mo \u2014 a fraction of IV clinic pricing. Board-certified physicians and US-licensed 503A pharmacy.";
const URL = "https://tryhalo.co/nad-therapy";
const OG_IMAGE = "/nad/og-nad-therapy.jpg";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "NAD+ therapy",
    "NAD+ injection",
    "NAD+ online",
    "at-home NAD+",
    "NAD injection telehealth",
    "longevity therapy",
    "cellular energy",
    "mitochondrial health",
    "anti-aging injection",
    "physician-led NAD+",
    "503A NAD+",
    "NAD+ vs IV",
    "compounded NAD+",
    "Sermorelin NAD",
    "NAD+ prescription",
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
        alt: "Halo NAD+ Therapy \u2014 physician-led, lab-driven, at home",
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

export default function NadTherapyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
