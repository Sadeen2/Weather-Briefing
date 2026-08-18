import { motion, useReducedMotion } from "framer-motion";
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  SunMedium,
  ThermometerSun,
} from "lucide-react";

function conditionKey(condition: string) {
  const value = condition.toLowerCase();

  if (value.includes("storm")) return "storm";
  if (value.includes("rain")) return "rain";
  if (value.includes("fog")) return "fog";
  if (value.includes("overcast")) return "cloudy";
  if (value.includes("cloud")) return "cloudy";
  if (value.includes("sunny") || value.includes("clear")) return "clear";
  return "clear";
}

export function WeatherGlyph({ condition, className = "" }: { condition: string; className?: string }) {
  const reduceMotion = useReducedMotion();
  const key = conditionKey(condition);

  const icon = (() => {
    switch (key) {
      case "storm":
        return <CloudLightning className="h-full w-full" />;
      case "rain":
        return <CloudRain className="h-full w-full" />;
      case "fog":
        return <CloudFog className="h-full w-full" />;
      case "cloudy":
        return <Cloud className="h-full w-full" />;
      default:
        return <CloudSun className="h-full w-full" />;
    }
  })();

  return (
    <motion.div
      className={`relative flex items-center justify-center rounded-[1.8rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(229,244,255,0.65))] text-sky-600 shadow-soft ring-1 ring-white/80 ${className}`}
      animate={reduceMotion ? undefined : key === "clear" ? { y: [0, -2, 0] } : key === "rain" ? { y: [0, 1, 0] } : { x: [0, 2, 0] }}
      transition={reduceMotion ? undefined : { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 rounded-[1.8rem] bg-[radial-gradient(circle_at_top,#FFFFFF_0%,rgba(255,255,255,0.0)_55%)]" />
      {icon}
      {key === "clear" ? <SunMedium className="absolute left-3 top-3 h-4 w-4 text-cirra-sun" /> : null}
      {key === "clear" ? <ThermometerSun className="absolute bottom-3 right-3 h-4 w-4 text-cirra-sun/70" /> : null}
      <span className="sr-only">{condition}</span>
    </motion.div>
  );
}
