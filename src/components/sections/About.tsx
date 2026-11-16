import { Instagram } from "lucide-react";
import { INSTAGRAM_URL } from "@/data/content";
import { useSwarmSection } from "@/swarm/provider";
import { SectionHeading } from "@/components/SectionHeading";

export function About() {
  const ref = useSwarmSection<HTMLElement>("about");
  return (
    <section id="about" ref={ref} className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div
          data-sw="rect"
          data-sw-id="about-portrait"
          className="order-2 lg:order-1"
        >
          <div className="relative overflow-hidden rounded-xl border border-border bg-card/60 p-8">
            <div
              className="absolute inset-3 rounded-lg border border-dashed border-white/10"
              aria-hidden="true"
            />
            <div className="flex aspect-[4/5] flex-col items-center justify-center gap-4 text-center">
              <span
                className="font-display text-6xl font-bold tracking-tight"
                style={{ color: "var(--accent-olive)" }}
              >
                D.
              </span>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Portrait placeholder
              </p>
              <p className="max-w-[240px] text-xs text-muted-foreground">
                A real portrait of Divakar will replace this frame.
              </p>
            </div>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Frame 01 · The editor behind the frame
            </p>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <SectionHeading idPrefix="about" label="11 / ABOUT" title="The editor behind the frame." />
          <p
            data-sw="text"
            data-sw-id="about-copy"
            className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            I'm Divakar Parajapati, a visual storyteller passionate about turning raw footage into
            memorable content. From short-form edits and color grading to thumbnails and creative
            video production, I focus on the details that bring every story together.
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            data-sw="rect"
            data-sw-id="about-ig"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
          >
            <Instagram className="h-4 w-4" /> Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
