import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Animated compass */}
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-28 h-28 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <Compass className="w-14 h-14 text-primary" />
        </motion.div>

        <h1 className="font-display text-8xl font-bold text-primary/20 mb-2">404</h1>
        <h2 className="font-display text-2xl font-bold text-foreground mb-3">Lost in transit?</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for has wandered off the map. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
          <Button onClick={() => navigate("/")} className="gap-2">
            <Home className="w-4 h-4" /> Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
