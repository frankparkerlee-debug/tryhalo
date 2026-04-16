import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProgramCardProps {
  title: string;
  description: string;
  href: string;
}

export default function ProgramCard({
  title,
  description,
  href,
}: ProgramCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-halo-cream rounded-2xl p-8 card-hover"
    >
      <h3 className="font-sans text-xl font-semibold text-halo-charcoal mb-3 group-hover:text-halo-charcoal/70 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-halo-charcoal/60 leading-relaxed text-sm mb-5">
        {description}
      </p>
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6B7B6E]">
        Tell me more
        <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
      </span>
    </Link>
  );
}
