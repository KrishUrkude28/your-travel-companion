import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import destManali from "@/assets/dest-manali.jpg";
import destGoa from "@/assets/dest-goa.jpg";
import destBali from "@/assets/dest-bali.jpg";
import destKerala from "@/assets/dest-kerala.jpg";

const destinations = [
  { name: "Manali", country: "India", rating: 4.8, price: "₹8,999", tag: "Adventure", image: destManali },
  { name: "Goa", country: "India", rating: 4.7, price: "₹6,499", tag: "Beach", image: destGoa },
  { name: "Bali", country: "Indonesia", rating: 4.9, price: "₹34,999", tag: "Tropical", image: destBali },
  { name: "Kerala", country: "India", rating: 4.8, price: "₹11,999", tag: "Backwaters", image: destKerala },
];

const DestinationsSection = () => {
  return (
    <section id="destinations" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent font-medium text-sm tracking-widest uppercase mb-3">
            Top Picks
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Trending Destinations
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-card group-hover:shadow-elevated transition-shadow duration-300">
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  width={640}
                  height={800}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, transparent 40%, hsla(200,30%,10%,0.8) 100%)" }}
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                    {dest.tag}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-1 text-primary-foreground/80 text-sm mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{dest.country}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-primary-foreground mb-2">
                    {dest.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-primary-foreground/90 text-sm font-medium">{dest.rating}</span>
                    </div>
                    <p className="text-primary-foreground font-bold text-lg">
                      {dest.price}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
