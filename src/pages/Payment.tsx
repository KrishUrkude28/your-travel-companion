import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle, Loader2,
  CreditCard, Smartphone, Building2, Ticket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/contexts/CurrencyContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Load Razorpay checkout.js dynamically
const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PAYMENT_METHODS = [
  { id: "upi", icon: Smartphone, label: "UPI / QR", desc: "PhonePe, GPay, Paytm" },
  { id: "card", icon: CreditCard, label: "Debit / Credit Card", desc: "Visa, Mastercard, Amex" },
  { id: "netbanking", icon: Building2, label: "Net Banking", desc: "All major Indian banks" },
];

const Payment = () => {
  const { booking_id } = useParams<{ booking_id: string }>();
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("upi");

  // Dynamic data from navigation state with improved fallbacks
  const amount = location.state?.amount || 2500;
  const serviceTitle = location.state?.service ||
    (booking_id?.startsWith("hotel") ? t("hotels.title", "Hotel Stay") :
     booking_id?.startsWith("train") ? t("trains.title", "Train Journey") :
     booking_id?.startsWith("bus") ? t("buses.title", "Bus Trip") :
     t("payment.default_service", "Premium Travel Service"));

  useEffect(() => {
    if (authLoading) return; // Wait for auth state to hydrate
    if (!user) {
      toast({ title: "Login required", description: "You must be logged in to pay" });
      navigate("/auth");
    }
  }, [user, authLoading, navigate, toast]);

  // Pre-load the Razorpay SDK on mount
  useEffect(() => { loadRazorpay(); }, []);

  const recordBooking = async () => {
    if (!user) return;
    if (booking_id && booking_id.startsWith("mock-")) {
      const fakeTitle = booking_id.split("-").slice(1).join(" ") + " Booking";
      await supabase.from("bookings").insert({
        user_id: user.id,
        package_id: booking_id,
        package_title: fakeTitle,
        full_name: user?.user_metadata?.full_name || "User",
        email: user?.email || "mock@test.com",
        phone: "9999999999",
        travelers: 1,
        travel_date: new Date().toISOString().split("T")[0],
        status: "confirmed",
      });
    }
    await supabase.from("payments").insert({
      razorpay_payment_id: `pay_test_${Date.now()}`,
      amount,
      status: "success",
      user_id: user.id,
      booking_id,
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    const sdkLoaded = await loadRazorpay();

    if (!sdkLoaded) {
      toast({ title: "Error", description: "Could not load payment SDK. Please check your connection.", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Attempt live Razorpay checkout with test key
    const razorpayKey = "rzp_test_YourTestKeyHere"; // Replace with actual test key
    const isDemoMode = !razorpayKey || razorpayKey.includes("YourTestKey");

    if (!isDemoMode && window.Razorpay) {
      const options = {
        key: razorpayKey,
        amount: amount * 100, // Razorpay expects paise
        currency: "INR",
        name: "TravelSathi",
        description: serviceTitle,
        image: "/pwa-192x192.png",
        prefill: {
          name: user?.user_metadata?.full_name || "",
          email: user?.email || "",
        },
        theme: { color: "#6366f1" },
        handler: async (response: any) => {
          await supabase.from("payments").insert({
            razorpay_payment_id: response.razorpay_payment_id,
            amount,
            status: "success",
            user_id: user?.id,
            booking_id,
          });
          await recordBooking();
          setSuccess(true);
          setLoading(false);
          toast({ title: "Payment Successful 🎉", description: "Your booking is confirmed!" });
          setTimeout(() => {
            toast({ title: "📧 Email Sent", description: `Receipt dispatched to ${user?.email}!`, className: "bg-green-50 border-green-200 text-green-900" });
          }, 2000);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast({ title: "Payment cancelled", description: "You closed the payment window.", variant: "destructive" });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      return;
    }

    // Demo / simulation mode
    setTimeout(async () => {
      try {
        await recordBooking();
        setSuccess(true);
        toast({ title: "Payment Successful 🎉", description: "Your booking is confirmed! (Demo Mode)" });
        setTimeout(() => {
          toast({ title: "📧 Email Sent", description: `Receipt dispatched to ${user?.email}!`, className: "bg-green-50 border-green-200 text-green-900" });
        }, 2000);
      } catch {
        toast({ title: "Error", description: "Could not record payment.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }, 2200);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card p-10 rounded-2xl shadow-elevated text-center max-w-md w-full border border-border"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
            className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12" />
          </motion.div>
          <h2 className="text-3xl font-display font-bold mb-2">{t("payment.success_title", "Booking Confirmed!")}</h2>
          <p className="text-muted-foreground mb-2">{t("payment.success_subtitle", "Thank you for your payment. Your adventure awaits.")}</p>
          <p className="text-sm text-muted-foreground mb-8 flex items-center justify-center gap-1">
            <Ticket className="w-4 h-4" /> Reference: #{booking_id?.slice(0, 8) || "N/A"}
          </p>
          <div className="space-y-3">
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
          <div className="p-8 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
            <h1 className="font-display text-3xl font-bold mb-1">{t("payment.title", "Complete your booking")}</h1>
            <p className="text-muted-foreground text-sm">
              Reference: #{booking_id?.slice(0, 8) || "N/A"}
            </p>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">{t("payment.summary", "Order Summary")}</h3>
                <div className="bg-muted/40 rounded-xl p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("common.service", "Service")}</span>
                    <span className="font-medium">{serviceTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("common.date", "Date")}</span>
                    <span className="font-medium">{new Date().toLocaleDateString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("payment.taxes", "Taxes & Fees")}</span>
                    <span className="font-medium">₹0 (Incl.)</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-bold">{t("payment.total", "Total")}</span>
                    <span className="font-bold text-xl text-primary">₹{amount.toLocaleString("en-IN")}</span>
                  </div>
                  {/* Currency conversion hint */}
                  <p className="text-xs text-muted-foreground text-right">≈ {formatPrice(amount)}</p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <h3 className="font-semibold mb-3">Payment Method</h3>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        selectedMethod === m.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <m.icon className={`h-5 w-5 shrink-0 ${selectedMethod === m.id ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{m.label}</p>
                        <p className="text-xs text-muted-foreground">{m.desc}</p>
                      </div>
                      <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMethod === m.id ? "border-primary" : "border-muted-foreground/30"}`}>
                        {selectedMethod === m.id && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pay Button + Trust signals */}
            <div className="flex flex-col gap-4">
              <div className="bg-muted/40 rounded-xl p-5 space-y-4 flex-1">
                <div className="flex items-center gap-3 text-sm bg-background p-3 rounded-lg border border-border">
                  <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-muted-foreground">{t("payment.secure_notice", "100% secure payment via Razorpay. Supported: Cards, UPI, NetBanking.")}</span>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-3 rounded-lg text-xs flex items-start gap-2 border border-amber-200 dark:border-amber-800/40">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{t("payment.test_mode", "Test mode: No real money will be deducted. Use test card: 4111 1111 1111 1111.")}</p>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
                  {["256-bit SSL", "PCI DSS", "RBI Compliant"].map((b) => (
                    <div key={b} className="bg-background border border-border rounded-lg py-2 px-1">
                      <ShieldCheck className="h-4 w-4 mx-auto mb-1 text-green-500" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all"
                onClick={handlePayment}
                disabled={loading}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </motion.span>
                  ) : (
                    <motion.span key="pay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {t("payment.pay", "Pay")} ₹{amount.toLocaleString("en-IN")}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                By paying, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
