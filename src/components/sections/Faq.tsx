import { useState } from "react";
import { Plus } from "lucide-react";
import { FAQS } from "@/data/content";
import { useSwarmSection } from "@/swarm/provider";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

export function Faq() {
  const ref = useSwarmSection<HTMLElement>("faq");
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" ref={ref} className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6">
      <SectionHeading
        idPrefix="faq"
        label="10 / QUESTIONS"
        title="Frequently Asked Questions"
      />
      <div data-sw="rect" data-sw-id="faq-list" className="mt-10 divide-y divide-border rounded-xl border border-border bg-card/40">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.question} data-sw="text" data-sw-id={`faq-${i}`}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-sm font-semibold text-foreground transition-colors hover:bg-accent/40 sm:text-base"
                >
                  <span>{f.question}</span>
                  <Plus
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-300",
                      isOpen && "rotate-45",
                    )}
                    style={{ color: "var(--accent-olive)" }}
                  />
                </button>
              </h3>
              <div
                id={`faq-panel-${i}`}
                role="region"
                className={cn(
                  "grid transition-all duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
