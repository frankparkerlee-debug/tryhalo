import type { Metadata } from "next";
import StackBuilder from "./StackBuilder";

export const metadata: Metadata = {
  title: "Build Your Stack — Halo Health",
  description:
    "Your personalized Halo plan. Pick the programs that fit, choose your delivery method, and reserve your founding spot.",
  robots: {
    // Pre-launch: keep /stack out of search while we're still iterating.
    // Flip to indexable once the public funnel is stable.
    index: false,
    follow: false,
  },
};

export default function StackPage() {
  return (
    <main className="bg-[#F8F7F4] min-h-screen">
      <StackBuilder />
    </main>
  );
}
