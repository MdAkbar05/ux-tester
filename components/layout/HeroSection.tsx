"use client";

import URLInput from "@/components/ui/URLInput";
import { Eye, Cpu, Smartphone, Users } from "lucide-react";

interface HeroSectionProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const FEATURES = [
  {
    icon: Eye,
    label: "Beginner Simulation",
    desc: "Catch navigation & clarity issues",
    color: "var(--color-beginner)",
  },
  {
    icon: Cpu,
    label: "Distracted User",
    desc: "Identify attention & clarity gaps",
    color: "var(--color-distracted)",
  },
  {
    icon: Smartphone,
    label: "Mobile Simulation",
    desc: "Expose touch & responsive bugs",
    color: "var(--color-mobile)",
  },
];

export default function HeroSection({ onSubmit, isLoading }: HeroSectionProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden">

      {/* Ambient glow blobs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Badge */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-medium"
        style={{
          border: "1px solid rgba(0,229,255,0.25)",
          background: "rgba(0,229,255,0.06)",
          color: "var(--color-accent)",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
          style={{ background: "var(--color-accent)" }}
        />
        AI-Powered UX Analysis · Real-Time Simulation
      </div>

      {/* Headline */}
      <div className="text-center mb-4 max-w-3xl">
        <h1
          className="font-bold leading-tight tracking-tight"
          style={{
            fontFamily: "Syne, var(--font-display)",
            fontSize: "clamp(2.2rem, 6vw, 4rem)",
            color: "var(--color-text)",
          }}
        >
          See your site through{" "}
          <span
            style={{
              background: "linear-gradient(135deg, var(--color-accent), var(--color-beginner))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            every user&apos;s eyes
          </span>
        </h1>
      </div>

      <p
        className="text-center mb-10 max-w-xl text-base leading-relaxed"
        style={{ color: "var(--color-text-dim)" }}
      >
        Drop any URL. Our AI simulates 3 different user personas and reveals
        exactly where visitors get confused, hesitate, or abandon your site.
      </p>

      {/* URL Input */}
      <URLInput onSubmit={onSubmit} isLoading={isLoading} />

      {/* Feature pills */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
        {FEATURES.map(({ icon: Icon, label, desc, color }) => (
          <div
            key={label}
            className="card p-4 flex items-start gap-3 card-hover"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${color}15`, border: `1px solid ${color}30` }}
            >
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--color-text)" }}
              >
                {label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-dim)" }}>
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div
        className="mt-12 flex items-center gap-8 flex-wrap justify-center text-center"
        style={{ color: "var(--color-text-dim)" }}
      >
        {[
          { value: "3", label: "User Personas" },
          { value: "∞", label: "URLs Supported" },
          { value: "~30s", label: "Analysis Time" },
        ].map(({ value, label }) => (
          <div key={label}>
            <div
              className="text-2xl font-bold"
              style={{
                color: "var(--color-text)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {value}
            </div>
            <div className="text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div
          className="w-0.5 h-8 rounded-full"
          style={{
            background: "linear-gradient(to bottom, var(--color-accent), transparent)",
          }}
        />
      </div>
    </div>
  );
}
