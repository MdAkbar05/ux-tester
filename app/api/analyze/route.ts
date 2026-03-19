import { NextRequest, NextResponse } from "next/server";
import { buildAnalysisPrompt, buildGlobalAnalysisPrompt } from "@/lib/prompts";
import type { PersonaType, PersonaReport, AnalysisResult, UXIssue } from "@/types";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

async function callGroq(prompt: string): Promise<string> {
  if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not set in .env.local");

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a professional UX analyst. Always respond with valid JSON only. No markdown, no explanation, just the JSON object.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Groq API error: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  if (!text) throw new Error("Empty response from Groq");
  return text;
}

async function analyzePersona(
  url: string,
  persona: PersonaType
): Promise<PersonaReport> {
  const prompt = buildAnalysisPrompt(url, persona);
  const text = await callGroq(prompt);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Failed to parse persona response for ${persona}`);

  const data = JSON.parse(jsonMatch[0]);

  return {
    persona,
    personaLabel: data.personaLabel || persona,
    personaEmoji: data.personaEmoji || "👤",
    summary: data.summary || "",
    overallScore: Math.min(100, Math.max(0, data.overallScore || 50)),
    issues: (data.issues || []).map((issue: UXIssue & { id?: string }, i: number) => ({
      ...issue,
      id: issue.id || `${persona}-issue-${i}`,
    })),
    hesitationPoints: data.hesitationPoints || [],
    positives: data.positives || [],
    flowBreakers: data.flowBreakers || [],
    worstElement: data.worstElement || "Unknown",
    completionLikelihood: Math.min(100, Math.max(0, data.completionLikelihood || 50)),
  };
}

async function analyzeGlobal(url: string) {
  const prompt = buildGlobalAnalysisPrompt(url);
  const text = await callGroq(prompt);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse global analysis");

  return JSON.parse(jsonMatch[0]);
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

    // Use streaming to send progress updates
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const sendEvent = async (data: object) => {
      await writer.write(
        encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
      );
    };

    // Run analysis in background
    (async () => {
      try {
        await sendEvent({ type: "step", step: "global", message: "Scanning website structure..." });

        const [globalData, beginnerReport, distractedReport, mobileReport] = await Promise.all([
          analyzeGlobal(normalizedUrl).catch(() => ({
            siteTitle: "Website",
            siteCategory: "Web Application",
            executiveSummary: "Analysis completed.",
            overallUXScore: 65,
            globalIssues: [],
            topRecommendations: [],
          })),
          (async () => {
            await sendEvent({ type: "step", step: "beginner", message: "Simulating beginner user..." });
            return analyzePersona(normalizedUrl, "beginner");
          })(),
          (async () => {
            await sendEvent({ type: "step", step: "distracted", message: "Simulating distracted user..." });
            return analyzePersona(normalizedUrl, "distracted");
          })(),
          (async () => {
            await sendEvent({ type: "step", step: "mobile", message: "Simulating mobile user..." });
            return analyzePersona(normalizedUrl, "mobile");
          })(),
        ]);

        const personas = [beginnerReport, distractedReport, mobileReport];
        const avgScore = personas.reduce((acc, p) => acc + p.overallScore, 0) / personas.length;

        const result: AnalysisResult = {
          url: normalizedUrl,
          analyzedAt: new Date().toISOString(),
          siteTitle: globalData.siteTitle,
          siteCategory: globalData.siteCategory,
          overallUXScore: Math.round(
            (globalData.overallUXScore * 0.4 + avgScore * 0.6)
          ),
          personas,
          globalIssues: globalData.globalIssues || [],
          topRecommendations: globalData.topRecommendations || [],
          executiveSummary: globalData.executiveSummary || "",
        };

        await sendEvent({ type: "complete", result });
      } catch (err) {
        await sendEvent({ type: "error", message: err instanceof Error ? err.message : "Analysis failed" });
      } finally {
        await writer.close();
      }
    })();

    return new NextResponse(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}