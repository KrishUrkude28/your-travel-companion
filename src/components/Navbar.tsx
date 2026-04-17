import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, Sparkles, User, LogOut, BookOpen, Heart, UserCog, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Destinations", href: "/#destinations" },
  { label: "Flights", href: "/flights" },
  { label: "Hotels", href: "/hotels" },
  { label: "Trains", href: "/trains" },
  { label: "Buses", href: "/buses" },
  { label: "Guides", href: "/guides" },
  { label: "AI Planner", href: "/trip-planner" },
  { label: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { user, signOut } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/#")) {
      navigate("/");
      setTimeout(() => {
        document.querySelector(href.replace("/", ""))?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      navigate(href);
    }
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-accent" />
          <span className="font-display text-xl font-bold text-foreground">
            Travel<span className="text-accent">Sathi</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              {link.label === "AI Planner" && <Sparkles className="h-3.5 w-3.5 text-accent" />}
              {link.label}
            </button>
          ))}

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle Dark Mode"
                className="relative h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                {isDark ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
              </button>
              <button
                onClick={() => navigate("/wishlist")}
                aria-label="Wishlist"
                className="relative h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <Heart className="h-4 w-4 text-foreground" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">{user.user_metadata?.full_name || user.email?.split("@")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserCog className="h-4 w-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/my-bookings")}>
                    <BookOpen className="h-4 w-4 mr-2" /> My Bookings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                    <Heart className="h-4 w-4 mr-2" /> Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-auto text-xs font-semibold text-accent">{wishlistCount}</span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Sign In
              </Button>
            </Link>
          )}
          {!user && (
             <button
                onClick={toggleDarkMode}
                aria-label="Toggle Dark Mode"
                className="relative h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors ml-2"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
             </button>
          )}
        </div>

        <button className="md:hidden text-foreground ml-auto mr-2" onClick={toggleDarkMode}>
          {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Profile</Button>
                  </Link>
                  <Link to="/my-bookings" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">My Bookings</Button>
                  </Link>
                  <Link to="/wishlist" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Wishlist</Button>
                  </Link>
                  <Button size="sm" variant="ghost" className="w-full" onClick={() => { signOut(); setIsOpen(false); }}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="bg-primary text-primary-foreground w-full">Sign In</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
