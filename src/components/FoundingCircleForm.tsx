"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";

interface FoundingCircleFormProps {
  variant?: "light" | "dark";
}

export default function FoundingCircleForm({
  variant = "light",
}: FoundingCircleFormProps) {
  const [email, setEmail] = useState("");
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

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Honeypot check — silently reject bots
      if (honeypot) {
        setStatus("success");
        return;
      }

      // Validate email format
      if (!email.trim()) {
        setErrorMessage("Please enter your email.");
        setStatus("error");
        return;
      }

      if (!validateEmail(email.trim())) {
        setErrorMessage("Please enter a valid email address.");
        setStatus("error");
        return;
      }

      // Check for duplicate
      const saved = localStorage.getItem("halo_signup_email");
      if (saved) {
        setStatus("duplicate");
        return;
      }

      // Submit
      setStatus("submitting");

      // Simulate submission with debounce delay
      setTimeout(() => {
        localStorage.setItem("halo_signup_email", email.trim());
        setStatus("success");
      }, 800);
    },
    [email, honeypot]
  );

  if (status === "duplicate") {
    return (
      <div className="text-center py-4">
        <p className="text-halo-gold font-semibold text-lg mb-1">
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
        <p className="text-halo-gold font-semibold text-lg mb-2">
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
          className={isDark ? "btn-gold-outline !py-2.5 !px-6 !text-sm" : "btn-halo !py-2.5 !px-6 !text-sm"}
        >
          Share with a friend
          <ArrowRight className="w-4 h-4 btn-arrow" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={isDark ? "founding-form-dark" : "founding-form"}>
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
        placeholder="your best email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className={status === "submitting" ? "opacity-60 cursor-wait" : ""}
      >
        {status === "submitting" ? "Joining..." : "Claim My Spot"}
        {status !== "submitting" && (
          <ArrowRight className="w-4 h-4 btn-arrow" />
        )}
      </button>
      {status === "error" && (
        <p className="absolute -bottom-7 left-0 text-xs text-red-500 pl-4">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
