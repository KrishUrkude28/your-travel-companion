import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { destination, duration, budget, travelers, interests, requirements } = await req.json();

    if (!destination || !duration || !budget) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a professional travel planner. Generate detailed, realistic travel itineraries in JSON format.
Your response MUST be a valid JSON object with this exact structure:
{
  "title": "Trip title",
  "summary": "Brief 1-2 sentence overview",
  "duration": "X Days / Y Nights",
  "estimatedBudget": "₹XX,XXX - ₹XX,XXX per person",
  "itinerary": [
    {
      "day": 1,
      "title": "Day title",
      "description": "Detailed description of the day",
      "meals": ["Breakfast", "Lunch", "Dinner"],
      "activities": ["Activity 1", "Activity 2"],
      "accommodation": "Hotel/resort name or type"
    }
  ],
  "tips": ["Tip 1", "Tip 2"]
}
Include practical details: real place names, realistic timings, local cuisine recommendations, and transportation between locations.`;

    const userPrompt = `Create a travel itinerary for:
- Destination: ${destination}
- Duration: ${duration}
- Budget: ${budget}
- Number of travelers: ${travelers}
- Interests: ${interests?.length > 0 ? interests.join(", ") : "General sightseeing"}
- Special requirements: ${requirements || "None"}

Make it detailed, practical, and personalized to the interests provided.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_itinerary",
              description: "Generate a structured travel itinerary",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  duration: { type: "string" },
                  estimatedBudget: { type: "string" },
                  itinerary: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        day: { type: "number" },
                        title: { type: "string" },
                        description: { type: "string" },
                        meals: { type: "array", items: { type: "string" } },
                        activities: { type: "array", items: { type: "string" } },
                        accommodation: { type: "string" },
                      },
                      required: ["day", "title", "description", "meals", "activities", "accommodation"],
                    },
                  },
                  tips: { type: "array", items: { type: "string" } },
                },
                required: ["title", "summary", "duration", "estimatedBudget", "itinerary", "tips"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_itinerary" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "AI is busy, please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate itinerary");
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("No structured output from AI");
    }

    const plan = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ plan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-itinerary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
