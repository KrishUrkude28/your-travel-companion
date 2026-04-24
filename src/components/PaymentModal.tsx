import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, CheckCircle2, Loader2, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
  amount: string | number;
  title: string;
}

const PaymentModal = ({ isOpen, onClose, onSuccess, amount, title }: PaymentModalProps) => {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate API delay for payment processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      
      // Auto close and trigger success callback after a short delay
      setTimeout(() => {
        onSuccess(`pay_mock_${Date.now()}`);
        setSuccess(false);
        setCardNumber("");
        setExpiry("");
        setCvv("");
        onClose();
      }, 1500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            disabled={processing || success}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">{title}</p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 mb-6 flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Total Amount</span>
              <span className="text-xl font-bold">₹{amount}</span>
            </div>

            {success ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="h-16 w-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold mb-2">Payment Successful!</h4>
                <p className="text-muted-foreground text-sm">Your booking has been confirmed.</p>
              </motion.div>
            ) : (
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Card Number</label>
                  <Input 
                    required 
                    placeholder="0000 0000 0000 0000" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                    className="font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Expiry</label>
                    <Input 
                      required 
                      placeholder="MM/YY" 
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      maxLength={5}
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">CVV</label>
                    <Input 
                      required 
                      type="password" 
                      placeholder="•••" 
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={4}
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={processing}>
                    {processing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Processing...
                      </>
                    ) : (
                      `Pay ₹${amount}`
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-4">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                  Payments are secure and encrypted.
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
