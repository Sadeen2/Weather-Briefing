import { motion } from "framer-motion";
import { ArrowLeftRight, RefreshCw } from "lucide-react";
import type { CompareWeatherResult, TemperatureUnit } from "../types/cirra";
import { GlassCard } from "../components/GlassCard";
import { SectionHeader } from "../components/SectionHeader";
import { WeatherGlyph } from "../components/WeatherGlyph";

function unitSymbol(units: TemperatureUnit) {
  return units === "fahrenheit" ? "°F" : "°C";
}

function ComparisonCard({
  city,
  units,
}: {
  city: CompareWeatherResult["city1"];
  units: TemperatureUnit;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/75 bg-white/80 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-extrabold text-cirra-ink">{city.location.name}</div>
          <div className="text-sm font-semibold text-cirra-muted">{city.location.country}</div>
        </div>
        <WeatherGlyph condition={city.conditions} className="h-14 w-14 text-sky-500" />
      </div>
      <div className="mt-5 flex items-end gap-2">
        <div className="text-4xl font-black tracking-tight text-cirra-ink">{city.temperature}</div>
        <div className="pb-1 text-lg font-bold text-sky-600">{unitSymbol(units)}</div>
      </div>
      <div className="mt-2 text-sm font-bold text-cirra-muted">{city.conditions}</div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-sky-50 px-3 py-2 font-semibold text-cirra-muted">
          Humidity<br /><span className="text-base font-extrabold text-cirra-ink">{city.humidity}%</span>
        </div>
        <div className="rounded-2xl bg-sky-50 px-3 py-2 font-semibold text-cirra-muted">
          Wind<br /><span className="text-base font-extrabold text-cirra-ink">{city.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
}

export function CompareSection({
  comparison,
  units,
  city1,
  city2,
  onSwap,
  onCompare,
  loading,
  onCity1Change,
  onCity2Change,
}: {
  comparison: CompareWeatherResult | null;
  units: TemperatureUnit;
  city1: string;
  city2: string;
  onSwap: () => void;
  onCompare: () => void;
  loading: boolean;
  onCity1Change: (value: string) => void;
  onCity2Change: (value: string) => void;
}) {
  return (
    <section id="compare">
      <SectionHeader
        eyebrow="Comparison"
        title="Compare weather"
        subtitle="A smooth side-by-side view for two cities, with the option to swap them instantly."
      />

      <GlassCard>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-[0.24em] text-sky-600">City 1</label>
            <input value={city1} onChange={(event) => onCity1Change(event.target.value)} className="h-12 w-full rounded-2xl border border-sky-100 bg-sky-50/70 px-4 font-semibold text-cirra-ink outline-none focus:ring-2 focus:ring-sky-300" />
          </div>

          <div className="flex items-center justify-center gap-3 py-2 lg:py-0">
            <button type="button" onClick={onSwap} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 transition hover:-translate-y-0.5">
              <ArrowLeftRight className="h-4 w-4" />
            </button>
            <div className="rounded-full bg-cirra-ink px-4 py-1.5 text-sm font-black tracking-[0.28em] text-white">VS</div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-[0.24em] text-sky-600">City 2</label>
            <input value={city2} onChange={(event) => onCity2Change(event.target.value)} className="h-12 w-full rounded-2xl border border-sky-100 bg-sky-50/70 px-4 font-semibold text-cirra-ink outline-none focus:ring-2 focus:ring-sky-300" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={onCompare} className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#74C0FC,#4FA9EE)] px-4 py-2.5 text-sm font-extrabold text-white shadow-soft transition hover:-translate-y-0.5">
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Compare now
          </button>
        </div>

        {comparison ? (
          <motion.div layout className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
            <ComparisonCard city={comparison.city1} units={units} />
            <div className="flex items-center justify-center py-2 text-sm font-black uppercase tracking-[0.4em] text-sky-500 lg:py-0">VS</div>
            <ComparisonCard city={comparison.city2} units={units} />
          </motion.div>
        ) : null}
      </GlassCard>
    </section>
  );
}
