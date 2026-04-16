import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Clock, Users, MapPin, Check, X, Utensils, Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { packages } from "@/data/packages";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PhotoGallery from "@/components/PhotoGallery";

const PackageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const pkg = packages.find((p) => p.id === id);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", travelers: "", date: "", message: "",
  });

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="font-display text-3xl font-bold text-foreground">Package not found</h1>
        <Link to="/"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Home</Button></Link>
      </div>
    );
  }

  const total = pkg.costBreakdown.reduce((s, c) => s + c.amount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to book a package.", variant: "destructive" });
      navigate("/auth");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        package_id: pkg.id,
        package_title: pkg.title,
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        travelers: Number(form.travelers),
        travel_date: form.date,
        message: form.message || null,
      });

      if (error) throw error;

      toast({ title: "Booking Request Sent!", description: "We'll get back to you within 24 hours." });
      setForm({ name: "", email: "", phone: "", travelers: "", date: "", message: "" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to submit booking", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <img src={pkg.heroImage} alt={pkg.title} className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsla(200,30%,10%,0.2) 0%, hsla(200,30%,10%,0.75) 100%)" }} />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 container mx-auto">
          <Link to="/#packages">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-4 transition-colors cursor-pointer">
              <ArrowLeft className="h-4 w-4" /> Back to Packages
            </motion.div>
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="px-3 py-1 rounded-full bg-accent/90 text-accent-foreground text-xs font-semibold mb-3 inline-block">{pkg.type}</span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-3">{pkg.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80 text-sm">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {pkg.destinations}</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {pkg.duration}</span>
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {pkg.groupSize}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>
            </motion.section>

            {/* Photo Gallery */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Camera className="h-5 w-5 text-accent" /> Photo Gallery
              </h2>
              <PhotoGallery images={pkg.galleryImages} title={pkg.title} />
            </motion.section>

            {/* Itinerary */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Day-by-Day Itinerary</h2>
              <Accordion type="single" collapsible className="space-y-3">
                {pkg.itinerary.map((item) => (
                  <AccordionItem key={item.day} value={`day-${item.day}`} className="border rounded-xl px-5 bg-card shadow-card">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-4 text-left">
                        <span className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{item.day}</span>
                        <span className="font-display font-semibold text-foreground">{item.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 pl-14">
                      <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Utensils className="h-3.5 w-3.5 text-accent" />
                        {item.meals.join(" • ")}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.section>

            {/* Inclusions / Exclusions */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h3 className="font-display text-lg font-bold text-foreground mb-4">What's Included</h3>
                <ul className="space-y-3">
                  {pkg.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-forest-green shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h3 className="font-display text-lg font-bold text-foreground mb-4">What's Not Included</h3>
                <ul className="space-y-3">
                  {pkg.exclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-2xl p-6 shadow-elevated sticky top-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-display text-3xl font-bold text-foreground">₹{pkg.price.toLocaleString("en-IN")}</span>
                <span className="text-muted-foreground text-sm line-through">₹{pkg.originalPrice.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-xs text-accent font-semibold mb-6">Save ₹{(pkg.originalPrice - pkg.price).toLocaleString("en-IN")}</p>

              <h3 className="font-display text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Cost Breakdown</h3>
              <ul className="space-y-2 mb-4">
                {pkg.costBreakdown.map((item) => (
                  <li key={item.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground font-medium">₹{item.amount.toLocaleString("en-IN")}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border pt-3 flex justify-between text-sm font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">₹{total.toLocaleString("en-IN")}</span>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <h3 className="font-display text-lg font-bold text-foreground">Book This Package</h3>
                {!user && (
                  <p className="text-xs text-accent font-medium">
                    <Link to="/auth" className="underline">Sign in</Link> to save your booking to your account.
                  </p>
                )}
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" required maxLength={15} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="travelers">Travelers</Label>
                    <Input id="travelers" type="number" min={1} max={20} required value={form.travelers} onChange={(e) => setForm({ ...form, travelers: e.target.value })} placeholder="2" />
                  </div>
                  <div>
                    <Label htmlFor="date">Travel Date</Label>
                    <Input id="date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Special Requests</Label>
                  <Textarea id="message" maxLength={500} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Any special requirements..." rows={3} />
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg" disabled={submitting}>
                  {submitting ? "Submitting..." : "Request Booking"}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
