const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface GroqOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function callGroq(
  prompt: string,
  options: GroqOptions = {},
): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content:
            options.systemPrompt ??
            "You are a helpful assistant for an outdoor gear marketplace.",
        },
        { role: "user", content: prompt },
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1000,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Groq API error (${res.status}): ${text || res.statusText}`,
    );
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}
