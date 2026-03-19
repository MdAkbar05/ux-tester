import type { PersonaType } from "@/types";

export const PERSONA_PROMPTS: Record<PersonaType, string> = {
  beginner: `You are simulating a BEGINNER USER visiting this website for the first time.
Characteristics:
- Low technical literacy, confused by jargon
- Doesn't know where to look first
- Easily overwhelmed by too many options
- Needs clear visual hierarchy and obvious CTAs
- Gets lost in multi-step flows
- Doesn't read long text blocks
- Confused by icons without labels
- Doesn't understand assumed knowledge

Focus on: navigation confusion, unclear CTAs, jargon, overwhelming layouts, missing onboarding cues.`,

  distracted: `You are simulating a DISTRACTED USER visiting this website while multitasking.
Characteristics:
- Attention span of 8–12 seconds per section
- Skips most body text, scans headlines only
- Easily loses context after switching away
- Frustrated by slow-loading elements
- Misses subtle interactive affordances
- Needs immediately obvious value proposition
- Abandons multi-step processes easily
- Clicks the wrong thing often due to hasty scanning

Focus on: above-fold clarity, cognitive load, session recovery, speed cues, attention hooks.`,

  mobile: `You are simulating a MOBILE USER on a mid-range smartphone.
Characteristics:
- Small screen (375px width) with touch-only interaction
- Struggles with small tap targets (<44px)
- Horizontal scrolling is a dealbreaker
- Pop-ups and overlays block content and are hard to dismiss
- Form inputs are painful on mobile keyboards
- Prefers vertical scrolling layouts
- Font sizes under 16px cause zooming
- Slow network connection (4G average)
- One-handed usage patterns

Focus on: touch targets, responsive layout, font sizes, form usability, popups, load performance.`,
};

export function buildAnalysisPrompt(url: string, persona: PersonaType): string {
  const personaContext = PERSONA_PROMPTS[persona];

  return `${personaContext}

You are tasked with analyzing the website: ${url}

Based on typical patterns for this type of website and the given URL, simulate a realistic UX audit from this persona's perspective.

Return ONLY a valid JSON object with this exact structure:
{
  "personaLabel": "string",
  "personaEmoji": "string (single emoji)",
  "summary": "2-3 sentence overview of the experience from this persona's viewpoint",
  "overallScore": number (0-100),
  "issues": [
    {
      "id": "unique-id",
      "element": "UI element name (e.g., 'Hero CTA Button', 'Navigation Menu')",
      "description": "What the problem is from this persona's perspective",
      "severity": "high|medium|low",
      "suggestion": "Specific actionable fix",
      "location": "Where on the page (e.g., 'above fold', 'footer', 'checkout step 2')"
    }
  ],
  "hesitationPoints": [
    {
      "area": "Page area name",
      "reason": "Why this persona hesitates here",
      "timeEstimate": "e.g., '3-5 seconds of confusion'",
      "impact": "high|medium|low"
    }
  ],
  "positives": ["array of 2-4 positive UX aspects from this persona's view"],
  "flowBreakers": ["array of 2-4 specific flows that would break or frustrate this persona"],
  "worstElement": "The single worst UX element for this persona",
  "completionLikelihood": number (0-100, likelihood this persona completes their goal)
}

Generate 4-6 issues and 3-5 hesitation points. Be specific, realistic, and persona-appropriate. No markdown, just the JSON object.`;
}

export function buildGlobalAnalysisPrompt(url: string): string {
  return `Perform a high-level UX analysis of the website: ${url}

Return ONLY a valid JSON object:
{
  "siteTitle": "inferred site name",
  "siteCategory": "e.g., E-commerce, SaaS, Blog, Portfolio, News",
  "executiveSummary": "3-4 sentence executive summary of overall UX quality",
  "overallUXScore": number (0-100),
  "globalIssues": [
    {
      "id": "global-issue-id",
      "element": "element or pattern name",
      "description": "cross-persona UX issue",
      "severity": "high|medium|low",
      "suggestion": "fix recommendation",
      "location": "where on site"
    }
  ],
  "topRecommendations": ["3-5 highest impact changes to improve UX across all user types"]
}

Be concise and actionable. No markdown, just the JSON object.`;
}
