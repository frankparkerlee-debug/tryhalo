interface TestimonialCardProps {
  category: string;
  quote: string;
}

export default function TestimonialCard({
  category,
  quote,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-7 card-hover">
      <p className="text-xs font-medium text-[#86868B] uppercase tracking-wider mb-3 flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#86868B]/50" />
        {category}
      </p>
      <p className="text-sm text-halo-charcoal/70 leading-relaxed italic">
        &ldquo;{quote}&rdquo;
      </p>
    </div>
  );
}
