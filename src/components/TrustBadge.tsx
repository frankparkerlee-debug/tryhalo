import { type LucideIcon } from "lucide-react";

interface TrustBadgeProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function TrustBadge({
  icon: Icon,
  title,
  description,
}: TrustBadgeProps) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 mx-auto mb-5 rounded-full border-[1.5px] border-[#E5E4E0] flex items-center justify-center transition-all duration-300 hover:border-[#6B7B6E]/60 hover:shadow-[0_0_15px_rgba(107,123,110,0.15)]">
        <Icon className="w-6 h-6 text-[#6B7B6E]" />
      </div>
      <h3 className="font-serif text-lg font-semibold text-halo-charcoal mb-2 tracking-[-0.01em]">
        {title}
      </h3>
      <p className="text-halo-charcoal/60 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
