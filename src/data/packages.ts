export interface PackageItinerary {
  day: number;
  title: string;
  description: string;
  meals: string[];
}

export interface CostItem {
  label: string;
  amount: number;
}

export interface TravelPackage {
  id: string;
  title: string;
  destinations: string;
  duration: string;
  groupSize: string;
  price: number;
  originalPrice: number;
  highlights: string[];
  type: string;
  description: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: PackageItinerary[];
  costBreakdown: CostItem[];
  heroImage: string;
  galleryImages: string[];
}

export const packages: TravelPackage[] = [
  {
    id: "golden-triangle",
    title: "Golden Triangle Tour",
    destinations: "Delhi → Agra → Jaipur",
    duration: "5 Days / 4 Nights",
    groupSize: "2-8 People",
    price: 14999,
    originalPrice: 19999,
    highlights: ["Taj Mahal Visit", "Hawa Mahal", "Red Fort", "Local Cuisine"],
    type: "Family",
    description:
      "Explore India's most iconic cities on this classic Golden Triangle tour. From the grandeur of Delhi's monuments to the ethereal beauty of the Taj Mahal and the vibrant culture of Jaipur, this journey is a feast for the senses.",
    inclusions: [
      "4-star hotel accommodation",
      "Daily breakfast & dinner",
      "AC transport throughout",
      "Professional English-speaking guide",
      "All monument entry fees",
      "Airport/railway station transfers",
    ],
    exclusions: [
      "Flights / train tickets",
      "Lunch & personal expenses",
      "Travel insurance",
      "Camera fees at monuments",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Delhi", description: "Arrive in Delhi and transfer to hotel. Evening visit to India Gate and Connaught Place for a welcome dinner.", meals: ["Dinner"] },
      { day: 2, title: "Delhi Sightseeing", description: "Full day tour covering Red Fort, Jama Masjid, Chandni Chowk, Qutub Minar, and Humayun's Tomb.", meals: ["Breakfast", "Dinner"] },
      { day: 3, title: "Delhi to Agra", description: "Drive to Agra. Visit Agra Fort in the afternoon. Enjoy sunset view of Taj Mahal from Mehtab Bagh.", meals: ["Breakfast", "Dinner"] },
      { day: 4, title: "Agra to Jaipur", description: "Sunrise visit to Taj Mahal. Drive to Jaipur with a stop at Fatehpur Sikri. Evening at leisure in Jaipur.", meals: ["Breakfast", "Dinner"] },
      { day: 5, title: "Jaipur & Departure", description: "Morning tour of Amber Fort, Hawa Mahal, and City Palace. Afternoon transfer to airport/station.", meals: ["Breakfast"] },
    ],
    costBreakdown: [
      { label: "Accommodation (4 nights)", amount: 8000 },
      { label: "Transport (AC vehicle)", amount: 3000 },
      { label: "Meals (breakfast & dinner)", amount: 2000 },
      { label: "Guide & entry fees", amount: 1500 },
      { label: "Taxes & service charge", amount: 499 },
    ],
    heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
      "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&q=80",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=80",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
      "https://images.unsplash.com/photo-1515091943-9d5c0ad475af?w=800&q=80",
    ],
  },
  {
    id: "bali-paradise",
    title: "Bali Paradise Escape",
    destinations: "Ubud → Seminyak → Nusa Dua",
    duration: "7 Days / 6 Nights",
    groupSize: "2-6 People",
    price: 44999,
    originalPrice: 59999,
    highlights: ["Rice Terraces", "Temple Tours", "Beach Villas", "Spa & Wellness"],
    type: "Honeymoon",
    description:
      "Escape to the island of the gods with this luxurious Bali getaway. Discover lush rice terraces, ancient temples, world-class spas, and pristine beaches on this romantic paradise escape.",
    inclusions: [
      "5-star resort accommodation",
      "Daily breakfast & 3 special dinners",
      "Private airport transfers",
      "Guided temple & rice terrace tours",
      "Couples spa session",
      "Snorkeling excursion",
    ],
    exclusions: [
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Personal shopping & tips",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Bali", description: "Arrive at Ngurah Rai Airport. Private transfer to Ubud resort. Welcome drink and evening at leisure.", meals: ["Dinner"] },
      { day: 2, title: "Ubud Exploration", description: "Visit Tegallalang Rice Terraces, Ubud Monkey Forest, and local art galleries. Evening Balinese dance performance.", meals: ["Breakfast", "Dinner"] },
      { day: 3, title: "Temple Trail", description: "Full day visiting Tirta Empul, Gunung Kawi, and Tanah Lot temples at sunset.", meals: ["Breakfast"] },
      { day: 4, title: "Transfer to Seminyak", description: "Morning yoga session. Transfer to Seminyak beach resort. Afternoon beach time and sunset cocktails.", meals: ["Breakfast"] },
      { day: 5, title: "Spa & Beach Day", description: "Couples spa treatment in the morning. Afternoon free for surfing, shopping, or relaxing by the pool.", meals: ["Breakfast", "Dinner"] },
      { day: 6, title: "Nusa Dua Adventure", description: "Transfer to Nusa Dua. Snorkeling excursion to coral reefs. Water sports and beach club evening.", meals: ["Breakfast"] },
      { day: 7, title: "Departure", description: "Leisurely morning. Check out and private transfer to airport.", meals: ["Breakfast"] },
    ],
    costBreakdown: [
      { label: "Accommodation (6 nights)", amount: 24000 },
      { label: "Transfers & transport", amount: 6000 },
      { label: "Meals & dining", amount: 5500 },
      { label: "Activities & excursions", amount: 6000 },
      { label: "Spa & wellness", amount: 2000 },
      { label: "Taxes & service charge", amount: 1499 },
    ],
    heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
      "https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80",
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=800&q=80",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80",
      "https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ],
  },
  {
    id: "himalayan-adventure",
    title: "Himalayan Adventure",
    destinations: "Shimla → Manali → Rohtang",
    duration: "6 Days / 5 Nights",
    groupSize: "4-12 People",
    price: 12499,
    originalPrice: 16999,
    highlights: ["Snow Activities", "River Rafting", "Camping", "Trekking"],
    type: "Adventure",
    description:
      "Conquer the mighty Himalayas on this adrenaline-packed adventure. From snow-capped peaks to roaring rivers, experience the thrill of mountain life with camping under the stars and white-water rafting.",
    inclusions: [
      "Hotel & camp accommodation",
      "All meals during trek/camp",
      "River rafting session",
      "Trekking gear & guide",
      "Volvo bus Delhi-Shimla-Delhi",
      "Rohtang Pass permit",
    ],
    exclusions: [
      "Personal trekking shoes",
      "Travel insurance",
      "Paragliding / skiing (optional)",
      "Tips & personal expenses",
    ],
    itinerary: [
      { day: 1, title: "Delhi to Shimla", description: "Overnight Volvo from Delhi. Arrive in Shimla by morning. Check in and explore Mall Road and Ridge.", meals: ["Dinner"] },
      { day: 2, title: "Shimla Sightseeing", description: "Visit Jakhoo Temple, Christ Church, and Kufri for horse riding and snow activities.", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 3, title: "Shimla to Manali", description: "Scenic drive through Kullu Valley. Stop at Hanogi Mata Temple and Pandoh Dam. Evening bonfire in Manali.", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 4, title: "Manali Adventure Day", description: "Morning river rafting on Beas River. Afternoon visit Hadimba Temple and Van Vihar. Evening camping setup.", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 5, title: "Rohtang Pass Expedition", description: "Full day excursion to Rohtang Pass (subject to weather). Snow activities, photography, and stunning views.", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 6, title: "Departure", description: "Morning trek to Jogini Waterfall. Afternoon departure via Volvo to Delhi.", meals: ["Breakfast", "Lunch"] },
    ],
    costBreakdown: [
      { label: "Accommodation (5 nights)", amount: 5000 },
      { label: "Transport (Volvo + local)", amount: 3000 },
      { label: "Meals (all inclusive)", amount: 2500 },
      { label: "Activities & permits", amount: 1500 },
      { label: "Taxes & service charge", amount: 499 },
    ],
    heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1585409677983-0f6c41128c1b?w=800&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      "https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=800&q=80",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
    ],
  },
];
