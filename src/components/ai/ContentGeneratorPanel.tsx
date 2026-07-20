"use client";

import { useState, useCallback } from "react";

interface Generation {
  description: string;
  tags: string[];
}

interface ContentGeneratorPanelProps {
  onGenerate: (description: string, tags: string[]) => void;
}

export default function ContentGeneratorPanel({
  onGenerate,
}: ContentGeneratorPanelProps) {
  const [bulletPoints, setBulletPoints] = useState("");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!bulletPoints.trim()) return;

    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bulletPoints: bulletPoints.trim(),
          length,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Generation failed");
      }

      const newGen: Generation = {
        description: data.description,
        tags: Array.isArray(data.tags) ? data.tags : [],
      };

      const updated = [...generations, newGen].slice(-3);
      setGenerations(updated);
      const idx = updated.length - 1;
      setSelectedIndex(idx);
      onGenerate(newGen.description, newGen.tags);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  }, [bulletPoints, length, generations, onGenerate]);

  function handleSelect(index: number) {
    setSelectedIndex(index);
    onGenerate(generations[index].description, generations[index].tags);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-1 flex items-center gap-2">
        <svg
          className="h-4 w-4 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>
        <h4 className="text-sm font-semibold text-foreground">
          AI Content Generator
        </h4>
      </div>
      <p className="mb-3 text-xs text-muted">
        Describe your gear in a few bullet points, then let AI draft a polished
        description and suggest tags.
      </p>

      <textarea
        value={bulletPoints}
        onChange={(e) => setBulletPoints(e.target.value)}
        placeholder={`• Lightweight 2-person tent\n• Sets up in under 5 minutes\n• Waterproof rainfly included\n• Used twice, excellent condition`}
        rows={3}
        className="w-full resize-y rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <select
          value={length}
          onChange={(e) =>
            setLength(e.target.value as "short" | "medium" | "long")
          }
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating || !bulletPoints.trim()}
          className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {generating
            ? "Generating…"
            : generations.length > 0
              ? "Regenerate"
              : "Generate Description"}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      {generations.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-xs text-muted">Pick a version:</p>
          <div className="flex flex-wrap gap-2">
            {generations.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(i)}
                className={`rounded-lg border px-3 py-1 text-xs transition-colors ${
                  selectedIndex === i
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted hover:border-primary/40"
                }`}
              >
                v{i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
