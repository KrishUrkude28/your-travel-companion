import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Users, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  package_id: string;
  package_title: string;
  full_name: string;
  travelers: number;
  travel_date: string;
  status: string;
  created_at: string;
}

const MyBookings = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        toast({ title: "Error", description: "Failed to load bookings", variant: "destructive" });
      } else {
        setBookings(data || []);
      }
      setLoading(false);
    };
    fetchBookings();
  }, [user, toast]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Button>
        </Link>

        <h1 className="font-display text-3xl font-bold text-foreground mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground mb-4">You haven't made any bookings yet.</p>
            <Link to="/#packages">
              <Button className="bg-primary text-primary-foreground">Browse Packages</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-foreground">{booking.package_title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                    booking.status === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-accent/20 text-accent-foreground"
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(booking.travel_date).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{booking.travelers} traveler{booking.travelers > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Booked {new Date(booking.created_at).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
                <Link to={`/package/${booking.package_id}`}>
                  <Button variant="outline" size="sm" className="w-full mt-4">View Package</Button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
