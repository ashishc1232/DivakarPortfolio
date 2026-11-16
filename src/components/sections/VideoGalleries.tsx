import { VIDEOS } from "@/data/content";
import { YouTubeVideo } from "@/components/YouTubeVideo";
import { TiltCard } from "@/components/TiltCard";
import { useSwarmSection } from "@/swarm/provider";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

export function ShortVideos() {
  const ref = useSwarmSection<HTMLElement>("shorts");
  return (
    <section id="shorts" ref={ref} className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        idPrefix="shorts"
        label="02 / SHORT FORM"
        title="Short Videos"
        description="Scroll-stopping videos built for Reels, Shorts and TikTok."
      />
      <div
        data-sw="rect"
        data-sw-id="shorts-marquee"
        data-sw-meta="4 clips"
        className="mt-10"
      >
        <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 [scrollbar-width:thin]">
          {VIDEOS.map((v, i) => (
            <div
              key={v.id}
              data-sw="rect"
              data-sw-id={`short-${i}`}
              className="w-[85%] shrink-0 snap-center sm:w-[48%] lg:w-[31%]"
            >
              <TiltCard className="rounded-xl border border-border bg-card/60 p-3">
                <div data-sw="media" data-sw-id={`short-${i}-media`} data-sw-deps={`short-${i}`}>
                  <YouTubeVideo video={v} meta={v.label} />
                </div>
                <p
                  data-sw="text"
                  data-sw-id={`short-${i}-t`}
                  data-sw-deps={`short-${i}`}
                  className="mt-3 line-clamp-1 font-display text-sm font-semibold text-foreground"
                >
                  {v.title}
                </p>
              </TiltCard>
            </div>
          ))}
        </div>
        <p className="mt-2 font-mono text-[11px] text-muted-foreground lg:hidden">Swipe to browse →</p>
      </div>
    </section>
  );
}

export function LongVideos() {
  const ref = useSwarmSection<HTMLElement>("longs");
  return (
    <section id="longs" ref={ref} className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        idPrefix="longs"
        label="03 / LONG FORM"
        title="Long Videos"
        description="Thoughtfully structured long-form edits built around story, rhythm and viewer experience."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div data-sw="rect" data-sw-id="long-feat" className="min-w-0">
          <TiltCard className="rounded-xl border border-border bg-card/60 p-3">
            <div data-sw="media" data-sw-id="long-feat-media" data-sw-deps="long-feat">
              <YouTubeVideo video={VIDEOS[0]} featured meta="Featured long-form edit" />
            </div>
            <h3
              data-sw="text"
              data-sw-id="long-feat-t"
              data-sw-deps="long-feat"
              className="mt-3 line-clamp-2 font-display text-base font-semibold text-foreground"
            >
              {VIDEOS[0].title}
            </h3>
            <p
              data-sw="text"
              data-sw-id="long-feat-m"
              data-sw-deps="long-feat"
              className="mt-1 font-mono text-[11px] text-muted-foreground"
            >
              {VIDEOS[0].channel}
            </p>
          </TiltCard>
        </div>
        <div className="grid gap-5">
          {[VIDEOS[1], VIDEOS[2]].map((v, i) => (
            <div key={v.id} data-sw="rect" data-sw-id={`long-${i}`} className="min-w-0">
              <TiltCard className="rounded-xl border border-border bg-card/60 p-3">
                <div data-sw="media" data-sw-id={`long-${i}-media`} data-sw-deps={`long-${i}`}>
                  <YouTubeVideo video={v} meta={v.label} />
                </div>
                <h3
                  data-sw="text"
                  data-sw-id={`long-${i}-t`}
                  data-sw-deps={`long-${i}`}
                  className={cn("mt-3 line-clamp-2 font-display text-sm font-semibold text-foreground")}
                >
                  {v.title}
                </h3>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
