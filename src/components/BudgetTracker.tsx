import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiggyBank, Plus, Trash2, TrendingUp, TrendingDown, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Expense {
  id: string;
  label: string;
  amount: number;
  category: string;
  day: number;
}

const CATEGORIES = [
  { label: "Food", emoji: "🍜" },
  { label: "Transport", emoji: "🚌" },
  { label: "Stay", emoji: "🏨" },
  { label: "Activity", emoji: "🎭" },
  { label: "Shopping", emoji: "🛍️" },
  { label: "Other", emoji: "📦" },
];

interface Props {
  budget: string;
  destination: string;
  days: number;
  onClose: () => void;
}

const BudgetTracker = ({ budget, destination, days, onClose }: Props) => {
  const totalBudget = parseFloat(budget.replace(/[^0-9.]/g, "")) || 0;
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try { return JSON.parse(localStorage.getItem(`budget_${destination}`) || "[]"); } catch { return []; }
  });
  const [form, setForm] = useState({ label: "", amount: "", category: "Food", day: 1 });

  const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - spent;
  const pct = totalBudget > 0 ? Math.min((spent / totalBudget) * 100, 100) : 0;

  useEffect(() => {
    localStorage.setItem(`budget_${destination}`, JSON.stringify(expenses));
  }, [expenses, destination]);

  const addExpense = () => {
    if (!form.label || !form.amount) return;
    setExpenses(prev => [...prev, {
      id: Date.now().toString(),
      label: form.label,
      amount: parseFloat(form.amount),
      category: form.category,
      day: form.day,
    }]);
    setForm(f => ({ ...f, label: "", amount: "" }));
  };

  const removeExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));

  const byCategory = CATEGORIES.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.label).reduce((s, e) => s + e.amount, 0),
  })).filter(c => c.total > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-background w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-accent" />
            <div>
              <p className="font-bold text-foreground text-sm">Budget Tracker</p>
              <p className="text-xs text-muted-foreground">{destination}</p>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Budget Overview */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Budget</span>
              <span className="font-bold text-foreground">₹{totalBudget.toLocaleString('en-IN')}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-3 bg-background/60 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${pct > 90 ? "bg-destructive" : pct > 70 ? "bg-yellow-500" : "bg-primary"}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background/60 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-destructive mb-1">
                  <TrendingDown className="h-3.5 w-3.5" /><span className="text-xs font-semibold">Spent</span>
                </div>
                <p className="font-bold text-foreground text-sm">₹{spent.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-background/60 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <TrendingUp className="h-3.5 w-3.5" /><span className="text-xs font-semibold">Remaining</span>
                </div>
                <p className={`font-bold text-sm ${remaining < 0 ? "text-destructive" : "text-green-600"}`}>
                  ₹{Math.abs(remaining).toLocaleString('en-IN')}{remaining < 0 ? " over!" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Add Expense */}
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <p className="font-semibold text-sm text-foreground flex items-center gap-2"><Plus className="h-4 w-4 text-accent" />Add Expense</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                value={form.label}
                onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                placeholder="What for? (e.g. Lunch)"
                className="col-span-2 h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="number"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="Amount (₹)"
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <select
                value={form.day}
                onChange={e => setForm(f => ({ ...f, day: Number(e.target.value) }))}
                className="h-9 rounded-lg border border-input bg-background px-2 text-sm outline-none"
              >
                {Array.from({ length: days }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Day {i + 1}</option>
                ))}
              </select>
              <div className="col-span-2 flex flex-wrap gap-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, category: cat.label }))}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${form.category === cat.label ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={addExpense} size="sm" className="w-full" disabled={!form.label || !form.amount}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          {/* Category breakdown */}
          {byCategory.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">By Category</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {byCategory.map(cat => (
                  <div key={cat.label} className="bg-muted rounded-xl p-3 text-center">
                    <p className="text-lg mb-0.5">{cat.emoji}</p>
                    <p className="text-xs text-muted-foreground">{cat.label}</p>
                    <p className="text-sm font-bold text-foreground">₹{cat.total.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expense list */}
          {expenses.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">All Expenses</p>
              <div className="space-y-2">
                {[...expenses].reverse().map(e => {
                  const cat = CATEGORIES.find(c => c.label === e.category);
                  return (
                    <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 group">
                      <span className="text-lg">{cat?.emoji || "📦"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{e.label}</p>
                        <p className="text-xs text-muted-foreground">Day {e.day} · {e.category}</p>
                      </div>
                      <span className="font-bold text-sm text-foreground shrink-0">₹{e.amount.toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => removeExpense(e.id)}
                        className="h-6 w-6 rounded-full hover:bg-destructive/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {expenses.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Wallet className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No expenses yet. Start adding them!</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BudgetTracker;
