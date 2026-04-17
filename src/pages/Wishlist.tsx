import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import { packages } from "@/data/packages";
import WishlistButton from "@/components/WishlistButton";

const Wishlist = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { items, loading } = useWishlist();

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const saved = items
    .map((i) => packages.find((p) => p.id === i.package_id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Heart className="h-7 w-7 text-destructive fill-destructive" /> My Wishlist
        </h1>
        <p className="text-muted-foreground mb-10">{items.length} saved package{items.length === 1 ? "" : "s"}</p>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : saved.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl shadow-card">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-foreground mb-2">No saved packages yet</h2>
            <p className="text-muted-foreground mb-6">Browse our packages and tap the heart to save them here.</p>
            <Link to="/#packages"><Button>Explore Packages</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saved.map((pkg, idx) => pkg && (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card rounded-2xl overflow-hidden shadow-card group relative"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={pkg.heroImage} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-3 right-3">
                    <WishlistButton packageId={pkg.id} packageTitle={pkg.title} />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-foreground mb-1">{pkg.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{pkg.destinations} • {pkg.duration}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold text-accent">₹{pkg.price.toLocaleString()}</span>
                    <Link to={`/package/${pkg.id}`}>
                      <Button size="sm" variant="ghost">View <ArrowRight className="h-4 w-4 ml-1" /></Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
