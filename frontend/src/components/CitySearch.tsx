import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Sparkles } from "lucide-react";
import type { GeoCity } from "../types/cirra";

export function CitySearch({
  query,
  suggestions,
  loading,
  onQueryChange,
  onSubmit,
  onPickSuggestion,
}: {
  query: string;
  suggestions: GeoCity[];
  loading: boolean;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  onPickSuggestion: (city: GeoCity) => void;
}) {
  return (
    <div className="relative mt-8">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="relative mx-auto flex max-w-3xl items-center gap-3 rounded-[1.4rem] border border-white/80 bg-white/80 p-2 shadow-glass backdrop-blur-xl"
      >
        <div className="flex h-14 flex-1 items-center gap-3 rounded-[1.15rem] bg-sky-50/80 px-4 ring-1 ring-sky-100/80">
          <MapPin className="h-5 w-5 text-sky-600" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search Hebron, Amman, London..."
            aria-label="Search for a city"
            className="h-full w-full bg-transparent text-base font-semibold text-cirra-ink outline-none placeholder:font-medium placeholder:text-cirra-soft"
          />
          <Sparkles className="h-4 w-4 text-cirra-sun" />
        </div>
        <button
          type="submit"
          className="inline-flex h-14 items-center gap-2 rounded-[1.1rem] bg-[linear-gradient(180deg,#74C0FC,#4FA9EE)] px-5 text-sm font-extrabold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Search className="h-4 w-4" />}
          Search
        </button>
      </form>

      <AnimatePresence>
        {suggestions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute left-1/2 z-20 mt-3 w-full max-w-3xl -translate-x-1/2 px-1"
          >
            <div className="overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/90 shadow-glass backdrop-blur-xl">
              {suggestions.map((city, index) => (
                <button
                  key={`${city.name}-${city.latitude}-${index}`}
                  type="button"
                  onClick={() => onPickSuggestion(city)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-sky-50/80 focus-visible:bg-sky-50/80 focus-visible:outline-none"
                >
                  <div>
                    <div className="text-sm font-extrabold text-cirra-ink">{city.name}</div>
                    <div className="text-sm text-cirra-muted">{city.country}</div>
                  </div>
                  <div className="text-right text-xs font-semibold text-cirra-soft">
                    <div>{city.latitude.toFixed(4)}° N</div>
                    <div>{city.longitude.toFixed(4)}° E</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
