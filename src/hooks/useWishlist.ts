import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface WishlistItem {
  id: string;
  package_id: string;
  package_title: string;
  created_at: string;
}

export const useWishlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("wishlists")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data as WishlistItem[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const isSaved = (packageId: string) => items.some((i) => i.package_id === packageId);

  const toggle = async (packageId: string, packageTitle: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to save packages.", variant: "destructive" });
      return;
    }
    const existing = items.find((i) => i.package_id === packageId);
    if (existing) {
      const { error } = await supabase.from("wishlists").delete().eq("id", existing.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      setItems((prev) => prev.filter((i) => i.id !== existing.id));
      toast({ title: "Removed", description: `${packageTitle} removed from wishlist.` });
    } else {
      const { data, error } = await supabase
        .from("wishlists")
        .insert({ user_id: user.id, package_id: packageId, package_title: packageTitle })
        .select()
        .single();
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      if (data) setItems((prev) => [data as WishlistItem, ...prev]);
      toast({ title: "Saved", description: `${packageTitle} added to wishlist.` });
    }
  };

  return { items, loading, isSaved, toggle, refresh: fetchItems };
};
