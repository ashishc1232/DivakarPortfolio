import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useSwarmSection, useSiteControls } from "@/swarm/provider";
import { LiveFrame, type Film } from "../LiveFrame";
import { VIDEOS } from "@/data/content";

const vimeo: Film[] = [
  "1182388289",
  "1182390511",
  "1182391186",
  "1242038060",
  "1242039872",
  "1243139179",
  "1243228470",
  "1248295966",
  "1248295963",
  "1248295965"
].map((id, index) => ({
  id,
  platform: "Vimeo",
  title: "Studio cut " + String(index + 1).padStart(2, "0"),
}));
const films: Film[] = VIDEOS.map(({ id, title }) => ({ id, title, platform: "YouTube" }));
const scenes = [
  {
    id: "rolling",
    mode: "strip",
    title: "Keep it",
    outline: "rolling",
    label: "The running cut / Never standing still",
    films: vimeo,
  },
  {
    id: "orbit",
    mode: "orbit",
    title: "In",
    outline: "rotation",
    label: "The orbit / Around the edit",
    films: vimeo,
  },
  {
    id: "longs",
    mode: "wide",
    title: "Long",
    outline: "takes",
    label: "The interview room / YouTube",
    films,
  },
];

function compose(mode: string, i: number, position: number, count: number, width: number) {
  const d = i - position;
  const mobile = width < 650;

  if (mode === "orbit") {
    const angle = (d * Math.PI * 2) / count;
    return {
      x: Math.sin(angle) * width * 0.33,
      y: (1 - Math.cos(angle)) * -37,
      z: 0,
      r: Math.sin(angle) * 12,
      ry: 0,
      s: 0.74 + 0.26 * Math.cos(angle),
      opacity: 0.5 + 0.5 * Math.cos(angle),
    };
  }

  if (mode === "stack")
    return {
      x: d * width * 0.15,
      y: Math.abs(d) * -20,
      z: 0,
      r: d * 8,
      ry: 0,
      s: 1 - Math.abs(d) * 0.12,
      opacity: 1,
    };
  return {
    x: d * width * (mode === "wide" ? 0.55 : mobile ? 0.56 : 0.2),
    y: 0,
    z: 0,
    r: 0,
    ry: 0,
    s: 1,
    opacity: 1,
  };
}

function Scene({ scene }: { scene: (typeof scenes)[number] }) {
  const ref = useSwarmSection<HTMLElement>(scene.id);
  const stage = useRef<HTMLDivElement>(null);
  const { controls } = useSiteControls();
  const [position, setPosition] = useState(0);
  const [width, setWidth] = useState(0);
  const count = scene.films.length;
  const staticView = !controls.animation;
  useEffect(() => {
    if (staticView || controls.paused) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!ref.current || !stage.current) return;
      const rect = ref.current.getBoundingClientRect();
      setPosition(
        Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight))) *
        (count - 1),
      );
      setWidth(stage.current.clientWidth);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [count, ref, staticView, controls.paused]);
  function seek(index: number) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    window.scrollTo({
      top: window.scrollY + rect.top + ((rect.height - window.innerHeight) * index) / (count - 1),
      behavior: "smooth",
    });
  }
  const current = Math.round(position);
  return (
    <section
      ref={ref}
      id={scene.id}
      className={"cinema " + scene.mode + (staticView ? " cinema-static" : "")}
      style={{ "--count": count } as CSSProperties}
    >
      <div className="cinema-sticky">
        <header className="cut-heading">
          <p data-sw="text">{scene.label}</p>
          <h2>
            {scene.title} <em>{scene.outline}</em>
            <b>.</b>
          </h2>
        </header>
        <div ref={stage} className="cinema-stage">
          <span className="cut-ghost" aria-hidden="true">
            {String(current + 1).padStart(2, "0")}
          </span>
          {scene.films.map((film, i) => {
            const { x, y, z = 0, r = 0, ry = 0, s = 1, opacity = 1 } = compose(scene.mode, i, position, count, width);
            const isActive = current === i;
            return (
              <article
                key={film.id}
                className="film-card"
                data-active={isActive ? "true" : "false"}
                onClick={() => {
                  if (!isActive) seek(i);
                }}
                style={{
                  transform: `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${ry.toFixed(1)}deg) rotate(${r.toFixed(1)}deg) scale(${s.toFixed(3)})`,
                  zIndex: Math.round(100 - Math.abs(i - position) * 10),
                  opacity,
                }}
              >
                <div className="cut-slate">DP / CUT {String(i + 1).padStart(2, "0")}</div>
                <div>
                  <LiveFrame film={film} priority={scene.id === "work" && i < 2} />
                </div>
              </article>
            );
          })}
        </div>
        <footer className="cut-footer">
          <div>
            <small>
              CUT {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </small>
            <p>{scene.films[current]?.title}</p>
          </div>
          <div className="cinema-transport">
            <button
              className="cut-arrow"
              aria-label="Previous cut"
              disabled={controls.paused}
              onClick={() => seek((current + count - 1) % count)}
            >
              ←
            </button>
            {scene.films.map((film, i) => (
              <button
                key={film.id}
                className="cut-dot"
                disabled={controls.paused}
                aria-label={"Select " + film.title}
                aria-current={current === i ? "true" : undefined}
                onClick={() => seek(i)}
              />
            ))}
            <button
              className="cut-arrow"
              aria-label="Next cut"
              disabled={controls.paused}
              onClick={() => seek((current + 1) % count)}
            >
              →
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}
export function Cinema() {
  return (
    <>
      {scenes.map((scene) => (
        <Scene key={scene.id} scene={scene} />
      ))}
    </>
  );
}
