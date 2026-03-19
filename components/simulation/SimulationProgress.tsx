"use client";

import type { SimulationStep } from "@/types";
import { Check, Loader2 } from "lucide-react";
import { getPersonaConfig } from "@/lib/utils";

interface SimulationProgressProps {
  steps: SimulationStep[];
  currentStep: string;
  url: string;
}

export default function SimulationProgress({
  steps,
  currentStep,
  url,
}: SimulationProgressProps) {
  return (
    <div className="card p-8 max-w-xl mx-auto text-center">
      {/* Animated orb */}
      <div className="relative w-24 h-24 mx-auto mb-8">
        {/* Outer rings */}
        <div
          className="absolute inset-0 rounded-full border-2 animate-spin-slow"
          style={{ borderColor: "var(--color-accent)", opacity: 0.3 }}
        />
        <div
          className="absolute inset-2 rounded-full border-2"
          style={{
            borderColor: "var(--color-accent)",
            borderTopColor: "transparent",
            animation: "spin-slow 3s linear infinite reverse",
            opacity: 0.5,
          }}
        />
        {/* Inner glow */}
        <div
          className="absolute inset-4 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle, rgba(0,229,255,0.3) 0%, rgba(0,229,255,0.05) 70%)",
          }}
        >
          <Loader2
            size={24}
            color="var(--color-accent)"
            className="animate-spin"
          />
        </div>
      </div>

      <h2
        className="text-xl font-bold mb-1"
        style={{ color: "var(--color-text)" }}
      >
        Analyzing Website
      </h2>
      <p
        className="text-sm mb-2 terminal truncate max-w-xs mx-auto"
        title={url}
      >
        {url.length > 40 ? url.slice(0, 40) + "..." : url}
      </p>
      <p className="text-sm mb-8" style={{ color: "var(--color-text-dim)" }}>
        {currentStep || "Initializing simulation..."}
      </p>

      {/* Steps */}
      <div className="space-y-3 text-left">
        {steps.map((step, i) => {
          const config = getPersonaConfig(step.persona);
          const isActive =
            currentStep.toLowerCase().includes(step.persona) ||
            (i === 0 && currentStep.includes("global"));
          const isDone = step.done;

          return (
            <div
              key={step.persona}
              className="flex items-center gap-4 p-3 rounded-xl transition-all"
              style={{
                background: isDone
                  ? "rgba(0,255,136,0.05)"
                  : isActive
                  ? `${config.color}10`
                  : "var(--color-surface)",
                border: `1px solid ${
                  isDone
                    ? "rgba(0,255,136,0.2)"
                    : isActive
                    ? `${config.color}40`
                    : "var(--color-border)"
                }`,
              }}
            >
              {/* Status icon */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: isDone
                    ? "rgba(0,255,136,0.15)"
                    : isActive
                    ? `${config.color}20`
                    : "var(--color-border)",
                }}
              >
                {isDone ? (
                  <Check size={14} color="var(--color-ok)" />
                ) : isActive ? (
                  <Loader2
                    size={14}
                    color={config.color}
                    className="animate-spin"
                  />
                ) : (
                  <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                    {i + 1}
                  </span>
                )}
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-base">{config.emoji}</span>
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color: isDone
                        ? "var(--color-ok)"
                        : isActive
                        ? config.color
                        : "var(--color-text-dim)",
                    }}
                  >
                    {config.label}
                  </span>
                </div>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  {step.description}
                </p>
              </div>

              {/* Done badge */}
              {isDone && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    color: "var(--color-ok)",
                    background: "rgba(0,255,136,0.1)",
                  }}
                >
                  Done
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div
        className="mt-6 h-1 rounded-full overflow-hidden"
        style={{ background: "var(--color-border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(steps.filter((s) => s.done).length / steps.length) * 100}%`,
            background: `linear-gradient(90deg, var(--color-accent), var(--color-ok))`,
            boxShadow: "0 0 8px var(--color-accent)",
          }}
        />
      </div>
    </div>
  );
}
