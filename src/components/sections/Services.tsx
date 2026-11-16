import { whatsapp } from "@/data/content";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/data/content";
import { TiltCard } from "@/components/TiltCard";
import { useSwarmSection } from "@/swarm/provider";
import { SectionHeading } from "@/components/SectionHeading";
import { useEnquiry } from "@/lib/enquiry";

export function Services() {
  const ref = useSwarmSection<HTMLElement>("services");
  const { selectService } = useEnquiry();
  return (
    <section id="services" ref={ref} className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        idPrefix="services"
        label="04 / SERVICES"
        title="Creative Video Solutions for You"
        description="From raw footage to final edits, I craft visuals that stand out and leave a lasting impression."
      />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {SERVICES.map((s, i) => (
          <div key={s.title} data-sw="rect" data-sw-id={`svc-${i}`} className="min-w-0">
            <TiltCard className="flex h-full flex-col rounded-xl border border-border bg-card/60 p-6">
              <div className="flex items-center justify-between">
                <span
                  data-sw="text"
                  data-sw-id={`svc-${i}-icon`}
                  data-sw-deps={`svc-${i}`}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-elevated"
                  style={{ color: "var(--accent-olive)" }}
                >
                  <s.icon className="h-5 w-5" />
                </span>
                <span
                  data-sw="text"
                  data-sw-id={`svc-${i}-idx`}
                  data-sw-deps={`svc-${i}`}
                  className="font-mono text-[11px] text-muted-foreground"
                >
                  {s.index}
                </span>
              </div>
              <h3
                data-sw="text"
                data-sw-id={`svc-${i}-t`}
                data-sw-deps={`svc-${i}`}
                className="mt-5 font-display text-lg font-semibold text-foreground"
              >
                {s.title}
              </h3>
              <p
                data-sw="text"
                data-sw-id={`svc-${i}-b`}
                data-sw-deps={`svc-${i}`}
                className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground"
              >
                {s.body}
              </p>
              <a
                href={whatsapp("Hi Divakar, I’m interested in " + s.title + ".")} target="_blank" rel="noreferrer"
                onClick={() => selectService(s.title)}
                data-sw="rect"
                data-sw-id={`svc-${i}-cta`}
                data-sw-deps={`svc-${i}`}
                className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Enquire <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </TiltCard>
          </div>
        ))}
      </div>
    </section>
  );
}
