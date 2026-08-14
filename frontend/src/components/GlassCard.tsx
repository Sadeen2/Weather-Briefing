import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-[2rem] border border-white/75 bg-white/72 p-5 shadow-glass backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}
