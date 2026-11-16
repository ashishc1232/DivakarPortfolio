import { VimeoTransport } from "./VimeoTransport";
import { useEffect, useRef, useState } from "react";
import { useSiteControls } from "@/swarm/provider";

export type Film = { id: string; platform: "YouTube" | "Vimeo" | "Instagram"; title: string };

interface LiveFrameProps {
  film: Film;
  priority?: boolean;
}

export function LiveFrame({ film, priority = false }: LiveFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [hasLoaded, setHasLoaded] = useState(priority);
  const [frameReady, setFrameReady] = useState(false);
  const { controls } = useSiteControls();

  const { id, platform, title } = film;
  const auto = controls.autoplay ? 1 : 0;
  const reel = platform === "Instagram";
  const vimeo = platform === "Vimeo";

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Start pre-loading 800px before element enters viewport
    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasLoaded(true);
          preloadObserver.disconnect();
        }
      },
      { rootMargin: "800px 0px" }
    );
    preloadObserver.observe(element);

    // Play/Pause control based on visibility in viewport
    const playObserver = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry?.isIntersecting ?? false;
        if (!frame.current?.contentWindow) return;
        try {
          if (isVisible) {
            if (vimeo) {
              frame.current.contentWindow.postMessage('{"method":"play"}', "*");
            } else if (!reel) {
              frame.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*");
            }
          } else {
            if (vimeo) {
              frame.current.contentWindow.postMessage('{"method":"pause"}', "*");
            } else if (!reel) {
              frame.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");
            }
          }
        } catch {
          // ignore cross-origin postMessage errors
        }
      },
      { rootMargin: "150px 0px" }
    );
    playObserver.observe(element);

    return () => {
      preloadObserver.disconnect();
      playObserver.disconnect();
    };
  }, [vimeo, reel]);

  const original = reel
    ? `https://www.instagram.com/reel/${id}/`
    : vimeo
      ? `https://vimeo.com/${id}`
      : `https://youtu.be/${id}`;

  const src = reel
    ? original + "embed/"
    : vimeo
      ? `https://player.vimeo.com/video/${id}?autoplay=${auto}&muted=1&controls=1&autopause=0&loop=1&playsinline=1&title=0&byline=0&portrait=0&dnt=1&quality=1080p`
      : `https://www.youtube-nocookie.com/embed/${id}?autoplay=${auto}&mute=1&controls=1&playsinline=1&loop=1&playlist=${id}&rel=0&modestbranding=1&enablejsapi=1&vq=hd1080`;

  const poster = !vimeo && !reel ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : null;

  return (
    <div ref={ref} className={"live-frame" + (reel ? " portrait" : "")}>
      <div className="live-screen relative overflow-hidden bg-black">
        {/* Instant visual poster while iframe buffers */}
        {poster && (
          <img
            src={poster}
            alt={title}
            loading={priority ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              frameReady ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          />
        )}
        {hasLoaded && (
          <iframe
            ref={frame}
            title={title}
            src={src}
            loading={priority ? "eager" : "lazy"}
            onLoad={() => setFrameReady(true)}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-full border-0 absolute inset-0"
          />
        )}
      </div>
      {vimeo && hasLoaded && <VimeoTransport frame={frame} />}
      <a
        className="film-source"
        href={original}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${title} on ${platform}`}
      >
        {platform} ↗
      </a>
    </div>
  );
}
