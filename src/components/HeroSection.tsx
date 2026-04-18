import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DestinationAutocomplete from "@/components/DestinationAutocomplete";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with lazy loading */}
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=75)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, hsla(200,30%,10%,0.25) 0%, hsla(200,30%,10%,0.75) 100%)" }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="text-accent font-semibold text-xs sm:text-sm tracking-widest uppercase mb-4">
            {t("hero.badge", "Your Journey Begins Here")}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6">
            {t("hero.title", "Discover the World,")}
            <br />
            <span className="text-gradient-warm">{t("hero.title_accent", "One Trip at a Time")}</span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 px-4">
            {t("hero.subtitle", "Curated travel experiences across India and beyond. Budget-friendly packages, seamless bookings, unforgettable memories.")}
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="max-w-3xl mx-auto bg-background/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-elevated"
        >
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-muted">
              <DestinationAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={t("hero.search_placeholder", "Where do you want to go?")}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-muted">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="When?"
                  className="bg-transparent w-full text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
                />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted">
                <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="2"
                  className="bg-transparent w-12 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            </div>
            <Button
              onClick={() => navigate("/trip-planner")}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              {t("hero.cta", "Explore")} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-10 sm:mt-14 flex items-center justify-center gap-8 sm:gap-12 text-white/70 text-sm"
        >
          {[
            { value: "500+", label: t("hero.stats.dest", "Destinations") },
            { value: "10K+", label: t("hero.stats.travelers", "Happy Travelers") },
            { value: "4.9★", label: t("hero.stats.rating", "Rating") },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-8 sm:gap-12">
              {i > 0 && <div className="w-px h-8 bg-white/20 -ml-8 sm:-ml-12" />}
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs sm:text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
