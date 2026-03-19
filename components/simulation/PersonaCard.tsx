"use client";

import { useState } from "react";
import { getPersonaConfig, getScoreColor } from "@/lib/utils";
import type { PersonaReport } from "@/types";
import IssueCard from "@/components/ui/IssueCard";
import ScoreRing from "@/components/ui/ScoreRing";
import { AlertTriangle, CheckCircle, Zap, Target } from "lucide-react";

interface PersonaCardProps {
  report: PersonaReport;
  isActive: boolean;
  onClick: () => void;
}

export default function PersonaCard({ report, isActive, onClick }: PersonaCardProps) {
  const config = getPersonaConfig(report.persona);
  const [activeTab, setActiveTab] = useState<"issues" | "hesitation" | "positives">("issues");

  const tabs = [
    { id: "issues" as const, label: "Issues", count: report.issues.length },
    { id: "hesitation" as const, label: "Hesitation", count: report.hesitationPoints.length },
    { id: "positives" as const, label: "Positives", count: report.positives.length },
  ];

  return (
    <div
      className="card overflow-hidden"
      style={{
        border: isActive
          ? `1px solid ${config.color}`
          : "1px solid var(--color-border)",
        boxShadow: isActive
          ? `0 0 30px rgba(0,0,0,0.3), 0 0 0 1px ${config.color}30`
          : "var(--shadow-card)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Header - clickable to collapse/expand */}
      <div
        className="p-5 cursor-pointer"
        onClick={onClick}
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${config.color}12, transparent)`
            : "transparent",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{
                background: `${config.color}15`,
                border: `1px solid ${config.color}40`,
              }}
            >
              {config.emoji}
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: "var(--color-text)" }}>
                {config.label}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-dim)" }}>
                {config.description}
              </p>
            </div>
          </div>

          {/* Mini scores */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div
                className="text-xl font-bold"
                style={{
                  color: getScoreColor(report.overallScore),
                  fontFamily: "var(--font-mono)",
                }}
              >
                {report.overallScore}
              </div>
              <div className="text-xs" style={{ color: "var(--color-text-dim)" }}>
                UX Score
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-xl font-bold"
                style={{
                  color: getScoreColor(report.completionLikelihood),
                  fontFamily: "var(--font-mono)",
                }}
              >
                {report.completionLikelihood}%
              </div>
              <div className="text-xs" style={{ color: "var(--color-text-dim)" }}>
                Completion
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-dim)" }}
        >
          {report.summary}
        </p>

        {/* Worst element */}
        <div
          className="mt-3 flex items-center gap-2 p-2 rounded-lg"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <AlertTriangle size={12} color="#ef4444" />
          <span className="text-xs" style={{ color: "#ef4444" }}>
            Biggest friction: <strong>{report.worstElement}</strong>
          </span>
        </div>
      </div>

      {/* Tab content - only when active */}
      {isActive && (
        <div>
          {/* Tabs */}
          <div
            className="flex gap-0"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 px-4 py-3 text-sm font-medium transition-colors relative"
                style={{
                  color:
                    activeTab === tab.id
                      ? config.color
                      : "var(--color-text-dim)",
                  background: "transparent",
                  borderBottom:
                    activeTab === tab.id
                      ? `2px solid ${config.color}`
                      : "2px solid transparent",
                }}
              >
                {tab.label}
                <span
                  className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    background:
                      activeTab === tab.id ? `${config.color}20` : "var(--color-border)",
                    color:
                      activeTab === tab.id ? config.color : "var(--color-text-dim)",
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <div className="p-5 space-y-3">
            {activeTab === "issues" && (
              <>
                {report.issues.length === 0 ? (
                  <p className="text-sm text-center py-4" style={{ color: "var(--color-text-dim)" }}>
                    No issues found
                  </p>
                ) : (
                  report.issues.map((issue, i) => (
                    <IssueCard key={issue.id} issue={issue} index={i} />
                  ))
                )}
              </>
            )}

            {activeTab === "hesitation" && (
              <div className="space-y-3">
                {report.hesitationPoints.map((hp, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl"
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Zap size={14} color={config.color} />
                        <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                          {hp.area}
                        </span>
                      </div>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full shrink-0"
                        style={{
                          background: "var(--color-border)",
                          color: "var(--color-text-dim)",
                        }}
                      >
                        {hp.timeEstimate}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
                      {hp.reason}
                    </p>
                  </div>
                ))}

                {/* Flow breakers */}
                {report.flowBreakers.length > 0 && (
                  <div className="mt-4">
                    <h4
                      className="text-xs font-semibold uppercase tracking-widest mb-2"
                      style={{ color: "var(--color-warn)" }}
                    >
                      Flow Breakers
                    </h4>
                    <ul className="space-y-2">
                      {report.flowBreakers.map((fb, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm"
                          style={{ color: "var(--color-text-dim)" }}
                        >
                          <span className="text-base leading-5 shrink-0">⚡</span>
                          {fb}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "positives" && (
              <div className="space-y-3">
                {report.positives.map((pos, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{
                      background: "rgba(0,255,136,0.05)",
                      border: "1px solid rgba(0,255,136,0.15)",
                    }}
                  >
                    <CheckCircle size={16} color="var(--color-ok)" className="shrink-0 mt-0.5" />
                    <p className="text-sm" style={{ color: "var(--color-text)" }}>
                      {pos}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
