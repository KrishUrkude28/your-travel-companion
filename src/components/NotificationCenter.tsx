import { useState, useEffect } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  type: "booking" | "social" | "system";
}

const mockNotifications: AppNotification[] = [
  {
    id: "1",
    title: "Booking Confirmed",
    message: "Your trip to Bali Paradise Escape is confirmed for next week!",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    type: "booking",
  },
  {
    id: "2",
    title: "New Like",
    message: "Sanya Roy liked your post from Agra.",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    type: "social",
  },
  {
    id: "3",
    title: "Welcome to TravelSathi",
    message: "Complete your profile to get personalized travel recommendations.",
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    type: "system",
  },
];

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Close dropdown when clicking outside (simple hack for demo)
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && !(e.target as Element).closest('.notification-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  const getTimeAgo = (dateString: string) => {
    const minutes = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="relative notification-container">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative hover:bg-muted/80 rounded-full h-10 w-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-background" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-card rounded-2xl shadow-elevated border border-border overflow-hidden z-50"
          >
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="font-display font-bold">Notifications</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground">
                  <Check className="h-3 w-3 mr-1" /> Read All
                </Button>
                <Button variant="ghost" size="sm" onClick={clearNotifications} className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="max-h-[350px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center">
                  <Bell className="h-8 w-8 mb-3 opacity-20" />
                  <p>You're all caught up!</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors relative ${!notif.read ? "bg-primary/5" : ""}`}
                    >
                      {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                      <div className="flex items-start justify-between mb-1">
                        <h4 className={`text-sm ${!notif.read ? "font-bold text-foreground" : "font-medium text-foreground/80"}`}>
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                          {getTimeAgo(notif.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-2 bg-muted/30 border-t border-border text-center">
              <Button variant="link" size="sm" className="text-xs text-muted-foreground">
                View all settings
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
