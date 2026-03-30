import { motion } from "framer-motion";
import { Clock, Users, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const packages = [
  {
    title: "Golden Triangle Tour",
    destinations: "Delhi → Agra → Jaipur",
    duration: "5 Days / 4 Nights",
    groupSize: "2-8 People",
    price: "₹14,999",
    originalPrice: "₹19,999",
    highlights: ["Taj Mahal Visit", "Hawa Mahal", "Red Fort", "Local Cuisine"],
    type: "Family",
  },
  {
    title: "Bali Paradise Escape",
    destinations: "Ubud → Seminyak → Nusa Dua",
    duration: "7 Days / 6 Nights",
    groupSize: "2-6 People",
    price: "₹44,999",
    originalPrice: "₹59,999",
    highlights: ["Rice Terraces", "Temple Tours", "Beach Villas", "Spa & Wellness"],
    type: "Honeymoon",
  },
  {
    title: "Himalayan Adventure",
    destinations: "Shimla → Manali → Rohtang",
    duration: "6 Days / 5 Nights",
    groupSize: "4-12 People",
    price: "₹12,499",
    originalPrice: "₹16,999",
    highlights: ["Snow Activities", "River Rafting", "Camping", "Trekking"],
    type: "Adventure",
  },
];

const PackagesSection = () => {
  return (
    <section id="packages" className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-accent font-medium text-sm tracking-widest uppercase mb-3">
            Best Deals
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Popular Packages
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {pkg.type}
                  </span>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs line-through">{pkg.originalPrice}</p>
                    <p className="text-foreground font-bold text-xl">{pkg.price}</p>
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {pkg.title}
                </h3>

                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>{pkg.destinations}</span>
                </div>

                <div className="flex items-center gap-4 text-muted-foreground text-sm mb-5">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{pkg.groupSize}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {pkg.highlights.map((h) => (
                    <span key={h} className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                      {h}
                    </span>
                  ))}
                </div>

                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 group-hover:shadow-glow transition-shadow">
                  View Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
