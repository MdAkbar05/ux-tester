export type PersonaType = "beginner" | "distracted" | "mobile";

export type SeverityLevel = "high" | "medium" | "low";

export interface UXIssue {
  id: string;
  element: string;
  description: string;
  severity: SeverityLevel;
  suggestion: string;
  location?: string;
}

export interface HesitationPoint {
  area: string;
  reason: string;
  timeEstimate: string;
  impact: SeverityLevel;
}

export interface PersonaReport {
  persona: PersonaType;
  personaLabel: string;
  personaEmoji: string;
  summary: string;
  overallScore: number;
  issues: UXIssue[];
  hesitationPoints: HesitationPoint[];
  positives: string[];
  flowBreakers: string[];
  worstElement: string;
  completionLikelihood: number;
}

export interface AnalysisResult {
  url: string;
  analyzedAt: string;
  siteTitle?: string;
  siteCategory?: string;
  overallUXScore: number;
  personas: PersonaReport[];
  globalIssues: UXIssue[];
  topRecommendations: string[];
  executiveSummary: string;
}

export interface AnalysisState {
  status: "idle" | "loading" | "streaming" | "complete" | "error";
  url: string;
  currentStep: string;
  progress: number;
  result: AnalysisResult | null;
  error: string | null;
}

export interface SimulationStep {
  persona: PersonaType;
  label: string;
  description: string;
  done: boolean;
}
