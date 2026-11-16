import { useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/data/content";
import { TiltCard } from "@/components/TiltCard";
import { useSwarmSection } from "@/swarm/provider";
import { SectionHeading } from "@/components/SectionHeading";

export function Testimonials() {
  const ref = useSwarmSection<HTMLElement>("testimonials");
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const w = card ? card.offsetWidth + 20 : 360;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  return (
    <section id="testimonials" ref={ref} className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <div className="flex items-end justify-between gap-6">
        <SectionHeading
          idPrefix="testimonials"
          label="08 / CLIENT WORDS"
          title="Client Testimonials"
        />
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div data-sw="rect" data-sw-id="testi-track" className="mt-10">
        <div
          ref={trackRef}
          className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={t.name}
              data-sw="rect"
              data-sw-id={`testi-${i}`}
              className="w-[88%] shrink-0 snap-center sm:w-[46%] lg:w-[31.5%]"
            >
              <TiltCard className="flex h-full flex-col rounded-xl border border-border bg-card/60 p-6">
                <Quote className="h-5 w-5" style={{ color: "var(--accent-olive)" }} />
                <blockquote
                  data-sw="text"
                  data-sw-id={`testi-${i}-q`}
                  data-sw-deps={`testi-${i}`}
                  className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90"
                >
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5">
                  <p
                    data-sw="text"
                    data-sw-id={`testi-${i}-n`}
                    data-sw-deps={`testi-${i}`}
                    className="font-display text-sm font-semibold text-foreground"
                  >
                    {t.name}
                  </p>
                  <p
                    data-sw="text"
                    data-sw-id={`testi-${i}-r`}
                    data-sw-deps={`testi-${i}`}
                    className="font-mono text-[11px] text-muted-foreground"
                  >
                    {t.role}
                  </p>
                </figcaption>
              </TiltCard>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
