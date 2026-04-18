import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Calendar, Clock, MapPin, Wallet, ArrowRight, Loader2, ListTree,
  ChevronDown, ChevronUp, Trash2, Plane, Utensils, Hotel, Sun
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DayActivity {
  time?: string;
  activity: string;
  description?: string;
}

interface ItineraryDay {
  day: number;
  title?: string;
  activities?: DayActivity[] | string[];
}

interface GeneratedItinerary {
  title?: string;
  summary?: string;
  days?: ItineraryDay[];
  highlights?: string[];
  tips?: string[];
}

interface Trip {
  id: string;
  destination: string;
  duration: string;
  budget: string;
  interests?: string[];
  created_at: string;
  generated_itinerary: GeneratedItinerary;
}

const DAY_ICONS = [Sun, Plane, Hotel, Utensils, MapPin, Sparkles];

// Strip markdown bold/italic/headers from AI-generated text
const stripMarkdown = (text: string) =>
  text
    .replace(/\*\*([^*]+)\*\*/g, "$1")  // **bold**
    .replace(/\*([^*]+)\*/g, "$1")       // *italic*
    .replace(/^#+\s*/gm, "")             // ## headers
    .trim();

const SavedTrips = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchTrips = async () => {
      const { data, error } = await supabase
        .from("trip_plans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) setTrips(data as Trip[]);
      setLoading(false);
    };
    fetchTrips();
  }, [user]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("trip_plans").delete().eq("id", id);
    setDeletingId(null);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setTrips((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Trip deleted", description: "The itinerary has been removed." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 text-accent rounded-xl">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">My Saved AI Trips</h1>
              <p className="text-muted-foreground text-sm">{trips.length} itinerar{trips.length === 1 ? "y" : "ies"} saved</p>
            </div>
          </div>
          <Link to="/trip-planner">
            <Button className="bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4 mr-2" /> Plan New Trip
            </Button>
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center text-center shadow-sm">
            <ListTree className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No trips planned yet</h2>
            <p className="text-muted-foreground mb-6">Use the AI Trip Planner to generate and save your first itinerary.</p>
            <Link to="/trip-planner">
              <Button size="lg" className="bg-primary text-primary-foreground font-bold">
                <Sparkles className="h-4 w-4 mr-2" /> Start Planning Now
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {trips.map((trip, idx) => {
              const isExpanded = expandedId === trip.id;
              const itinerary = trip.generated_itinerary || {};
              const days: ItineraryDay[] = itinerary.days || [];

              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Card Header */}
                  <div
                    className="p-5 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : trip.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display text-xl font-bold truncate">{trip.destination}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mt-0.5">
                            {itinerary.summary || `A ${trip.duration} journey with ${trip.interests?.length || 0} interests`}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{trip.duration}</span>
                            <span className="flex items-center gap-1"><Wallet className="h-3.5 w-3.5" />{trip.budget}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(trip.created_at).toLocaleDateString("en-IN")}</span>
                            {trip.interests && trip.interests.length > 0 && (
                              <span className="flex items-center gap-1 text-accent">
                                <Sparkles className="h-3.5 w-3.5" />{trip.interests.slice(0, 2).join(", ")}{trip.interests.length > 2 ? " +" + (trip.interests.length - 2) : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(trip.id); }}
                          disabled={deletingId === trip.id}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Delete trip"
                        >
                          {deletingId === trip.id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Trash2 className="h-4 w-4" />}
                        </button>
                        <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Itinerary */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border">
                          {/* Full Itinerary Title */}
                          {itinerary.title && (
                            <div className="px-5 py-4 bg-gradient-to-r from-primary/5 to-accent/5">
                              <p className="text-sm font-semibold text-primary">{itinerary.title}</p>
                            </div>
                          )}

                          {/* Day-by-day breakdown */}
                          {days.length > 0 && (
                            <div className="px-5 py-4 space-y-4">
                              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Day-by-Day Itinerary</h4>
                              {days.map((d, di) => {
                                const DayIcon = DAY_ICONS[di % DAY_ICONS.length];
                                return (
                                  <div key={di} className="flex gap-3">
                                    <div className="shrink-0 flex flex-col items-center">
                                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                        {d.day || di + 1}
                                      </div>
                                      {di < days.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                                    </div>
                                    <div className="pb-4 min-w-0">
                                      <p className="font-semibold text-sm mb-1">{d.title || `Day ${d.day || di + 1}`}</p>
                                      {Array.isArray(d.activities) && d.activities.map((act, ai) => (
                                        <div key={ai} className="text-sm text-muted-foreground flex items-start gap-2 mt-1.5">
                                          <DayIcon className="h-3.5 w-3.5 mt-0.5 shrink-0 text-accent" />
                                          <span>
                                            {typeof act === "string"
                                              ? act
                                              : `${act.time ? `[${act.time}] ` : ""}${act.activity}${act.description ? ` — ${act.description}` : ""}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Highlights */}
                          {itinerary.highlights && itinerary.highlights.length > 0 && (
                            <div className="px-5 pb-4">
                              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Highlights</h4>
                              <div className="flex flex-wrap gap-2">
                                {itinerary.highlights.map((h, i) => (
                                  <span key={i} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                                    ✨ {h}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tips */}
                          {itinerary.tips && itinerary.tips.length > 0 && (
                            <div className="px-5 pb-4">
                              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Travel Tips</h4>
                              <ul className="space-y-1.5">
                                {itinerary.tips.map((tip, i) => (
                                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <span className="text-primary shrink-0">💡</span>{tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Raw summary fallback when no structure */}
                          {days.length === 0 && !itinerary.highlights && (
                            <div className="px-5 py-4">
                              <p className="text-sm text-muted-foreground whitespace-pre-line">{itinerary.summary || "No detailed itinerary data available."}</p>
                            </div>
                          )}

                          {/* Footer actions */}
                          <div className="px-5 py-4 border-t border-border flex gap-3">
                            <Link to="/trip-planner" className="flex-1">
                              <Button variant="outline" className="w-full group hover:bg-primary hover:text-primary-foreground border-primary/20">
                                Generate Similar <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTrips;
