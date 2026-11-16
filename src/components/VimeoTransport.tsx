import Player from "@vimeo/player";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

export function VimeoTransport({ frame }: { frame: RefObject<HTMLIFrameElement | null> }) {
  const player = useRef<Player | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!frame.current) return;
    const p = new Player(frame.current);
    let active = true;
    player.current = p;
    const start = () => setPlaying(true);
    const stop = () => setPlaying(false);
    const volume = ({ muted, volume }: { muted?: boolean; volume: number }) =>
      setMuted(muted ?? (volume === 0));
    p.on("playing", start);
    p.on("pause", stop);
    p.on("ended", stop);
    p.on("volumechange", volume);
    p.ready()
      .then(async () => {
        const [paused, silent] = await Promise.all([p.getPaused(), p.getMuted()]);
        if (active) {
          setReady(true);
          setPlaying(!paused);
          setMuted(silent);
          if (paused) {
            p.setMuted(true).then(() => p.play()).catch(() => {});
          }
        }
      })
      .catch(() => {});
    return () => {
      active = false;
      p.off("playing", start);
      p.off("pause", stop);
      p.off("ended", stop);
      p.off("volumechange", volume);
      player.current = null;
    };
  }, [frame]);
  return (
    <div className="vimeo-transport">
      <button
        disabled={!ready}
        aria-label={playing ? "Pause film" : "Play film"}
        onClick={() => {
          const p = player.current;
          if (p) (playing ? p.pause() : p.play()).catch(() => {});
        }}
      >
        {playing ? <Pause /> : <Play />}
      </button>
      <button
        disabled={!ready}
        onClick={() => {
          const p = player.current;
          if (!p) return;
          const next = !muted;
          const change = next ? p.setMuted(true) : Promise.all([p.setMuted(false), p.setVolume(1)]);
          change.then(() => p.getMuted()).then(setMuted).catch(() => {});
        }}
      >
        {muted ? <VolumeX /> : <Volume2 />}
        {muted ? "Enable sound" : "Mute"}
      </button>
      <small>{ready ? (playing ? "Playing" : "Paused") : "Vimeo"}</small>
    </div>
  );
}
