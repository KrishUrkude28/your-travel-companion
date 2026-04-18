# ✈️ TravelSathi: Your AI-Powered Travel Companion

TravelSathi is a premium, high-performance travel planning and booking platform. Built with an **OLED-optimized Pure Black Dark Mode** and powered by state-of-the-art AI, it provides a seamless and battery-efficient experience for modern travelers.

![Home Page](file:///C:/Users/asus/.gemini/antigravity/brain/8b2c09eb-9fc3-456c-bef9-343caabdc1dd/home_page_search_bar_fix_1776522793093.png)

---

## 🌟 Key Features

### 🧠 AI Trip Planner
- **Intelligent Itineraries**: Generate day-by-day plans using Llama 3.3 70B (via Groq) tailored to your destination, budget, and interests.
- **Multi-Language Support**: Fully localized in English and Hindi (हिन्दी) via `react-i18next`.
- **Weather Predictor**: Real-time packing suggestions based on live weather data at your destination.
- **Budget Tracker**: Integrated per-trip budget monitor to keep your travel expenses in check.

### 🔍 Real-Time Search Pipeline
- **Global Flights**: Live flight comparisons using the SkyScrapper API (RapidAPI).
- **Hotel Discovery**: Find the best stays with real-time pricing and availability.
- **Trains & Buses**: Seamless search for Indian Railways (IRCTC simulation) and premium bus services.

### 💳 Simulated Booking & Payments
- **Secure Checkout**: Integrated Razorpay SDK workflow for a production-ready payment feel.
- **Trust Badges**: PCI-DSS and industry-standard security indicators.

### 📱 Sharing & Portability
- **WhatsApp Share**: Send your AI-generated plans to friends with one click using centralized sharing utilities.
- **PDF Export**: Download professional, print-friendly itineraries (via `jsPDF` and `html2canvas`) for offline use.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Framer Motion (Animations), Lucide Icons
- **State & Backend**: Supabase (Database, Auth & Real-time Notifications)
- **AI Engine**: Groq (Llama 3.3) / Google Gemini
- **APIs**: SkyScrapper (RapidAPI), Open-Meteo (Weather), Nominatim (Geocoding)
- **Testing**: Vitest, React Testing Library, JSDOM
- **UI Components**: Shadcn UI (Tailored for Pure Black mode)

---

## 📸 Screen Gallery

| **AI Trip Planner** | **Itinerary Actions** |
| :---: | :---: |
| ![Planner](file:///C:/Users/asus/.gemini/antigravity/brain/8b2c09eb-9fc3-456c-bef9-343caabdc1dd/trip_planner_page_1776509314291.png) | ![Actions](file:///C:/Users/asus/.gemini/antigravity/brain/8b2c09eb-9fc3-456c-bef9-343caabdc1dd/expanded_trip_card_with_buttons_1776523161392.png) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase Project
- API Keys: Groq, RapidAPI (SkyScrapper)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/travelsathi.git
   cd travelsathi
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_GROQ_API_KEY=your_groq_key
   VITE_RAPID_API_KEY=your_rapidapi_key
   VITE_RAPID_API_HOST=your_rapidapi_host
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

---

## 🧪 Testing

The project includes a robust testing suite for hooks, utilities, and components.
```bash
npm run test
```

---

## 🗺️ Roadmap

- [x] Phase 1: Core UI & Authentication
- [x] Phase 2: AI Planner & Local Features
- [x] Phase 3: Real API Integration (Flights/Hotels)
- [x] Phase 4: Sharing & Export (WhatsApp/PDF)
- [x] Phase 5: Testing Infrastructure & QA Fixes
- [ ] Phase 6: PWA Support & Production Deployment

---

## 📄 License
This project is for educational and portfolio demonstration purposes.

Developed with ❤️ by the TravelSathi Team.
