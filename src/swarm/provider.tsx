import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { swarm } from "./engine";
import type { SwarmEvent } from "./types";
import { setSfxEnabled, sfx } from "@/lib/sfx";

export interface SiteControls {
  animation: boolean;
  paused: boolean;
  speed: 1 | 2 | 3;
  guides: boolean;
  labels: boolean;
  autoplay: boolean;
  sfx: boolean;
}

const DEFAULTS: SiteControls = {
  animation: true,
  paused: false,
  speed: 1,
  guides: true,
  labels: false,
  autoplay: true,
  sfx: false,
};

interface ControlsValue {
  controls: SiteControls;
  update: (patch: Partial<SiteControls>) => void;
}

const ControlsContext = createContext<ControlsValue>({
  controls: DEFAULTS,
  update: () => {},
});

export function SiteProvider({ children }: { children: ReactNode }) {
  const [controls, setControls] = useState<SiteControls>(DEFAULTS);
  const booted = useRef(false);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    const onEvent = (e: SwarmEvent) => {
      if (!controlsRef.current.sfx) return;
      if (e.type === "selectStart") sfx.select();
      else if (e.type === "typeTick") sfx.tick();
      else if (e.type === "taskDone") sfx.done();
    };
    const controlsRef = { current: controls };
    swarm.init({ reduced, mobile, onEvent });
    if (reduced) setControls((c) => ({ ...c, animation: false, autoplay: false }));
  }, []);

  const update = useCallback(
    (patch: Partial<SiteControls>) => setControls((c) => ({ ...c, ...patch })),
    [],
  );

  useEffect(() => {
    if (!swarm.ready) return;
    swarm.setEnabled(controls.animation);
  }, [controls.animation]);

  useEffect(() => {
    if (!swarm.ready) return;
    swarm.setPaused(controls.paused);
  }, [controls.paused]);

  useEffect(() => {
    if (!swarm.ready) return;
    swarm.setSpeed(controls.speed);
  }, [controls.speed]);

  useEffect(() => {
    if (!swarm.ready) return;
    swarm.setGuides(controls.guides);
  }, [controls.guides]);

  useEffect(() => {
    if (!swarm.ready) return;
    swarm.setLabels(controls.labels);
  }, [controls.labels]);

  useEffect(() => {
    setSfxEnabled(controls.sfx);
  }, [controls.sfx]);

  const value = useMemo(() => ({ controls, update }), [controls, update]);
  return <ControlsContext.Provider value={value}>{children}</ControlsContext.Provider>;
}

export function useSiteControls() {
  return useContext(ControlsContext);
}

/**
 * Registers a section for swarm construction. Elements inside annotate
 * themselves with data-sw attributes; the engine reads them at mount.
 */
export function useSwarmSection<T extends HTMLElement = HTMLElement>(id: string) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    swarm.registerGroup(id, el);
    return () => swarm.unregisterGroup(id);
  }, [id]);
  return ref;
}
