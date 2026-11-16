import { whatsapp } from "@/data/content";
import { Check } from "lucide-react";
import { PRICING_PLANS } from "@/data/content";
import { TiltCard } from "@/components/TiltCard";
import { useSwarmSection } from "@/swarm/provider";
import { SectionHeading } from "@/components/SectionHeading";
import { useEnquiry } from "@/lib/enquiry";
import { cn } from "@/lib/utils";

export function Pricing() {
  const ref = useSwarmSection<HTMLElement>("pricing");
  const { selectPlan } = useEnquiry();
  return (
    <section id="pricing" ref={ref} className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        idPrefix="pricing"
        label="09 / PLANS"
        title="Our Pricing"
        description="Choose the creative support that fits your content goals."
      />
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {PRICING_PLANS.map((p, i) => (
          <div
            key={p.id}
            data-sw="rect"
            data-sw-id={`plan-${i}`}
            className={cn("min-w-0", p.featured && "md:-mt-3")}
          >
            <TiltCard
              maxTilt={4}
              className={cn(
                "flex h-full flex-col rounded-xl border p-6",
                p.featured
                  ? "border-[color:var(--accent-olive)]/50 bg-elevated shadow-[0_20px_60px_-30px_rgba(215,230,166,0.25)]"
                  : "border-border bg-card/60",
              )}
            >
              {p.featured ? (
                <span
                  data-sw="text"
                  data-sw-id={`plan-${i}-badge`}
                  data-sw-deps={`plan-${i}`}
                  className="mb-4 w-fit rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest"
                  style={{ background: "var(--accent-olive)", color: "#10130d" }}
                >
                  Most Popular
                </span>
              ) : null}
              <h3
                data-sw="text"
                data-sw-id={`plan-${i}-name`}
                data-sw-deps={`plan-${i}`}
                className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                {p.name}
              </h3>
              <p data-sw="text" data-sw-id={`plan-${i}-price`} data-sw-deps={`plan-${i}`} className="mt-3">
                <span className="font-display text-4xl font-bold text-foreground sm:text-5xl">
                  {p.currency}
                  {p.price}
                </span>
                <span className="ml-2 text-sm text-muted-foreground">{p.period}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.features.map((f, j) => (
                  <li
                    key={f}
                    data-sw="text"
                    data-sw-id={`plan-${i}-f${j}`}
                    data-sw-deps={`plan-${i}`}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: "var(--accent-olive)" }}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={whatsapp("Hi Divakar, I’m interested in the " + p.name + " plan.")} target="_blank" rel="noreferrer"
                onClick={() => selectPlan(p.name)}
                data-sw="rect"
                data-sw-id={`plan-${i}-cta`}
                data-sw-deps={`plan-${i}`}
                className={cn(
                  "mt-7 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]",
                  p.featured ? "text-[#10130d]" : "border border-border text-foreground hover:bg-accent",
                )}
                style={p.featured ? { background: "var(--accent-olive)" } : undefined}
              >
                {p.cta}
              </a>
            </TiltCard>
          </div>
        ))}
      </div>
      <p className="mt-6 font-mono text-[11px] text-muted-foreground">
        Plan details pending owner confirmation before publishing.
      </p>
    </section>
  );
}
