import { ArrowRight, Check } from "lucide-react";

interface PricingCardProps {
  programName: string;
  founderPrice: string;
  standardPrice: string;
  includes: string[];
  medicationRange: string;
  ctaText: string;
  ctaHref?: string;
  note?: string;
}

export default function PricingCard({
  programName,
  founderPrice,
  standardPrice,
  includes,
  medicationRange,
  ctaText,
  ctaHref = "/#founding-circle",
  note,
}: PricingCardProps) {
  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl border border-[#E5E4E0] p-8 md:p-10 card-hover">
        <h3 className="font-serif text-2xl font-bold text-halo-charcoal mb-2">
          {programName}
        </h3>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-4xl font-bold text-halo-charcoal">
            {founderPrice}
          </span>
          <span className="text-halo-charcoal/50">/mo</span>
        </div>
        <p className="text-sm text-[#6B7B6E] font-medium mb-1">
          Founding member rate, locked in for life
        </p>
        <p className="text-sm text-halo-charcoal/40 mb-6 line-through">
          {standardPrice}/mo after public launch
        </p>

        <div className="border-t border-halo-charcoal/5 pt-6 mb-6">
          <p className="text-sm font-medium text-halo-charcoal mb-3">
            Includes:
          </p>
          <ul className="space-y-2.5">
            {includes.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full border-[1.5px] border-[#6B7B6E]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#6B7B6E]" />
                </span>
                <span className="text-sm text-halo-charcoal/70">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-halo-bg rounded-xl p-4 mb-6">
          <p className="text-sm text-halo-charcoal/60">
            <span className="font-medium text-halo-charcoal">
              Medications: {medicationRange}
            </span>
            <br />
            Billed separately through our pharmacy partner. No markup.
          </p>
        </div>

        <a href={ctaHref} className="btn-halo w-full justify-center">
          {ctaText}
          <ArrowRight className="w-4 h-4 btn-arrow" />
        </a>

        {note && (
          <p className="mt-4 text-xs text-halo-charcoal/40 text-center">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
