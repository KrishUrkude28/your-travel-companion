# 🌍 TravelSathi - Discover the World, One Trip at a Time

TravelSathi is a comprehensive, AI-powered travel management platform offering curated travel experiences across India and beyond. From budget-friendly packages to seamless bookings and AI-generated itineraries, TravelSathi is designed to create unforgettable memories for every traveler.

---

## 🚀 Features

### 🏨 Bookings & Search
- **Flights**: Real-time flight search and booking integration.
- **Hotels**: Find the best accommodations worldwide.
- **Trains & Buses**: Comprehensive transport options for intercity travel.
- **Restaurants**: Discover top-rated dining spots at your destination.

### 🤖 AI-Powered Planning
- **Trip Planner**: Generate personalized itineraries using AI (Gemini/Groq integration).
- **Saved Trips**: Keep track of your planned journeys.
- **Wishlist**: Save your favorite destinations for later.

### 👥 Community & Content
- **Community Hub**: Share experiences and connect with fellow travelers.
- **Travel Guides**: Access detailed guides and local tips for popular destinations.
- **Member Profiles**: Manage your travel preferences and booking history.

### 🛠️ Advanced Tools
- **Admin Dashboard**: Analytics and management tools for platform administrators.
- **Multi-Currency Support**: View prices in your preferred currency.
- **Internationalization**: Support for multiple languages (i18next).
- **PDF Generation**: Download your itineraries and booking confirmations as PDFs.
- **AI Chatbot**: Get instant help and travel suggestions.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Backend/Database**: [Supabase](https://supabase.com/)
- **Authentication**: Supabase Auth
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Internationalization**: i18next
- **AI Integration**: Google Gemini API & Groq API

---

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KrishUrkude28/your-travel-companion.git
   cd your-travel-companion
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following keys (you can refer to `.env.example` if available):
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_GROQ_API_KEY=your_groq_api_key
   VITE_RAPID_API_KEY=your_rapid_api_key
   VITE_RAPID_API_HOST=sky-scrapper.p.rapidapi.com
   VITE_RAZORPAY_KEY_ID=your_razorpay_key
   ```

### Running the Application

- **Development Mode**:
  ```bash
  npm run dev
  ```
  The app will be available at `http://localhost:5173`.

- **Build for Production**:
  ```bash
  npm run build
  ```

- **Preview Production Build**:
  ```bash
  npm run preview
  ```

---

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components (Shadcn + custom)
├── contexts/       # React Contexts (Auth, Currency, etc.)
├── data/           # Static data and constants
├── hooks/          # Custom React hooks
├── integrations/   # API and external service integrations
├── lib/            # Shared libraries and configurations
├── locales/        # Translation files for i18n
├── pages/          # Main application screens/routes
├── utils/          # Helper functions and utilities
├── App.tsx         # Main application component & routing
└── main.tsx        # Application entry point
```

---

## 📜 Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint to check for code quality.
- `npm run test`: Runs unit tests using Vitest.
- `npm run test:watch`: Runs tests in watch mode.

---

## 🌐 Deployment

The project is live and deployed on **Vercel**. You can access it here:
🚀 **[Live Demo](https://your-travel-companion-delta.vercel.app/)**

Simply connect your GitHub repository to Vercel for automatic deployments on every push.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.
