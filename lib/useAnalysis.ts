"use client";

import { useState, useCallback, useRef } from "react";
import type { AnalysisState, AnalysisResult, SimulationStep } from "@/types";

const INITIAL_STEPS: SimulationStep[] = [
  {
    persona: "beginner",
    label: "Beginner User",
    description: "Simulating first-time visitor with low tech literacy",
    done: false,
  },
  {
    persona: "distracted",
    label: "Distracted User",
    description: "Simulating multitasking user with short attention span",
    done: false,
  },
  {
    persona: "mobile",
    label: "Mobile User",
    description: "Simulating smartphone user on small screen",
    done: false,
  },
];

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    status: "idle",
    url: "",
    currentStep: "",
    progress: 0,
    result: null,
    error: null,
  });

  const [steps, setSteps] = useState<SimulationStep[]>(INITIAL_STEPS);
  const abortRef = useRef<AbortController | null>(null);

  const analyze = useCallback(async (url: string) => {
    // Abort any existing request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    // Reset steps
    setSteps(INITIAL_STEPS.map((s) => ({ ...s, done: false })));

    setState({
      status: "loading",
      url,
      currentStep: "Connecting to analysis engine...",
      progress: 0,
      result: null,
      error: null,
    });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Server error" }));
        throw new Error(err.error || `HTTP ${response.status}`);
      }

      if (!response.body) throw new Error("No response stream");

      setState((prev) => ({ ...prev, status: "streaming" }));

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          try {
            const event = JSON.parse(raw);

            if (event.type === "step") {
              const persona = event.step;
              setState((prev) => ({
                ...prev,
                currentStep: event.message,
                progress: prev.progress + 25,
              }));

              // Mark previous persona as done
              setSteps((prev) =>
                prev.map((s) => {
                  if (
                    persona === "beginner" && s.persona === "beginner"
                  ) return { ...s, done: false };
                  if (
                    persona === "distracted" && s.persona === "beginner"
                  ) return { ...s, done: true };
                  if (
                    persona === "mobile" && s.persona !== "mobile"
                  ) return { ...s, done: true };
                  return s;
                })
              );
            }

            if (event.type === "complete") {
              const result: AnalysisResult = event.result;
              setSteps((prev) => prev.map((s) => ({ ...s, done: true })));
              setState({
                status: "complete",
                url,
                currentStep: "Analysis complete",
                progress: 100,
                result,
                error: null,
              });
            }

            if (event.type === "error") {
              throw new Error(event.message);
            }
          } catch (parseErr) {
            if (parseErr instanceof SyntaxError) continue;
            throw parseErr;
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;

      setState((prev) => ({
        ...prev,
        status: "error",
        error:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred. Please try again.",
      }));
    }
  }, []);

  const reset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setSteps(INITIAL_STEPS.map((s) => ({ ...s, done: false })));
    setState({
      status: "idle",
      url: "",
      currentStep: "",
      progress: 0,
      result: null,
      error: null,
    });
  }, []);

  return { state, steps, analyze, reset };
}
