import { MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-ocean-deep text-primary-foreground/80 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-accent" />
              <span className="font-display text-lg font-bold text-primary-foreground">
                Travel<span className="text-accent">Sathi</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Making travel planning simple, affordable, and personalized for everyone.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#destinations" className="hover:text-accent transition-colors">Destinations</a></li>
              <li><a href="#packages" className="hover:text-accent transition-colors">Packages</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Custom Trips</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Travel Types</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Family Vacations</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Honeymoon</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Adventure</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Corporate</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                hello@travelsathi.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                +91 98765 43210
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
