"use client";

import { getScoreColor, getScoreLabel } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export default function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  return (
    <div className="relative flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background ring */}
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
              transition: "stroke-dashoffset 1s ease",
            }}
          />
        </svg>

        {/* Score text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span
            className="font-bold leading-none"
            style={{
              fontSize: size * 0.22,
              color,
            }}
          >
            {score}
          </span>
          <span
            className="font-medium"
            style={{
              fontSize: size * 0.09,
              color: "var(--color-text-dim)",
              marginTop: 2,
            }}
          >
            {scoreLabel}
          </span>
        </div>
      </div>

      {label && (
        <div className="text-center">
          <p
            className="font-semibold"
            style={{ color: "var(--color-text)", fontSize: 13 }}
          >
            {label}
          </p>
          {sublabel && (
            <p style={{ color: "var(--color-text-dim)", fontSize: 11 }}>
              {sublabel}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
