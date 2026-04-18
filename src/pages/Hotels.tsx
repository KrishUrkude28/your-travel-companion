import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, MapPin, Calendar, Star, Users, Search, Wifi, Coffee, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "react-i18next";
import DestinationAutocomplete from "@/components/DestinationAutocomplete";

const mockHotelsData = [
  { id: 1, name: "Taj Palace Hotel", city: "New Delhi", rating: 4.8, type: "Luxury", price: 12500, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", amenities: ["Free WiFi", "Pool", "Spa"] },
  { id: 2, name: "Le Meridien", city: "New Delhi", rating: 4.6, type: "Premium", price: 8900, img: "https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?w=600&q=80", amenities: ["Breakfast", "Gym"] },
  { id: 3, name: "Holiday Inn Express", city: "New Delhi", rating: 4.2, type: "Business", price: 4200, img: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=600&q=80", amenities: ["Free WiFi", "Breakfast"] },
];

const Hotels = () => {
  const { formatPrice } = useCurrency();
  const { t } = useTranslation();
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState("New Delhi");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      {/* Hero Search Section */}
      <div className="bg-primary/5 py-12 border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{t("hotels.title", "Book Your Stay")}</h1>
            <p className="text-muted-foreground text-lg">{t("hotels.subtitle", "Find the perfect hotel, resort, or homestay for your trip.")}</p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="bg-card p-6 rounded-2xl shadow-elevated border border-border grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
          >
            <div className="md:col-span-4 relative">
              <Label className="flex items-center gap-2 mb-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {t("hotels.destination", "Destination")}</Label>
              <DestinationAutocomplete 
                value={destination} 
                onChange={setDestination} 
                placeholder={t("hotels.dest_placeholder", "City, Hotel Name")} 
                className="w-full"
              />
            </div>

            <div className="md:col-span-3">
              <Label className="flex items-center gap-2 mb-2 text-muted-foreground"><Calendar className="h-4 w-4" /> {t("hotels.check_in", "Check-in")}</Label>
              <Input type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
            </div>

            <div className="md:col-span-3">
              <Label className="flex items-center gap-2 mb-2 text-muted-foreground"><Users className="h-4 w-4" /> {t("hotels.guests", "Guests")}</Label>
              <Input type="text" placeholder={t("hotels.guests_placeholder", "2 Adults, 1 Room")} defaultValue="2 Adults, 1 Room" required />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" className="w-full bg-primary text-primary-foreground h-10" disabled={loading}>
                {loading ? t("common.searching", "Searching...") : <><Search className="h-4 w-4 mr-2"/> {t("hotels.search", "Search")}</>}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-6 max-w-5xl py-12">
        {!searched && !loading && (
          <div className="text-center text-muted-foreground py-20 flex flex-col items-center">
            <Building2 className="h-16 w-16 mb-4 opacity-20" />
            <p>{t("hotels.search_prompt", "Enter your destination above to discover great stays.")}</p>
          </div>
        )}

        {loading && (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t("hotels.loading_rates", "Finding best rates in")} {destination}...</p>
            </div>
        )}

        {searched && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Top Properties in {destination}</h2>
            <div className="grid grid-cols-1 gap-6">
              {mockHotelsData.map((hotel, idx) => (
                <motion.div 
                  key={hotel.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card rounded-2xl border border-border shadow-sm flex flex-col md:flex-row overflow-hidden hover:shadow-card transition-all"
                >
                  {/* Image */}
                  <div className="md:w-1/3 h-56 md:h-auto overflow-hidden">
                    <img src={hotel.img} alt={hotel.name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                  </div>

                  {/* Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-display text-2xl font-bold text-foreground">{hotel.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" /> {destination} <span className="mx-2">•</span> {hotel.type}
                          </p>
                        </div>
                        <div className="bg-accent/10 px-2 py-1 flex items-center gap-1 rounded text-accent font-bold">
                          {hotel.rating} <Star className="h-3 w-3 fill-accent" />
                        </div>
                      </div>

                      <div className="flex gap-4 mt-4">
                        {hotel.amenities.map(amenity => (
                          <div key={amenity} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {amenity === "Free WiFi" && <Wifi className="h-3 w-3" />}
                            {amenity === "Breakfast" && <Coffee className="h-3 w-3" />}
                            {amenity === "Pool" && <Waves className="h-3 w-3" />}
                            {amenity}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between items-end border-t border-border pt-4">
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {formatPrice(hotel.price)}
                        </p>
                        <p className="text-xs text-muted-foreground">+ {formatPrice(Math.floor(hotel.price * 0.18))} taxes per night</p>
                      </div>
                      <Button 
                        onClick={() => navigate(`/payment/hotel-${hotel.id}`, { state: { amount: Math.floor(hotel.price * 1.18), service: `${hotel.name} - ${hotel.type} Room` } })}
                        className="px-8 bg-primary text-primary-foreground rounded-full"
                      >
                        {t("hotels.select_room", "Select Room")}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Hotels;
