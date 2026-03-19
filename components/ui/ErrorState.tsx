"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card p-8 max-w-md w-full text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <AlertTriangle size={28} color="#ef4444" />
        </div>

        <h2
          className="text-xl font-bold mb-2"
          style={{ color: "var(--color-text)" }}
        >
          Analysis Failed
        </h2>

        <p
          className="text-sm mb-6 leading-relaxed"
          style={{ color: "var(--color-text-dim)" }}
        >
          {message}
        </p>

        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} />
            Try Again
          </button>

          <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
            Make sure you have a valid{" "}
            <code
              className="px-1 py-0.5 rounded"
              style={{ background: "var(--color-border)", color: "var(--color-accent)" }}
            >
              GROQ_API_KEY
            </code>{" "}
            set in your <code style={{ color: "var(--color-accent)" }}>.env.local</code> file.
            Get a free key at{" "}
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--color-accent)", textDecoration: "underline" }}
            >
              console.groq.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}