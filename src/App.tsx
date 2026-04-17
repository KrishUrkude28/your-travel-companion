import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Index from "./pages/Index.tsx";
import PackageDetail from "./pages/PackageDetail.tsx";
import Auth from "./pages/Auth.tsx";
import MyBookings from "./pages/MyBookings.tsx";
import TripPlanner from "./pages/TripPlanner.tsx";
import Profile from "./pages/Profile.tsx";
import Wishlist from "./pages/Wishlist.tsx";
import NotFound from "./pages/NotFound.tsx";
import Guides from "./pages/Guides.tsx";
import GuideDetail from "./pages/GuideDetail.tsx";
import Payment from "./pages/Payment.tsx";
import Flights from "./pages/Flights.tsx";
import Hotels from "./pages/Hotels.tsx";
import Trains from "./pages/Trains.tsx";
import Buses from "./pages/Buses.tsx";
import SavedTrips from "./pages/SavedTrips.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CurrencyProvider>
          <AuthProvider>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </CurrencyProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
