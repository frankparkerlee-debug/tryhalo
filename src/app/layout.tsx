import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

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

export const metadata: Metadata = {
  title: "Halo — Physician-Led Hormone Optimization & Wellness",
  description:
    "Halo is a new kind of health platform — physician-led hormone optimization, peptide therapy, and wellness programs designed around your biology.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.svg",
  },
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
      <body className="min-h-screen flex flex-col font-sans">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
