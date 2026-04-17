import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform",
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

    const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_KEY) throw new Error("GEMINI_API_KEY is not configured in Supabase Secrets");

    const prompt = `You are TravelSathi's expert travel planner. Create a detailed travel itinerary.
Destination: ${destination}
Duration: ${duration}  |  Budget: ${budget}  |  Travelers: ${travelers}
Interests: ${interests?.length > 0 ? interests.join(", ") : "General sightseeing"}
Special Requirements: ${requirements || "None"}

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Trip Title",
  "summary": "Brief 1-2 sentence overview of the trip",
  "duration": "${duration}",
  "estimatedBudget": "${budget}",
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1 Theme/Title",
      "description": "Detailed description of the day's events",
      "meals": ["Breakfast spot", "Lunch spot", "Dinner spot"],
      "activities": ["Activity 1", "Activity 2"],
      "accommodation": "Hotel/resort name"
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}
`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    const text = data.candidates[0].content.parts[0].text;
    const cleanJsonText = text.replace(/```json|```/g, "").trim();
    const plan = JSON.parse(cleanJsonText);

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
