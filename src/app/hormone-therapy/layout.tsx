import type { Metadata } from "next";
import {
  cheapestMonthlyFounding,
  formatMonthlyRounded,
  getProgram,
} from "@/lib/programs";

const TITLE = "Hormone Therapy (HRT)";
const HRT_FROM = formatMonthlyRounded(
  cheapestMonthlyFounding(getProgram("hrt")!).price
);
const DESCRIPTION =
  `Physician-led hormone replacement therapy for women in perimenopause and menopause. Estradiol and progesterone \u2014 bioidentical and compounded to your labs. Low-dose testosterone for women available separately. Board-certified physicians and US-licensed 503A pharmacy. From ${HRT_FROM}/mo for founding members.`;
const URL = "https://tryhalo.co/hormone-therapy";
const OG_IMAGE = "/hrt/hero-portrait.png";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "hormone replacement therapy",
    "HRT",
    "menopause treatment",
    "perimenopause treatment",
    "bioidentical hormones",
    "estradiol",
    "progesterone",
    "women's hormone therapy",
    "online HRT",
    "HRT telehealth",
    "physician-led HRT",
    "low-dose testosterone for women",
    "compounded bioidentical hormones",
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
        alt: "Halo Hormone Therapy \u2014 physician-led HRT for women",
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

export default function HormoneTherapyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
