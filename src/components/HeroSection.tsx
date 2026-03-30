import { motion } from "framer-motion";
import { Search, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-beach.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, hsla(200,30%,10%,0.3) 0%, hsla(200,30%,10%,0.7) 100%)" }}
      />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-accent font-medium text-sm tracking-widest uppercase mb-4">
            Your Journey Begins Here
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
            Discover the World,
            <br />
            <span className="text-gradient-warm">One Trip at a Time</span>
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body">
            Curated travel experiences across India and beyond. Budget-friendly packages,
            seamless bookings, unforgettable memories.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-3xl mx-auto bg-background/95 backdrop-blur-md rounded-2xl p-4 shadow-elevated"
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-muted">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="bg-transparent w-full text-sm text-foreground placeholder:text-muted-foreground outline-none font-body"
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted">
              <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="When?"
                className="bg-transparent w-full text-sm text-foreground placeholder:text-muted-foreground outline-none font-body md:w-28"
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted">
              <Users className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Travelers"
                className="bg-transparent w-full text-sm text-foreground placeholder:text-muted-foreground outline-none font-body md:w-24"
              />
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-xl text-sm font-semibold">
              Explore
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 flex items-center justify-center gap-8 text-primary-foreground/70 text-sm"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-foreground">500+</p>
            <p>Destinations</p>
          </div>
          <div className="w-px h-10 bg-primary-foreground/20" />
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-foreground">10K+</p>
            <p>Happy Travelers</p>
          </div>
          <div className="w-px h-10 bg-primary-foreground/20" />
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-foreground">4.9★</p>
            <p>Rating</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
