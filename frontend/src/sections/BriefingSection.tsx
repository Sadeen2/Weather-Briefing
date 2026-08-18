import { motion } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import type { BriefingResult } from "../types/cirra";
import { GlassCard } from "../components/GlassCard";
import { SectionHeader } from "../components/SectionHeader";

export function BriefingSection({ briefing, loading }: { briefing: BriefingResult | null; loading: boolean }) {
  return (
    <section id="briefing">
      <SectionHeader
        eyebrow="Intelligence"
        title="Cirra Briefing"
        subtitle="The most useful part of the app: a plain-language summary with practical guidance."
      />

      <GlassCard className="relative overflow-hidden">
        <div className={`pointer-events-none absolute inset-0 ${loading ? "opacity-100" : "opacity-0"} transition-opacity`}>
          <div className="absolute inset-y-0 left-[-40%] w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)] animate-shimmer" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 text-sky-600">
            <Wand2 className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">✦ Cirra Briefing</span>
          </div>

          {briefing ? (
            <>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-cirra-ink sm:text-xl">{briefing.briefing}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {briefing.highlights.map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-cirra-ink ring-1 ring-sky-100/80">
                    <Sparkles className="h-4 w-4 text-cirra-sun" />
                    {item}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-5 rounded-[1.4rem] border border-dashed border-sky-100 bg-sky-50/60 p-8 text-cirra-muted">
              Creating your Cirra briefing...
            </div>
          )}
        </div>
      </GlassCard>
    </section>
  );
}
