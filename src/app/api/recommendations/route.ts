import { NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";
import type { ListingDoc } from "@/types";

const EXPRESS_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchListings(
  category?: string,
  limit = 12,
): Promise<ListingDoc[]> {
  if (!EXPRESS_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const params = new URLSearchParams();
  if (category) params.set("category", category);
  params.set("limit", String(limit));

  const res = await fetch(
    `${EXPRESS_URL}/api/listings${params.toString() ? `?${params.toString()}` : ""}`,
    { signal: AbortSignal.timeout(5000) },
  );

  if (!res.ok) {
    throw new Error(`Express API error: ${res.status}`);
  }

  const data = await res.json();
  return data.listings ?? [];
}

export async function POST(request: Request) {
  try {
    const { category, listingId, limit = 6 } = await request.json();

    const candidates = await fetchListings(category, limit + 5);

    const filtered = candidates.filter((l) => l._id !== listingId).slice(0, limit);

    if (filtered.length === 0) {
      return NextResponse.json({ recommendations: [] });
    }

    // Plain-code scoring — sort by rating descending, then pick top
    const scored = filtered.sort(
      (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
    );
    const top = scored.slice(0, limit);

    // Ask Groq only for the reason text per suggestion
    const gearLines = top
      .map(
        (l, i) =>
          `${i + 1}. "${l.title}" — ${l.shortDescription.slice(0, 80)}`,
      )
      .join("\n");

    const prompt = `Given these outdoor gear items, write ONE short sentence per item explaining why someone renting outdoor gear might also be interested. Be specific and practical.

${gearLines}

Return exactly one sentence per item, each on a new line, numbered 1–${top.length}. Keep each sentence under 20 words.`;

    let reasons: string[] = [];
    try {
      const text = await callGroq(prompt, {
        systemPrompt:
          "You are a helpful gear recommendation assistant for an outdoor rental marketplace.",
        temperature: 0.5,
        maxTokens: 300,
      });

      reasons = text
        .split("\n")
        .filter((line) => /^\d+\./.test(line.trim()))
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean);
    } catch {
      // Groq failure — return recommendations without reason text
      reasons = [];
    }

    const recommendations = top.map((listing, i) => ({
      listing,
      reason: reasons[i] ?? "",
    }));

    return NextResponse.json({ recommendations });
  } catch (err) {
    console.error("[AI Recommendations] Error:", err);
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("GROQ_API_KEY") || msg.includes("API key")) {
      return NextResponse.json(
        { error: "Recommendations unavailable — GROQ_API_KEY is missing or invalid" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { error: "Recommendations unavailable right now — try again" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
