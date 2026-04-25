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
  
  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchGuideAndReviews = async () => {
      // Fetch guide
      const { data } = await supabase.from("guides").select("*").eq("id", id).maybeSingle();
      if (data) {
        setGuide(data as Guide);
      } else {
        setGuide(mockProfiles[id || "1"] || mockProfiles["1"]);
      }

      // Fetch reviews
      const { data: reviewData } = await supabase
        .from("reviews")
        .select(`*, profiles(display_name, avatar_url)`)
        .eq("guide_id", id)
        .order("created_at", { ascending: false });
      
      if (reviewData) {
        setReviews(reviewData);
      }
    };
    fetchGuideAndReviews();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!user) return;
    setIsSubmittingReview(true);
    
    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          guide_id: id,
          user_id: user.id, // Using the auth.uid
          rating: newRating,
          comment: newComment
        })
        .select(`*, profiles(display_name, avatar_url)`)
        .single();

      if (error) throw error;
      
      setReviews([data, ...reviews]);
      setNewRating(0);
      setNewComment("");
      toast({ title: "Review submitted", description: "Thank you for your feedback!" });
    } catch (err: any) {
      toast({ title: "Failed to submit review", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleBooking = () => {
    if (!user) {
      toast({ title: "Login required", description: "Please sign in to book a guide.", variant: "destructive" });
      navigate("/auth");
      return;
    }
    navigate(`/payment/mock-guide-${id}`, {
      state: { amount: guide.price_full_day, service: `Guide Booking: ${guide.name}` }
    });
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

            {/* Reviews Section */}
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold">Reviews</h3>
              </div>
              
              {/* Review Submission Form */}
              {user ? (
                <div className="mb-8 p-4 border border-border rounded-xl bg-muted/30">
                   <h4 className="font-semibold text-sm mb-3">Write a Review</h4>
                   <div className="flex gap-2 mb-3">
                     {[1,2,3,4,5].map((star) => (
                       <button key={star} type="button" onClick={() => setNewRating(star)} className="focus:outline-none">
                         <Star className={`h-6 w-6 ${newRating >= star ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                       </button>
                     ))}
                   </div>
                   <textarea 
                     className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary outline-none resize-none mb-3"
                     rows={3}
                     placeholder="Tell us about your experience..."
                     value={newComment}
                     onChange={(e) => setNewComment(e.target.value)}
                   />
                   <Button onClick={handleSubmitReview} disabled={isSubmittingReview || newRating === 0} size="sm" className="bg-primary text-primary-foreground">
                     {isSubmittingReview ? "Submitting..." : "Submit Review"}
                   </Button>
                </div>
              ) : (
                <div className="mb-8 p-4 border border-border rounded-xl bg-muted/30 text-center">
                  <p className="text-sm text-muted-foreground mb-3">Please sign in to leave a review.</p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>Sign In</Button>
                </div>
              )}

              {/* Review List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-4">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((rev: any) => (
                    <div key={rev.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                             {(rev.profiles?.display_name || "User").substring(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{rev.profiles?.display_name || "Anonymous User"}</p>
                            <p className="text-xs text-muted-foreground">{new Date(rev.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 fill-accent text-accent mr-1" />
                          <span className="text-sm font-bold">{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-foreground mt-2">{rev.comment}</p>
                    </div>
                  ))
                )}
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
