/**
 * Thin wrapper around the official YouTube IFrame Player API.
 * Only created client-side (inside effects), keeps one active player at a time.
 */

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  setVolume(v: number): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getIframe(): HTMLIFrameElement;
  destroy(): void;
}

interface YTNamespace {
  Player: new (
    el: HTMLElement | string,
    options: {
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: () => void;
        onStateChange?: (e: { data: number }) => void;
        onError?: (e: { data: number }) => void;
      };
    },
  ) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const YT_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

let apiPromise: Promise<YTNamespace> | null = null;

export function loadYouTubeAPI(): Promise<YTNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API requires a browser"));
  }
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<YTNamespace>((resolve, reject) => {
    const timeout = window.setTimeout(
      () => reject(new Error("YouTube IFrame API failed to load")),
      15000,
    );
    window.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timeout);
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error("YouTube API loaded without Player"));
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error("Failed to load YouTube IFrame API"));
    };
    document.head.appendChild(script);
  });
  return apiPromise;
}

export class YTHandle {
  player: YTPlayer | null = null;
  videoId: string;
  muted = true;
  playing = false;
  private destroyed = false;
  private onStateCb?: ((playing: boolean) => void) | undefined;
  private onErrorCb?: (() => void) | undefined;

  constructor(videoId: string) {
    this.videoId = videoId;
  }

  async mount(
    container: HTMLElement,
    opts: {
      autoplay?: boolean;
      mute?: boolean;
      loop?: boolean;
      controls?: boolean;
      onState?: (playing: boolean) => void;
      onError?: () => void;
    } = {},
  ) {
    const YT = await loadYouTubeAPI();
    if (this.destroyed) return;
    const host = document.createElement("div");
    host.style.width = "100%";
    host.style.height = "100%";
    container.appendChild(host);
    this.onStateCb = opts.onState;
    this.onErrorCb = opts.onError;
    this.muted = opts.mute ?? true;
    this.player = new YT.Player(host, {
      videoId: this.videoId,
      playerVars: {
        autoplay: opts.autoplay ? 1 : 0,
        mute: this.muted ? 1 : 0,
        playsinline: 1,
        controls: opts.controls === false ? 0 : 1,
        rel: 0,
        modestbranding: 1,
        enablejsapi: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          if (this.destroyed) return;
          if (opts.autoplay) {
            if (this.muted) this.player?.mute();
            this.player?.playVideo();
          }
        },
        onStateChange: (e) => {
          if (this.destroyed) return;
          this.playing = e.data === YT_STATE.PLAYING;
          if (this.playing && opts.loop) {
            // handled by ENDED below
          }
          if (e.data === YT_STATE.ENDED && opts.loop) {
            this.player?.seekTo(0, true);
            this.player?.playVideo();
          }
          if (this.playing) {
            activeHandles.add(this);
            pauseOthers(this);
          } else if (e.data === YT_STATE.PAUSED || e.data === YT_STATE.ENDED) {
            activeHandles.delete(this);
          }
          this.onStateCb?.(this.playing);
        },
        onError: () => {
          this.onErrorCb?.();
        },
      },
    });
  }

  play() {
    this.player?.playVideo();
  }

  pause() {
    this.player?.pauseVideo();
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (m) this.player?.mute();
    else {
      this.player?.unMute();
      this.player?.setVolume(85);
    }
  }

  destroy() {
    this.destroyed = true;
    activeHandles.delete(this);
    try {
      this.player?.destroy();
    } catch {
      // player already gone
    }
    this.player = null;
  }
}

const activeHandles = new Set<YTHandle>();

/** Only one video should ever be audible/playing at a time. */
export function pauseOthers(self: YTHandle) {
  for (const h of activeHandles) {
    if (h !== self && h.playing) h.pause();
  }
}

export function pauseAll() {
  for (const h of activeHandles) h.pause();
}
