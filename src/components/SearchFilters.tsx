import { useState, useEffect } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/contexts/CurrencyContext";

export interface FilterState {
  priceRange: [number, number];
  duration: string[];
  tripType: string[];
}

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

const DEFAULT_FILTERS: FilterState = {
  priceRange: [0, 200000],
  duration: [],
  tripType: [],
};

const TRIP_TYPES = ["Adventure", "Luxury", "Budget", "Culture", "Honeymoon", "Family"];
const DURATIONS = [
  { label: "1-3 Days", value: "short" },
  { label: "4-7 Days", value: "medium" },
  { label: "8+ Days", value: "long" },
];

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const toggleTripType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      tripType: prev.tripType.includes(type)
        ? prev.tripType.filter(t => t !== type)
        : [...prev.tripType, type]
    }));
  };

  const toggleDuration = (value: string) => {
    setFilters(prev => ({
      ...prev,
      duration: prev.duration.includes(value)
        ? prev.duration.filter(d => d !== value)
        : [...prev.duration, value]
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
      <div className="flex items-center justify-between mb-6 cursor-pointer sm:cursor-default" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="font-display text-lg font-bold flex items-center gap-2">
          <Filter className="h-5 w-5 text-accent" />
          {t("filters.title", "Filter Packages")}
        </h3>
        <div className="flex items-center gap-2">
          {(filters.tripType.length > 0 || filters.duration.length > 0 || filters.priceRange[1] < 200000) && (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); resetFilters(); }} className="text-xs h-8 text-muted-foreground hover:text-foreground">
              {t("filters.clear", "Clear all")}
            </Button>
          )}
          <Button variant="ghost" size="sm" className="sm:hidden h-8 w-8 p-0">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden sm:block'}`}>
        {/* Price Filter */}
        <div>
          <label className="text-sm font-semibold mb-3 block text-foreground">
            {t("filters.price_range", "Price Range (Max)")}
          </label>
          <input
            type="range"
            min="5000"
            max="200000"
            step="5000"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [0, parseInt(e.target.value)] }))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{formatPrice(0)}</span>
            <span className="font-semibold text-foreground">{formatPrice(filters.priceRange[1])}</span>
          </div>
        </div>

        {/* Trip Type Filter */}
        <div>
          <label className="text-sm font-semibold mb-3 block text-foreground">
            {t("filters.trip_type", "Trip Type")}
          </label>
          <div className="flex flex-wrap gap-2">
            {TRIP_TYPES.map(type => (
              <button
                key={type}
                onClick={() => toggleTripType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filters.tripType.includes(type)
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {t(`filters.types.${type.toLowerCase()}`, type)}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Filter */}
        <div>
          <label className="text-sm font-semibold mb-3 block text-foreground">
            {t("filters.duration", "Duration")}
          </label>
          <div className="flex flex-col gap-2">
            {DURATIONS.map(d => (
              <label key={d.value} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  filters.duration.includes(d.value)
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-input group-hover:border-primary/50"
                }`}>
                  {filters.duration.includes(d.value) && <X className="h-3 w-3" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={filters.duration.includes(d.value)}
                  onChange={() => toggleDuration(d.value)}
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {t(`filters.durations.${d.value}`, d.label)}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
