import { describe, it, expect } from "vitest";
import { generateWhatsAppLink } from "../itineraryExport";

describe("itineraryExport utility", () => {
  const mockPlan = {
    title: "Dream Trip to Paris",
    summary: "Discover the magic of the Eiffel Tower, the Louvre, and charming Parisian cafes over 5 unforgettable days.",
    duration: "5 Days",
    estimatedBudget: "$2500",
    itinerary: [],
    tips: ["Wear comfortable shoes", "Learn basic French phrases"]
  };

  it("generates a correct WhatsApp sharing link", () => {
    const mockTrip = { destination: "Paris", duration: "5 Days" };
    const mockItinerary = { highlights: ["Eiffel Tower", "Louvre"] };
    const link = generateWhatsAppLink(mockTrip, mockItinerary);
    
    expect(link).toContain("https://wa.me/?text=");
    expect(link).toContain(encodeURIComponent(mockTrip.destination));
    expect(link).toContain(encodeURIComponent(mockTrip.duration));
    expect(link).toContain(encodeURIComponent("TravelSathi"));
  });

  it("includes fallback text if plan details are missing", () => {
    const link = generateWhatsAppLink({}, {});
    expect(decodeURIComponent(link)).toContain("my dream destination");
  });
});
