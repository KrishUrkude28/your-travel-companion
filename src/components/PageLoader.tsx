import { motion } from "framer-motion";
import { Plane } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-24 w-24 rounded-full border-4 border-primary/20 border-t-primary"
        />
        <motion.div
          animate={{ 
            x: [0, 40, 0, -40, 0],
            y: [0, -20, 0, 20, 0],
            rotate: [0, 15, 0, -15, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
        >
          <Plane className="h-8 w-8 text-primary" />
        </motion.div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-lg font-medium text-muted-foreground animate-pulse"
      >
        Preparing your journey...
      </motion.p>
    </div>
  );
};

export default PageLoader;
