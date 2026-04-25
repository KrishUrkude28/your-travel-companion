import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import ChatBot from "@/components/ChatBot";
import BottomNav from "@/components/BottomNav";
import PageLoader from "@/components/PageLoader";

// Lazy Load Pages
const Index = lazy(() => import("./pages/Index.tsx"));
const PackageDetail = lazy(() => import("./pages/PackageDetail.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const MyBookings = lazy(() => import("./pages/MyBookings.tsx"));
const TripPlanner = lazy(() => import("./pages/TripPlanner.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Guides = lazy(() => import("./pages/Guides.tsx"));
const GuideDetail = lazy(() => import("./pages/GuideDetail.tsx"));
const Payment = lazy(() => import("./pages/Payment.tsx"));
const Flights = lazy(() => import("./pages/Flights.tsx"));
const Hotels = lazy(() => import("./pages/Hotels.tsx"));
const Trains = lazy(() => import("./pages/Trains.tsx"));
const Buses = lazy(() => import("./pages/Buses.tsx"));
const SavedTrips = lazy(() => import("./pages/SavedTrips.tsx"));
const Restaurants = lazy(() => import("./pages/Restaurants.tsx"));
const Community = lazy(() => import("./pages/Community.tsx"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CurrencyProvider>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/package/:id" element={<PackageDetail />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/trip-planner" element={<TripPlanner />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/saved-trips" element={<SavedTrips />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/guides/:id" element={<GuideDetail />} />
                <Route path="/payment/:booking_id" element={<Payment />} />
                <Route path="/flights" element={<Flights />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/trains" element={<Trains />} />
                <Route path="/buses" element={<Buses />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/community" element={<Community />} />
                <Route path="/admin" element={<AdminAnalytics />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            {/* Global Components */}
            <ChatBot />
            <BottomNav />
          </AuthProvider>
        </CurrencyProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
