import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Utensils, Search, Filter, X, Clock, Users, Calendar } from "lucide-react";
import { restaurants, Restaurant } from "@/data/restaurants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Restaurants = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedCuisine, setSelectedCuisine] = useState("All Cuisines");
  const [bookingRes, setBookingRes] = useState<Restaurant | null>(null);
  
  const cities = ["All Cities", ...new Set(restaurants.map(r => r.city))];
  const cuisines = ["All Cuisines", ...new Set(restaurants.flatMap(r => r.cuisine))];

  const filtered = restaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
                         r.city.toLowerCase().includes(search.toLowerCase());
    const matchesCity = selectedCity === "All Cities" || r.city === selectedCity;
    const matchesCuisine = selectedCuisine === "All Cuisines" || r.cuisine.includes(selectedCuisine);
    return matchesSearch && matchesCity && matchesCuisine;
  });

  const handleBookTable = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Table Reserved! 🍽️",
      description: `Your reservation at ${bookingRes?.name} has been confirmed. A confirmation SMS has been sent to your registered number.`,
    });
    setBookingRes(null);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Savor Local Flavors
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the best dining experiences across India, from legendary street food institutions to premium coastal fine-dining.
          </p>
        </motion.div>

        {/* Filters bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 sticky top-20 z-30 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by restaurant name or city..." 
              className="pl-10 h-12 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
             <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              className="h-12 px-4 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
            
            <select 
              value={selectedCuisine} 
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="h-12 px-4 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <Utensils className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground">No restaurants found matching your criteria.</p>
              <Button variant="link" onClick={() => { setSearch(""); setSelectedCity("All Cities"); setSelectedCuisine("All Cuisines"); }}>
                Clear all filters
              </Button>
            </div>
          ) : (
            filtered.map((r, idx) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:shadow-elevated transition-all duration-300"
              >
                <div className="h-52 overflow-hidden relative">
                  <img 
                    src={r.photo_url} 
                    alt={r.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star className="h-3 w-3 text-accent fill-accent" />
                    {r.rating} ({r.review_count})
                  </div>
                  <div className="absolute bottom-4 left-4 flex gap-1">
                    {r.cuisine.slice(0, 2).map((c) => (
                      <span key={c} className="bg-primary/90 backdrop-blur text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">{r.name}</h3>
                    <span className="text-sm font-bold text-accent">{r.price_range}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {r.city}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {r.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-6">
                    {r.tags.map(tag => (
                      <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md italic">#{tag}</span>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => setBookingRes(r)}
                    className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all hover:gap-3"
                  >
                    Reserve Table <Utensils className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingRes && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setBookingRes(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                 <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold font-display">Reserve at {bookingRes.name}</h2>
                  <button onClick={() => setBookingRes(null)} className="p-2 rounded-full hover:bg-muted"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleBookTable} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Select Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="date" required className="pl-10" min={new Date().toISOString().split('T')[0]} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Select Time</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="time" required className="pl-10" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Number of Guests</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <select required className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} Guests</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-2xl border border-dashed border-border mb-4">
                    <p className="text-xs text-muted-foreground italic mb-1">TravelSathi Perk:</p>
                    <p className="text-sm font-semibold text-accent">Free complimentary dessert for TravelSathi members on arrival! 🍰</p>
                  </div>
                  
                  <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold">Confirm Reservation</Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Restaurants;
