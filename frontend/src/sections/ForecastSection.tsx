import { motion } from "framer-motion";
import type { ForecastResult, TemperatureUnit } from "../types/cirra";
import { GlassCard } from "../components/GlassCard";
import { SectionHeader } from "../components/SectionHeader";
import { WeatherGlyph } from "../components/WeatherGlyph";

function unitSymbol(units: TemperatureUnit) {
  return units === "fahrenheit" ? "°F" : "°C";
}

export function ForecastSection({ forecast, units }: { forecast: ForecastResult; units: TemperatureUnit }) {
  return (
    <section id="forecast">
      <SectionHeader
        eyebrow="Forecast"
        title="Next 7 days"
        subtitle="A compact horizon of what Cirra sees ahead. Swipe on mobile, scan at a glance on desktop."
      />

      <GlassCard className="overflow-hidden">
        <div className="-mx-2 flex gap-4 overflow-x-auto px-2 pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-7 lg:overflow-visible">
          {forecast.forecast.map((day, index) => (
            <motion.article
              key={day.date}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="min-w-[9rem] flex-1 rounded-[1.4rem] border border-white/70 bg-white/70 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-sky-600">
                {new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(new Date(day.date)).toUpperCase()}
              </div>
              <div className="mt-4 flex justify-center">
                <WeatherGlyph condition={day.conditions} className="h-16 w-16 text-sky-500" />
              </div>
              <div className="mt-4 space-y-1 text-center">
                <div className="text-2xl font-black text-cirra-ink">{day.maxTemp}{unitSymbol(units)}</div>
                <div className="text-sm font-semibold text-cirra-soft">Low {day.minTemp}{unitSymbol(units)}</div>
                <div className="pt-1 text-sm font-bold text-cirra-muted">{day.conditions}</div>
              </div>
            </motion.article>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}
