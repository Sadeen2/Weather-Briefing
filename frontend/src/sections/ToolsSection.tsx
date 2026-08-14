import { motion } from "framer-motion";
import { ArrowLeftRight, ArrowRight, Cloud, CloudRain, Heart, MapPin, Sparkles, SunMedium, TriangleAlert } from "lucide-react";
import { cirraTools } from "../services/cirra";
import { GlassCard } from "../components/GlassCard";
import { SectionHeader } from "../components/SectionHeader";

const ICONS = {
  search_city: MapPin,
  get_weather: SunMedium,
  get_forecast: Cloud,
  create_weather_briefing: Sparkles,
  compare_weather: ArrowLeftRight,
  get_weather_alerts: TriangleAlert,
  save_favorite_city: Heart,
  list_favorite_cities: CloudRain,
} as const;

export function ToolsSection() {
  return (
    <section id="tools">
      <SectionHeader
        eyebrow="MCP"
        title="Cirra Tools"
        subtitle="A friendly showcase of the MCP capabilities behind the experience, presented as product cards rather than developer docs."
      />

      <GlassCard>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cirraTools.map((tool, index) => {
            const Icon = ICONS[tool.name as keyof typeof ICONS] ?? Cloud;

            return (
              <motion.article
                key={tool.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.03 }}
                className="rounded-[1.5rem] border border-white/75 bg-white/75 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-emerald-700">{tool.status}</div>
                </div>
                <div className="mt-4 text-lg font-extrabold text-cirra-ink">{tool.title}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.24em] text-sky-600">{tool.name}</div>
                <p className="mt-3 text-sm leading-6 text-cirra-muted">{tool.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tool.inputs.length > 0 ? tool.inputs.map((input) => (
                    <span key={input} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-cirra-ink ring-1 ring-sky-100/80">{input}</span>
                  )) : <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-cirra-ink ring-1 ring-sky-100/80">none</span>}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-sky-700">
                  View capability <ArrowRight className="h-4 w-4" />
                </div>
              </motion.article>
            );
          })}
        </div>
      </GlassCard>
    </section>
  );
}
