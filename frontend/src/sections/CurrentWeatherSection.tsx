import { motion } from "framer-motion";
import { Heart, Droplets, Wind, RefreshCw } from "lucide-react";
import type { CurrentWeather, TemperatureUnit } from "../types/cirra";
import { GlassCard } from "../components/GlassCard";
import { WeatherGlyph } from "../components/WeatherGlyph";

function unitSymbol(units: TemperatureUnit) {
  return units === "fahrenheit" ? "°F" : "°C";
}

export function CurrentWeatherSection({
  weather,
  units,
  favorite,
  onSaveFavorite,
  onRefresh,
}: {
  weather: CurrentWeather;
  units: TemperatureUnit;
  favorite: boolean;
  onSaveFavorite: () => void;
  onRefresh: () => void;
}) {
  return (
    <GlassCard className="h-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-sky-600">Current Weather</div>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-cirra-ink sm:text-3xl">{weather.location.name}, {weather.location.country}</h3>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Refresh weather"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 transition hover:-translate-y-0.5"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onSaveFavorite}
            aria-label={favorite ? "Saved to favorites" : "Save to favorites"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 transition hover:-translate-y-0.5"
          >
            <motion.span animate={favorite ? { scale: [1, 1.15, 1] } : undefined} transition={{ duration: 0.35 }}>
              <Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} />
            </motion.span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-5">
          <div className="flex items-end gap-4">
            <div className="text-[4.5rem] font-black leading-none tracking-tight text-cirra-ink sm:text-[5.5rem]">
              {weather.temperature}
            </div>
            <div className="pb-2 text-2xl font-extrabold text-sky-600">{unitSymbol(units)}</div>
          </div>

          <div className="text-xl font-bold text-cirra-muted">{weather.conditions}</div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-sky-50/90 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-cirra-muted"><Droplets className="h-4 w-4 text-sky-500" />Humidity</div>
              <div className="mt-1 text-xl font-extrabold text-cirra-ink">{weather.humidity}%</div>
            </div>
            <div className="rounded-2xl bg-sky-50/90 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-cirra-muted"><Wind className="h-4 w-4 text-sky-500" />Wind</div>
              <div className="mt-1 text-xl font-extrabold text-cirra-ink">{weather.windSpeed} km/h</div>
            </div>
            <div className="rounded-2xl bg-[linear-gradient(180deg,rgba(255,229,173,0.45),rgba(255,255,255,0.65))] px-4 py-3 sm:col-span-1">
              <div className="text-sm font-semibold text-cirra-muted">Location</div>
              <div className="mt-1 text-lg font-extrabold text-cirra-ink">{weather.location.timezone ?? weather.location.country}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <WeatherGlyph condition={weather.conditions} className="flex h-52 w-52 items-center justify-center text-sky-500 sm:h-56 sm:w-56" />
        </div>
      </div>
    </GlassCard>
  );
}
