import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        flights: "Flights",
        hotels: "Hotels",
        planner: "AI Planner",
        explore: "Explore",
        bookings: "Bookings",
        trains: "Trains",
        buses: "Buses",
        profile: "Profile",
        logout: "Sign Out",
        dark_mode: "Dark Mode",
        light_mode: "Light Mode",
        language: "Language",
        back: "Back to Home",
        dining: "Dining",
        community: "Community",
        guides: "Guides"
      },
      common: {
        back: "Back",
        select: "Select",
        service: "Service",
        date: "Date",
        searching: "Searching..."
      },
      hero: {
        badge: "Your Journey Begins Here",
        title: "Discover the World,",
        title_accent: "One Trip at a Time",
        subtitle: "Curated travel experiences across India and beyond. Budget-friendly packages and unforgettable memories.",
        search_placeholder: "Where to next?",
        cta: "Explore Now",
        stats: {
          dest: "Destinations",
          travelers: "Happy Travelers",
          rating: "Rating"
        }
      },
      planner: {
        title: "Plan Your Dream Trip",
        subtitle: "Tell us your preferences and our AI will create a personalized day-by-day itinerary for you.",
        destination: "Destination",
        dest_placeholder: "e.g. Rajasthan, Bali, Switzerland...",
        duration: "Duration",
        dur_placeholder: "e.g. 5 days",
        budget: "Budget",
        budget_placeholder: "e.g. ₹50,000",
        travelers: "Travelers",
        generate: "Create Itinerary"
      },
      flights: {
        title: "Find the Best Flights",
        subtitle: "Live Global Data Pipeline. Compare real prices now.",
        from: "From",
        from_placeholder: "Origin City",
        to: "To",
        to_placeholder: "Destination City",
        departure: "Departure",
        search: "Search Flights",
        scanning: "Scanning globally...",
        contacting: "Contacting Global Matrix...",
        placeholder_hint: "Enter your route above to pull live data from global carriers.",
        results_header: "Real-time Flights",
        results_count: "Results Found",
        select: "Select"
      },
      interests: {
        culture: "Culture & History",
        adventure: "Adventure Sports",
        beach: "Beach & Relaxation",
        wildlife: "Wildlife",
        food: "Food & Cuisine",
        photography: "Photography",
        shopping: "Shopping",
        spiritual: "Spiritual & Wellness",
        nightlife: "Nightlife",
        family: "Family Activities"
      },
      hotels: {
        title: "Book Your Stay",
        subtitle: "Find the perfect hotel, resort, or homestay for your trip.",
        check_in: "Check-in",
        check_out: "Check-out",
        guests: "Guests",
        search: "Search Hotels",
        results_header: "Top Properties in",
        select_room: "Select Room"
      },
      trains: {
        title: "IRCTC Bookings",
        subtitle: "Fast, secure, and hassle-free train reservations.",
        from: "From Station",
        to: "To Station",
        date: "Journey Date",
        search: "Search Trains",
        discovering: "Discovering Routes...",
        results_header: "Trains Found",
        live_availability: "Live Availability"
      },
      buses: {
        title: "Comfortable Road Travel",
        subtitle: "Book premium Volvo and Sleeper buses.",
        origin: "Origin",
        destination: "Destination",
        date: "Pickup Date",
        search: "Search Buses",
        view_seats: "View Seats",
        seats_left: "Seats Left!"
      },
      payment: {
        title: "Complete your booking",
        reference: "Booking Reference",
        summary: "Order Summary",
        total: "Total Amount",
        taxes: "Taxes & Fees",
        default_service: "Premium Travel Service",
        secure_notice: "100% secure payment. Supported: Cards, UPI, NetBanking.",
        test_mode: "This is a test mode integration. No real money will be deducted.",
        pay: "Pay",
        success_title: "Booking Confirmed!",
        success_subtitle: "Thank you for your payment. Your adventure awaits.",
        view_bookings: "View My Bookings",
        trips: {
          title: "My Saved AI Trips",
          no_trips: "No trips planned yet",
          no_trips_subtitle: "Use the AI Trip Planner to generate and save your first itinerary.",
          start_planning: "Start Planning Now",
          plan_new: "Plan New Trip",
          generate_similar: "Generate Similar",
          share_wa: "Share on WhatsApp",
          download_pdf: "Download PDF",
          itinerary_day: "Day-by-Day Itinerary",
          highlights: "Highlights",
          travel_tips: "Travel Tips"
        }
      }
    }
  },
  hi: {
    translation: {
      nav: {
        home: "मुख्य पृष्ठ",
        flights: "उड़ानें",
        hotels: "होटल",
        planner: "AI प्लानर",
        explore: "एक्सप्लोर",
        bookings: "मेरी बुकिंग",
        trains: "ट्रेनें",
        buses: "बसें",
        profile: "प्रोफ़ाइल",
        logout: "लॉग आउट",
        dark_mode: "डार्क मोड",
        light_mode: "लाइट मोड",
        language: "भाषा",
        back: "मुख्य पृष्ठ पर वापस",
        dining: "भोजन",
        community: "कम्युनिटी",
        guides: "गाइड्स"
      },
      common: {
        back: "पीछे",
        select: "चुनें",
        service: "सेवा",
        date: "तारीख",
        searching: "खोज रहे हैं..."
      },
      hero: {
        badge: "आपकी यात्रा यहाँ से शुरू होती है",
        title: "दुनिया को देखें,",
        title_accent: "एक समय में एक यात्रा",
        subtitle: "भारत और उसके बाहर के क्यूरेटेड यात्रा अनुभव। बजट अनुकूल पैकेज और अविस्मरणीय यादें।",
        search_placeholder: "अगली यात्रा कहाँ?",
        cta: "अभी एक्सप्लोर करें",
        stats: {
          dest: "गंतव्य",
          travelers: "खुश यात्री",
          rating: "रेटिंग"
        }
      },
      planner: {
        title: "अपनी ड्रीम ट्रिप प्लान करें",
        subtitle: "हमें अपनी पसंद बताएं और हमारा AI आपके लिए एक व्यक्तिगत दिन-प्रतिदिन का यात्रा कार्यक्रम तैयार करेगा।",
        destination: "गंतव्य",
        dest_placeholder: "जैसे: राजस्थान, बाली, स्विट्जरलैंड...",
        duration: "अवधि",
        dur_placeholder: "जैसे: 5 दिन",
        budget: "बजट",
        budget_placeholder: "जैसे: ₹50,000",
        travelers: "यात्री",
        generate: "योजना बनाएं"
      },
      flights: {
        title: "सबसे अच्छी उड़ानें खोजें",
        subtitle: "लाइव ग्लोबल डेटा पाइपलाइन। अभी वास्तविक कीमतों की तुलना करें।",
        from: "कहाँ से",
        from_placeholder: "मूल शहर",
        to: "कहाँ तक",
        to_placeholder: "गंतव्य शहर",
        departure: "प्रस्थान",
        search: "उड़ानें खोजें",
        scanning: "विश्व स्तर पर स्कैनिंग...",
        contacting: "ग्लोबल मैट्रिक्स से संपर्क कर रहे हैं...",
        placeholder_hint: "ग्लोबल कैरियर से लाइव डेटा प्राप्त करने के लिए ऊपर अपना मार्ग दर्ज करें।",
        results_header: "रीयल-टाइम उड़ानें",
        results_count: "परिणाम मिले",
        select: "चुनें"
      },
      interests: {
        culture: "संस्कृति और इतिहास",
        adventure: "साहसिक खेल",
        beach: "समुद्र तट और विश्राम",
        wildlife: "वन्यजीव",
        food: "भोजन",
        photography: "फोटोग्राफी",
        shopping: "खरीदारी",
        spiritual: "आध्यात्मिक",
        nightlife: "नाइटलाइफ़",
        family: "पारिवारिक गतिविधियाँ"
      },
      hotels: {
        title: "अपना प्रवास बुक करें",
        subtitle: "अपनी यात्रा के लिए सही होटल, रिज़ॉर्ट या होमस्टे खोजें।",
        check_in: "चेक-इन",
        check_out: "चेक-आउट",
        guests: "अतिथि",
        search: "होटल खोजें",
        results_header: "शीर्ष संपत्तियां यहाँ",
        select_room: "कमरा चुनें"
      },
      trains: {
        title: "IRCTC बुकिंग",
        subtitle: "तेज, सुरक्षित और परेशानी मुक्त ट्रेन आरक्षण।",
        from: "कहाँ से (स्टेशन)",
        to: "कहाँ तक (स्टेशन)",
        date: "यात्रा की तिथि",
        search: "ट्रेन खोजें",
        discovering: "रास्ते खोज रहे हैं...",
        results_header: "ट्रेनें मिलीं",
        live_availability: "लाइव उपलब्धता"
      },
      buses: {
        title: "आरामदायक सड़क यात्रा",
        subtitle: "प्रीमियम वोल्वो और स्लीपर बसें बुक करें।",
        origin: "कहाँ से",
        destination: "कहाँ तक",
        date: "पिकअप तिथि",
        search: "बसें खोजें",
        view_seats: "सीटें देखें",
        seats_left: "सीटें बची हैं!"
      },
      payment: {
        title: "अपनी बुकिंग पूरी करें",
        reference: "बुकिंग संदर्भ",
        summary: "ऑर्डर सारांश",
        total: "कुल राशि",
        taxes: "कर और शुल्क",
        default_service: "प्रीमियम यात्रा सेवा",
        secure_notice: "100% सुरक्षित भुगतान। समर्थित: कार्ड, UPI, नेटबैंकिंग।",
        test_mode: "यह एक टेस्ट मोड एकीकरण है। कोई वास्तविक पैसा नहीं काटा जाएगा।",
        pay: "भुगतान करें",
        success_title: "बुकिंग की पुष्टि हो गई!",
        success_subtitle: "आपके भुगतान के लिए धन्यवाद। आपका रोमांच इंतज़ार कर रहा है।",
        view_bookings: "मेरी बुकिंग देखें",
        trips: {
          title: "मेरे सहेजे गए AI ट्रिप्स",
          no_trips: "अभी तक कोई ट्रिप प्लान नहीं की गई है",
          no_trips_subtitle: "अपनी पहली आईटीनेररी बनाने और सहेजने के लिए AI ट्रिप प्लानर का उपयोग करें।",
          start_planning: "अभी योजना बनाना शुरू करें",
          plan_new: "नई ट्रिप प्लान करें",
          generate_similar: "समान ट्रिप बनाएं",
          share_wa: "व्हाट्सएप पर साझा करें",
          download_pdf: "पीडीएफ डाउनलोड करें",
          itinerary_day: "दिन-प्रतिदिन का यात्रा कार्यक्रम",
          highlights: "मुख्य आकर्षण",
          travel_tips: "यात्रा के टिप्स"
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
