"use client";

import { useAnalysis } from "@/lib/useAnalysis";
import HeroSection from "@/components/layout/HeroSection";
import SimulationProgress from "@/components/simulation/SimulationProgress";
import ResultsDashboard from "@/components/simulation/ResultsDashboard";
import ErrorState from "@/components/ui/ErrorState";

export default function Home() {
  const { state, steps, analyze, reset } = useAnalysis();

  if (state.status === "error") {
    return (
      <ErrorState
        message={state.error ?? "Something went wrong."}
        onRetry={reset}
      />
    );
  }

  if (state.status === "complete" && state.result) {
    return (
      <ResultsDashboard
        result={state.result}
        onReset={reset}
      />
    );
  }

  if (state.status === "loading" || state.status === "streaming") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <SimulationProgress
          steps={steps}
          currentStep={state.currentStep}
          url={state.url}
        />
      </div>
    );
  }

  return (
    <HeroSection
      onSubmit={analyze}
      isLoading={false}
    />
  );
}
