"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-[#1C1C1E] text-[#F8F7F4] z-40">
      <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-center relative">
        <a
          href="#founding-circle"
          className="text-xs sm:text-sm font-medium tracking-wide hover:underline"
        >
          Founding Circle is open — 999 spots at reduced pricing for life.{" "}
          <span className="font-semibold">Join now &rarr;</span>
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
