import { useLocation, useNavigate } from "react-router-dom";
import { Home, Plane, MapPin, Sparkles, BookOpen, Camera, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Community", icon: Camera, href: "/community" },
  { label: "AI Plan", icon: Sparkles, href: "/trip-planner", accent: true },
  { label: "Dining", icon: Utensils, href: "/restaurants" },
  { label: "Bookings", icon: BookOpen, href: "/my-bookings" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    if (href.startsWith("/#")) {
      navigate("/");
      setTimeout(() => {
        document.querySelector(href.replace("/", ""))?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      navigate(href);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href) && href !== "/";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <button
              key={tab.label}
              onClick={() => handleNavClick(tab.href)}
              className="relative flex flex-col items-center gap-0.5 py-2 px-3 min-w-[52px] group"
              aria-label={tab.label}
            >
              {tab.accent ? (
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 -mt-5 rounded-2xl bg-primary flex items-center justify-center shadow-elevated"
                >
                  <tab.icon className="h-5 w-5 text-primary-foreground" />
                </motion.div>
              ) : (
                <>
                  {active && (
                    <motion.div
                      layoutId="bottom-nav-indicator"
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                    />
                  )}
                  <tab.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </>
              )}
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  tab.accent ? "text-primary mt-0.5" : active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
