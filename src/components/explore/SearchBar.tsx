"use client";

import { useState } from "react";

interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
}

export default function SearchBar({ value, onSearch }: SearchBarProps) {
  const [input, setInput] = useState(value);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(input.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center pl-4 text-muted">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search gear by name, description, or tag..."
        className="flex-1 px-3 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none"
      />
      <button
        type="submit"
        className="bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
      >
        Search
      </button>
    </form>
  );
}
