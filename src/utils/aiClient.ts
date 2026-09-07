interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqChatOptions {
  messages: GroqMessage[];
  temperature?: number;
  max_tokens?: number;
}

const FALLBACK_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "groq/compound",
  "groq/compound-mini",
  "qwen/qwen3.6-27b",
  "llama-3.3-70b-versatile",
];

export async function generateGroqCompletion(options: GroqChatOptions): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Groq API key is missing. Please check VITE_GROQ_API_KEY in your .env file.");
  }

  let lastErrorMessage = "";

  for (const model of FALLBACK_MODELS) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: options.messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.max_tokens ?? 2048,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return content;
        }
      }

      const errData = await res.json().catch(() => ({}));
      lastErrorMessage = errData.error?.message || `Groq error: ${res.statusText} (${res.status})`;

      // If invalid API key, fail immediately without retrying other models
      if (res.status === 401) {
        throw new Error("Invalid Groq API Key (401). Please check VITE_GROQ_API_KEY in your .env file.");
      }
    } catch (e: any) {
      if (e.message?.includes("Invalid Groq API Key")) {
        throw e;
      }
      lastErrorMessage = e.message || String(e);
    }
  }

  throw new Error(lastErrorMessage || "Failed to generate AI response. Please try again.");
}
