import type { Metadata } from "next";
import { Playfair_Display, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import {
  PROGRAM_CATALOG,
  cheapestMonthlyFounding,
  formatMonthlyRounded,
  getProgram,
} from "@/lib/programs";

// Derive marketing copy from the program catalog so prices can never drift.
const HRT_FROM = formatMonthlyRounded(
  cheapestMonthlyFounding(getProgram("hrt")!).price
);
const NAD_STD_MONTHLY = getProgram("nad")!.pricing.monthly;
const PRICE_FLOOR = Math.min(
  ...PROGRAM_CATALOG.filter(
    (p) =>
      p.slug !== "care_coach" &&
      p.slug !== "sexual_wellness" &&
      !p.comingSoon
  ).map((p) => cheapestMonthlyFounding(p).price)
);
const PRICE_CEIL = Math.max(
  NAD_STD_MONTHLY,
  getProgram("peptides")!.pricing.monthly
);

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = "https://tryhalo.co";
const SITE_NAME = "Halo";
const TITLE = "Halo | HRT, NAD+, TRT, Peptides & Longevity Medicine";
const DESCRIPTION =
  `Physician-led hormone therapy and longevity medicine. Hormone replacement therapy (HRT) for women, NAD+ therapy, testosterone replacement (TRT) for men, peptide therapy, and GLP-1 weight management — personalized, monitored, and adjusted to your biology. Board-certified physicians, US-licensed compounding pharmacy, no insurance needed. Founding pricing from ${HRT_FROM}/mo for the first 999 members.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Halo",
  },
  description: DESCRIPTION,
  keywords: [
    "hormone optimization",
    "testosterone replacement therapy",
    "TRT",
    "TRT online",
    "hormone replacement therapy",
    "HRT",
    "bioidentical hormones",
    "GLP-1 weight loss",
    "compounded semaglutide",
    "peptide therapy",
    "sermorelin",
    "NAD+ therapy",
    "anti-aging",
    "longevity medicine",
    "telehealth hormone therapy",
    "online TRT",
    "men's health",
    "women's health",
    "menopause treatment",
    "low testosterone treatment",
    "physician-led wellness",
    "concierge telehealth",
    "compounded hormones",
    "USP pharmacy",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/halo-difference.jpg",
        width: 1600,
        height: 900,
        alt: "Halo — Hormone optimization designed around your biology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/halo-difference.jpg"],
    creator: "@tryhalo",
  },
  category: "health",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/apple-touch-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

/* JSON-LD structured data for Google rich results */
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/apple-touch-icon.svg`,
      description: DESCRIPTION,
      sameAs: ["https://www.instagram.com/tryhalo.co"],
    },
    {
      "@type": "MedicalBusiness",
      "@id": `${SITE_URL}#business`,
      name: SITE_NAME,
      description:
        "Telehealth platform providing physician-led hormone replacement therapy (HRT), NAD+ therapy, testosterone optimization (TRT), peptide therapy, and GLP-1 weight management.",
      url: SITE_URL,
      priceRange: `$${PRICE_FLOOR}-$${PRICE_CEIL}/mo`,
      medicalSpecialty: [
        "Endocrinology",
        "Internal Medicine",
        "Sports Medicine",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}#organization` },
      inLanguage: "en-US",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${plexMono.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(STRUCTURED_DATA),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <GoogleAnalytics />
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
