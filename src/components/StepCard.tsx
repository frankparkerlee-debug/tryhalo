interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

export default function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0 w-12 h-12 rounded-full border-[1.5px] border-[#E5E4E0] flex items-center justify-center">
        <span className="text-[#1C1C1E] font-semibold text-sm">
          {String(number).padStart(2, "0")}
        </span>
      </div>
      <div>
        <h3 className="font-sans text-xl font-semibold text-halo-charcoal mb-1.5 tracking-[-0.01em]">
          {title}
        </h3>
        <p className="text-halo-charcoal/60 leading-relaxed text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
