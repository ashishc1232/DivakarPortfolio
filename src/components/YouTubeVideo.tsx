import type { VideoItem } from "@/data/content";
import { LiveFrame } from "./LiveFrame";

export function YouTubeVideo({ video }: { video: VideoItem; featured?: boolean; meta?: string }) {
  return <LiveFrame film={{ id: video.id, title: video.title, platform: "YouTube" }} />;
}
