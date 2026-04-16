interface TreatmentCardProps {
  title: string;
  description: string;
  comingSoon?: boolean;
}

export default function TreatmentCard({
  title,
  description,
  comingSoon = false,
}: TreatmentCardProps) {
  return (
    <div className="bg-white rounded-2xl p-7 card-hover">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-sans text-lg font-semibold text-halo-charcoal">
          {title}
        </h3>
        {comingSoon && (
          <span className="flex-shrink-0 text-xs font-medium text-[#86868B] bg-[#86868B]/10 px-2.5 py-1 rounded-full">
            Coming soon
          </span>
        )}
      </div>
      <p className="text-sm text-halo-charcoal/60 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
