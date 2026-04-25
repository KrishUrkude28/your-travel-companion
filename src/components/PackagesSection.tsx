import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, MapPin, ArrowRight, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCurrency } from "@/contexts/CurrencyContext";
import { packages } from "@/data/packages";
import WishlistButton from "@/components/WishlistButton";
import SearchFilters, { FilterState } from "./SearchFilters";

const PackagesSection = () => {
  const { formatPrice } = useCurrency();
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 200000],
    duration: [],
    tripType: [],
  });

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      // Check price
      if (pkg.price > filters.priceRange[1]) return false;

      // Check trip type
      if (filters.tripType.length > 0 && !filters.tripType.includes(pkg.type)) return false;

      // Check duration
      if (filters.duration.length > 0) {
        const daysStr = pkg.duration.split(' ')[0];
        const days = parseInt(daysStr) || 0;
        
        const isShort = days >= 1 && days <= 3;
        const isMedium = days >= 4 && days <= 7;
        const isLong = days >= 8;
        
        if (!((filters.duration.includes("short") && isShort) ||
              (filters.duration.includes("medium") && isMedium) ||
              (filters.duration.includes("long") && isLong))) {
           return false;
        }
      }
      return true;
    });
  }, [filters]);

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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4 shrink-0">
            <div className="sticky top-24">
              <SearchFilters onFilterChange={setFilters} />
            </div>
          </div>

          {/* Packages Grid */}
          <div className="w-full lg:w-3/4">
            <AnimatePresence mode="popLayout">
              {filteredPackages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card rounded-2xl p-12 text-center border border-border shadow-sm flex flex-col items-center"
                >
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <SearchX className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No packages found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters to find more travel options.</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPackages.map((pkg, i) => (
                    <motion.div
                      layout
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 group relative flex flex-col"
                    >
                      <div className="absolute top-4 right-4 z-10">
                        <WishlistButton packageId={pkg.id} packageTitle={pkg.title} />
                      </div>
                      
                      {/* Package Image */}
                      <div className="relative h-48 overflow-hidden shrink-0">
                        <img 
                          src={pkg.heroImage} 
                          alt={pkg.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-4">
                          <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider">
                            {pkg.type}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-display text-xl font-bold text-foreground mb-1 line-clamp-1">
                              {pkg.title}
                            </h3>
                            <div className="flex items-center gap-1 text-muted-foreground text-xs">
                              <MapPin className="h-3 w-3 text-accent shrink-0" />
                              <span className="line-clamp-1">{pkg.destinations}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <p className="text-muted-foreground text-[10px] line-through">{formatPrice(pkg.originalPrice)}</p>
                            <p className="text-primary font-bold text-lg">{formatPrice(pkg.price)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-5">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 shrink-0" />
                            <span className="whitespace-nowrap">{pkg.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 shrink-0" />
                            <span className="whitespace-nowrap">{pkg.groupSize}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6 flex-1 content-start">
                          {pkg.highlights.slice(0, 3).map((h) => (
                            <span key={h} className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-[11px] leading-none">
                              {h}
                            </span>
                          ))}
                          {pkg.highlights.length > 3 && (
                            <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-[11px] leading-none">
                              +{pkg.highlights.length - 3} more
                            </span>
                          )}
                        </div>

                        <Link to={`/package/${pkg.id}`} className="mt-auto">
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 group-hover:shadow-glow transition-shadow">
                            View Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
