import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  package_title: string;
  status: string;
  created_at: string;
}

const NotificationBell = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState<string>(() =>
    localStorage.getItem("notif_last_seen") || new Date(0).toISOString()
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id, package_title, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) setItems(data);
    };
    fetch();

    // Real-time subscription
    const channel = supabase
      .channel("bookings-notif")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings", filter: `user_id=eq.${user.id}` }, () => {
        fetch();
      })
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
      localStorage.setItem("notif_last_seen", now);
    }
  };

  const statusLabel: Record<string, { label: string; color: string }> = {
    confirmed: { label: "Booking Confirmed ✅", color: "text-green-600" },
    cancelled: { label: "Booking Cancelled ❌", color: "text-red-500" },
    pending: { label: "Booking Pending ⏳", color: "text-amber-500" },
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
                const s = statusLabel[n.status] || { label: n.status, color: "text-foreground" };
                const isNew = n.created_at > lastSeen;
                return (
                  <div
                    key={n.id}
                    className={`px-4 py-3 text-sm ${isNew ? "bg-primary/5" : ""}`}
                  >
                    <p className={`font-semibold ${s.color} mb-0.5`}>{s.label}</p>
                    <p className="text-foreground truncate">{n.package_title}</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {new Date(n.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
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
