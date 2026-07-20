"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  }

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl bg-card border border-border px-6 py-12 text-center shadow-sm sm:px-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Stay in the loop
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Get the best gear deals, seasonal rental tips, and new listings
            delivered to your inbox every week.
          </p>

          {submitted ? (
            <p className="mt-6 text-sm font-medium text-success">
              You&apos;re subscribed! Check your inbox for a welcome email.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-6 flex max-w-sm overflow-hidden rounded-xl border border-border bg-background shadow-sm"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="mt-3 text-xs text-muted">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
