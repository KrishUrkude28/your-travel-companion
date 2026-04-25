import { motion } from "framer-motion";
import { Users, CreditCard, MapPin, TrendingUp, ArrowUpRight, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const revenueData = [
  { name: "Jan", total: 45000 },
  { name: "Feb", total: 52000 },
  { name: "Mar", total: 48000 },
  { name: "Apr", total: 61000 },
  { name: "May", total: 59000 },
  { name: "Jun", total: 84000 },
];

const destinationData = [
  { name: "Goa", value: 400 },
  { name: "Kerala", value: 300 },
  { name: "Manali", value: 300 },
  { name: "Agra", value: 200 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AdminAnalytics() {
  const { user } = useAuth();
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          payments ( amount )
        `)
        .order("created_at", { ascending: false })
        .limit(10);
        
      if (!error && data) {
        setRecentBookings(data);
      }
    };
    fetchBookings();
  }, []);

  // Basic "admin" check (in a real app, this would check a 'role' column in user metadata)
  // We'll just let any logged-in user see this for the demo if they type the URL, but bounce logged out users.
  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen bg-muted/20 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">Platform performance and analytics overview.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-border">Download Report</Button>
            <Button>View Live Traffic</Button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: "Total Revenue", value: "₹3,49,000", icon: CreditCard, trend: "+12.5%", color: "text-green-500" },
            { title: "Active Users", value: "2,845", icon: Users, trend: "+5.2%", color: "text-blue-500" },
            { title: "Total Bookings", value: "842", icon: Activity, trend: "+18.1%", color: "text-accent" },
            { title: "Destinations", value: "48", icon: MapPin, trend: "+2", color: "text-orange-500" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border p-5 rounded-2xl shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold font-display">{stat.value}</h3>
                </div>
                <div className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <span className="text-green-500 flex items-center font-bold">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  {stat.trend}
                </span>
                <span className="text-muted-foreground ml-1.5">vs last month</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Area Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-card border border-border p-6 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold font-display">Revenue Overview</h3>
              <select className="bg-muted text-xs border-none rounded-md px-2 py-1 outline-none">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`₹${value}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top Destinations Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border p-6 rounded-2xl shadow-sm"
          >
            <h3 className="font-bold font-display mb-6">Top Destinations</h3>
            <div className="h-[200px] w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={destinationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {destinationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {destinationData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h3 className="font-bold font-display">Recent Bookings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                <tr>
                  <th className="px-6 py-4 font-bold">User</th>
                  <th className="px-6 py-4 font-bold">Destination</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(recentBookings.length > 0 ? recentBookings.map(b => ({
                  user: b.full_name || "Guest",
                  dest: b.package_title || "Custom Trip",
                  amount: b.payments?.[0]?.amount ? `₹${b.payments[0].amount.toLocaleString()}` : "₹--",
                  status: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : "Confirmed",
                  date: new Date(b.created_at).toLocaleDateString()
                })) : [
                  { user: "Priya Sharma", dest: "Goa Beach Resort", amount: "₹24,500", status: "Confirmed", date: "Today, 10:42 AM" },
                  { user: "Rahul Desai", dest: "Kerala Backwaters", amount: "₹32,000", status: "Confirmed", date: "Today, 09:15 AM" },
                  { user: "Ananya Gupta", dest: "Manali Adventure", amount: "₹18,200", status: "Confirmed", date: "Yesterday" }
                ]).map((row, i) => (
                  <tr key={i} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.user}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.dest}</td>
                    <td className="px-6 py-4 font-medium">{row.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        row.status.toLowerCase() === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        row.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
