import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    package_id: string;
    package_title: string;
  } | null;
}

const ReviewModal = ({ isOpen, onClose, booking }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  if (!isOpen || !booking) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }

    if (!user) return;

    setIsSubmitting(true);

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      package_id: booking.package_id,
      rating,
      comment,
      user_name: user.user_metadata?.full_name || "Traveler",
      package_title: booking.package_title,
    });

    setIsSubmitting(false);

    if (error) {
      toast({ title: "Error submitting review", description: error.message, variant: "destructive" });
    } else {
      setIsSuccess(true);
      toast({ title: "Review submitted!", description: "Thank you for your feedback." });
      setTimeout(() => {
        setIsSuccess(false);
        setRating(0);
        setComment("");
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card w-full max-w-md rounded-2xl shadow-elevated border border-border overflow-hidden relative"
      >
        {!isSuccess && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="p-6">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-10 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground font-display mb-2">Thank You!</h3>
                <p className="text-muted-foreground text-sm">Your review has been published on the homepage.</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="text-2xl font-bold text-foreground font-display mb-2">Rate your trip</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  How was your experience with <strong>{booking.package_title}</strong>?
                </p>

                {/* Star Rating */}
                <div className="flex justify-center gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="transition-transform hover:scale-110 focus:outline-none"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star 
                        className={`h-10 w-10 transition-colors ${
                          (hoveredRating || rating) >= star 
                            ? "fill-accent text-accent" 
                            : "fill-muted text-muted"
                        }`} 
                      />
                    </button>
                  ))}
                </div>

                {/* Comment area */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Share more about your experience (optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you love? What could be improved?"
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-primary text-primary-foreground" 
                    onClick={handleSubmit}
                    disabled={isSubmitting || rating === 0}
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Submit Review
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewModal;
