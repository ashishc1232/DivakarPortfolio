import { SKILLS } from "@/data/content";
import { useSwarmSection } from "@/swarm/provider";
import { SectionHeading } from "@/components/SectionHeading";

function Band({ reverse }: { reverse?: boolean }) {
  const items = [...SKILLS, ...SKILLS];
  return (
    <div className="overflow-hidden border-y border-white/5 py-4" aria-hidden="true">
      <div className={reverse ? "sw-marquee-track sw-marquee-track--reverse" : "sw-marquee-track"}>
        {items.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="font-display text-xl font-medium text-foreground/70 sm:text-2xl"
          >
            {s}
            <span className="ml-10" style={{ color: "var(--accent-olive)" }}>
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  const ref = useSwarmSection<HTMLElement>("skills");
  return (
    <section id="skills" ref={ref} className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        idPrefix="skills"
        label="05 / CAPABILITIES"
        title="Skills"
        description="Every skill we bring adds value to your digital presence. We combine creativity, strategy and precision to build impactful results."
      />
      <div data-sw="rect" data-sw-id="skills-grid" className="mt-10 flex flex-wrap gap-2.5">
        {SKILLS.map((s, i) => (
          <span
            key={s}
            data-sw="text"
            data-sw-id={`skill-${i}`}
            className="rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-foreground"
          >
            {s}
          </span>
        ))}
      </div>
      <div data-sw="line" data-sw-id="skills-band-line" className="mt-12">
        <Band />
      </div>
      <div className="mt-0">
        <Band reverse />
      </div>
    </section>
  );
}
