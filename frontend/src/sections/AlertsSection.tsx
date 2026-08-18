import type { WeatherAlertsResult } from "../types/cirra";
import { GlassCard } from "../components/GlassCard";
import { SectionHeader } from "../components/SectionHeader";
import { AlertTriangle, ShieldCheck } from "lucide-react";

function severityClasses(severity: string) {
  if (severity === "high") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (severity === "moderate") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  return "border-sky-200 bg-sky-50 text-sky-700";
}

export function AlertsSection({ alerts }: { alerts: WeatherAlertsResult | null }) {
  return (
    <section id="alerts">
      <SectionHeader
        eyebrow="Safety"
        title="Weather alerts"
        subtitle="Calm, readable alerts when the sky needs attention and a gentle confirmation when it does not."
      />

      <GlassCard>
        {!alerts || alerts.alerts.length === 0 ? (
          <div className="flex items-start gap-4 rounded-[1.5rem] border border-emerald-200 bg-emerald-50/80 p-5 text-emerald-800">
            <ShieldCheck className="mt-1 h-5 w-5 flex-none" />
            <div>
              <div className="text-lg font-extrabold">No active weather alerts</div>
              <p className="mt-1 text-sm font-medium">Conditions currently look safe for the selected city.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {alerts.alerts.map((alert) => (
              <div key={`${alert.city}-${alert.type}`} className={`flex items-start gap-4 rounded-[1.5rem] border p-5 ${severityClasses(alert.severity)}`}>
                <AlertTriangle className="mt-1 h-5 w-5 flex-none" />
                <div>
                  <div className="text-lg font-extrabold">{alert.type}</div>
                  <div className="mt-1 text-sm font-semibold capitalize">{alert.severity} severity</div>
                  <p className="mt-2 text-sm leading-6 opacity-90">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </section>
  );
}
