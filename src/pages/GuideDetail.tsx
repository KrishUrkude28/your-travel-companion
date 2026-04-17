import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Star, ShieldCheck, CalendarCheck, IndianRupee, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Guide {
  id: string;
  name: string;
  city: string;
  bio: string;
  specialities: string[];
  languages: string[];
  price_half_day: number;
  price_full_day: number;
  rating: number;
  review_count: number;
  photo_url: string;
  is_verified: boolean;
}

// Fallback mock guide matching the listing ID's
const mockProfiles: Record<string, Guide> = {
  "1": {
    id: "1", name: "Rahul Sharma", city: "Jaipur", rating: 4.8, review_count: 124, languages: ["English", "Hindi", "French"], price_half_day: 1500, price_full_day: 2500, photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    bio: "I am a historian and passionate storyteller born and raised in Jaipur. I specialize in heritage walks, architecture tours, and local culinary experiences.",
    specialities: ["History", "Architecture", "Food"], is_verified: true,
  },
  "2": {
    id: "2", name: "Priya Patel", city: "Mumbai", rating: 4.9, review_count: 89, languages: ["English", "Hindi", "Marathi"], price_half_day: 1800, price_full_day: 3000, photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    bio: "Explore the bustling streets of Mumbai with me. From Bollywood tours to the hidden street food gems of Mohammad Ali Road. I'll show you the real Mumbai.",
    specialities: ["Street Food", "Bollywood", "Culture"], is_verified: true,
  },
  "3": {
    id: "3", name: "Arun Kumar", city: "Kerala", rating: 4.7, review_count: 56, languages: ["English", "Malayalam"], price_half_day: 1200, price_full_day: 2200, photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    bio: "Certified nature guide specializing in the backwaters and tea plantations of Kerala. Let me show you God's Own Country in its purest form.",
    specialities: ["Nature", "Trekking", "Wildlife"], is_verified: false,
  }
};

const GuideDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [guide, setGuide] = useState<Guide | null>(null);

  useEffect(() => {
    const fetchGuide = async () => {
      // simulate network request
      const { data, error } = await supabase.from("guides").select("*").eq("id", id).maybeSingle();
      if (data) {
        setGuide(data as Guide);
      } else {
        setGuide(mockProfiles[id || "1"] || mockProfiles["1"]);
      }
    };
    fetchGuide();
  }, [id]);

  const handleBooking = () => {
    if (!user) {
      toast({ title: "Login required", description: "Please sign in to book a guide.", variant: "destructive" });
      navigate("/auth");
      return;
    }
    // In a real app we would create a booking record first. For PRD payment flow, we'll route to payment mock.
    // Assuming we generate a mock booking ID for the payment page
    const mockBookingId = "booking-" + Math.random().toString(36).substring(7);
    navigate(`/payment/${mockBookingId}`);
  };

  if (!guide) return <div className="pt-32 text-center">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-6">
        <Link to="/guides">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Guides
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <img 
                src={guide.photo_url} 
                alt={guide.name}
                className="w-48 h-48 rounded-2xl object-cover shadow-elevated"
              />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-display text-3xl font-bold text-foreground">{guide.name}</h1>
                  {guide.is_verified && <ShieldCheck className="h-6 w-6 text-primary" />}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" /> {guide.city}
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 text-accent fill-accent" />
                    <span className="font-semibold text-accent">{guide.rating} <span className="text-muted-foreground font-normal">({guide.review_count} reviews)</span></span>
                  </div>
                </div>
                <p className="text-foreground leading-relaxed">{guide.bio}</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
              <h3 className="font-display text-xl font-bold mb-4">Expertise</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Specialities</h4>
                  <div className="flex flex-wrap gap-2">
                    {guide.specialities.map(spec => (
                      <span key={spec} className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">{spec}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {guide.languages.map(lang => (
                      <span key={lang} className="px-3 py-1 bg-muted text-muted-foreground text-sm font-medium rounded-full">{lang}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 shadow-elevated border-2 border-primary/20 sticky top-24">
              <h3 className="font-display text-2xl font-bold mb-6">Book this Guide</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-3 rounded-lg border border-border hover:border-primary cursor-pointer transition-colors">
                  <div>
                    <h4 className="font-semibold">Half Day</h4>
                    <p className="text-sm text-muted-foreground">Up to 4 hours</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold flex items-center justify-end"><IndianRupee className="h-4 w-4" />{guide.price_half_day}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border-2 border-primary bg-primary/5 cursor-pointer transition-colors">
                  <div>
                    <h4 className="font-semibold text-primary">Full Day</h4>
                    <p className="text-sm text-muted-foreground">Up to 8 hours</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold flex items-center justify-end text-primary"><IndianRupee className="h-4 w-4" />{guide.price_full_day}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={handleBooking} className="w-full bg-primary text-primary-foreground" size="lg">
                  <CalendarCheck className="h-4 w-4 mr-2" /> Book Now
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <MessageCircle className="h-4 w-4 mr-2" /> Message Guide
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                You won't be charged yet. Payment is secure with Razorpay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;
