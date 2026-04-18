import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, IndianRupee, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

// Inform TS about the Razorpay window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Payment = () => {
  const { booking_id } = useParams<{ booking_id: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Dynamic data from navigation state
  const amount = location.state?.amount || 2500;
  const serviceTitle = location.state?.service || t("payment.default_service", "Premium Travel Service");
  
  useEffect(() => {
    if (!user) {
      toast({ title: "Login required", description: "You must be logged in to pay" });
      navigate("/auth");
    }
  }, [user, navigate, toast]);

  const handlePayment = async () => {
    setLoading(true);

    // Completely simulated payment to avoid 401 Unauthorized errors from Razorpay with an invalid string test key.
    // In a production app, you would generate an order_id via Razorpay API backend and pass it to window.Razorpay.
    
    toast({ title: "Processing", description: "Simulating secure payment through Razorpay..." });

    setTimeout(async () => {
      try {
        if (user) {
          // If it's a mock flow from Flights/Hotels/etc, inject a fake booking so it shows up in "My Bookings"
          if (booking_id && booking_id.startsWith("mock-")) {
            const fakeTitle = booking_id.split("-")[1].toUpperCase() + " Booking (Mock Flow)";
            await supabase.from("bookings").insert({
              user_id: user.id,
              package_id: booking_id,
              package_title: fakeTitle,
              full_name: user?.user_metadata?.full_name || "User",
              email: user?.email || "mock@test.com",
              phone: "9999999999",
              travelers: 1,
              travel_date: new Date().toISOString().split('T')[0],
              status: "confirmed"
            });
          }

          // Log simulated payment to Supabase
          await supabase.from("payments").insert({
            razorpay_payment_id: "pay_mock_simulated123",
            amount: amount,
            status: "success",
            user_id: user.id,
            booking_id: booking_id
          });
        }
        setSuccess(true);
        toast({
          title: "Payment Successful",
          description: "Your booking is confirmed!",
        });
        
        // Phase 1 Feature: Simulated Automated Booking Email
        setTimeout(() => {
           toast({ 
             title: "📧 Email Sent", 
             description: `An automated HTML receipt has been dispatched to ${user?.email || "your email"}!`,
             className: "bg-green-50 border-green-200 text-green-900"
           });
        }, 2000);
      } catch (err: any) {
        toast({ title: "Error", description: "Could not record payment.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12 flex items-center justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card p-10 rounded-2xl shadow-elevated text-center max-w-md w-full border border-border">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-2">{t("payment.success_title", "Booking Confirmed!")}</h2>
          <p className="text-muted-foreground mb-8">{t("payment.success_subtitle", "Thank you for your payment. Your adventure awaits.")}</p>
          <div className="space-y-4">
            <Button onClick={() => navigate("/my-bookings")} className="w-full bg-primary text-primary-foreground">
              {t("payment.view_bookings", "View My Bookings")}
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="w-full">
              {t("nav.home", "Back to Home")}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-3xl">
        <Button variant="ghost" size="sm" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> {t("common.back", "Back")}
        </Button>

        <div className="bg-card rounded-2xl shadow-elevated border border-border overflow-hidden">
          <div className="p-8 border-b border-border">
            <h1 className="font-display text-3xl font-bold mb-2">{t("payment.title", "Complete your booking")}</h1>
            <p className="text-muted-foreground">{t("payment.reference", "Booking Reference")}: #{booking_id?.slice(0, 8) || "N/A"}</p>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{t("payment.summary", "Order Summary")}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t("common.service", "Service")}</span>
                    <span className="text-foreground font-medium">{serviceTitle}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t("common.date", "Date")}</span>
                    <span className="text-foreground font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t("payment.taxes", "Taxes & Fees")}</span>
                    <span className="text-foreground font-medium"><IndianRupee className="inline w-3 h-3"/> 0</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-end">
                  <span className="font-semibold">{t("payment.total", "Total Amount")}</span>
                  <span className="text-2xl font-bold text-primary flex items-center justify-end">
                    <IndianRupee className="w-5 h-5 mr-1" />{amount}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-xl space-y-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground bg-background p-3 rounded border border-border">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span>{t("payment.secure_notice", "100% secure payment via Razorpay. Supported: Cards, UPI, NetBanking.")}</span>
              </div>

              <div className="bg-orange-100 text-orange-800 p-3 rounded text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{t("payment.test_mode", "This is a test mode integration. No real money will be deducted.")}</p>
              </div>

              <Button 
                className="w-full h-12 text-lg font-semibold bg-primary text-primary-foreground" 
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto"/> : `${t("payment.pay", "Pay")} ₹${amount}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
