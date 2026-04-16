"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQProps {
  items: FAQItem[];
  categories?: string[];
}

export default function FAQ({ items, categories }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("General");

  const cats = categories || ["General", "Programs", "Pricing", "Medical"];

  // For now, all items show under "General" tab
  const filteredItems =
    activeCategory === "General"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Category tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {cats.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setOpenIndex(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              activeCategory === cat
                ? "bg-halo-charcoal text-white"
                : "bg-halo-charcoal/[0.06] text-halo-charcoal/50 hover:text-halo-charcoal hover:bg-halo-charcoal/[0.1]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ items */}
      <div className="divide-y divide-[#E5E4E0]">
        {filteredItems.map((item, index) => (
          <div key={index} className="aos-child">
            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="w-full flex items-center justify-between py-6 text-left group"
            >
              <span className="font-serif text-lg font-semibold text-halo-charcoal pr-8 group-hover:text-halo-charcoal/70 transition-colors duration-300 tracking-[-0.01em]">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-halo-charcoal/40 flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-96 pb-6" : "max-h-0"
              }`}
            >
              <p className="text-halo-charcoal/60 leading-relaxed text-sm">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <p className="py-8 text-center text-halo-charcoal/40 text-sm">
            More questions and answers coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
