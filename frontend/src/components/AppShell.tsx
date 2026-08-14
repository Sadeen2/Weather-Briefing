import { motion, useReducedMotion } from "framer-motion";
import {
  Cloud,
  CloudSun,
  Heart,
  Menu,
  Sparkles,
  Navigation,
} from "lucide-react";
import type { ReactNode } from "react";

const navItems = ["Weather", "Forecast", "Compare", "Briefing", "Favorites"];

function SkyCloud({ className }: { className: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className={className}
      animate={reduceMotion ? undefined : { x: [0, 18, 0], y: [0, -10, 0] }}
      transition={reduceMotion ? undefined : { duration: 28, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      <Cloud className="h-full w-full text-white/70 drop-shadow-[0_12px_30px_rgba(120,170,220,0.22)]" strokeWidth={1.3} />
    </motion.div>
  );
}

function SkyBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#F8FCFF_0%,#EEF7FF_44%,#FFFFFF_100%)]" />
      <motion.div
        className="absolute left-0 top-0 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl"
        animate={{ x: [0, 24, 0], y: [0, 18, 0] }}
        transition={{ duration: 26, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-5rem] top-24 h-[30rem] w-[30rem] rounded-full bg-sky-100/80 blur-3xl"
        animate={{ x: [0, -24, 0], y: [0, -12, 0] }}
        transition={{ duration: 34, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-[#FFE5AD]/20 blur-3xl"
        animate={{ x: [0, 16, 0], y: [0, -8, 0] }}
        transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <SkyCloud className="absolute left-8 top-24 h-24 w-24 opacity-40" />
      <SkyCloud className="absolute right-16 top-40 h-28 w-28 opacity-30" />
      <SkyCloud className="absolute bottom-20 left-1/3 h-20 w-20 opacity-25" />
    </div>
  );
}

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(229,244,255,0.9))] shadow-soft ring-1 ring-white/80">
        <CloudSun className="h-6 w-6 text-sky-600" />
        <Sparkles className="absolute right-1 top-1 h-3 w-3 text-cirra-sun" />
      </div>
      <div>
        <div className="text-lg font-extrabold tracking-tight text-cirra-ink">Cirra</div>
        <div className="text-xs font-medium text-cirra-soft">Weather, made clear.</div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-sky-50 text-cirra-ink selection:bg-sky-300/50 selection:text-cirra-ink">
      <SkyBackdrop />

      <header className="relative z-20 px-4 pt-4 sm:px-6 lg:px-8">
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 rounded-full border border-white/70 bg-white/70 px-4 py-3 shadow-glass backdrop-blur-xl sm:px-6"
        >
          <LogoMark />

          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-cirra-muted transition hover:text-cirra-ink">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-700 sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(34,197,94,0.14)]" />
              MCP Connected
            </div>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-cirra-ink shadow-soft ring-1 ring-white/80 transition hover:-translate-y-0.5 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </motion.nav>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1400px] px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="relative z-10 px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 rounded-[2rem] border border-white/70 bg-white/60 px-5 py-4 text-sm text-cirra-muted shadow-soft backdrop-blur-xl">
          <div>
            <div className="font-extrabold text-cirra-ink">Cirra</div>
            <div>Weather, made clear.</div>
          </div>
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-sky-600" />
            Powered by Open-Meteo + MCP
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Heart className="h-4 w-4 text-rose-400" />
            Built for NextFlows Academy
          </div>
        </div>
      </footer>
    </div>
  );
}
