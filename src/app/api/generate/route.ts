import { NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const { bulletPoints, length = "medium" } = await request.json();

    if (!bulletPoints || typeof bulletPoints !== "string" || !bulletPoints.trim()) {
      return NextResponse.json(
        { error: "Bullet points are required" },
        { status: 400 },
      );
    }

    if (!["short", "medium", "long"].includes(length)) {
      return NextResponse.json(
        { error: "Length must be 'short', 'medium', or 'long'" },
        { status: 400 },
      );
    }

    const lengthGuides: Record<string, string> = {
      short: "Write a concise 2–3 sentence description highlighting the most important features.",
      medium:
        "Write a detailed 4–6 sentence description covering features, condition, ideal use cases, and what's included.",
      long: "Write a comprehensive description of 7–10 sentences covering all features, condition, ideal users, what's included, and why this gear stands out.",
    };

    const prompt = `You are an expert outdoor-gear copywriter. Write a compelling rental listing description based on these bullet points:

${bulletPoints.trim()}

${lengthGuides[length]}

After the description, suggest 3–5 relevant search tags as a JSON array of strings.

Format your response like this:
DESCRIPTION:
<your description here>

TAGS:
["tag1", "tag2", "tag3"]`;

    const text = await callGroq(prompt, {
      systemPrompt: "You are an expert outdoor-gear copywriter for a rental marketplace.",
      temperature: 0.7,
      maxTokens: length === "short" ? 500 : length === "medium" ? 1000 : 1500,
    });

    const descMatch = text.match(/DESCRIPTION:\s*([\s\S]*?)(?:\n\s*TAGS:|$)/);
    const tagsMatch = text.match(/TAGS:\s*(\[[\s\S]*?\])\s*$/);

    const description = descMatch?.[1]?.trim() || text;
    let tags: string[] = [];

    if (tagsMatch) {
      try {
        const parsed = JSON.parse(tagsMatch[1]);
        if (Array.isArray(parsed)) {
          tags = parsed.filter((t): t is string => typeof t === "string").slice(0, 8);
        }
      } catch {
        tags = [];
      }
    }

    return NextResponse.json({ description, tags });
  } catch (err) {
    console.error("[AI Generate] Error:", err);
    const msg =
      err instanceof Error ? err.message : "Generation failed";
    if (msg.includes("GROQ_API_KEY") || msg.includes("API key")) {
      return NextResponse.json(
        { error: "AI suggestions unavailable — GROQ_API_KEY is missing or invalid" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { error: "AI suggestions unavailable right now — try again" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
