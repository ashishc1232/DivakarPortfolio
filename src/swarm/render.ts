import type { Agent, Rect, Task } from "./types";

type CursorPainter = (color: string) => string;

const CURSORS: Record<string, CursorPainter> = {
  arrow: () =>
    `<svg width="18" height="18" viewBox="0 0 18 18"><path d="M3 1.5 L3 14.5 L6.6 11.3 L8.8 16.4 L11 15.4 L8.8 10.6 L13.4 10.2 Z" fill="#F5F3EC" stroke="rgba(0,0,0,0.55)" stroke-width="0.8"/></svg>`,
  crosshair: (c) =>
    `<svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 1v16M1 9h16" stroke="${c}" stroke-width="1.4"/><circle cx="9" cy="9" r="2.6" fill="none" stroke="${c}" stroke-width="1.2"/></svg>`,
  ibeam: (c) =>
    `<svg width="10" height="18" viewBox="0 0 10 18"><path d="M5 1v16M2 1h6M2 17h6M5 3.4c1.6 0 3-.9 3-.9M5 3.4c-1.6 0-3-.9-3-.9" stroke="${c}" stroke-width="1.2" fill="none"/></svg>`,
  pen: (c) =>
    `<svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 1 L13 9 L9 17 L5 9 Z" fill="#F5F3EC" stroke="${c}" stroke-width="1"/></svg>`,
  move: (c) =>
    `<svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 2v14M2 9h14M9 2l-2 2M9 2l2 2M9 16l-2-2M9 16l2-2M2 9l2-2M2 9l2 2M16 9l-2-2M16 9l-2 2" stroke="${c}" stroke-width="1.2" fill="none"/></svg>`,
  resize: (c) =>
    `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 14 L14 2M2 14v-3.5M2 14h3.5M14 2v3.5M14 2h-3.5" stroke="${c}" stroke-width="1.3" fill="none"/></svg>`,
  duplicate: (c) =>
    `<svg width="20" height="18" viewBox="0 0 20 18"><path d="M3 1.5 L3 14.5 L6.6 11.3 L8.8 16.4 L11 15.4 L8.8 10.6 L13.4 10.2 Z" fill="#F5F3EC" stroke="rgba(0,0,0,0.55)" stroke-width="0.8"/><path d="M15 11v6M12 14h6" stroke="${c}" stroke-width="1.6"/></svg>`,
};

interface AgentRec {
  root: HTMLDivElement;
  cursor: HTMLDivElement;
  label: HTMLDivElement;
  lastShape: string;
}

interface OverlayRec {
  box: HTMLDivElement;
  meta: HTMLDivElement | null;
}

interface Flash {
  el: HTMLDivElement;
  until: number;
}

const OVERLAY_TASKS = new Set(["rect", "media", "marquee", "duplicate", "guide"]);

export class SwarmRenderer {
  private layer: HTMLDivElement | null = null;
  private agentEls = new Map<number, AgentRec>();
  private overlayEls = new Map<string, OverlayRec>();
  private flashes: Flash[] = [];
  private guides = true;
  private labels = true;

  get attached() {
    return this.layer != null;
  }

  attach() {
    if (this.layer) return;
    const layer = document.createElement("div");
    layer.className = "sw-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);
    this.layer = layer;
  }

  detach() {
    this.layer?.remove();
    this.layer = null;
    this.agentEls.clear();
    this.overlayEls.clear();
    this.flashes = [];
  }

  setGuides(v: boolean) {
    this.guides = v;
  }

  setLabels(v: boolean) {
    this.labels = v;
  }

  clearAgents() {
    for (const rec of this.agentEls.values()) rec.root.remove();
    this.agentEls.clear();
  }

  clearOverlays() {
    for (const o of this.overlayEls.values()) {
      o.box.remove();
      o.meta?.remove();
    }
    this.overlayEls.clear();
  }

  addFlash(r: Rect | null) {
    if (!this.layer || !r || r.w < 12 || r.h < 10) return;
    const el = document.createElement("div");
    el.className = "sw-flash";
    el.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
    el.style.width = `${r.w}px`;
    el.style.height = `${r.h}px`;
    this.layer.appendChild(el);
    this.flashes.push({ el, until: performance.now() + 340 });
  }

  render(agents: Agent[], tasks: Task[], now: number) {
    if (!this.layer) return;
    this.renderAgents(agents);
    this.renderOverlays(tasks, agents);
    this.renderFlashes(now);
  }

  private renderAgents(agents: Agent[]) {
    const seen = new Set<number>();
    for (const a of agents) {
      seen.add(a.id);
      let rec = this.agentEls.get(a.id);
      if (!rec) {
        const root = document.createElement("div");
        root.className = "sw-agent";
        const cursor = document.createElement("div");
        cursor.className = "sw-cursor";
        const label = document.createElement("div");
        label.className = "sw-label";
        label.textContent = a.name;
        label.style.background = a.color;
        root.append(cursor);
        this.layer!.appendChild(root);
        rec = { root, cursor, label, lastShape: "" };
        this.agentEls.set(a.id, rec);
      }
      if (rec.lastShape !== a.shape) {
        const painter = CURSORS[a.shape] ?? CURSORS["arrow"];
        if (!painter) continue;
        rec.cursor.innerHTML = painter(a.color);
        rec.lastShape = a.shape;
      }
      rec.root.style.transform = `translate3d(${a.x}px, ${a.y}px, 0)`;
      rec.label.style.display =
        this.labels && (a.state === "work" || a.state === "travel") ? "" : "none";
    }
    for (const [id, rec] of this.agentEls) {
      if (!seen.has(id)) {
        rec.root.remove();
        this.agentEls.delete(id);
      }
    }
  }

  private renderOverlays(tasks: Task[], agents: Agent[]) {
    const seen = new Set<string>();
    for (const t of tasks) {
      if (t.status !== "active" || !OVERLAY_TASKS.has(t.type) || !t.rect) continue;
      seen.add(t.id);
      let o = this.overlayEls.get(t.id);
      if (!o) {
        const box = document.createElement("div");
        box.className =
          t.type === "marquee"
            ? "sw-rect sw-rect--marquee"
            : t.type === "guide"
              ? `sw-guide ${t.variant === "v" ? "sw-guide--v" : "sw-guide--h"}`
              : "sw-rect";
        let meta: HTMLDivElement | null = null;
        if (t.type !== "guide") {
          meta = document.createElement("div");
          meta.className = "sw-rect-meta";
        }
        this.layer!.append(box);
        if (meta) this.layer!.append(meta);
        o = { box, meta };
        this.overlayEls.set(t.id, o);
      }
      const r = t.rect;
      const agent = t.agentId != null ? agents.find((a) => a.id === t.agentId) : undefined;

      if (t.type === "guide") {
        if (t.variant === "v") {
          o.box.style.transform = `translate3d(${r.x + r.w / 2}px, 0, 0)`;
          o.box.style.height = "100vh";
          o.box.style.width = "0";
        } else {
          o.box.style.transform = `translate3d(0, ${r.y + r.h / 2}px, 0)`;
          o.box.style.width = "100vw";
          o.box.style.height = "0";
        }
        o.box.style.opacity = String(Math.min(1, t.progress * 4) * (1 - Math.max(0, (t.progress - 0.75) / 0.25)));
        continue;
      }

      let x = r.x;
      let y = r.y;
      let w = r.w;
      let h = r.h;

      if (t.type === "rect" || t.type === "marquee") {
        w = r.w * t.progress;
        h = r.h * t.progress;
      } else if (t.type === "media") {
        const p = Math.min(1, t.progress / 0.4);
        w = r.w * p;
        h = r.h * p;
      } else if (t.type === "duplicate") {
        if (t.progress < 0.35) {
          const src = this.sourceRectOf(t, tasks);
          if (src) {
            x = src.x;
            y = src.y;
            w = src.w;
            h = src.h;
          }
          o.box.style.opacity = "1";
        } else {
          o.box.style.opacity = String(1 - (t.progress - 0.35) / 0.65);
        }
      }
      if (agent && (t.type === "rect" || t.type === "marquee" || (t.type === "media" && t.progress < 0.4))) {
        w = Math.max(w, agent.x - r.x);
        h = Math.max(h, agent.y - r.y);
      }
      o.box.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      o.box.style.width = `${Math.max(0, w)}px`;
      o.box.style.height = `${Math.max(0, h)}px`;
      o.box.style.opacity = "1";

      if (o.meta) {
        const showMeta = this.guides && w > 44 && h > 22 && t.progress > 0.05;
        if (showMeta) {
          o.meta.style.display = "";
          const src = this.sourceRectOf(t, tasks);
          const count = t.meta || "";
          o.meta.textContent =
            t.type === "marquee"
              ? `${Math.round(w)}×${Math.round(h)}${count ? ` · ${count}` : ""}`
              : `${Math.round(w)} × ${Math.round(h)}`;
          o.meta.style.transform = `translate3d(${x}px, ${Math.max(2, y - 16)}px, 0)`;
          void src;
        } else {
          o.meta.style.display = "none";
        }
      }
    }
    for (const [id, o] of this.overlayEls) {
      if (!seen.has(id)) {
        o.box.remove();
        o.meta?.remove();
        this.overlayEls.delete(id);
      }
    }
  }

  private sourceRectOf(t: Task, tasks: Task[]): Rect | null {
    const dep = t.deps[0] ? tasks.find((x) => x.id === t.deps[0]) : undefined;
    return dep?.rect ?? t.rect;
  }

  private renderFlashes(now: number) {
    this.flashes = this.flashes.filter((f) => {
      const remain = f.until - now;
      if (remain <= 0) {
        f.el.remove();
        return false;
      }
      f.el.style.opacity = String(Math.min(1, remain / 260));
      return true;
    });
  }
}
