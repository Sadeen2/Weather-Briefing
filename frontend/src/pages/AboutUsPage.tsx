import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";

const teamMembers = [
  {
    name: "Sadeen Ryahi",
    university: "Birzeit University",
    academicStatus: "Computer Engineering Graduate",
    description:
      "A Computer Engineering graduate from Birzeit University with an interest in software development, modern web technologies, and building practical technology solutions.",
    githubUrl: "https://github.com/Sadeen2",
    linkedinUrl: "https://www.linkedin.com/in/sadeen-ryahi-6a9129340/",
  },
  {
    name: "Doaa Naji",
    university: "Birzeit University",
    academicStatus: "Computer Engineering Student",
    description:
      "A Computer Engineering student at Birzeit University who is continuously learning and exploring software development, emerging technologies, and practical engineering solutions.",
    githubUrl: "https://github.com/DuaaNaji",
    linkedinUrl: "",
  },
  {
    name: "Rawand Bawatneh",
    university: "Birzeit University",
    academicStatus: "Computer Engineering Graduate",
    description:
      "A Computer Engineering graduate from Birzeit University with an interest in software engineering, technology, and creating practical solutions through computing.",
    githubUrl: "https://github.com/RawandBawatneh",
    linkedinUrl: "",
  },
] as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ProfileLink({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Github }) {
  const hasUrl = Boolean(href && href.trim());

  if (!hasUrl) {
    return (
      <span
        aria-label={`${label} placeholder`}
        className="inline-flex items-center gap-2 rounded-full border border-dashed border-sky-200 bg-sky-50/60 px-3 py-2 text-sm font-semibold text-cirra-muted"
      >
        <Icon className="h-4 w-4 text-sky-500" />
        {label}: TBD
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-3 py-2 text-sm font-semibold text-cirra-muted transition duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:text-cirra-ink"
    >
      <Icon className="h-4 w-4 text-sky-600" />
      {label}
    </a>
  );
}

export function AboutUsPage() {
  return (
    <div className="space-y-10">
      <section className="pt-4 sm:pt-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/70 px-4 py-2 text-sm font-semibold text-cirra-muted shadow-soft backdrop-blur-xl">
            Cirra • Birzeit University
          </div>

          <h1 className="mt-8 text-4xl font-black tracking-tight text-cirra-ink sm:text-5xl lg:text-6xl">
            Meet the Team
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-cirra-muted sm:text-xl">
            Cirra is a Weather Briefing MCP project developed by a team of Computer Engineering students and graduates from Birzeit University.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {teamMembers.map((member, index) => (
          <motion.article
            key={member.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            className="group rounded-[2rem] border border-white/75 bg-white/70 p-6 shadow-soft backdrop-blur-xl transition-all duration-200"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(224,242,255,0.9))] text-lg font-black text-sky-700 ring-1 ring-sky-100 shadow-soft">
              {initials(member.name)}
            </div>

            <div className="space-y-3">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-cirra-ink">{member.name}</h2>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-cirra-muted">
                  {member.university}
                </p>
              </div>

              <div className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-sky-700 ring-1 ring-sky-100">
                {member.academicStatus}
              </div>

              <p className="text-sm leading-7 text-cirra-muted">{member.description}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <ProfileLink href={member.githubUrl} label="GitHub" icon={Github} />
              {member.linkedinUrl ? <ProfileLink href={member.linkedinUrl} label="LinkedIn" icon={Linkedin} /> : null}
            </div>
          </motion.article>
        ))}
      </section>
    </div>
  );
}
