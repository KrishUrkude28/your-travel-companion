import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Suggestion {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  hideIcon?: boolean;
  id?: string;
}

const DestinationAutocomplete = ({ value, onChange, placeholder = "e.g. Rajasthan, Bali...", className = "", inputClassName = "", hideIcon = false, id }: Props) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const cacheRef = useRef<Record<string, Suggestion[]>>({});

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) { setSuggestions([]); setOpen(false); return; }
    
    // Check Cache
    if (cacheRef.current[query]) {
      setSuggestions(cacheRef.current[query]);
      setOpen(cacheRef.current[query].length > 0);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=20&language=en&format=json`
      );
      const data = await res.json();
      
      const results: Suggestion[] = (data.results || [])
        .filter((r: any) => r.country === "India" || r.country_code === "IN")
        .slice(0, 6)
        .map((r: any) => ({
          name: r.name,
          country: r.country,
          admin1: r.admin1,
          latitude: r.latitude,
          longitude: r.longitude,
        }));
        
      // Update Cache
      cacheRef.current[query] = results;
      
      setSuggestions(results);
      setOpen(results.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (val: string) => {
    onChange(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSelect = (s: Suggestion) => {
    const label = s.admin1 ? `${s.name}, ${s.admin1}, ${s.country}` : `${s.name}, ${s.country}`;
    onChange(label);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={(e) => {
             e.target.select();
             if (suggestions.length > 0) setOpen(true);
          }}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full h-10 rounded-md border border-input bg-background px-3 py-2 ${hideIcon ? 'pl-3' : 'pl-9'} text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${inputClassName}`}
        />
        {!hideIcon && <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />}
      </div>

      {open && suggestions.length > 0 && (
        <ul
          className="absolute z-[999999] left-0 right-0 mt-1 bg-white dark:bg-[#1a1c2e] border border-border rounded-xl shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto"
        >
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => handleSelect(s)}
                className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex flex-col gap-0.5 border-b border-border/50 last:border-0"
              >
                <span className="font-bold text-slate-900 dark:text-white">{s.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {s.admin1 ? `${s.admin1}, ` : ""}{s.country}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DestinationAutocomplete;
