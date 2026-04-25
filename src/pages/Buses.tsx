import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bus, MapPin, Calendar, Search, ArrowRight, Snowflake, Usb, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "react-i18next";
import DestinationAutocomplete from "@/components/DestinationAutocomplete";

const mockBusesData = [
  { id: "B1", operator: "IntrCity SmartBus", type: "A/C Sleeper (2+1)", depTime: "21:00", arrTime: "07:30", dur: "10h 30m", price: 1250, rating: 4.8, seats: 12 },
  { id: "B2", operator: "Zingbus", type: "Volvo Multi-Axle Semi-Sleeper", depTime: "22:15", arrTime: "09:00", dur: "10h 45m", price: 950, rating: 4.5, seats: 4 },
  { id: "B3", operator: "RedBus Assured", type: "Non A/C Seater (2+2)", depTime: "18:00", arrTime: "05:00", dur: "11h 00m", price: 550, rating: 3.9, seats: 28 },
];

const Buses = () => {
  const { formatPrice } = useCurrency();
  const { t } = useTranslation();
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState("Delhi");
  const [dest, setDest] = useState("Manali");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      {/* Dynamic Header */}
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="bg-gradient-to-br from-[#1A1C2E] to-[#2D3436] rounded-[2rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden mb-12 border border-white/10">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Bus className="w-80 h-80 -rotate-12 transform translate-x-20 -translate-y-20" />
           </div>
           
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 max-w-3xl mx-auto text-center">
             <h1 className="text-5xl md:text-6xl font-display font-black mb-6 leading-tight">
               {t("buses.title", "Travel India with Comfort.")}
             </h1>
             <p className="text-white/70 text-xl mb-10 max-w-xl mx-auto">
               {t("buses.subtitle", "Book premium Volvo and Sleeper buses for your inter-city travel across the country.")}
             </p>
             
             {/* Search Form - Expanded and Comfortable */}
             <form onSubmit={handleSearch} className="bg-white/15 backdrop-blur-xl w-full p-4 rounded-[2rem] shadow-2xl flex flex-col lg:flex-row gap-4 border border-white/20">
                <div className="flex-[1.5] relative flex items-center bg-white/10 rounded-2xl px-6 py-4 border border-transparent focus-within:border-accent transition-all group">
                  <MapPin className="w-6 h-6 text-white/50 mr-4 group-focus-within:text-accent transition-colors" />
                  <div className="flex-1 w-full text-left">
                    <p className="text-xs uppercase font-bold text-white/50 tracking-widest mb-1">{t("buses.origin", "Origin")}</p>
                    <DestinationAutocomplete 
                      value={origin} 
                      onChange={setOrigin} 
                      hideIcon
                      inputClassName="!bg-transparent !border-none !outline-none !shadow-none !px-0 flex items-center font-bold text-xl text-white placeholder:text-white/30 h-10 w-full"
                      className="w-full text-black"
                      placeholder="Departure City"
                    />
                  </div>
                </div>

                <div className="flex-[1.5] relative flex items-center bg-white/10 rounded-2xl px-6 py-4 border border-transparent focus-within:border-accent transition-all group">
                  <MapPin className="w-6 h-6 text-accent mr-4" />
                  <div className="flex-1 w-full text-left">
                    <p className="text-xs uppercase font-bold text-accent tracking-widest mb-1">{t("buses.destination", "Destination")}</p>
                    <DestinationAutocomplete 
                      value={dest} 
                      onChange={setDest} 
                      hideIcon
                      inputClassName="!bg-transparent !border-none !outline-none !shadow-none !px-0 flex items-center font-bold text-xl text-white placeholder:text-white/30 h-10 w-full"
                      className="w-full text-black"
                      placeholder="Destination City"
                    />
                  </div>
                </div>

                <div className="flex-1 relative flex items-center bg-white/10 rounded-2xl px-6 py-4 border border-transparent focus-within:border-accent transition-all group">
                  <Calendar className="w-6 h-6 text-white/50 mr-4 group-focus-within:text-accent transition-colors" />
                  <div className="flex-1 text-left">
                     <p className="text-xs uppercase font-bold text-white/50 tracking-widest mb-1">{t("buses.date", "Travel Date")}</p>
                     <input type="date" className="w-full bg-transparent border-none outline-none font-bold text-white text-lg h-10" defaultValue={new Date().toISOString().split('T')[0]} required />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="lg:w-40 h-auto py-6 rounded-2xl bg-accent text-accent-foreground shadow-lg hover:shadow-accent/40 hover:-translate-y-1 transition-all">
                  {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Search className="w-7 h-7 mr-2" /> Search</>}
                </Button>
             </form>
           </motion.div>
        </div>

        {/* Results grid */}
        <AnimatePresence>
          {searched && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar Filters Simulation */}
              <div className="lg:col-span-3 hidden lg:block space-y-6">
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                   <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">Filters</h3>
                   <div className="space-y-4">
                     <div>
                       <p className="font-semibold mb-2">Bus Type</p>
                       <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked readOnly/> AC (3)</label>
                       <label className="flex items-center gap-2 text-sm mt-1"><input type="checkbox" /> Non-AC (1)</label>
                       <label className="flex items-center gap-2 text-sm mt-1"><input type="checkbox" checked readOnly/> Sleeper (2)</label>
                     </div>
                   </div>
                </div>
              </div>

              {/* Bus Results */}
              <div className="lg:col-span-9 space-y-5">
                {mockBusesData.map((bus, idx) => (
                   <motion.div 
                     key={bus.id}
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: idx * 0.1 }}
                     className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                   >
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-4 mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                             {bus.operator}
                             <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded flex items-center gap-1">★ {bus.rating}</span>
                          </h3>
                          <p className="text-sm text-muted-foreground">{bus.type}</p>
                        </div>
                        <div className="flex gap-3 mt-3 md:mt-0 opacity-70 text-muted-foreground">
                           <div className="flex items-center gap-1 text-xs"><Snowflake className="w-4 h-4"/> A/C</div>
                           <div className="flex items-center gap-1 text-xs"><Usb className="w-4 h-4"/> Charger</div>
                           <div className="flex items-center gap-1 text-xs"><Coffee className="w-4 h-4"/> Rest Stop</div>
                        </div>
                     </div>

                     <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex-1 flex items-center gap-4 w-full">
                           <div className="text-center">
                             <p className="text-xl font-bold">{bus.depTime}</p>
                             <p className="text-xs text-muted-foreground">{origin}</p>
                           </div>
                           <div className="flex-1 flex flex-col items-center">
                             <p className="text-xs text-muted-foreground mb-1">{bus.dur}</p>
                             <div className="w-full h-[1px] border-t-2 border-dashed border-border relative">
                                <ArrowRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground bg-card px-0.5" />
                             </div>
                           </div>
                           <div className="text-center">
                             <p className="text-xl font-bold">{bus.arrTime}</p>
                             <p className="text-xs text-muted-foreground">{dest}</p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-4 md:mt-0">
                           <div className="text-left md:text-right">
                             <p className="text-2xl font-black text-foreground">{formatPrice(bus.price)}</p>
                             <p className="text-xs text-destructive font-semibold">{bus.seats} {t("buses.seats_left", "Seats Left!")}</p>
                           </div>
                           <Link to={`/payment/mock-bus-${bus.id}`} state={{ amount: bus.price, service: `${bus.operator} - ${bus.type}` }}>
                             <Button className="bg-primary text-primary-foreground font-bold px-6 py-6 rounded-xl hover:-translate-y-1 transition-transform">{t("buses.view_seats", "View Seats")}</Button>
                           </Link>
                        </div>
                     </div>
                   </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Buses;
