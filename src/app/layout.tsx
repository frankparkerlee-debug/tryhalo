import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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

const SITE_URL = "https://tryhalo.co";
const SITE_NAME = "Halo";
const TITLE = "Halo | Hormone Optimization, TRT, HRT, GLP-1 & Longevity";
const DESCRIPTION =
  "Physician-led hormone optimization for adults 40-55. Testosterone replacement therapy (TRT), hormone replacement therapy (HRT), GLP-1 weight management, peptide therapy, and NAD+ — personalized, monitored, and adjusted to your biology. Board-certified physicians, US-licensed compounding pharmacy, no insurance needed. Founding pricing from $149/mo.";

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
    "compounded tirzepatide",
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
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.svg",
  },
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
        "Telehealth platform providing physician-led hormone optimization, TRT, HRT, GLP-1 weight management, peptide therapy, and NAD+ protocols.",
      url: SITE_URL,
      priceRange: "$109-$249/mo",
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
      className={`${playfair.variable} ${inter.variable} antialiased`}
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
