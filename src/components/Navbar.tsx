"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import HaloLogo from "./HaloLogo";

const navLinks = [
  { label: "Hormone Therapy", href: "/hormone-therapy" },
  { label: "Testosterone", href: "/testosterone-therapy" },
  { label: "Peptide Therapy", href: "/peptide-therapy" },
  { label: "NAD+", href: "/nad-therapy" },
  { label: "Weight Loss", href: "/#founding-circle" },
  { label: "Quiz", href: "/quiz" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-xl ${
          scrolled
            ? "bg-[#141414]/90 shadow-[0_1px_0_rgba(255,255,255,0.06)]"
            : "bg-[#141414]/60"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="group flex-shrink-0">
            <HaloLogo size="md" variant="dark" />
          </Link>

          {/* Center: Category links (desktop) */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-white/50 hover:text-white transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[1px] after:bg-white/40 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: CTA + hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/quiz"
              className="btn-gold-outline !py-2 !px-5 !text-sm hidden sm:inline-flex border border-white/25 text-white hover:bg-white hover:text-[#1C1C1E]"
            >
              Get Started
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-out menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Slide panel */}
        <div
          className={`absolute top-0 right-0 w-[280px] h-full bg-[#141414] border-l border-white/[0.06] transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="pt-20 px-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-lg text-white/60 hover:text-white hover:pl-2 transition-all duration-300 border-b border-white/[0.06]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quiz"
              onClick={() => setMobileOpen(false)}
              className="btn-gold-filled !text-sm mt-6 justify-center bg-[#F8F7F4] text-[#1C1C1E]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
