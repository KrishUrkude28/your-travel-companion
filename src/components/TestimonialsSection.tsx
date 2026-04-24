import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const fallbackTestimonials = [
  {
    name: "Priya Sharma",
    trip: "Bali Honeymoon",
    text: "TravelSathi made our honeymoon absolutely magical. Every detail was perfectly planned — from the villa to the sunset dinner. Couldn't have asked for more!",
    rating: 5,
  },
  {
    name: "Rahul Mehta",
    trip: "Manali Adventure",
    text: "Best adventure trip I've ever been on. The team arranged everything from trekking to river rafting. Great value for money and amazing guides!",
    rating: 5,
  },
  {
    name: "Ananya Patel",
    trip: "Kerala Family Trip",
    text: "Traveled with my family of 6 and every member loved it. The houseboat experience and local food were highlights. Highly recommended!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("user_name, package_title, comment, rating")
          .order("created_at", { ascending: false })
          .limit(6); // Fetch latest 6

        if (!error && data && data.length > 0) {
          // Format real reviews
          const realReviews = data.map(review => ({
            name: review.user_name || "Traveler",
            trip: review.package_title || "Custom Trip",
            text: review.comment || "Amazing experience! Highly recommended.",
            rating: review.rating || 5
          }));

          // Merge with fallbacks if we don't have enough to fill a row of 3
          let merged = [...realReviews];
          if (merged.length < 3) {
            merged = [...merged, ...fallbackTestimonials.slice(0, 3 - merged.length)];
          }
          setTestimonials(merged);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-accent font-medium text-sm tracking-widest uppercase mb-3">
            Testimonials
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            What Travelers Say
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={`${t.name}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card rounded-2xl p-8 shadow-card relative flex flex-col h-full"
              >
                <Quote className="h-8 w-8 text-accent/30 absolute top-6 right-6" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  "{t.text}"
                </p>
                <div className="mt-auto">
                  <p className="font-display font-semibold text-foreground">{t.name}</p>
                  <p className="text-accent text-xs font-medium">{t.trip}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
