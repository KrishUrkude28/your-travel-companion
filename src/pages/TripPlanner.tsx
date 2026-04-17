import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Sparkles, MapPin, Clock, Wallet, Users, Heart, Loader2,
  Utensils, Calendar, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";


interface GeneratedDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
  activities: string[];
  accommodation: string;
}

interface GeneratedPlan {
  title: string;
  summary: string;
  duration: string;
  estimatedBudget: string;
  itinerary: GeneratedDay[];
  tips: string[];
}

const interestOptions = [
  "Culture & History", "Adventure Sports", "Beach & Relaxation", "Wildlife",
  "Food & Cuisine", "Photography", "Shopping", "Spiritual & Wellness",
  "Nightlife", "Family Activities"
];

const TripPlanner = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [form, setForm] = useState({
    destination: "",
    duration: "",
    budget: "",
    travelers: "2",
    interests: [] as string[],
    requirements: "",
  });
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  // Prefill interests from saved travel preferences
  useEffect(() => {
    if (!user || prefsLoaded) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("travel_preferences")
        .eq("user_id", user.id)
        .maybeSingle();
      const prefs = data?.travel_preferences ?? [];
      if (prefs.length > 0) {
        // Map saved preferences to matching interest options (case-insensitive substring match)
        const matched = interestOptions.filter((opt) =>
          prefs.some((p: string) => opt.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(opt.toLowerCase().split(" ")[0])),
        );
        if (matched.length > 0) {
          setForm((prev) => ({ ...prev, interests: Array.from(new Set([...prev.interests, ...matched])) }));
          toast({ title: "Interests pre-filled", description: "Loaded from your profile preferences." });
        }
      }
      setPrefsLoaded(true);
    })();
  }, [user, prefsLoaded, toast]);

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to use the AI planner.", variant: "destructive" });
      navigate("/auth");
      return;
    }

    setGenerating(true);
    setPlan(null);

    try {
      const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      if (!GEMINI_KEY) {
        throw new Error("Please add VITE_GEMINI_API_KEY to your .env file!");
      }

      const prompt = `You are TravelSathi's expert travel planner. Create a detailed travel itinerary.
Destination: ${form.destination}
Duration: ${form.duration}  |  Budget: ${form.budget}  |  Travelers: ${form.travelers}
Interests: ${form.interests?.length > 0 ? form.interests.join(", ") : "General sightseeing"}
Special Requirements: ${form.requirements || "None"}

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Trip Title",
  "summary": "Brief 1-2 sentence overview of the trip",
  "duration": "${form.duration}",
  "estimatedBudget": "${form.budget}",
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
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      const geminiData = await res.json();
      if (geminiData.error) throw new Error(geminiData.error.message);

      const text = geminiData.candidates[0].content.parts[0].text;
      const cleanJsonText = text.replace(/```json|```/g, "").trim();
      const generatedPlan = JSON.parse(cleanJsonText);
      setPlan(generatedPlan);

      // Save to DB
      await supabase.from("trip_plans").insert({
        user_id: user.id,
        destination: form.destination,
        duration: form.duration,
        budget: form.budget,
        travelers: Number(form.travelers),
        interests: form.interests,
        requirements: form.requirements,
        generated_itinerary: generatedPlan,
      });
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Button>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            <Sparkles className="h-4 w-4" /> AI-Powered Trip Planner
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
            Plan Your Dream Trip
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tell us your preferences and our AI will create a personalized day-by-day itinerary for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleGenerate}
            className="bg-card rounded-2xl p-8 shadow-elevated space-y-5"
          >
            <div>
              <Label htmlFor="dest" className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> Destination</Label>
              <Input id="dest" placeholder="e.g. Rajasthan, Bali, Switzerland..." value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required maxLength={200} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dur" className="flex items-center gap-2"><Clock className="h-4 w-4 text-accent" /> Duration</Label>
                <Input id="dur" placeholder="e.g. 5 days" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required maxLength={50} />
              </div>
              <div>
                <Label htmlFor="budget" className="flex items-center gap-2"><Wallet className="h-4 w-4 text-accent" /> Budget</Label>
                <Input id="budget" placeholder="e.g. ₹50,000" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} required maxLength={50} />
              </div>
            </div>
            <div>
              <Label htmlFor="trav" className="flex items-center gap-2"><Users className="h-4 w-4 text-accent" /> Travelers</Label>
              <Input id="trav" type="number" min={1} max={30} value={form.travelers} onChange={(e) => setForm({ ...form, travelers: e.target.value })} required />
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-2"><Heart className="h-4 w-4 text-accent" /> Interests</Label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      form.interests.includes(interest)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="req">Special Requirements</Label>
              <Textarea
                id="req"
                placeholder="Dietary restrictions, accessibility needs, must-visit places..."
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                maxLength={500}
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground" size="lg" disabled={generating}>
              {generating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4 mr-2" /> Generate Itinerary</>}
            </Button>
          </motion.form>

          {/* Result */}
          <div>
            {generating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium">Crafting your perfect itinerary...</p>
              </motion.div>
            )}

            {plan && !generating && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="bg-card rounded-2xl p-6 shadow-elevated">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">{plan.title}</h2>
                  <p className="text-muted-foreground text-sm mb-4">{plan.summary}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-accent" /> {plan.duration}</span>
                    <span className="flex items-center gap-1"><Wallet className="h-4 w-4 text-accent" /> {plan.estimatedBudget}</span>
                  </div>
                </div>

                {plan.itinerary.map((day) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: day.day * 0.05 }}
                    className="bg-card rounded-xl p-5 shadow-card"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                        {day.day}
                      </span>
                      <h3 className="font-display font-semibold text-foreground">{day.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{day.description}</p>
                    {day.activities.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-semibold text-foreground mb-1">Activities:</p>
                        <ul className="space-y-1">
                          {day.activities.map((act, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <Check className="h-3 w-3 text-primary shrink-0 mt-0.5" /> {act}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Utensils className="h-3 w-3 text-accent" /> {day.meals.join(" • ")}</span>
                      {day.accommodation && <span>🏨 {day.accommodation}</span>}
                    </div>
                  </motion.div>
                ))}

                {plan.tips.length > 0 && (
                  <div className="bg-accent/10 rounded-xl p-5">
                    <h3 className="font-display font-bold text-foreground mb-3">💡 Travel Tips</h3>
                    <ul className="space-y-2">
                      {plan.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-accent">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {!plan && !generating && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Sparkles className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Fill in your preferences and generate a custom itinerary</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
