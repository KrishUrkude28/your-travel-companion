import { motion } from "framer-motion";
import { Info, Cloudy, Thermometer, Map, Navigation, ShieldCheck } from "lucide-react";

const insights = [
    { 
        icon: <Cloudy className="h-5 w-5 text-blue-500" />, 
        title: "Bali Weather Alert", 
        detail: "Partly cloudy with pleasant winds. Perfect for beach treks this week.", 
        status: "Good to Go",
        color: "bg-blue-50 text-blue-700 border-blue-100"
    },
    { 
        icon: <Thermometer className="h-5 w-5 text-orange-500" />, 
        title: "Swiss Alps Temps", 
        detail: "Average -2°C. Heavy snow reported in Zermatt. Ski resorts fully open.", 
        status: "Peak Season",
        color: "bg-orange-50 text-orange-700 border-orange-100"
    },
    { 
        icon: <ShieldCheck className="h-5 w-5 text-green-500" />, 
        title: "Safety Update: Iceland", 
        detail: "Vibrant aurora sightings predicted tonight. Safe for solo nocturnal driving.", 
        status: "Verified",
        color: "bg-green-50 text-green-700 border-green-100"
    }
];

const TravelInsights = () => {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
                           <Map className="h-8 w-8 text-primary" /> Live Travel Pulse
                        </h2>
                        <p className="text-muted-foreground mt-1">Real-time snippets from top global destinations.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
                        <Navigation className="h-3 w-3" /> Syncing with Global Data...
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {insights.map((item, i) => (
                        <motion.div 
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-background rounded-lg shadow-sm border border-border">
                                    {item.icon}
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${item.color}`}>
                                    {item.status}
                                </span>
                            </div>
                            <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
                            
                            <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                                <Info className="h-3 w-3" /> Updated 4 mins ago
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TravelInsights;
