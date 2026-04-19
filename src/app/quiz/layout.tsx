import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find your Halo protocol",
  description:
    "A two-minute assessment to find the right Halo protocol for your goals and biology. Testosterone therapy, hormone therapy, peptide therapy, or NAD+.",
  alternates: { canonical: "https://tryhalo.co/quiz" },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Find your Halo protocol",
    description:
      "A two-minute assessment to find the right Halo protocol for your goals and biology.",
    url: "https://tryhalo.co/quiz",
    type: "website",
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
