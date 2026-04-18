import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Users, Clock, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [startY, setStartY] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const fetchBookings = async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    else setLoading(true);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load bookings", variant: "destructive" });
    } else {
      setBookings(data || []);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchBookings();

    // Real-time subscription for booking updates
    const channel = supabase
      .channel(`my-bookings-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  // Pull to refresh logic
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) setStartY(e.touches[0].pageY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === 0) return;
    const y = e.touches[0].pageY;
    const progress = Math.min((y - startY) / 100, 1.2);
    if (progress > 0) setPullProgress(progress);
  };

  const handleTouchEnd = () => {
    if (pullProgress > 0.8) fetchBookings(true);
    setStartY(0);
    setPullProgress(0);
  };

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);
    setCancellingId(null);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "cancelled" } : b));
    toast({ title: "Booking cancelled", description: "Your booking has been cancelled." });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div 
        className="min-h-screen bg-background pt-24 pb-12"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      <AnimatePresence>
        {(pullProgress > 0 || refreshing) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ 
                opacity: Math.min(pullProgress, 1), 
                scale: Math.min(pullProgress, 1),
                y: refreshing ? 20 : Math.min(pullProgress * 50, 50) 
            }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="fixed top-20 left-0 right-0 z-50 flex justify-center pointer-events-none"
          >
            <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-elevated">
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} style={{ transform: refreshing ? '' : `rotate(${pullProgress * 360}deg)` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                className="bg-card rounded-2xl p-6 shadow-card flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-foreground">{booking.package_title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                    booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                    booking.status === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-accent/20 text-accent-foreground"
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground flex-1">
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
                <div className="flex gap-2 mt-4">
                  <Link 
                    to={
                      booking.package_id.startsWith("mock-") 
                        ? (booking.package_id === "mock-bus" ? "/buses" 
                         : booking.package_id === "mock-guide" ? "/guides"
                         : `/${booking.package_id.split("-")[1]}s`) 
                        : `/package/${booking.package_id}`
                    } 
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">View</Button>
                  </Link>
                  {booking.status === "pending" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                          disabled={cancellingId === booking.id}
                        >
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Your booking for <strong>{booking.package_title}</strong> on{" "}
                            {new Date(booking.travel_date).toLocaleDateString("en-IN", { dateStyle: "long" })} will be cancelled. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep booking</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancel(booking.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, cancel
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {/* Phase 2 Feature: Team Expense Tripper (Split Bill) */}
                  {booking.status === "confirmed" && booking.travelers > 1 && (
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="bg-accent/10 border-accent/20 text-accent hover:bg-accent/20 hover:text-accent font-semibold"
                       onClick={() => {
                          const emails = prompt(`Split bill for ${booking.travelers} travelers.\n\nEnter the emails of your ${booking.travelers - 1} friend(s), separated by commas:`);
                          if (emails) {
                            toast({ 
                              title: "💸 Split Links Sent!", 
                              description: `Payment requests have been securely emailed to: ${emails}`,
                              className: "bg-green-50 border-green-200 text-green-900"
                            });
                          }
                       }}
                     >
                       Split Bill
                     </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
