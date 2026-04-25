import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlaneTakeoff, PlaneLanding, Calendar, Search, IndianRupee, ArrowRightLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "react-i18next";
import DestinationAutocomplete from "@/components/DestinationAutocomplete";
import { useFlightSearch } from "@/hooks/useFlightSearch";

// Replace with a default date natively formatted
const today = new Date();
today.setDate(today.getDate() + 7); // Default to 7 days from now
const defaultDate = today.toISOString().split("T")[0];



const Flights = () => {
  const { formatPrice } = useCurrency();
  const { t } = useTranslation();
  const [searched, setSearched] = useState(false);
  const { flights, loading, error, searchFlights } = useFlightSearch();

  const [fromConfig, setFromConfig] = useState("New Delhi");
  const [toConfig, setToConfig] = useState("Goa");
  const [dateStr, setDateStr] = useState(defaultDate);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(false);
    await searchFlights(fromConfig, toConfig, dateStr);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      {/* Hero Search Section */}
      <div className="bg-primary/5 py-12 border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Global Data Pipeline Active
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{t("flights.title", "Find the Best Flights")}</h1>
            <p className="text-muted-foreground text-lg">{t("flights.subtitle", "Connected via SkyScanner live APIs. Compare real prices now.")}</p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="bg-card p-6 rounded-2xl shadow-elevated border border-border grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative z-[100]"
          >
            <div className="md:col-span-3 relative z-[110]">
              <Label className="flex items-center gap-2 mb-2 text-muted-foreground"><PlaneTakeoff className="h-4 w-4" /> {t("flights.from", "From")}</Label>
              <DestinationAutocomplete 
                value={fromConfig} 
                onChange={setFromConfig} 
                placeholder={t("flights.from_placeholder", "City or Airport")} 
                className="w-full"
              />
            </div>
            
            <div className="md:col-span-1 flex justify-center pb-2 hidden md:flex relative z-[110]">
              <Button type="button" variant="ghost" size="icon" className="rounded-full bg-muted text-muted-foreground" onClick={() => {
                const temp = fromConfig;
                setFromConfig(toConfig);
                setToConfig(temp);
              }}>
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="md:col-span-3 relative z-[110]">
              <Label className="flex items-center gap-2 mb-2 text-muted-foreground"><PlaneLanding className="h-4 w-4" /> {t("flights.to", "To")}</Label>
              <DestinationAutocomplete 
                value={toConfig} 
                onChange={setToConfig} 
                placeholder={t("flights.to_placeholder", "City or Airport")} 
                className="w-full"
              />
            </div>

            <div className="md:col-span-3">
              <Label className="flex items-center gap-2 mb-2 text-muted-foreground"><Calendar className="h-4 w-4" /> Departure</Label>
              <Input type="date" required value={dateStr} onChange={e => setDateStr(e.target.value)} />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" className="w-full bg-primary text-primary-foreground h-10" disabled={loading}>
                {loading ? t("flights.scanning", "Scanning globally...") : <><Search className="h-4 w-4 mr-2"/> {t("flights.search", "Search Flights")}</>}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-6 max-w-5xl py-12">
        {loading && (
          <div className="text-center py-20 flex flex-col items-center">
            <PlaneTakeoff className="h-16 w-16 mb-4 text-primary animate-bounce" />
            <p className="text-lg font-semibold animate-pulse">{t("flights.contacting", "Contacting Global Matrix...")}</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20 flex flex-col items-center text-destructive">
            <AlertCircle className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg font-bold">Search Failed</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        )}

        {!searched && !loading && !error && (
          <div className="text-center text-muted-foreground py-20 flex flex-col items-center">
             <PlaneTakeoff className="h-16 w-16 mb-4 opacity-20" />
             <p>{t("flights.placeholder_hint", "Enter your route above to pull live data from global carriers.")}</p>
          </div>
        )}

        {searched && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex justify-between items-end mb-6">
               <h2 className="text-xl font-bold">{t("flights.results_header", "Real-time Flights")}</h2>
               <span className="text-xs font-bold bg-accent/20 text-accent px-3 py-1 rounded-full">{flights.length} {t("flights.results_count", "Results Found")}</span>
            </div>
            
            {flights.map((flight, idx) => (
              <motion.div 
                key={flight.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-card transition-all"
              >
                {/* Airline Info */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  {flight.logo ? (
                     <img src={flight.logo} alt={flight.airline} className="w-10 h-10 object-contain rounded-md" />
                  ) : (
                     <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                       {flight.airline.charAt(0)}
                     </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">{flight.airline}</h3>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Flight #{flight.flightNo}</p>
                  </div>
                </div>

                {/* Timing */}
                <div className="flex items-center justify-center gap-6 flex-1 w-full">
                  <div className="text-right">
                    <p className="font-bold text-xl">{flight.dep}</p>
                    <p className="text-sm font-semibold text-accent">{flight.from}</p>
                  </div>
                  <div className="flex flex-col items-center px-4 w-full max-w-[200px]">
                    <p className="text-xs text-muted-foreground font-medium mb-1">{flight.dur}</p>
                    <div className="w-full h-[2px] bg-border relative rounded-full">
                      <PlaneTakeoff className="h-4 w-4 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-0.5" />
                    </div>
                    <p className={`text-[10px] font-bold mt-1.5 px-2 py-0.5 rounded uppercase ${flight.stops === 0 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {flight.stops === 0 ? "Direct" : `${flight.stops} Stop(s)`}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xl">{flight.arr}</p>
                    <p className="text-sm font-semibold text-primary">{flight.to}</p>
                  </div>
                </div>

                {/* Price & Book */}
                <div className="flex flex-col md:items-end gap-3 min-w-[150px] border-l border-border pl-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Total Price</p>
                  <div className="text-3xl font-bold flex items-center text-foreground -mt-2">
                    {formatPrice(flight.price)}
                  </div>
                  <Link to={`/payment/mock-flight-${flight.flightNo}`} state={{ amount: flight.price, service: `${flight.airline} - ${flight.from} to ${flight.to}` }}>
                    <Button className="w-full md:w-auto px-8 bg-foreground text-background font-bold hover:bg-foreground/90 transition-transform hover:-translate-y-0.5 shadow-xl">
                       {t("flights.select", "Select")}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Flights;
