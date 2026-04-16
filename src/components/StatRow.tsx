interface StatItem {
  value: string;
  label: string;
}

interface StatRowProps {
  stats: StatItem[];
}

export default function StatRow({ stats }: StatRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-3xl mx-auto">
      {stats.map((stat, index) => (
        <div key={index} className="text-center aos-child">
          <p className="text-4xl md:text-5xl font-bold text-[#1C1C1E] mb-2 tracking-tight">
            {stat.value}
          </p>
          <p className="text-sm text-halo-charcoal/60">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
