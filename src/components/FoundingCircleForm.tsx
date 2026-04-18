"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { track } from "@/lib/tracking";

interface FoundingCircleFormProps {
  variant?: "light" | "dark";
}

export default function FoundingCircleForm({
  variant = "light",
}: FoundingCircleFormProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "duplicate" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isDark = variant === "dark";

  // Check if already signed up on mount
  useEffect(() => {
    const saved = localStorage.getItem("halo_signup_email");
    if (saved) {
      setStatus("duplicate");
    }
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Light phone validation: 10+ digits, allowing spaces, dashes, parens, dots.
  // Empty is allowed since phone is optional.
  const validatePhone = (phone: string) => {
    const trimmed = phone.trim();
    if (!trimmed) return true;
    const digits = trimmed.replace(/\D/g, "");
    return digits.length >= 10;
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      track("founding_signup_attempt", {
        variant,
        has_phone: !!phone.trim(),
      });

      // Honeypot check — silently reject bots
      if (honeypot) {
        setStatus("success");
        return;
      }

      // Validate email format
      if (!email.trim()) {
        setErrorMessage("Please enter your email.");
        setStatus("error");
        track("founding_signup_error", { reason: "missing_email", variant });
        return;
      }

      if (!validateEmail(email.trim())) {
        setErrorMessage("Please enter a valid email address.");
        setStatus("error");
        track("founding_signup_error", { reason: "invalid_email", variant });
        return;
      }

      if (!validatePhone(phone)) {
        setErrorMessage("Please enter a valid phone number (10+ digits).");
        setStatus("error");
        track("founding_signup_error", { reason: "invalid_phone", variant });
        return;
      }

      // Check for duplicate
      const saved = localStorage.getItem("halo_signup_email");
      if (saved) {
        setStatus("duplicate");
        track("founding_signup_duplicate", { variant });
        return;
      }

      // Submit
      setStatus("submitting");

      // Simulate submission with debounce delay
      setTimeout(() => {
        localStorage.setItem("halo_signup_email", email.trim());
        if (phone.trim()) {
          localStorage.setItem("halo_signup_phone", phone.trim());
        }
        setStatus("success");
        track("founding_signup_success", {
          variant,
          has_phone: !!phone.trim(),
          source: typeof window !== "undefined" ? window.location.pathname : "",
        });
      }, 800);
    },
    [email, phone, honeypot, variant]
  );

  if (status === "duplicate") {
    return (
      <div className="text-center py-4">
        <p className="text-[#6B7B6E] font-semibold text-lg mb-1">
          You&apos;re already on the list.
        </p>
        <p className={`text-sm ${isDark ? "text-white/50" : "text-halo-charcoal/50"}`}>
          We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <p className="text-[#6B7B6E] font-semibold text-lg mb-2">
          You&apos;re in. Check your inbox.
        </p>
        <p className={`text-sm mb-4 ${isDark ? "text-white/60" : "text-halo-charcoal/60"}`}>
          Share Halo with a friend and you both get a free month.
        </p>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "Halo — Founding Circle",
                text: "Join the Halo Founding Circle for locked-in pricing on physician-led hormone optimization.",
                url: "https://tryhalo.co",
              });
            } else {
              navigator.clipboard.writeText("https://tryhalo.co");
              alert("Link copied!");
            }
          }}
          className={isDark ? "btn-gold-outline !py-2.5 !px-6 !text-sm border-white/25 text-white hover:bg-white hover:text-[#1C1C1E]" : "btn-halo !py-2.5 !px-6 !text-sm"}
        >
          Share with a friend
          <ArrowRight className="w-4 h-4 btn-arrow" />
        </button>
      </div>
    );
  }

  const inputBaseClass = isDark
    ? "w-full px-5 py-3.5 bg-white/5 border border-white/15 focus:border-white/40 focus:outline-none rounded-xl text-sm text-white placeholder:text-white/35 transition-colors"
    : "w-full px-5 py-3.5 bg-white border border-[#E5E4E0] focus:border-halo-charcoal/30 focus:outline-none rounded-xl text-sm text-halo-charcoal placeholder:text-halo-charcoal/35 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5 w-full">
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{
          position: "absolute",
          left: "-9999px",
          opacity: 0,
          height: 0,
          width: 0,
          overflow: "hidden",
        }}
      />
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="Email"
        aria-label="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        className={inputBaseClass}
      />
      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="Phone (optional)"
        aria-label="Phone number (optional)"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        className={inputBaseClass}
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all ${
          isDark
            ? "bg-white text-[#1C1C1E] hover:bg-white/90"
            : "bg-[#1C1C1E] text-white hover:bg-[#333]"
        } ${status === "submitting" ? "opacity-60 cursor-wait" : ""}`}
      >
        {status === "submitting" ? "Joining..." : "Claim My Spot"}
        {status !== "submitting" && (
          <ArrowRight className="w-4 h-4" />
        )}
      </button>
      {status === "error" && (
        <p className={`text-xs pl-1 ${isDark ? "text-red-300" : "text-red-500"}`}>
          {errorMessage}
        </p>
      )}
      <p className={`text-[10px] text-center pt-1 ${isDark ? "text-white/35" : "text-halo-charcoal/40"}`}>
        By submitting, you agree to receive occasional updates from Halo. Unsubscribe anytime.
      </p>
    </form>
  );
}
