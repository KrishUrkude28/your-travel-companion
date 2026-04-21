import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, MapPin, Calendar, Star, Users, Search, Wifi, Coffee, Waves, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "react-i18next";
import DestinationAutocomplete from "@/components/DestinationAutocomplete";

const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;
const RAPID_API_HOST = import.meta.env.VITE_RAPID_API_HOST;

const Hotels = () => {
  const { formatPrice } = useCurrency();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destination, setDestination] = useState("New Delhi");
  const [hotels, setHotels] = useState<any[]>([]);

  const MOCK_HOTELS = [
    { id: "h1", name: "Taj Palace, New Delhi", rating: 5.0, type: "Luxury Hotel", price: 18500, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", amenities: ["Spa", "Fine Dining", "Pool"] },
    { id: "h2", name: "The Oberoi Amarvilas", rating: 4.9, type: "Resort", price: 32000, img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80", amenities: ["View of Taj Mahal", "Pool", "Butler Service"] },
    { id: "h3", name: "ITC Grand Chola", rating: 4.8, type: "Hotel", price: 12000, img: "https://images.unsplash.com/photo-1549333341-c767a4c17715?w=800&q=80", amenities: ["Sustainable", "Gym", "Lounge"] },
    { id: "h4", name: "The Leela Palace, Udaipur", rating: 5.0, type: "Palace Hotel", price: 45000, img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80", amenities: ["Lake View", "Luxury Spa", "Heritage"] },
    { id: "h5", name: "JW Marriott Mussoorie", rating: 4.7, type: "Resort", price: 15500, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", amenities: ["Mountain View", "Kids Club", "Pool"] }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(false);
    setError(null);
    setHotels([]);

    try {
      if (!RAPID_API_KEY || !RAPID_API_HOST) {
         throw new Error("Using fallback data");
      }

      // Step 1: Find destination entity mapping
      const destRes = await fetch(
        `https://${RAPID_API_HOST}/api/v1/hotels/searchDestination?query=${encodeURIComponent(destination)}`,
        {
          headers: { "x-rapidapi-key": RAPID_API_KEY, "x-rapidapi-host": RAPID_API_HOST }
        }
      );
      const destData = await destRes.json();
      
      if (!destData.data || destData.data.length === 0) {
        throw new Error(`Location matching not found for "${destination}"`);
      }
      
      const entityId = destData.data[0].entityId;

      // Step 2: Fetch live hotels
      const hotelRes = await fetch(
        `https://${RAPID_API_HOST}/api/v1/hotels/searchHotels?entityId=${entityId}&currency=INR`,
        {
          headers: { "x-rapidapi-key": RAPID_API_KEY, "x-rapidapi-host": RAPID_API_HOST }
        }
      );
      
      const hotelData = await hotelRes.json();

      if (!hotelData.data || !hotelData.data.hotels || hotelData.data.hotels.length === 0) {
        throw new Error("No live results found.");
      }

      const liveHotels = hotelData.data.hotels.slice(0, 10).map((h: any) => ({
        id: h.hotelId,
        name: h.name,
        rating: h.stars || 4.2,
        type: h.propertyType || "Hotel",
        price: Math.floor(h.price?.raw || (3500 + Math.random() * 8000)),
        img: h.heroImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        amenities: h.relevantAmenities?.slice(0, 3) || ["WiFi", "Breakfast"]
      }));

      setHotels(liveHotels);
      setSearched(true);
    } catch (err: any) {
      console.warn("Using simulation fallback for Hotels:", err.message);
      // Fallback logic
      const cityFiltered = MOCK_HOTELS.map(h => ({
         ...h,
         name: h.name.includes(destination) ? h.name : `${h.name} (${destination})`
      }));
      setHotels(cityFiltered);
      setSearched(true);
    } finally {
      setLoading(false);
    }
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
            className="bg-card p-6 rounded-2xl shadow-elevated border border-border grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative z-[50]"
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
        <AnimatePresence mode="wait">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-center gap-3 mb-8">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!searched && !loading && !error && (
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
              {hotels.map((hotel, idx) => (
                <motion.div 
                  key={hotel.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-card rounded-2xl border border-border shadow-sm flex flex-col md:flex-row overflow-hidden hover:shadow-card transition-all"
                >
                  {/* Image */}
                  <div className="md:w-1/3 h-56 md:h-auto overflow-hidden bg-muted">
                    <img 
                      src={hotel.img.replace('w=800', 'w=600').replace('q=80', 'q=70&auto=format')} 
                      alt={hotel.name} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                  </div>

                  {/* Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="max-w-[80%]">
                          <h3 className="font-display text-2xl font-bold text-foreground leading-tight">{hotel.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" /> {destination} <span className="mx-2">•</span> {hotel.type}
                          </p>
                        </div>
                        <div className="bg-accent/10 px-2 py-1 flex items-center gap-1 rounded text-accent font-bold shrink-0">
                          {hotel.rating} <Star className="h-3 w-3 fill-accent" />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {hotel.amenities.map((amenity: string) => (
                          <div key={amenity} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {amenity.toLowerCase().includes("wifi") && <Wifi className="h-3 w-3" />}
                            {amenity.toLowerCase().includes("breakfast") && <Coffee className="h-3 w-3" />}
                            {amenity.toLowerCase().includes("pool") && <Waves className="h-3 w-3" />}
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
                        onClick={() => navigate(`/payment/hotel-${hotel.id}`, { state: { amount: Math.floor(hotel.price * 1.18), service: `${hotel.name} - ${hotel.type}` } })}
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
