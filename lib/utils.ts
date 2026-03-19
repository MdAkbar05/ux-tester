import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PersonaType, SeverityLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPersonaConfig(persona: PersonaType) {
  const configs = {
    beginner: {
      label: "Beginner User",
      emoji: "🐣",
      description: "First-time visitor, low tech savvy",
      color: "var(--color-beginner)",
      className: "persona-beginner",
    },
    distracted: {
      label: "Distracted User",
      emoji: "📱",
      description: "Multitasking, short attention span",
      color: "var(--color-distracted)",
      className: "persona-distracted",
    },
    mobile: {
      label: "Mobile User",
      emoji: "📲",
      description: "On phone, small screen, touch-first",
      color: "var(--color-mobile)",
      className: "persona-mobile",
    },
  };
  return configs[persona];
}

export function getSeverityConfig(severity: SeverityLevel) {
  const configs = {
    high: { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: "🔴" },
    medium: { label: "Warning", color: "var(--color-warn)", bg: "rgba(255,107,43,0.1)", icon: "🟡" },
    low: { label: "Minor", color: "var(--color-ok)", bg: "rgba(0,255,136,0.1)", icon: "🟢" },
  };
  return configs[severity];
}

export function getScoreColor(score: number): string {
  if (score >= 75) return "var(--color-ok)";
  if (score >= 50) return "var(--color-warn)";
  return "#ef4444";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 50) return "Needs Work";
  if (score >= 35) return "Poor";
  return "Critical";
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.includes(".");
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}

export function formatUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname + (parsed.pathname !== "/" ? parsed.pathname : "");
  } catch {
    return url;
  }
}
