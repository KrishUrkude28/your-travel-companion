import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Clock, Users, MapPin, Check, X, Utensils, Camera, Star, Send, MessageSquare, Share2, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { packages } from "@/data/packages";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";
import PhotoGallery from "@/components/PhotoGallery";
import WishlistButton from "@/components/WishlistButton";

const PackageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const pkg = packages.find((p) => p.id === id);
  const { toast } = useToast();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", travelers: "2", date: "", message: "", passportNumber: "",
  });

  useEffect(() => {
    if (pkg) {
      fetchReviews();
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || user.user_metadata?.display_name || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      // Fetching from supabase (assuming package_id was added or using a placeholder)
      const { data, error } = await supabase
        .from("reviews")
        .select(`*, profiles(display_name, avatar_url)`)
        .eq("package_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        // If the table is missing or columns are wrong, we use the fallback
        if (error.code === "PGRST116" || error.code === "42P01") {
          console.info("Using simulated reviews (Database table 'reviews' not yet created).");
        } else {
          console.warn("Reviews fetch error:", error);
        }
        
        // Fallback to static reviews
        setReviews([
          { id: 1, rating: 5, comment: "Absolutely incredible experience! Everything was perfectly organized.", profiles: { display_name: "Rahul Sharma", avatar_url: "" }, created_at: new Date().toISOString() },
          { id: 2, rating: 4, comment: "Great trip, hotels were top-notch. Wish we had one more day in the mountains.", profiles: { display_name: "Anjali Gupta", avatar_url: "" }, created_at: new Date(Date.now() - 86400000).toISOString() }
        ]);
      } else {
        setReviews(data || []);
      }
    } catch (err) {
      console.error("Critical error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Login required", description: "Please sign in to leave a review." });
        return;
    }
    if (!newReview.comment.trim()) return;

    setSubmittingReview(true);
    try {
        const { error } = await supabase.from("reviews").insert({
            user_id: user.id,
            rating: newReview.rating,
            comment: newReview.comment,
            package_id: id
        });
        if (error) throw error;
        toast({ title: "Review Submitted!", description: "Thank you for your feedback." });
        setNewReview({ rating: 5, comment: "" });
        fetchReviews();
    } catch (err: any) {
        toast({ title: "Review Error", description: "Could not submit review at this time.", variant: "destructive" });
    } finally {
        setSubmittingReview(false);
    }
  };

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
      toast({ 
        title: "Authentication Required", 
        description: "Please sign in to book this package.", 
        variant: "destructive" 
      });
      navigate("/auth");
      return;
    }

    // Validation
    const isIndian = form.phone.startsWith("+91") || /^[6-9]\d{9}$/.test(form.phone);
    if (!isIndian && !form.passportNumber) {
      toast({ 
        title: "Information Required", 
        description: "Please provide a Passport Number for international bookings or use an Indian (+91) number.", 
        variant: "destructive" 
      });
      return;
    }

    const phoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
    const internationalPhoneRegex = /^\+\d{1,4}[\-\s]?\d{6,14}$/;
    
    if (!phoneRegex.test(form.phone) && !internationalPhoneRegex.test(form.phone)) {
       toast({ title: "Invalid Phone", description: "Please enter a valid phone number including country code (+91 for India).", variant: "destructive" });
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
        passport_number: form.passportNumber || null,
        status: 'pending'
      });

      if (error) throw error;

      toast({ 
        title: "Booking Request Sent!", 
        description: "A confirmation email simulation has been sent to " + form.email 
      });

      // Simulation of email dispatch
      console.log(`[EMAIL SIM] To: ${form.email} - Subject: Booking Confirmation for ${pkg.title}`);
      
      setForm({ name: "", email: "", phone: "", travelers: "2", date: "", message: "", passportNumber: "" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to submit booking", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const shareOnWhatsApp = () => {
    const text = `✈️ *${pkg.title}*\n\n📍 ${pkg.destinations}\n📅 ${pkg.duration}\n💰 From ${formatPrice(pkg.price)}\n\n*What's included:*\n${pkg.itinerary.slice(0, 3).map(d => `Day ${d.day}: ${d.title}`).join('\n')}\n\nCheck it out on TravelSathi! 🌏`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const downloadAsPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const margin = 15;
    let y = margin;
    const pageH = doc.internal.pageSize.height;
    const addLine = (text: string, size = 11, bold = false, color = '#333333') => {
      if (y > pageH - 20) { doc.addPage(); y = margin; }
      doc.setFontSize(size);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(color);
      const lines = doc.splitTextToSize(text, 180);
      doc.text(lines, margin, y);
      y += lines.length * (size * 0.45) + 3;
    };
    addLine('TravelSathi — Trip Package', 20, true, '#1a4a5a');
    addLine(pkg.title, 16, true);
    addLine(pkg.description.slice(0, 300) + '...', 11);
    addLine(`Location: ${pkg.destinations} | Duration: ${pkg.duration} | Participants: ${pkg.groupSize}`, 10, false, '#666666');
    y += 5;
    pkg.itinerary.forEach(day => {
      addLine(`Day ${day.day}: ${day.title}`, 13, true, '#1a4a5a');
      addLine(day.description, 10);
      if (day.meals?.length) { addLine('Meals: ' + day.meals.join(' • '), 9, false, '#555'); }
      y += 4;
    });
    doc.save(`${pkg.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <div className="relative h-[50vh] overflow-hidden">
        <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            src={pkg.heroImage} 
            alt={pkg.title} 
            className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 container mx-auto">
          <Link to="/#packages">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors cursor-pointer bg-black/20 backdrop-blur-md px-3 py-1 rounded-full w-fit">
              <ArrowLeft className="h-4 w-4" /> Back to Packages
            </motion.div>
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-3 inline-block shadow-glow">{pkg.type}</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">{pkg.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base">
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20"><MapPin className="h-4 w-4 text-accent" /> {pkg.destinations}</span>
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20"><Clock className="h-4 w-4 text-accent" /> {pkg.duration}</span>
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20"><Users className="h-4 w-4 text-accent" /> {pkg.groupSize}</span>
            </div>
          </motion.div>
          
          <div className="mt-6 flex gap-3">
              <Button onClick={shareOnWhatsApp} variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 flex items-center gap-2">
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <Button onClick={downloadAsPDF} variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 flex items-center gap-2">
                <Download className="h-4 w-4" /> PDF
              </Button>
          </div>

          <div className="absolute top-10 right-6 md:right-10">
            <WishlistButton packageId={pkg.id} packageTitle={pkg.title} variant="full" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-16">
            {/* Description */}
            <section className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-accent/30 rounded-full" />
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">Experience Overview</h2>
              <p className="text-muted-foreground text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-accent first-letter:mr-3 first-letter:float-left">
                {pkg.description}
              </p>
            </section>

            {/* Photo Gallery */}
            <section>
              <h2 className="font-display text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Camera className="h-8 w-8 text-accent" /> Visual Journey
              </h2>
              <PhotoGallery images={pkg.galleryImages} title={pkg.title} />
            </section>

            {/* Itinerary */}
            <section>
              <h2 className="font-display text-3xl font-bold text-foreground mb-8">Planned Itinerary</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {pkg.itinerary.map((item) => (
                  <AccordionItem key={item.day} value={`day-${item.day}`} className="border-none rounded-2xl px-6 bg-card shadow-card-hover overflow-hidden transition-all">
                    <AccordionTrigger className="hover:no-underline py-6">
                      <div className="flex items-center gap-6 text-left w-full">
                        <span className="shrink-0 w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-lg font-black shadow-glow">0{item.day}</span>
                        <div className="flex-1">
                            <span className="font-display text-xl font-bold text-foreground block">{item.title}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1 block">Daily Flow</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 pl-20 pr-4">
                      <p className="text-muted-foreground text-lg mb-6 leading-relaxed border-l-2 border-accent/20 pl-6">{item.description}</p>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground bg-accent/10 px-3 py-1.5 rounded-full">
                          <Utensils className="h-4 w-4 text-accent" />
                          {item.meals.join(" • ")}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Community Reviews */}
            <section className="bg-card rounded-3xl p-8 border border-border shadow-elevated">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-accent" /> Guest Experiences
                </h2>
                <div className="flex items-center gap-1 text-2xl font-black text-accent">
                   4.9 <Star className="h-6 w-6 fill-accent" />
                </div>
              </div>

              {/* Add Review Form */}
              {user ? (
                <form onSubmit={handleReviewSubmit} className="mb-12 bg-muted/40 p-6 rounded-2xl border border-dashed border-border group focus-within:border-accent transition-all">
                   <p className="font-bold mb-4 text-sm uppercase tracking-widest text-muted-foreground">Share your feedback</p>
                   <div className="flex gap-2 mb-4">
                      {[1,2,3,4,5].map(s => (
                        <button type="button" key={s} onClick={() => setNewReview({...newReview, rating: s})} className="transition-transform active:scale-95">
                          <Star className={`h-6 w-6 ${s <= newReview.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
                        </button>
                      ))}
                   </div>
                   <Textarea 
                      placeholder="How was your trip? Be descriptive..." 
                      className="bg-background border-none mb-4 resize-none focus-visible:ring-accent"
                      value={newReview.comment}
                      onChange={e => setNewReview({...newReview, comment: e.target.value})}
                   />
                   <Button disabled={submittingReview} className="bg-accent text-accent-foreground font-bold rounded-xl space-x-2">
                       {submittingReview ? "Submitting..." : <><Send className="h-4 w-4" /> <span>Post Review</span></>}
                   </Button>
                </form>
              ) : (
                <div className="mb-12 text-center p-8 border border-dashed rounded-2xl opacity-60">
                    <p className="text-muted-foreground">Sign in to share your trip experience with the community.</p>
                </div>
              )}

              <div className="space-y-8">
                {loadingReviews ? (
                  <p className="text-center py-10 animate-pulse text-muted-foreground">Syncing reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-center py-10 text-muted-foreground">No reviews yet. Be the first!</p>
                ) : (
                  reviews.map((rev, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: i * 0.1 }}
                        key={rev.id} 
                        className="flex gap-4 border-b border-border pb-8 last:border-0"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center font-bold text-primary overflow-hidden border-2 border-white shadow-sm">
                         {rev.profiles?.avatar_url ? <img src={rev.profiles.avatar_url} className="w-full h-full object-cover"/> : (rev.profiles?.display_name?.charAt(0) || "U")}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="font-bold text-foreground">{rev.profiles?.display_name || "Anonymous Guest"}</h4>
                           <div className="flex gap-0.5">
                             {[...Array(5)].map((_, i) => (
                               <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-accent text-accent' : 'text-muted/40'}`} />
                             ))}
                           </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{new Date(rev.created_at).toLocaleDateString("en-US", {dateStyle: 'medium'})}</p>
                        <p className="text-muted-foreground italic leading-relaxed">"{rev.comment}"</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-3xl p-8 shadow-elevated border border-border sticky top-24">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-display text-4xl font-bold text-primary">{formatPrice(pkg.price)}</span>
                <span className="text-muted-foreground text-sm line-through decoration-destructive/30">{formatPrice(pkg.originalPrice)}</span>
              </div>
              <p className="text-xs text-accent font-black mb-8 bg-accent/10 px-2 py-1 rounded inline-block">Flash Deal: Save {formatPrice(pkg.originalPrice - pkg.price)}</p>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Base Fare</span>
                    <span className="text-foreground font-bold">{formatPrice(pkg.price * 0.7)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Accomodation & Meals</span>
                    <span className="text-foreground font-bold">{formatPrice(pkg.price * 0.2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Taxes & Fees</span>
                    <span className="text-foreground font-bold">{formatPrice(pkg.price * 0.1)}</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between items-center">
                    <span className="font-bold text-foreground">Final Price</span>
                    <span className="text-xl font-black text-foreground">{formatPrice(total)}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                    <Send className="h-5 w-5 text-accent" /> Reserve Spot
                </h3>
                {!user && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-accent bg-accent/5 p-3 rounded-xl border border-accent/10 flex items-start gap-2">
                      <div className="shrink-0 pt-0.5">💡</div>
                      <p><Link to="/auth" className="font-bold underline">Login</Link> now to access member-only perks and dashboard sync.</p>
                    </motion.div>
                )}
                <div className="space-y-4">
                    <div>
                    <Label htmlFor="name" className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Full Name</Label>
                    <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="bg-muted/50 border-none h-12 rounded-xl focus-visible:ring-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="travelers" className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Travelers</Label>
                            <Input id="travelers" type="number" min={1} required value={form.travelers} onChange={(e) => setForm({ ...form, travelers: e.target.value })} className="bg-muted/50 border-none h-12 rounded-xl" />
                        </div>
                        <div>
                            <Label htmlFor="date" className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Date</Label>
                            <Input id="date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="bg-muted/50 border-none h-12 rounded-xl text-sm" />
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="email" className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Email Address</Label>
                        <Input id="email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="bg-muted/50 border-none h-12 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="phone" className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Phone Number</Label>
                            <Input id="phone" required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 ..." className="bg-muted/50 border-none h-12 rounded-xl" />
                        </div>
                        <div>
                            <Label htmlFor="passport" className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Passport Number {!(form.phone.startsWith("+91") || /^[6-9]\d{9}$/.test(form.phone)) && <span className="text-destructive">*</span>}</Label>
                            <Input id="passport" value={form.passportNumber} onChange={(e) => setForm({ ...form, passportNumber: e.target.value })} placeholder="Required for Int'l Travel" className="bg-muted/50 border-none h-12 rounded-xl text-sm" />
                        </div>
                    </div>
                </div>
                <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-black bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow" disabled={submitting}>
                  {submitting ? (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                    </div>
                  ) : "Confirm Reservation"}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground">Free cancellation up to 72 hours before departure.</p>
              </form>
            </motion.div>

            {/* Inclusions / Exclusions Compact for Sidebar */}
             <div className="bg-card rounded-3xl p-6 border border-border shadow-sm space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Quick Highlights</h3>
                <div className="space-y-2">
                    {pkg.inclusions.slice(0, 4).map(inc => (
                        <div key={inc} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                            <Check className="h-3 w-3 text-forest-green" /> {inc}
                        </div>
                    ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
