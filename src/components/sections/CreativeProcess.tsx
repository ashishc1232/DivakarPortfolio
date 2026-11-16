import { PROCESS_STEPS } from "@/data/content";
import { useSwarmSection } from "@/swarm/provider";
import { SectionHeading } from "@/components/SectionHeading";

export function CreativeProcess() {
  const ref = useSwarmSection<HTMLElement>("process");
  return (
    <section id="process" ref={ref} className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        idPrefix="process"
        label="07 / PROCESS"
        title="From Concept to Final Cut"
      />
      <div data-sw="line" data-sw-id="process-line" className="mt-12 hidden h-px w-full bg-white/10 md:block" />
      <ol className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-6">
        {PROCESS_STEPS.map((s, i) => (
          <li key={s.step} className="relative" data-sw="rect" data-sw-id={`step-${i}`}>
            <span
              data-sw="text"
              data-sw-id={`step-${i}-dot`}
              data-sw-deps={`step-${i}`}
              className="absolute -top-[52px] left-0 hidden h-3 w-3 rounded-full border-2 md:block"
              style={{ borderColor: "var(--accent-olive)", background: "var(--background)" }}
            />
            <p
              data-sw="text"
              data-sw-id={`step-${i}-n`}
              data-sw-deps={`step-${i}`}
              className="font-mono text-[11px] tracking-widest"
              style={{ color: "var(--accent-olive)" }}
            >
              {s.step}
            </p>
            <h3
              data-sw="text"
              data-sw-id={`step-${i}-t`}
              data-sw-deps={`step-${i}`}
              className="mt-2 font-display text-xl font-semibold text-foreground"
            >
              {s.title}
            </h3>
            <p
              data-sw="text"
              data-sw-id={`step-${i}-b`}
              data-sw-deps={`step-${i}`}
              className="mt-2 text-sm leading-relaxed text-muted-foreground"
            >
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
