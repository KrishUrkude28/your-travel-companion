import { useState } from "react";
import { MapPin, Mail, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({
      title: "Subscribed Successfully!",
      description: "You'll now receive our latest travel deals and updates.",
    });
    setEmail("");
  };

  return (
    <footer id="contact" className="bg-ocean-deep text-primary-foreground/80 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-accent" />
              <span className="font-display text-lg font-bold text-primary-foreground">
                Travel<span className="text-accent">Sathi</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-sm">
              Making travel planning simple, affordable, and personalized for everyone. Join our community of travelers today.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex items-center max-w-sm gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground h-10 px-4">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#destinations" className="hover:text-accent transition-colors">Destinations</a></li>
              <li><a href="/#packages" className="hover:text-accent transition-colors">Packages</a></li>
              <li><a href="/trip-planner" className="hover:text-accent transition-colors">Custom Trips</a></li>
              <li><a href="/community" className="hover:text-accent transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Travel Types</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/packages" className="hover:text-accent transition-colors">Family Vacations</a></li>
              <li><a href="/packages" className="hover:text-accent transition-colors">Honeymoon</a></li>
              <li><a href="/packages" className="hover:text-accent transition-colors">Adventure</a></li>
              <li><a href="/hotels" className="hover:text-accent transition-colors">Hotels</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:hello@travelsathi.com" className="hover:text-accent transition-colors">hello@travelsathi.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                <a href="tel:+919876543210" className="hover:text-accent transition-colors">+91 98765 43210</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center text-xs">
          <p>© 2026 TravelSathi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
