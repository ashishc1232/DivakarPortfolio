import { useRef, useState } from "react";
import { Gauge, MousePointerClick, ChevronDown, Pause, Play, RotateCcw, X } from "lucide-react";
import { useSiteControls } from "./provider";
import { swarm } from "./engine";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}

function Toggle({
  on,
  onChange,
  labelOn,
  labelOff,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  labelOn?: string;
  labelOff?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="min-w-[52px] rounded-full border px-2 py-0.5 font-mono text-[11px] transition-colors"
      style={
        on
          ? { background: "var(--selection)", borderColor: "var(--selection)", color: "#00121f" }
          : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
      }
    >
      {on ? (labelOn ?? "On") : (labelOff ?? "Off")}
    </button>
  );
}

export function SwarmControls() {
  const { controls, update } = useSiteControls();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={panelRef} className="fixed bottom-4 right-4 z-[95] print:hidden">
      {open ? (
        <div className="mb-2 w-64 rounded-xl border border-border bg-popover/95 p-3 shadow-xl backdrop-blur">
          <div className="mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <MousePointerClick className="h-3.5 w-3.5" /> Studio Controls
            </span>
            <button
              type="button"
              aria-label="Close controls"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="divide-y divide-border/60">
            <Row label="Animation">
              <Toggle on={controls.animation} onChange={(v) => update({ animation: v })} />
            </Row>
            <Row label="Pause">
              <Toggle
                on={controls.paused}
                onChange={(v) => update({ paused: v })}
                labelOn="Paused"
                labelOff="Running"
              />
            </Row>
            <Row label="Speed">
              <button
                type="button"
                onClick={() =>
                  update({ speed: controls.speed === 3 ? 1 : ((controls.speed + 1) as 1 | 2 | 3) })
                }
                className="flex min-w-[52px] items-center justify-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[11px] text-foreground hover:bg-accent"
              >
                <Gauge className="h-3 w-3" /> {controls.speed}×
              </button>
            </Row>
            <Row label="Guides">
              <Toggle on={controls.guides} onChange={(v) => update({ guides: v })} />
            </Row>
            <Row label="Video autoplay">
              <Toggle on={controls.autoplay} onChange={(v) => update({ autoplay: v })} />
            </Row>
            <Row label="Sound FX">
              <Toggle on={controls.sfx} onChange={(v) => update({ sfx: v })} />
            </Row>
            <Row label="Replay">
              <button
                type="button"
                onClick={() => {
                  if (swarm.ready) {
                    update({ animation: true, paused: false });
                    swarm.reset();
                  }
                }}
                className="min-w-[52px] rounded-full border px-2 py-0.5 font-mono text-[11px] text-foreground hover:bg-accent"
              >
                Replay
              </button>
            </Row>
          </div>
        </div>
      ) : null}
      <div className="crew-bar">
        <button
          aria-label={controls.paused ? "Resume crew" : "Pause crew"}
          onClick={() => update({ paused: !controls.paused })}
        >
          <span>● CREW {controls.paused ? "PAUSED" : "ON"}</span>
          {controls.paused ? <Play /> : <Pause />}
        </button>
        <button
          aria-label="Change cursor speed"
          onClick={() => update({ speed: ((controls.speed % 3) + 1) as 1 | 2 | 3 })}
        >
          {controls.speed}×
        </button>
        <button
          aria-label="Replay cursor sequence"
          onClick={() => {
            update({ animation: true, paused: false });
            if (swarm.ready) swarm.reset();
          }}
        >
          <RotateCcw />
        </button>
        <button
          aria-label="Toggle studio controls"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <ChevronDown />
        </button>
      </div>
    </div>
  );
}
