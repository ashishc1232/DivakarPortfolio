import { VIDEOS, type VideoItem } from "@/data/content";
import { YouTubeVideo } from "@/components/YouTubeVideo";
import { TiltCard } from "@/components/TiltCard";
import { useSwarmSection } from "@/swarm/provider";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

function VideoCard({
  video,
  className,
  id,
  featured,
}: {
  video: VideoItem;
  className?: string;
  id: string;
  featured?: boolean;
}) {
  return (
    <div data-sw="rect" data-sw-id={id} className={cn("min-w-0", className)}>
      <TiltCard className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card/60 p-3">
        <div data-sw="media" data-sw-id={`${id}-media`} data-sw-deps={id}>
          <YouTubeVideo video={video} meta={video.label} />
        </div>
        <h3
          data-sw="text"
          data-sw-id={`${id}-title`}
          data-sw-deps={id}
          className="line-clamp-2 font-display text-sm font-semibold leading-snug text-foreground"
        >
          {video.title}
        </h3>
        <p
          data-sw="text"
          data-sw-id={`${id}-meta`}
          data-sw-deps={id}
          className="font-mono text-[11px] text-muted-foreground"
        >
          {video.channel}
        </p>
        {featured ? null : null}
      </TiltCard>
    </div>
  );
}

export function RecentEdits() {
  const ref = useSwarmSection<HTMLElement>("work");
  return (
    <section id="work" ref={ref} className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        idPrefix="work"
        label="01 / SELECTED WORK"
        title="My Recent Edits"
        description="Your vision, brought to life. We craft stories that engage and inspire. Because every second matters."
      />
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <VideoCard video={VIDEOS[0]} id="work-v1" featured className="md:col-span-2 lg:col-span-2" />
        <VideoCard video={VIDEOS[1]} id="work-v2" />
        <VideoCard video={VIDEOS[2]} id="work-v3" />
        <VideoCard video={VIDEOS[3]} id="work-v4" />
      </div>
    </section>
  );
}
