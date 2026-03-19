"use client";

import { getSeverityConfig } from "@/lib/utils";
import type { UXIssue } from "@/types";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface IssueCardProps {
  issue: UXIssue;
  index: number;
}

export default function IssueCard({ issue, index }: IssueCardProps) {
  const [expanded, setExpanded] = useState(false);
  const severity = getSeverityConfig(issue.severity);

  return (
    <div
      className="card card-hover cursor-pointer overflow-hidden"
      style={{
        animationDelay: `${index * 80}ms`,
        borderLeft: `3px solid ${severity.color}`,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Severity icon */}
            <span className="text-base shrink-0 mt-0.5">{severity.icon}</span>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className="text-sm font-semibold truncate"
                  style={{ color: "var(--color-text)" }}
                >
                  {issue.element}
                </span>
                {issue.location && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      background: "var(--color-surface)",
                      color: "var(--color-text-dim)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {issue.location}
                  </span>
                )}
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-dim)" }}
              >
                {issue.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{
                color: severity.color,
                background: severity.bg,
              }}
            >
              {severity.label}
            </span>
            <ChevronDown
              size={14}
              style={{
                color: "var(--color-muted)",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </div>
        </div>
      </div>

      {expanded && (
        <div
          className="px-4 pb-4 pt-0 border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div
            className="mt-3 p-3 rounded-lg flex gap-2"
            style={{
              background: "rgba(0,229,255,0.05)",
              border: "1px solid rgba(0,229,255,0.15)",
            }}
          >
            <span className="text-sm">💡</span>
            <div>
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: "var(--color-accent)" }}
              >
                Suggested Fix
              </p>
              <p className="text-sm" style={{ color: "var(--color-text)" }}>
                {issue.suggestion}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
