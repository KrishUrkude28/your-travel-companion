import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

// Lazy load non-critical sections
const DestinationsSection = lazy(() => import("@/components/DestinationsSection"));
const PackagesSection = lazy(() => import("@/components/PackagesSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const TravelInsights = lazy(() => import("@/components/TravelInsights"));
const CTASection = lazy(() => import("@/components/CTASection"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      <Suspense fallback={<div className="h-96 flex items-center justify-center animate-pulse bg-muted/50 rounded-3xl m-6">Loading sections...</div>}>
        <DestinationsSection />
        <PackagesSection />
        <TravelInsights />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
