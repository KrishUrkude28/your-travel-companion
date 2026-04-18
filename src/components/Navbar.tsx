import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, Sparkles, User, LogOut, BookOpen, Heart, UserCog, Moon, Sun, Coins, ChevronDown, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useWishlist } from "@/hooks/useWishlist";
import NotificationBell from "@/components/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Destinations", href: "/#destinations" },
  { label: "Flights", href: "/flights" },
  { label: "Hotels", href: "/hotels" },
  { label: "Trains", href: "/trains" },
  { label: "Buses", href: "/buses" },
  { label: "Guides", href: "/guides" },
  { label: "AI Planner", href: "/trip-planner" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { user, signOut } = useAuth();
  const { currency, setCurrency, symbol } = useCurrency();
  const { count: wishlistCount } = useWishlist();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const translatedLinks = [
    { label: t("nav.home"), href: "/", key: "home" },
    { label: t("nav.flights"), href: "/flights", key: "flights" },
    { label: t("nav.hotels"), href: "/hotels", key: "hotels" },
    { label: t("nav.trains"), href: "/trains", key: "trains" },
    { label: t("nav.buses"), href: "/buses", key: "buses" },
    { label: t("nav.planner"), href: "/trip-planner", key: "planner" },
    { label: t("nav.explore"), href: "/#destinations", key: "explore" },
  ];


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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border/50"
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <MapPin className="h-5 w-5 text-accent" />
          <span className="font-display text-lg font-bold text-foreground">
            Travel<span className="text-accent">Sathi</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-5 flex-1 justify-center">
          {translatedLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              {link.key === "planner" && <Sparkles className="h-3 w-3 text-accent" />}
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Controls */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-9 px-3 rounded-full hover:bg-muted flex items-center gap-1.5 transition-colors text-xs font-bold text-foreground border border-border/50 uppercase" aria-label="Language Selector">
                <Languages className="h-3.5 w-3.5 text-accent" />
                {i18n.language.split("-")[0]}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-32 rounded-xl">
              <DropdownMenuItem onClick={() => changeLanguage('en')} className="flex items-center justify-between cursor-pointer">
                English {i18n.language.startsWith('en') && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('hi')} className="flex items-center justify-between cursor-pointer">
                हिंदी {i18n.language.startsWith('hi') && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Currency */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-9 px-3 rounded-full hover:bg-muted flex items-center gap-1.5 transition-colors text-xs font-bold text-foreground border border-border/50" aria-label="Currency Selector">
                <Coins className="h-3.5 w-3.5 text-accent" />
                {currency}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem onClick={() => setCurrency('INR')}>INR (₹) — Indian Rupee</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrency('USD')}>USD ($) — US Dollar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrency('EUR')}>EUR (€) — Euro</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark mode */}
          <button onClick={toggleDarkMode} aria-label="Toggle Dark Mode" className="h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <>
              <NotificationBell />
              <button onClick={() => navigate("/wishlist")} aria-label="Wishlist" className="relative h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                <Heart className="h-4 w-4" />
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
                    <span className="max-w-[80px] truncate text-xs">{user.user_metadata?.full_name || user.email?.split("@")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/profile")}><UserCog className="h-4 w-4 mr-2" /> Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/my-bookings")}><BookOpen className="h-4 w-4 mr-2" /> My Bookings</DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/saved-trips" className="w-full flex items-center cursor-pointer"><Sparkles className="mr-2 h-4 w-4" /><span>Saved AI Trips</span></Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}><LogOut className="h-4 w-4 mr-2" /> Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth"><Button variant="ghost" size="sm">Sign In</Button></Link>
              <Link to="/auth"><Button size="sm">Get Started</Button></Link>
            </div>
          )}
        </div>

        {/* Mobile: Currency + Hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 px-2 rounded-full hover:bg-muted flex items-center gap-1 text-xs font-bold border border-border/50">
                <Coins className="h-3 w-3 text-accent" />{symbol}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCurrency('INR')}>INR (₹)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrency('USD')}>USD ($)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrency('EUR')}>EUR (€)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button onClick={() => setIsOpen(!isOpen)} className="h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors" aria-label="Menu">
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {translatedLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                >
                  {link.key === "planner" && <Sparkles className="h-4 w-4 text-accent" />}
                  {link.label}
                </button>
              ))}
              <div className="border-t border-border pt-3 mt-3 grid grid-cols-2 gap-2">
                <button onClick={toggleDarkMode} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-foreground hover:bg-muted">
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} {isDark ? t("nav.light_mode") : t("nav.dark_mode")}
                </button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-foreground hover:bg-muted">
                            <Languages className="h-4 w-4 text-accent" /> {i18n.language.startsWith('hi') ? 'हिंदी' : 'English'}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeLanguage('hi')}>हिंदी</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {user ? (
                  <>
                    <button onClick={() => { navigate("/wishlist"); setIsOpen(false); }} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-foreground hover:bg-muted">
                      <Heart className="h-4 w-4" /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                    </button>
                    <button onClick={() => { navigate("/profile"); setIsOpen(false); }} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-foreground hover:bg-muted">
                      <UserCog className="h-4 w-4" /> Profile
                    </button>
                    <button onClick={() => { navigate("/my-bookings"); setIsOpen(false); }} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-foreground hover:bg-muted">
                      <BookOpen className="h-4 w-4" /> Bookings
                    </button>
                    <button onClick={signOut} className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm text-destructive bg-destructive/10 hover:bg-destructive/20">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsOpen(false)} className="col-span-2">
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
