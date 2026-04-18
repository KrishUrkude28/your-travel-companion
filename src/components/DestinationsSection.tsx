import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";

const destinations = [
  { name: "Manali", country: "India", rating: 4.8, price: "₹8,999", tag: "Adventure", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=640&q=75" },
  { name: "Goa", country: "India", rating: 4.7, price: "₹6,499", tag: "Beach", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=640&q=75" },
  { name: "Bali", country: "Indonesia", rating: 4.9, price: "₹34,999", tag: "Tropical", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=640&q=75" },
  { name: "Kerala", country: "India", rating: 4.8, price: "₹11,999", tag: "Backwaters", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=640&q=75" },
];

const DestinationsSection = () => {
  return (
    <section id="destinations" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-accent font-medium text-xs sm:text-sm tracking-widest uppercase mb-3">Top Picks</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">Trending Destinations</h2>
        </motion.div>

        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-hidden pb-4 sm:pb-0 hide-scrollbar snap-x snap-mandatory lg:snap-none">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group cursor-pointer min-w-[280px] sm:min-w-0 snap-center"
            >
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[3/4] shadow-card group-hover:shadow-elevated transition-shadow duration-300">
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, hsla(200,30%,10%,0.85) 100%)" }} />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] sm:text-xs font-semibold">{dest.tag}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                  <div className="flex items-center gap-1 text-white/75 text-xs mb-0.5">
                    <MapPin className="h-3 w-3" /><span>{dest.country}</span>
                  </div>
                  <h3 className="font-display text-base sm:text-xl font-bold text-white mb-1">{dest.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      <span className="text-white/90 text-xs font-medium">{dest.rating}</span>
                    </div>
                    <p className="text-white font-bold text-sm sm:text-base">{dest.price}</p>
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
