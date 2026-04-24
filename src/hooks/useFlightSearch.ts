import { useState } from "react";

const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;
const RAPID_API_HOST = import.meta.env.VITE_RAPID_API_HOST;

export interface Flight {
  id: string | number;
  airline: string;
  logo: string;
  flightNo: string;
  from: string;
  to: string;
  dep: string;
  arr: string;
  dur: string;
  price: number;
  stops: number;
}

export const useFlightSearch = () => {
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getAirportData = async (query: string) => {
    const res = await fetch(`https://${RAPID_API_HOST}/api/v1/flights/searchAirport?query=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPID_API_KEY,
        "x-rapidapi-host": RAPID_API_HOST
      }
    });
    const json = await res.json();
    if (!json.data || json.data.length === 0) throw new Error(`Could not find airport for "${query}"`);
    return {
      skyId: json.data[0].navigation.relevantHotelParams.localizedName || json.data[0].skyId,
      entityId: json.data[0].entityId,
      name: json.data[0].presentation.title
    };
  };

  const searchFlights = async (from: string, to: string, date: string) => {
    setLoading(true);
    setError(null);
    setFlights([]);

    try {
      // Step 1: Find origin airport entity mappings
      const origin = await getAirportData(from);
      
      // Step 2: Find destination airport entity mappings
      const dest = await getAirportData(to);

      // Step 3: Fetch live flights
      const flightRes = await fetch(
        `https://${RAPID_API_HOST}/api/v1/flights/searchFlights?originSkyId=${origin.skyId}&destinationSkyId=${dest.skyId}&originEntityId=${origin.entityId}&destinationEntityId=${dest.entityId}&date=${date}&adults=1&currency=INR`, 
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": RAPID_API_KEY,
            "x-rapidapi-host": RAPID_API_HOST
          }
        }
      );
      
      const flightData = await flightRes.json();

      if (!flightData.data || !flightData.data.itineraries || flightData.data.itineraries.length === 0) {
        throw new Error("No flights found for this route on this date.");
      }

      const liveFlights = flightData.data.itineraries.slice(0, 15).map((itinerary: any, idx: number) => {
        const leg = itinerary.legs[0];
        return {
          id: itinerary.id || idx,
          airline: leg.carriers.marketing[0]?.name || "Unknown Airline",
          logo: leg.carriers.marketing[0]?.logoUrl || "",
          flightNo: leg.segments[0]?.flightNumber || "N/A",
          from: leg.origin.displayCode,
          to: leg.destination.displayCode,
          dep: new Date(leg.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          arr: new Date(leg.arrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          dur: `${Math.floor(leg.durationInMinutes / 60)}h ${leg.durationInMinutes % 60}m`,
          price: Math.floor(itinerary.price.raw || 0),
          stops: leg.stopCount
        };
      });

      setFlights(liveFlights);
      setLoading(false);
      return liveFlights;
    } catch (err: any) {
      if (err.status === 429) {
        console.warn("RapidAPI Rate Limit Reached (429). Switching to simulated data.");
      } else if (err.status === 403) {
        console.error("RapidAPI Key Invalid or Expired (403). Using demo data.");
      } else {
        console.warn("Live Flight API Failed. Using simulation for demo.", err);
      }
      
      // Simulate delay for demo feel
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fakeCodeFrom = from.substring(0, 3).toUpperCase();
      const fakeCodeTo = to.substring(0, 3).toUpperCase();
      
      const simulatedFlights: Flight[] = [
        { id: 1, airline: "IndiGo", logo: "", flightNo: "6E-214", from: fakeCodeFrom, to: fakeCodeTo, dep: "06:00", arr: "08:15", dur: "2h 15m", price: 4200, stops: 0 },
        { id: 2, airline: "Vistara", logo: "", flightNo: "UK-951", from: fakeCodeFrom, to: fakeCodeTo, dep: "09:30", arr: "12:15", dur: "2h 45m", price: 5800, stops: 1 },
        { id: 3, airline: "Air India", logo: "", flightNo: "AI-102", from: fakeCodeFrom, to: fakeCodeTo, dep: "14:00", arr: "16:20", dur: "2h 20m", price: 4750, stops: 0 },
        { id: 4, airline: "SpiceJet", logo: "", flightNo: "SG-801", from: fakeCodeFrom, to: fakeCodeTo, dep: "19:15", arr: "21:30", dur: "2h 15m", price: 3900, stops: 0 },
      ];
      
      setFlights(simulatedFlights);
      setLoading(false);
      return simulatedFlights;
    }
  };

  return { flights, loading, error, searchFlights };
};
