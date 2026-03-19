"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/types";
import ScoreRing from "@/components/ui/ScoreRing";
import PersonaCard from "@/components/simulation/PersonaCard";
import IssueCard from "@/components/ui/IssueCard";
import { getPersonaConfig, getScoreColor, formatUrl } from "@/lib/utils";
import {
  ArrowLeft,
  ExternalLink,
  Shield,
  AlertTriangle,
  TrendingUp,
  BarChart3,
} from "lucide-react";

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  const [activePersona, setActivePersona] = useState<string | null>("beginner");

  const issuesBySeverity = {
    high: result.globalIssues.filter((i) => i.severity === "high").length +
      result.personas.flatMap((p) => p.issues).filter((i) => i.severity === "high").length,
    medium: result.globalIssues.filter((i) => i.severity === "medium").length +
      result.personas.flatMap((p) => p.issues).filter((i) => i.severity === "medium").length,
    low: result.globalIssues.filter((i) => i.severity === "low").length +
      result.personas.flatMap((p) => p.issues).filter((i) => i.severity === "low").length,
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-void)" }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-50 border-b px-6 py-4 flex items-center gap-4"
        style={{
          background: "rgba(2,4,8,0.95)",
          borderColor: "var(--color-border)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors"
          style={{
            color: "var(--color-text-dim)",
            border: "1px solid var(--color-border)",
          }}
        >
          <ArrowLeft size={14} />
          New Analysis
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-2 h-2 rounded-full animate-pulse-glow shrink-0"
            style={{ background: "var(--color-ok)" }}
          />
          <span
            className="terminal text-sm truncate"
            title={result.url}
          >
            {formatUrl(result.url)}
          </span>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <ExternalLink size={12} style={{ color: "var(--color-text-dim)" }} />
          </a>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {result.siteCategory && (
            <span
              className="text-xs px-2 py-1 rounded-full hidden sm:block"
              style={{
                color: "var(--color-accent)",
                background: "var(--color-accent-glow)",
                border: "1px solid rgba(0,229,255,0.2)",
              }}
            >
              {result.siteCategory}
            </span>
          )}
          <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>
            {new Date(result.analyzedAt).toLocaleTimeString()}
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Overview row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall score + summary */}
          <div
            className="card p-6 lg:col-span-1 flex flex-col items-center justify-center gap-4"
          >
            <ScoreRing
              score={result.overallUXScore}
              size={140}
              strokeWidth={10}
              label="Overall UX Score"
              sublabel={result.siteTitle}
            />

            {/* Issue breakdown */}
            <div className="w-full space-y-2 mt-2">
              {[
                { label: "Critical", count: issuesBySeverity.high, color: "#ef4444" },
                { label: "Warnings", count: issuesBySeverity.medium, color: "var(--color-warn)" },
                { label: "Minor", count: issuesBySeverity.low, color: "var(--color-ok)" },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs w-16 shrink-0" style={{ color: "var(--color-text-dim)" }}>
                    {label}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--color-border)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, (count / 20) * 100)}%`,
                        background: color,
                        boxShadow: `0 0 4px ${color}`,
                      }}
                    />
                  </div>
                  <span
                    className="text-xs w-4 text-right shrink-0 font-mono"
                    style={{ color }}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Executive summary */}
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} color="var(--color-accent)" />
              <h2
                className="text-sm font-semibold uppercase tracking-widest"
                style={{ color: "var(--color-accent)" }}
              >
                Executive Summary
              </h2>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-text-dim)" }}>
              {result.executiveSummary}
            </p>

            {/* Persona comparison */}
            <div className="grid grid-cols-3 gap-3">
              {result.personas.map((p) => {
                const config = getPersonaConfig(p.persona);
                return (
                  <button
                    key={p.persona}
                    onClick={() =>
                      setActivePersona(
                        activePersona === p.persona ? null : p.persona
                      )
                    }
                    className="p-3 rounded-xl text-center transition-all"
                    style={{
                      background:
                        activePersona === p.persona
                          ? `${config.color}12`
                          : "var(--color-surface)",
                      border: `1px solid ${
                        activePersona === p.persona
                          ? `${config.color}50`
                          : "var(--color-border)"
                      }`,
                    }}
                  >
                    <div className="text-xl mb-1">{config.emoji}</div>
                    <div
                      className="text-lg font-bold font-mono"
                      style={{ color: getScoreColor(p.overallScore) }}
                    >
                      {p.overallScore}
                    </div>
                    <div className="text-xs" style={{ color: "var(--color-text-dim)" }}>
                      {config.label.split(" ")[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top recommendations */}
        {result.topRecommendations.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} color="var(--color-ok)" />
              <h2
                className="text-sm font-semibold uppercase tracking-widest"
                style={{ color: "var(--color-ok)" }}
              >
                Top Recommendations
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {result.topRecommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: "rgba(0,255,136,0.15)",
                      color: "var(--color-ok)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm" style={{ color: "var(--color-text)" }}>
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Persona cards */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} color="var(--color-accent)" />
            <h2
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-accent)" }}
            >
              Persona Simulations
            </h2>
          </div>
          <div className="space-y-4">
            {result.personas.map((persona) => (
              <PersonaCard
                key={persona.persona}
                report={persona}
                isActive={activePersona === persona.persona}
                onClick={() =>
                  setActivePersona(
                    activePersona === persona.persona ? null : persona.persona
                  )
                }
              />
            ))}
          </div>
        </div>

        {/* Global issues */}
        {result.globalIssues.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} color="var(--color-warn)" />
              <h2
                className="text-sm font-semibold uppercase tracking-widest"
                style={{ color: "var(--color-warn)" }}
              >
                Cross-Persona Issues
              </h2>
            </div>
            <div className="space-y-3">
              {result.globalIssues.map((issue, i) => (
                <IssueCard key={issue.id} issue={issue} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
