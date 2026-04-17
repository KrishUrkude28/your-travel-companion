import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TrainTrack, Train, Search, Users, IndianRupee, MapPin, Clock, ArrowRightLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mockTrains = [
  { id: "12004", name: "Shatabdi Express", type: "Premium", from: "NDLS (Delhi)", to: "BCT (Mumbai)", dep: "06:15", arr: "22:15", dur: "16h", price: 2850, classes: ["1A", "EC", "CC"] },
  { id: "12952", name: "Rajdhani Express", type: "Premium", from: "NDLS (Delhi)", to: "BCT (Mumbai)", dep: "16:25", arr: "08:15", dur: "15h 50m", price: 3100, classes: ["1A", "2A", "3A"] },
  { id: "12904", name: "Golden Temple Mail", type: "Express", from: "NDLS (Delhi)", to: "BCT (Mumbai)", dep: "07:20", arr: "05:05", dur: "21h 45m", price: 1850, classes: ["2A", "3A", "SL"] },
];

const Trains = () => {
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Background blur */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-background z-0"></div>
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-card rounded-full shadow-elevated mb-4 text-primary">
             <Train className="w-8 h-8" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">IRCTC Bookings</h1>
          <p className="text-muted-foreground text-lg">Fast, secure, and hassle-free train ticket reservations.</p>
        </motion.div>

        {/* Search Panel */}
        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="bg-card/80 backdrop-blur-xl p-8 rounded-3xl shadow-elevated border border-border grid grid-cols-1 md:grid-cols-12 gap-5"
        >
          <div className="md:col-span-4 relative group">
            <Label className="mb-2 block text-muted-foreground text-sm font-semibold tracking-wide">From Station</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <Input className="pl-10 h-14 bg-background/50 border-primary/20 focus:border-primary rounded-xl text-lg" defaultValue="New Delhi (NDLS)" required />
            </div>
          </div>
          
          <div className="md:col-span-1 flex items-center justify-center pt-6 hidden md:flex">
            <motion.button whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.9 }} type="button" className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg shadow-accent/20">
              <ArrowRightLeft className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="md:col-span-4">
            <Label className="mb-2 block text-muted-foreground text-sm font-semibold tracking-wide">To Station</Label>
            <div className="relative">
               <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
               <Input className="pl-10 h-14 bg-background/50 border-accent/20 focus:border-accent rounded-xl text-lg" defaultValue="Mumbai (BCT)" required />
            </div>
          </div>

          <div className="md:col-span-3">
             <Label className="mb-2 block text-muted-foreground text-sm font-semibold tracking-wide">Journey Date</Label>
             <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <Input type="date" className="pl-10 h-14 bg-background/50 rounded-xl" required />
             </div>
          </div>

          <div className="md:col-span-12 mt-2">
            <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 overflow-hidden relative group" disabled={loading}>
              {loading ? (
                <motion.div animate={{ x: [0, 100, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-white/20 skew-x-12"></motion.div>
              ) : null}
              {loading ? "Discovering Routes..." : "Search Trains"}
            </Button>
          </div>
        </motion.form>

        {/* Results */}
        <AnimatePresence>
          {searched && !loading && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-12 space-y-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-display font-bold">3 Trains Found</h2>
                 <span className="text-sm text-green-600 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                   <ShieldCheck className="w-4 h-4"/> Live Availability
                 </span>
              </div>

              {mockTrains.map((train, i) => (
                <motion.div 
                   key={train.id}
                   initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                   whileHover={{ y: -5 }}
                   className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/80"></div>
                  
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* Train Info */}
                    <div className="lg:w-1/3">
                       <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                         {train.name} 
                         <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded uppercase tracking-wider">{train.type}</span>
                       </h3>
                       <p className="text-muted-foreground font-mono mt-1">🚆 #{train.id}</p>
                       <div className="flex gap-2 mt-4">
                         {train.classes.map(c => (
                            <button key={c} onClick={() => setSelectedClass(c)} className={`px-3 py-1 text-sm font-semibold border rounded-lg transition-colors ${selectedClass === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:bg-muted'}`}>
                              {c}
                            </button>
                         ))}
                       </div>
                    </div>

                    {/* Timeline */}
                    <div className="lg:w-1/3 flex items-center justify-between relative px-2">
                        <div className="text-center">
                           <p className="text-2xl font-bold">{train.dep}</p>
                           <p className="text-sm text-muted-foreground">{train.from}</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center mx-4">
                           <span className="text-xs text-muted-foreground mb-1">{train.dur}</span>
                           <div className="w-full h-1 bg-gradient-to-r from-primary/30 via-primary to-accent/30 rounded-full relative">
                              <TrainTrack className="w-4 h-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card rounded-full p-0.5" />
                           </div>
                           <span className="text-xs text-muted-foreground mt-1">Direct</span>
                        </div>
                        <div className="text-center">
                           <p className="text-2xl font-bold">{train.arr}</p>
                           <p className="text-sm text-muted-foreground">{train.to}</p>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="lg:w-1/4 flex flex-col justify-center items-end border-l border-border pl-6">
                        <p className="text-sm text-muted-foreground">Starting from</p>
                        <div className="text-3xl font-bold text-foreground flex items-center my-1">
                           <IndianRupee className="w-6 h-6 mr-1" />{train.price}
                        </div>
                        <p className="text-xs text-green-600 font-semibold mb-3">Available</p>
                        <Link to="/payment/mock-train">
                           <Button className="w-full bg-foreground text-background hover:bg-foreground/90 font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">Select</Button>
                        </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Trains;
