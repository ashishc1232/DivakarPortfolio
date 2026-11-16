import portrait from "@/assets/hero/divakar.webp";
import wordmark from "@/assets/hero/portfolio.webp";
import { Scissors, Palette, Layers, PenTool, type LucideIcon } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { VIDEOS, whatsapp } from "@/data/content";
import { YouTubeVideo } from "@/components/YouTubeVideo";
import { useSiteControls, useSwarmSection } from "@/swarm/provider";
import "./hero.css";

const toolkit: { label: string; icon: LucideIcon }[] = [
  { label: "Reel editing", icon: Scissors },
  { label: "Color correction", icon: Palette },
  { label: "Motion design", icon: Layers },
  { label: "Graphic design", icon: PenTool },
];

export function Hero() {
  const ref = useSwarmSection<HTMLElement>("hero");
  const { controls } = useSiteControls();
  const [take, setTake] = useState(0);
  const motion = controls.animation && !controls.paused;

  useEffect(() => {
    const scene = ref.current;
    if (!scene || !motion) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let x = 0,
      y = 0,
      frame = 0;
    function draw() {
      frame = 0;
      if (!scene) return;
      const bounds = scene.getBoundingClientRect();
      const travel = Math.min(1, Math.max(0, -bounds.top / bounds.height));
      scene.style.setProperty("--px", preference.matches ? "0" : String(x));
      scene.style.setProperty("--py", preference.matches ? "0" : String(y));
      scene.style.setProperty("--travel", preference.matches ? "0" : String(travel));
    }
    function queue() {
      if (!frame) frame = requestAnimationFrame(draw);
    }
    function move(event: PointerEvent) {
      if (!scene || event.pointerType === "touch") return;
      const box = scene.getBoundingClientRect();
      x = (2 * (event.clientX - box.left)) / box.width - 1;
      y = (2 * (event.clientY - box.top)) / box.height - 1;
      queue();
    }
    function center() {
      x = 0;
      y = 0;
      queue();
    }
    scene.addEventListener("pointermove", move);
    scene.addEventListener("pointerleave", center);
    window.addEventListener("scroll", queue, { passive: true });
    preference.addEventListener("change", queue);
    draw();
    return () => {
      cancelAnimationFrame(frame);
      scene.removeEventListener("pointermove", move);
      scene.removeEventListener("pointerleave", center);
      window.removeEventListener("scroll", queue);
      preference.removeEventListener("change", queue);
      for (const key of ["--px", "--py", "--travel"]) scene.style.removeProperty(key);
    };
  }, [motion, ref]);

  return (
    <>
      <section
        ref={ref}
        id="home"
        className="poster"
        data-motion={controls.animation}
        data-paused={controls.paused}
        aria-labelledby="poster-name"
      >
        <div key={take} className="poster-take">
          <div className="poster-camera" aria-hidden="true">
            <div className="poster-back" />
            <div className="poster-flare" />
            <div className="poster-title">
              <img src={wordmark} alt="" />
            </div>
            <div className="poster-person">
              <img src={portrait} alt="" fetchPriority="high" />
            </div>
            {toolkit.map(({ label, icon: Icon }, index) => (
              <div key={label} className="poster-tool" style={{ "--slot": index } as CSSProperties}>
                <span>
                  <Icon size={16} />
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="poster-name">
            <p>Hello, I’m</p>
            <h1 id="poster-name">Divakar</h1>
          </div>
          <div className="poster-role">
            <span>Graphic designer</span>
            <strong>Video editor</strong>
          </div>
        </div>
        <div className="poster-actions">
          <a href="#showreel">Watch showreel ↓</a>
          {motion && (
            <button type="button" className="poster-replay" onClick={() => setTake((n) => n + 1)}>
              ↻ Replay intro
            </button>
          )}
          <a href={whatsapp()} target="_blank" rel="noreferrer">
            Start a project ↗
          </a>
        </div>
      </section>
      <Showreel />
    </>
  );
}

function Showreel() {
  const ref = useSwarmSection<HTMLElement>("showreel");
  return (
    <section id="showreel" ref={ref} className="poster-reel">
      <h2 data-sw="text">Showreel</h2>
      <div data-sw="media">
        <YouTubeVideo video={VIDEOS[0]} featured />
      </div>
    </section>
  );
}
