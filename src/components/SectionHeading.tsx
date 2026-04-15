import HaloLogo from "./HaloLogo";

interface SectionHeadingProps {
  headline: string;
  subtext?: string;
  centered?: boolean;
}

export default function SectionHeading({
  headline,
  subtext,
  centered = true,
}: SectionHeadingProps) {
  return (
    <div className={`mb-14 ${centered ? "text-center" : ""}`}>
      {centered && (
        <div className="flex justify-center mb-5">
          <HaloLogo size="sm" variant="light" showText={false} />
        </div>
      )}
      <h2 className="headline-section text-3xl md:text-4xl lg:text-5xl mb-5">
        {headline}
      </h2>
      {subtext && (
        <p className="text-lg text-halo-charcoal/60 max-w-2xl mx-auto leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  );
}
