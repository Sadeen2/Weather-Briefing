import { motion } from "framer-motion";
import { Heart, MapPin } from "lucide-react";
import type { CurrentWeather, TemperatureUnit } from "../types/cirra";
import { GlassCard } from "../components/GlassCard";
import { SectionHeader } from "../components/SectionHeader";
import { WeatherGlyph } from "../components/WeatherGlyph";

function unitSymbol(units: TemperatureUnit) {
  return units === "fahrenheit" ? "°F" : "°C";
}

export function FavoritesSection({
  favorites,
  units,
  onPickFavorite,
}: {
  favorites: CurrentWeather[];
  units: TemperatureUnit;
  onPickFavorite: (city: string) => void;
}) {
  return (
    <section id="favorites">
      <SectionHeader
        eyebrow="Saved"
        title="Favorite cities"
        subtitle="Tap a favorite to instantly load its weather and keep the demo flow moving."
      />

      <GlassCard>
        {favorites.length === 0 ? (
          <div className="flex items-start gap-4 rounded-[1.5rem] border border-dashed border-sky-100 bg-sky-50/70 p-5 text-cirra-muted">
            <Heart className="mt-1 h-5 w-5 text-rose-400" />
            <div>
              <div className="text-lg font-extrabold text-cirra-ink">No favorites yet</div>
              <p className="mt-1 text-sm font-medium">Save a city from the current weather card to build your list.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {favorites.map((city) => (
              <motion.button
                key={city.location.name}
                type="button"
                onClick={() => onPickFavorite(city.location.name)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 rounded-[1.5rem] border border-white/80 bg-white/80 p-4 text-left shadow-sm transition hover:shadow-soft"
              >
                <WeatherGlyph condition={city.conditions} className="h-14 w-14 text-sky-500" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-base font-extrabold text-cirra-ink">{city.location.name}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-cirra-muted">
                    <MapPin className="h-3 w-3" />
                    {city.location.country}
                  </div>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <div className="text-2xl font-black text-cirra-ink">{city.temperature}{unitSymbol(units)}</div>
                    <div className="text-xs font-bold text-cirra-muted">{city.conditions}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </GlassCard>
    </section>
  );
}
