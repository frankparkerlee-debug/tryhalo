import Link from "next/link";
import HaloLogo from "./HaloLogo";

const footerColumns = [
  {
    title: "Programs",
    links: [
      { label: "Hormone Therapy", href: "/renew" },
      { label: "Testosterone", href: "/vital" },
      { label: "Peptide Therapy", href: "/restore" },
      { label: "NAD+ Therapy", href: "/vitality" },
      { label: "Weight Loss", href: "/#founding-circle", comingSoon: true },
      { label: "Sexual Wellness", href: "/#founding-circle", comingSoon: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "HIPAA Notice", href: "/hipaa" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#141414] text-white/70 relative">
      {/* Gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        {/* Top: Logo + columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Logo column */}
          <div className="col-span-2 md:col-span-1">
            <HaloLogo size="md" variant="dark" />
            <p className="text-sm text-white/30 mt-4 leading-relaxed max-w-[200px]">
              Physician-led hormone optimization and wellness.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("mailto:") ? (
                      <a
                        href={link.href}
                        className="text-sm text-white/50 hover:text-white transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-white/50 hover:text-white transition-colors duration-300 inline-flex items-center gap-2"
                      >
                        {link.label}
                        {"comingSoon" in link && link.comingSoon && (
                          <span className="text-[10px] text-white/25 font-medium">
                            Soon
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Connect column */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
              Connect
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:hello@tryhalo.co"
                  className="text-sm text-white/50 hover:text-white transition-colors duration-300"
                >
                  hello@tryhalo.co
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/tryhalo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-white transition-colors duration-300"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/tryhalo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-white transition-colors duration-300"
                >
                  X (Twitter)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <p className="text-xs text-white/25">
              &copy; 2026 Halo Health Inc. All rights reserved.
            </p>
            <p className="text-xs text-white/20 leading-relaxed max-w-2xl md:text-right">
              Halo is a technology platform that connects patients with licensed
              healthcare providers. All clinical decisions are made by
              independent licensed providers. Halo does not provide medical
              advice, diagnosis, or treatment. If you are experiencing a medical
              emergency, call 911.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
