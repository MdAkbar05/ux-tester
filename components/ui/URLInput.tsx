"use client";

import { useState, useRef } from "react";
import { isValidUrl, normalizeUrl } from "@/lib/utils";
import { Globe, ArrowRight, Zap } from "lucide-react";

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const EXAMPLE_URLS = [
  "stripe.com",
  "github.com",
  "notion.so",
  "airbnb.com",
  "figma.com",
];

export default function URLInput({ onSubmit, isLoading }: URLInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();

    if (!trimmed) {
      setError("Please enter a URL");
      return;
    }

    if (!isValidUrl(trimmed)) {
      setError("Please enter a valid URL (e.g. stripe.com)");
      return;
    }

    setError("");
    onSubmit(normalizeUrl(trimmed));
  };

  const handleExample = (example: string) => {
    setUrl(example);
    setError("");
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Main input */}
        <div className="relative group">
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <Globe
              size={18}
              style={{ color: error ? "#ef4444" : "var(--color-accent)" }}
            />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            placeholder="Enter website URL (e.g. stripe.com)"
            className="input-field w-full pl-11 pr-36 py-4 text-base"
            disabled={isLoading}
            autoComplete="off"
            spellCheck={false}
          />

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="btn-primary absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2.5 text-sm"
          >
            {isLoading ? (
              <>
                <span
                  className="w-3 h-3 rounded-full border-2 animate-spin"
                  style={{
                    borderColor: "var(--color-void)",
                    borderTopColor: "transparent",
                  }}
                />
                Analyzing...
              </>
            ) : (
              <>
                <Zap size={14} />
                Run Test
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-sm flex items-center gap-1.5" style={{ color: "#ef4444" }}>
            <span>⚠</span> {error}
          </p>
        )}

        {/* Example URLs */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>
            Try:
          </span>
          {EXAMPLE_URLS.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => handleExample(example)}
              disabled={isLoading}
              className="text-xs px-2.5 py-1 rounded-full transition-colors"
              style={{
                color: "var(--color-accent-dim)",
                border: "1px solid rgba(0,229,255,0.2)",
                background: "rgba(0,229,255,0.04)",
              }}
            >
              {example}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
