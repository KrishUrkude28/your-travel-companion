import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, User, Languages, IndianRupee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface Guide {
  id: string;
  name: string;
  city: string;
  rating: number;
  review_count: number;
  languages: string[];
  price_full_day: number;
  photo_url: string | null;
}

const mockGuides: Guide[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    city: "Jaipur",
    rating: 4.8,
    review_count: 124,
    languages: ["English", "Hindi", "French"],
    price_full_day: 2500,
    photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
  },
  {
    id: "2",
    name: "Priya Patel",
    city: "Mumbai",
    rating: 4.9,
    review_count: 89,
    languages: ["English", "Hindi", "Marathi"],
    price_full_day: 3000,
    photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
  },
  {
    id: "3",
    name: "Arun Kumar",
    city: "Kerala",
    rating: 4.7,
    review_count: 56,
    languages: ["English", "Malayalam"],
    price_full_day: 2200,
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  }
];

const Guides = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const { data, error } = await supabase.from("guides").select("*");
        if (error || !data || data.length === 0) {
          // Fallback to mock data if table is empty or doesn't exist yet
          setGuides(mockGuides);
        } else {
          setGuides(data);
        }
      } catch (e) {
        setGuides(mockGuides);
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Find Local Experts
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enhance your journey with verified local guides who know the hidden gems, culture, and history of your destination.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading guides...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide, idx) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-300 border border-border"
              >
                <div className="h-56 overflow-hidden">
                  <img 
                    src={guide.photo_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80"} 
                    alt={guide.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display text-xl font-bold text-foreground">{guide.name}</h3>
                    <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 text-accent fill-accent" />
                      <span className="text-xs font-semibold text-accent">{guide.rating} <span className="text-muted-foreground font-normal">({guide.review_count})</span></span>
                    </div>
                  </div>
                  
                  <div className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {guide.city}
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-start gap-2 text-sm text-foreground">
                      <Languages className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{guide.languages.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <IndianRupee className="h-4 w-4 text-primary" />
                      <span><strong>₹{guide.price_full_day}</strong> / day</span>
                    </div>
                  </div>

                  <Link to={`/guides/${guide.id}`}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Guides;
