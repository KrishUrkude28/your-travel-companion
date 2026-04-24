import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Sparkles, MapPin, Clock, Wallet, Users, Heart, Loader2,
  Utensils, Check, CloudSun, Download, MessageCircle, PiggyBank, Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import DestinationAutocomplete from "@/components/DestinationAutocomplete";
import BudgetTracker from "@/components/BudgetTracker";
import { fetchDestinationWeather } from "@/utils/weatherPredictor";
import { generateWhatsAppLink, exportToPDF, uploadTripItinerary } from "@/utils/itineraryExport";
import PaymentModal from "@/components/PaymentModal";

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
  { key: "culture", label: "Culture & History" },
  { key: "adventure", label: "Adventure Sports" },
  { key: "beach", label: "Beach & Relaxation" },
  { key: "wildlife", label: "Wildlife" },
  { key: "food", label: "Food & Cuisine" },
  { key: "photography", label: "Photography" },
  { key: "shopping", label: "Shopping" },
  { key: "spiritual", label: "Spiritual & Wellness" },
  { key: "nightlife", label: "Nightlife" },
  { key: "family", label: "Family Activities" }
];

const TripPlanner = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [generating, setGenerating] = useState(false);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [weather, setWeather] = useState<{temp: number, desc: string} | null>(null);
  const [showBudget, setShowBudget] = useState(false);
  const [detectingLoc, setDetectingLoc] = useState(false);
  const [form, setForm] = useState({
    destination: "",
    duration: "",
    budget: "",
    travelers: "2",
    interests: [] as string[],
    requirements: "",
  });
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);

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
          prefs.some((p: string) => opt.label.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(opt.label.toLowerCase().split(" ")[0])),
        );
        if (matched.length > 0) {
          setForm((prev) => ({ ...prev, interests: Array.from(new Set([...prev.interests, ...matched.map(m => m.key)])) }));
          toast({ title: "Interests pre-filled", description: "Loaded from your profile preferences." });
        }
      }
      setPrefsLoaded(true);
    })();
  }, [user, prefsLoaded, toast]);

  const toggleInterest = (interestKey: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestKey)
        ? prev.interests.filter((i) => i !== interestKey)
        : [...prev.interests, interestKey],
    }));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || "";
          const country = data.address?.country || "";
          if (city) setForm(f => ({ ...f, destination: country ? `${city}, ${country}` : city }));
        } catch { /* silent */ } finally { setDetectingLoc(false); }
      },
      () => setDetectingLoc(false),
      { timeout: 5000 }
    );
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
      const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;
      if (!GROQ_KEY) {
        throw new Error("Please add VITE_GROQ_API_KEY to your .env file!");
      }

      const prompt = `System Identity: You are "TravelSathi AI," a specialized travel assistant for the Indian market. Your goal is to help both Indian citizens and foreigners explore India seamlessly.

Core Competencies:
1. AI Planner: Create detailed itineraries for Indian destinations (Manali, Goa, Kerala, etc.) including hidden gems and local transport logic (Auto-rickshaws, Metro, regional trains).
2. Support Center: Answer FAQs about bookings (Flights, Hotels, Buses, Guides). Focus strictly on India-based travel.
3. India Expert: Provide info on local permits (like Inner Line Permits for Ladakh), regional cuisines, and safety tips for foreigners.

Constraints:
- Focus strictly on India-based travel.
- If a user asks about Guide or Restaurant bookings, inform them these are upcoming features and ask for their location to provide recommendations.
- If you cannot resolve a support issue, provide the contact: hello@travelsathi.com.
- Use a helpful, professional, and culturally knowledgeable tone.

User Trip Request:
Destination: ${form.destination}
Duration: ${form.duration}  |  Budget: ${form.budget}  |  Travelers: ${form.travelers}
Interests: ${form.interests?.length > 0 ? form.interests.join(", ") : "General sightseeing"}
Special Requirements: ${form.requirements || "None"}

Return ONLY a valid JSON object (no markdown, no code fences) with this exact structure.
The content MUST be written in ${i18n.language === 'hi' ? 'Hindi' : 'English'}.
{
  "title": "Trip Title",
  "summary": "Brief 1-2 sentence overview of the trip",
  "duration": "${form.duration}",
  "estimatedBudget": "${form.budget}",
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1 Theme/Title",
      "description": "Detailed description of the day's events and places to visit",
      "meals": ["Breakfast spot", "Lunch spot", "Dinner spot"],
      "activities": ["Activity 1", "Activity 2", "Activity 3"],
      "accommodation": "Hotel/resort name"
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"]
}`;

      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are TravelSathi AI, an expert travel planner for India. Respond only in raw JSON."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4096,
          response_format: { type: "json_object" }
        }),
      });

      if (!groqRes.ok) {
        const errData = await groqRes.json().catch(() => ({}));
        if (groqRes.status === 401) {
          throw new Error("Invalid Groq API Key (401). Please check VITE_GROQ_API_KEY in your .env file.");
        }
        throw new Error(errData.error?.message || `Groq API Error: ${groqRes.statusText}`);
      }

      const groqData = await groqRes.json();
      if (!groqData.choices || !groqData.choices[0]) {
        throw new Error("Invalid response from Groq API.");
      }

      const text = groqData.choices[0].message.content;
      const cleanJsonText = text.replace(/```json|```/g, "").trim();
      const generatedPlan = JSON.parse(cleanJsonText);
      setPlan(generatedPlan);


      // Fetch Live Weather & Packing Predictor (Phase 2 Feature)
      const weatherData = await fetchDestinationWeather(form.destination);
      if (weatherData) {
        setWeather(weatherData);
      }

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

  const shareOnWhatsApp = () => {
    if (!plan) return;
    const mockTrip = { destination: form.destination, duration: form.duration };
    const link = generateWhatsAppLink(mockTrip, plan);
    window.open(link, '_blank');
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    if (!user || !plan) return;
    
    try {
      const budgetAmount = parseInt(plan.estimatedBudget.replace(/[^0-9]/g, "")) || 50000;
      
      const { data: bookingData, error: bookingError } = await supabase.from("bookings").insert({
        user_id: user.id,
        package_id: 'custom-ai-itinerary',
        package_title: `Custom AI Itinerary: ${plan.title}`,
        full_name: user.user_metadata?.full_name || "AI Planner User", 
        email: user.email || "user@example.com",
        phone: "Not provided",
        travelers: parseInt(form.travelers) || 1,
        travel_date: new Date().toISOString().split('T')[0],
        status: 'confirmed'
      }).select().single();

      if (bookingError) throw bookingError;

      const { error: paymentError } = await supabase.from("payments").insert({
        user_id: user.id,
        booking_id: bookingData.id,
        amount: budgetAmount,
        status: 'completed',
        razorpay_payment_id: paymentId
      });

      if (paymentError) throw paymentError;

      toast({ 
        title: "Booking Confirmed!", 
        description: "Your custom AI itinerary is now booked! Check your bookings dashboard." 
      });
    } catch (err: any) {
      toast({ title: "Booking Error", description: err.message || "Failed to finalize booking.", variant: "destructive" });
    }
  };

  const downloadAsPDF = async () => {
    if (!plan || !planRef.current) return;
    const blob = await exportToPDF(planRef.current, plan.title || "TravelSathi_Trip");
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(plan.title || "TravelSathi_Trip").replace(/\s+/g, '_')}.pdf`;
      a.click();
    }
  };

  const shareHostedPDF = async () => {
     if (!plan || !planRef.current || !user) {
        if (!user) toast({ title: "Login Required", description: "Please sign in to share PDF links." });
        return;
     }

     setUploadingPDF(true);
     try {
        const blob = await exportToPDF(planRef.current, plan.title || "TravelSathi_Trip");
        if (!blob) throw new Error("Failed to generate PDF");

        const publicUrl = await uploadTripItinerary(blob, (plan.title || "Trip").substring(0, 20), user.id);
        
        const message = `Check out my travel itinerary for ${form.destination} on TravelSathi! 🌍\n\n📄 View PDF: ${publicUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        
        toast({ title: "PDF Shared!", description: "WhatsApp opened with your itinerary link." });
     } catch (err: any) {
        toast({ title: "Sharing Error", description: "Could not host PDF. Using text-only sharing.", variant: "destructive" });
        shareOnWhatsApp();
     } finally {
        setUploadingPDF(false);
     }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-28 sm:pb-12">
      <div className="container mx-auto px-4 sm:px-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> {t("nav.back")}
          </Button>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            <Sparkles className="h-4 w-4" /> {t("nav.planner")}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
            {t("planner.title")}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("planner.subtitle", "Tell us your preferences and our AI will create a personalized day-by-day itinerary for you.")}
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
            {/* Destination + GPS */}
            <div>
              <Label htmlFor="dest" className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> {t("planner.destination")}</Label>
              <div className="flex gap-2 mt-1.5">
                <DestinationAutocomplete
                  id="dest"
                  value={form.destination}
                  onChange={(val) => setForm({ ...form, destination: val })}
                  placeholder={t("planner.dest_placeholder", "e.g. Rajasthan, Bali, Switzerland...")}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={detectLocation}
                  title="Use my location"
                  className="h-10 px-3 rounded-md border border-input bg-background hover:bg-muted flex items-center gap-1.5 text-sm text-muted-foreground transition-colors shrink-0"
                >
                  {detectingLoc ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dur" className="flex items-center gap-2"><Clock className="h-4 w-4 text-accent" /> {t("planner.duration")}</Label>
                <Input id="dur" placeholder={t("planner.dur_placeholder", "e.g. 5 days")} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required maxLength={50} />
              </div>
              <div>
                <Label htmlFor="budget" className="flex items-center gap-2"><Wallet className="h-4 w-4 text-accent" /> {t("planner.budget")}</Label>
                <Input id="budget" placeholder={t("planner.budget_placeholder", "e.g. ₹50,000")} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} required maxLength={50} />
              </div>
            </div>
            <div>
              <Label htmlFor="trav" className="flex items-center gap-2"><Users className="h-4 w-4 text-accent" /> {t("planner.travelers")}</Label>
              <Input id="trav" type="number" min={1} max={30} value={form.travelers} onChange={(e) => setForm({ ...form, travelers: e.target.value })} required />
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-2"><Heart className="h-4 w-4 text-accent" /> Interests</Label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => toggleInterest(opt.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      form.interests.includes(opt.key)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {t(`interests.${opt.key}`, opt.label)}
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
              <motion.div ref={planRef} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {/* Action buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button 
                    onClick={shareHostedPDF} 
                    disabled={uploadingPDF}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-70"
                  >
                    {uploadingPDF ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />} 
                    Share PDF Link
                  </button>
                  <button onClick={downloadAsPDF} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                    <Download className="h-4 w-4" /> Download PDF
                  </button>
                  <button onClick={() => setShowBudget(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 text-accent border border-accent/30 text-sm font-semibold hover:bg-accent/20 transition-colors">
                    <PiggyBank className="h-4 w-4" /> Track Budget
                  </button>
                  <button onClick={() => setShowPaymentModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors">
                    <Navigation className="h-4 w-4" /> Book this Itinerary
                  </button>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-elevated">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">{plan.title}</h2>
                  <p className="text-muted-foreground text-sm mb-4">{plan.summary}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-accent" /> {plan.duration}</span>
                    <span className="flex items-center gap-1"><Wallet className="h-4 w-4 text-accent" /> {plan.estimatedBudget}</span>
                    {weather && (
                      <span className="flex items-center gap-1 bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium shadow-sm">
                         <CloudSun className="h-4 w-4" /> {weather.temp}°C - {weather.desc}
                      </span>
                    )}
                  </div>
                  
                  {/* Phase 2 Feature: Auto-Rendered Maps Integration */}
                  <div className="w-full h-[250px] rounded-xl overflow-hidden shadow-inner border border-border">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(form.destination)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
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

      <AnimatePresence>
        {showBudget && plan && (
          <BudgetTracker
            destination={form.destination}
            budget={plan.estimatedBudget}
            days={plan.itinerary.length}
            onClose={() => setShowBudget(false)}
          />
        )}
      </AnimatePresence>

      {plan && (
        <PaymentModal 
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          amount={parseInt(plan.estimatedBudget.replace(/[^0-9]/g, "")) || 50000}
          title={plan.title}
        />
      )}
    </div>
  );
};

export default TripPlanner;
