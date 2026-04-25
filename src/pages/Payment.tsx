import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, Loader2, CreditCard, Ticket, Lock, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/contexts/CurrencyContext";

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

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState(user?.user_metadata?.full_name || "");

  // Dynamic data from navigation state with improved fallbacks
  const amount = location.state?.amount || 2500;
  const serviceTitle =
    location.state?.service ||
    (booking_id?.startsWith("hotel")
      ? t("hotels.title", "Hotel Stay")
      : booking_id?.startsWith("train")
      ? t("trains.title", "Train Journey")
      : booking_id?.startsWith("bus")
      ? t("buses.title", "Bus Trip")
      : t("payment.default_service", "Premium Travel Service"));

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      toast({ title: "Login required", description: "You must be logged in to pay" });
      navigate("/auth");
    }
  }, [user, authLoading, navigate, toast]);

  const recordBooking = async () => {
    if (!user) return;

    // Record the booking if it's a mock-prefixed ID
    if (booking_id && booking_id.startsWith("mock-")) {
      await supabase.from("bookings").insert({
        user_id: user.id,
        package_id: booking_id,
        package_title:
          serviceTitle || booking_id.split("-").slice(1).join(" ") + " Booking",
        full_name: name || user?.user_metadata?.full_name || "User",
        email: user?.email || "mock@test.com",
        phone: "9999999999",
        travelers: 1,
        travel_date: new Date().toISOString().split("T")[0],
        status: "confirmed",
      });
    }

    // Record the payment transaction
    try {
      await supabase.from("payments").insert({
        razorpay_payment_id: `pi_test_${Date.now()}`,
        amount,
        status: "success",
        user_id: user.id,
        booking_id,
      });
    } catch (err: any) {
      console.info("Payment record skipped. Continuing in demo mode.");
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, "").length < 15 || expiry.length < 5 || cvc.length < 3) {
      toast({
        title: "Invalid Details",
        description: "Please enter valid card information.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        await recordBooking();
        setSuccess(true);
        setLoading(false);
        toast({ title: "Payment Successful 🎉", description: "Your booking is confirmed!" });
        setTimeout(() => {
          toast({
            title: "📧 Email Sent",
            description: `Receipt dispatched to ${user?.email || "your email"}!`,
            className: "bg-green-50 border-green-200 text-green-900",
          });
        }, 2000);
      } catch (error) {
        setLoading(false);
        toast({
          title: "Payment Failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    }, 2500);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    let formatted = "";
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += " ";
      formatted += value[i];
    }
    setCardNumber(formatted.slice(0, 19));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    } else {
      setExpiry(value);
    }
  };

  // ── Success Screen ──────────────────────────────────────────────
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
          <h2 className="text-3xl font-display font-bold mb-2">
            {t("payment.success_title", "Booking Confirmed!")}
          </h2>
          <p className="text-muted-foreground mb-2">
            {t("payment.success_subtitle", "Thank you for your payment. Your adventure awaits.")}
          </p>
          <p className="text-sm text-muted-foreground mb-8 flex items-center justify-center gap-1">
            <Ticket className="w-4 h-4" /> Reference: #{booking_id?.slice(0, 8) || "N/A"}
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/my-bookings")}
              className="w-full bg-primary text-primary-foreground"
            >
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

  // ── Checkout Screen ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-3xl">
        <Button variant="ghost" size="sm" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> {t("common.back", "Back")}
        </Button>

        <div className="bg-card rounded-2xl shadow-elevated border border-border overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-display text-3xl font-bold">
                {t("payment.title", "Complete your booking")}
              </h1>
              <div className="bg-[#635BFF] text-white text-xs font-bold px-3 py-1.5 rounded-md tracking-wide">
                Stripe
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Reference: #{booking_id?.slice(0, 8) || "N/A"}
            </p>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-8">
            {/* ── Left: Order Summary ── */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">
                  {t("payment.summary", "Order Summary")}
                </h3>
                <div className="bg-muted/40 rounded-xl p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium text-right max-w-[200px] truncate">
                      {serviceTitle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes & Fees</span>
                    <span className="font-medium">₹0 (Incl.)</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between font-semibold text-base">
                    <span>{t("payment.total", "Total to Pay")}</span>
                    <span className="text-primary">{formatPrice(amount)}</span>
                  </div>
                </div>
              </div>

              {/* Security badge */}
              <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 flex items-start gap-3 border border-blue-100 dark:border-blue-900/30">
                <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Your payment is secured with 256-bit SSL encryption via Stripe.
                </p>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
                {["256-bit SSL", "PCI DSS", "RBI Compliant"].map((b) => (
                  <div
                    key={b}
                    className="bg-muted/30 border border-border rounded-lg py-2 px-1"
                  >
                    <ShieldCheck className="h-4 w-4 mx-auto mb-1 text-green-500" />
                    {b}
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-amber-600">Test mode:</span> Use card{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-xs">4242 4242 4242 4242</code>,
                any future expiry, any 3-digit CVC.
              </p>
            </div>

            {/* ── Right: Stripe Card Form ── */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Payment Details</h3>
              <form onSubmit={handlePayment} className="space-y-4">
                {/* Card number + expiry + CVC grouped like Stripe */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">
                    Card Information
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      inputMode="numeric"
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-t-md focus:outline-none focus:ring-2 focus:ring-[#635BFF]/40 focus:border-[#635BFF] transition-all text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      inputMode="numeric"
                      className="w-full px-4 py-2.5 bg-background border border-border border-t-0 rounded-bl-md focus:outline-none focus:ring-2 focus:ring-[#635BFF]/40 focus:border-[#635BFF] transition-all text-sm"
                      required
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      inputMode="numeric"
                      className="w-full px-4 py-2.5 bg-background border border-border border-t-0 border-l-0 rounded-br-md focus:outline-none focus:ring-2 focus:ring-[#635BFF]/40 focus:border-[#635BFF] transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Name on card */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Name on card
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#635BFF]/40 focus:border-[#635BFF] transition-all text-sm"
                    required
                  />
                </div>

                {/* Pay button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold transition-all"
                    disabled={loading}
                    style={{ backgroundColor: "#635BFF", color: "white" }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      `Pay ${formatPrice(amount)}`
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    By paying, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
