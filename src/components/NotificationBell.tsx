import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type?: string;
  created_at: string;
  is_read?: boolean;
}

const typeStyles: Record<string, { label: string; color: string; icon?: string }> = {
  booking: { label: "Travel Update ✈️", color: "text-primary" },
  promo: { label: "Special Offer 🎁", color: "text-accent" },
  alert: { label: "System Alert ⚠️", color: "text-destructive" },
  permit: { label: "Permit Update 📜", color: "text-green-600" },
};

const NotificationBell = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState(() => {
    try {
      return localStorage.getItem("notif_last_seen") || new Date().toISOString();
    } catch (e) {
      return new Date().toISOString();
    }
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetch = async () => {
      try {
        // Fetch actual notifications
        const { data: notifs } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);
        
        // Fetch bookings as notifications (legacy/fallback)
        const { data: bookNotifs } = await supabase
          .from("bookings")
          .select("id, package_title, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        const combined: NotificationItem[] = [
          ...(notifs || []).map(n => ({
            id: n.id,
            title: n.title || "New Notification",
            message: n.message || "",
            type: n.type,
            created_at: n.created_at || new Date().toISOString(),
            is_read: n.is_read
          })),
          ...(bookNotifs || []).map(b => ({
            id: b.id,
            title: `Booking Update: ${b.status || 'Updated'}`,
            message: b.package_title || "Your booking has been updated.",
            type: 'booking',
            created_at: b.created_at || new Date().toISOString()
          }))
        ].sort((a, b) => {
          const timeA = new Date(a.created_at).getTime();
          const timeB = new Date(b.created_at).getTime();
          return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
        }).slice(0, 15);

        setItems(combined);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetch();

    // Real-time subscription for both tables
    const channel = supabase
      .channel("notif-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => fetch())
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings", filter: `user_id=eq.${user.id}` }, () => fetch())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unread = items.filter((n) => n.created_at > lastSeen).length;

  const handleOpen = () => {
    setOpen((prev) => !prev);
    if (!open) {
      const now = new Date().toISOString();
      setLastSeen(now);
      try {
        localStorage.setItem("notif_last_seen", now);
      } catch (e) {
        // Ignore storage errors
      }
    }
  };

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative p-2 rounded-full hover:bg-muted transition-colors"
      >
        <Bell className="h-5 w-5 text-foreground/80" />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center"
            >
              {unread > 9 ? "9+" : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 w-80 bg-card border border-border rounded-2xl shadow-elevated z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="font-semibold text-sm">Notifications</span>
              {items.length > 0 && (
                <span className="text-xs text-muted-foreground">{items.length} total</span>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {items.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No notifications yet
                </div>
              ) : items.map((n) => {
                if (!n) return null;
                const s = typeStyles[n.type || "booking"] || { label: "Notification", color: "text-foreground" };
                const isNew = n.created_at > lastSeen;
                
                let dateStr = "Recently";
                try {
                  if (n.created_at) {
                    dateStr = new Date(n.created_at).toLocaleString("en-IN", { 
                      dateStyle: "medium", 
                      timeStyle: "short" 
                    });
                  }
                } catch (e) {
                  // Fallback to "Recently"
                }

                return (
                  <div
                    key={n.id}
                    className={`px-4 py-3 text-sm transition-colors ${isNew ? "bg-primary/5" : "hover:bg-muted/30"}`}
                  >
                    <p className={`font-semibold ${s.color} mb-0.5`}>{s.label}</p>
                    <p className="text-foreground font-medium">{n.title || "New Message"}</p>
                    <p className="text-muted-foreground text-xs line-clamp-2">{n.message || ""}</p>
                    <p className="text-muted-foreground/60 text-[10px] mt-1.5 flex justify-between items-center">
                      <span>{dateStr}</span>
                      {isNew && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
