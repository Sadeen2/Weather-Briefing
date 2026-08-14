import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <div className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-sky-600">{eyebrow}</div> : null}
        <h2 className="text-2xl font-extrabold tracking-tight text-cirra-ink sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-cirra-muted sm:text-base">{subtitle}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
