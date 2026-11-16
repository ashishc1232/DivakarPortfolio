import type { Agent, Rect, SwarmEvent, Task, TaskType } from "./types";
import { SwarmRenderer } from "./render";

const NAMES = [
  "dvn", "frame", "colorist", "story", "cut-01", "gfx", "type-01", "reel",
  "grade", "motion", "layout", "meta", "assist-01", "kp-ops", "edit-02",
  "timeline", "sfx", "render", "v1", "studio", "cut-02", "type-02", "edit-03", "grid",
];

const COLORS = [
  "#0D99FF", "#2FA8FF", "#0A7FE0", "#5FC0FF", "#0D99FF", "#8AD2FF", "#0D99FF", "#3FB0FF",
];

const SHAPES: Record<TaskType, Agent["shape"]> = {
  rect: "crosshair",
  media: "crosshair",
  marquee: "crosshair",
  text: "ibeam",
  line: "pen",
  guide: "crosshair",
  duplicate: "duplicate",
};

interface Group {
  root: HTMLElement;
  taskIds: string[];
  activated: boolean;
}

export class SwarmEngine {
  private tasks = new Map<string, Task>();
  private groups = new Map<string, Group>();
  private completedGroups = new Set<string>();
  private agents: Agent[] = [];
  private nextAgentId = 1;
  private renderer: SwarmRenderer | null = null;
  private io: IntersectionObserver | null = null;
  private raf = 0;
  private last = 0;
  private running = false;
  private paused = false;
  private allRevealed = false;
  private speed = 1;
  private onEvent: ((e: SwarmEvent) => void) | null = null;
  private reduced = false;
  private mobile = false;
  private opened = false;
  private pendingActivation = new Set<string>();
  private hasWork = false;
  private geomDirty = true;

  private onGeomDirty = () => {
    this.geomDirty = true;
  };

  get ready() {
    return this.renderer != null && !this.reduced;
  }

  get isReduced() {
    return this.reduced;
  }

  init(opts: { reduced: boolean; mobile: boolean; onEvent?: (e: SwarmEvent) => void }) {
    this.reduced = opts.reduced;
    this.mobile = opts.mobile;
    this.onEvent = opts.onEvent ?? null;
    if (this.reduced) {
      this.allRevealed = true;
      return;
    }
    this.renderer = new SwarmRenderer();
    this.renderer.attach();
    window.addEventListener("scroll", this.onGeomDirty, { passive: true });
    window.addEventListener("resize", this.onGeomDirty);
    this.io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          this.io?.unobserve(entry.target);
          const id = (entry.target as HTMLElement).dataset['swSection'];
          if (!id) continue;
          if (this.opened) this.activateGroup(id);
          else this.pendingActivation.add(id);
        }
      },
      { rootMargin: "260px 0px 260px 0px", threshold: 0 },
    );
    // Hide everything the engine will build (called before first paint of built sections)
    for (const t of this.tasks.values()) {
      if (t.status === "pending") t.el.classList.add("sw-pending");
    }
    for (const g of this.groups.values()) {
      if (!this.completedGroups.has(this.groupIdOf(g))) this.io?.observe(g.root);
    }
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
    this.openingGather();
  }

  private groupIdOf(g: Group): string {
    return g.root.dataset['swSection'] ?? "";
  }

  registerGroup(id: string, root: HTMLElement) {
    root.dataset['swSection'] = id;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-sw]"));
    const taskIds: string[] = [];
    els.forEach((el, i) => {
      const tid = el.dataset['swId'] || `${id}:${i}`;
      const type = el.dataset['sw'] as TaskType;
      const existing = this.tasks.get(tid);
      const task: Task = existing ?? {
        id: tid,
        type,
        el,
        deps: (el.dataset['swDeps'] || "").split(/\s+/).filter(Boolean),
        priority: Number(el.dataset['swPriority'] || 0),
        meta: el.dataset['swMeta'] || "",
        variant: el.dataset['swVariant'] || "h",
        status: "pending",
        progress: 0,
        agentId: null,
        rect: null,
        text: el.textContent ?? "",
        originalHTML: el.innerHTML,
        workMs: 0,
        workT: 0,
        revealDone: false,
      };
      if (existing) {
        existing.el = el;
        existing.rect = null;
      }
      this.tasks.set(tid, task);
      if (this.allRevealed || this.completedGroups.has(id) || this.reduced) {
        task.status = "done";
      } else if (this.running) {
        el.classList.add("sw-pending");
      }
      taskIds.push(tid);
    });
    this.groups.set(id, { root, taskIds, activated: this.completedGroups.has(id) || this.allRevealed });
    if (!this.completedGroups.has(id) && !this.allRevealed && this.io) this.io.observe(root);
  }

  unregisterGroup(id: string) {
    const g = this.groups.get(id);
    if (!g) return;
    this.io?.unobserve(g.root);
    for (const tid of g.taskIds) this.tasks.delete(tid);
    this.groups.delete(id);
  }

  private activateGroup(id: string) {
    const g = this.groups.get(id);
    if (!g || g.activated) return;
    g.activated = true;
  }

  private openingGather() {
    const n = this.mobile ? 4 : 8;
    for (let i = 0; i < n; i++) {
      const a = this.spawnAgent();
      a.tx = window.innerWidth * (0.18 + Math.random() * 0.64);
      a.ty = window.innerHeight * (0.22 + Math.random() * 0.45);
    }
    window.setTimeout(() => {
      this.opened = true;
      for (const id of this.pendingActivation) this.activateGroup(id);
      this.pendingActivation.clear();
      const vh = window.innerHeight;
      for (const [id, g] of this.groups) {
        if (g.activated) continue;
        const r = g.root.getBoundingClientRect();
        if (r.top < vh * 1.25 && r.bottom > -260) this.activateGroup(id);
      }
    }, this.mobile ? 420 : 720);
  }

  // ---------------- controls ----------------

  setSpeed(speed: number) {
    this.speed = speed;
  }

  setPaused(on: boolean) {
    this.paused = on;
    this.geomDirty = true;
  }

  setGuides(show: boolean) {
    this.renderer?.setGuides(show);
  }

  setLabels(show: boolean) {
    this.renderer?.setLabels(show);
  }

  setEnabled(on: boolean) {
    if (this.reduced) return;
    if (on && !this.running) {
      this.allRevealed = false;
      this.completedGroups.clear();
      this.running = true;
      this.reset();
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    } else if (!on && this.running) {
      this.running = false;
      cancelAnimationFrame(this.raf);
      this.revealEverything();
    }
  }

  reset() {
    if (this.reduced || !this.renderer) return;
    this.completedGroups.clear();
    for (const t of this.tasks.values()) {
      t.status = "pending";
      t.progress = 0;
      t.workT = 0;
      t.revealDone = false;
      t.agentId = null;
      t.el.classList.remove("sw-typing", "sw-reveal", "sw-line");
      void t.el.offsetWidth;
      if (t.type === "text") t.el.innerHTML = t.originalHTML;
      if (t.type === "line") t.el.style.transform = "";
      if (!t.el.classList.contains("sw-pending")) t.el.classList.add("sw-pending");
    }
    for (const g of this.groups.values()) {
      g.activated = false;
      this.io?.observe(g.root);
    }
    this.renderer.clearAgents();
    this.renderer.clearOverlays();
    this.agents = [];
    this.opened = false;
    this.pendingActivation.clear();
    this.geomDirty = true;
    this.openingGather();
  }

  private revealEverything() {
    for (const t of this.tasks.values()) {
      t.status = "done";
      t.el.classList.remove("sw-pending", "sw-typing", "sw-reveal", "sw-line");
      if (t.type === "text") t.el.innerHTML = t.originalHTML;
      if (t.type === "line") t.el.style.transform = "";
    }
    this.renderer?.clearAgents();
    this.renderer?.clearOverlays();
    this.agents = [];
    this.allRevealed = true;
  }

  // ---------------- main loop ----------------

  private tick = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(50, now - this.last) * (this.paused ? 0 : this.speed);
    this.last = now;
    if (dt > 0) {
      if (this.geomDirty) {
        this.remeasure();
        this.geomDirty = false;
      }
      this.schedule();
      this.advance(dt, now);
    } else if (this.geomDirty) {
      this.remeasure();
      this.geomDirty = false;
    }
    this.renderer?.render(this.agents, Array.from(this.tasks.values()), now);
    this.raf = requestAnimationFrame(this.tick);
  };

  private remeasure() {
    for (const t of this.tasks.values()) {
      if (t.status === "done" || !t.el.isConnected) continue;
      t.rect = this.measure(t.el);
    }
  }

  private measure(el: HTMLElement): Rect {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  }

  private depsDone(t: Task): boolean {
    for (const dep of t.deps) {
      const d = this.tasks.get(dep);
      if (!d || d.status !== "done") return false;
    }
    return true;
  }

  private schedule() {
    const ready: Task[] = [];
    let activeCount = 0;
    for (const g of this.groups.values()) {
      if (!g.activated) continue;
      for (const tid of g.taskIds) {
        const t = this.tasks.get(tid);
        if (!t) continue;
        if (t.status === "active") activeCount++;
        else if (t.status === "pending" && this.depsDone(t)) ready.push(t);
      }
    }
    this.hasWork = activeCount > 0 || ready.length > 0;
    if (!this.hasWork) return;

    const cap = this.mobile ? 8 : 48;
    const minPop = this.opened ? (this.mobile ? 2 : 3) : this.mobile ? 4 : 8;
    const desired = Math.min(cap, Math.max(minPop, Math.ceil((activeCount + ready.length) / 3)));
    let spawns = 0;
    while (this.agents.length < desired && spawns < 2) {
      this.spawnAgent();
      spawns++;
    }

    if (ready.length === 0) return;
    const cy = window.innerHeight / 2;
    ready.sort((a, b) => this.taskDist(a, cy) - this.taskDist(b, cy) || a.priority - b.priority);
    for (const t of ready) {
      if (t.status !== "pending") continue;
      const agent = this.nearestIdleAgent(t);
      if (!agent) break;
      this.assign(agent, t);
    }
  }

  private taskDist(t: Task, cy: number): number {
    if (!t.rect) return 1e9;
    return Math.abs(t.rect.y + t.rect.h / 2 - cy);
  }

  private nearestIdleAgent(t: Task): Agent | null {
    if (!t.rect) return null;
    let best: Agent | null = null;
    let bestDist = Infinity;
    for (const a of this.agents) {
      if (a.state !== "idle") continue;
      const d = Math.hypot(a.x - t.rect.x, a.y - t.rect.y);
      if (d < bestDist) {
        bestDist = d;
        best = a;
      }
    }
    return best;
  }

  private spawnAgent(): Agent {
    const id = this.nextAgentId++;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const fromBottom = Math.random() < 0.65;
    const agent: Agent = {
      id,
      name: NAMES[(id - 1) % NAMES.length] ?? "Editor",
      color: COLORS[(id - 1) % COLORS.length] ?? "#0D99FF",
      shape: "arrow",
      x: fromBottom ? vw * (0.05 + Math.random() * 0.9) : vw + 30,
      y: fromBottom ? vh + 30 : vh * (0.05 + Math.random() * 0.9),
      tx: vw / 2,
      ty: vh / 2,
      state: "spawn",
      speed: 850 + Math.random() * 750,
      taskId: null,
      idleSince: performance.now(),
    };
    this.agents.push(agent);
    return agent;
  }

  private assign(agent: Agent, t: Task) {
    const r = t.rect ?? (t.rect = this.measure(t.el));
    t.status = "active";
    t.agentId = agent.id;
    t.workT = 0;
    agent.taskId = t.id;
    agent.state = "travel";
    agent.shape = "arrow";
    if (t.type === "duplicate") {
      const src = t.deps[0] ? this.tasks.get(t.deps[0]) : undefined;
      const sr = src?.rect ?? r;
      agent.tx = sr.x + sr.w / 2;
      agent.ty = sr.y + sr.h / 2;
    } else if (t.type === "text") {
      agent.tx = r.x - 10;
      agent.ty = r.y + r.h / 2;
    } else if (t.type === "line") {
      agent.tx = r.x - 4;
      agent.ty = r.y + r.h / 2;
    } else if (t.type === "guide") {
      agent.tx = r.x + r.w / 2;
      agent.ty = r.y + r.h / 2;
    } else {
      agent.tx = r.x - 8;
      agent.ty = r.y - 8;
    }
    if (t.type === "rect" || t.type === "media" || t.type === "marquee") {
      this.emit({ type: "selectStart" });
    }
  }

  private advance(dt: number, now: number) {
    for (const a of this.agents) {
      if (a.state === "travel" || a.state === "spawn") {
        const dx = a.tx - a.x;
        const dy = a.ty - a.y;
        const dist = Math.hypot(dx, dy);
        const v = a.state === "spawn" ? a.speed : Math.min(a.speed, Math.max(240, dist * 5));
        const step = (v * dt) / 1000;
        if (dist <= Math.max(2.5, step)) {
          a.x = a.tx;
          a.y = a.ty;
          const t = a.taskId ? this.tasks.get(a.taskId) : undefined;
          if (t && a.state === "travel") this.beginWork(a, t);
          else {
            a.state = "idle";
            a.idleSince = now;
          }
        } else {
          a.x += (dx / dist) * step;
          a.y += (dy / dist) * step;
        }
      } else if (a.state === "work") {
        const t = a.taskId ? this.tasks.get(a.taskId) : undefined;
        if (!t || t.status !== "active") {
          a.state = "idle";
          a.idleSince = now;
          a.taskId = null;
          continue;
        }
        t.workT += dt;
        const p = Math.min(1, t.workT / t.workMs);
        t.progress = p;
        this.runWork(a, t, p);
        if (p >= 1) this.finishTask(a, t, now);
      }
    }
    const grace = this.hasWork ? 14000 : 2200;
    this.agents = this.agents.filter((a) => {
      if (a.state === "idle" && now - a.idleSince > grace) return false;
      return true;
    });
  }

  private effectiveDuration(t: Task): number {
    const r = t.rect ?? this.measure(t.el);
    let base: number;
    switch (t.type) {
      case "rect":
        base = 420 + Math.min(420, (r.w * r.h) / 3800);
        break;
      case "text":
        base = Math.min(1500, Math.max(340, t.text.length * 15));
        break;
      case "media":
        base = 560;
        break;
      case "line":
        base = 480;
        break;
      case "marquee":
        base = 660;
        break;
      case "guide":
        base = 820;
        break;
      case "duplicate":
        base = 540;
        break;
    }
    let backlog = 0;
    for (const x of this.tasks.values()) if (x.status !== "done") backlog++;
    const f = backlog > 18 ? 0.45 : backlog > 9 ? 0.65 : 1;
    return base * f * (this.mobile ? 0.8 : 1);
  }

  private beginWork(agent: Agent, t: Task) {
    agent.state = "work";
    agent.shape = SHAPES[t.type];
    t.workT = 0;
    t.workMs = this.effectiveDuration(t);
    if (!t.rect) t.rect = this.measure(t.el);
    if (t.type === "text") {
      t.el.classList.remove("sw-pending");
      t.el.classList.add("sw-typing");
    } else if (t.type === "line") {
      t.el.classList.remove("sw-pending");
      t.el.classList.add("sw-line");
      t.el.style.transform = "scaleX(0)";
    }
  }

  private runWork(agent: Agent, t: Task, p: number) {
    const r = t.rect;
    if (!r) return;
    switch (t.type) {
      case "rect":
      case "marquee": {
        agent.x = r.x + r.w * p;
        agent.y = r.y + r.h * p;
        break;
      }
      case "media": {
        if (p < 0.4) {
          const q = p / 0.4;
          agent.x = r.x + r.w * q;
          agent.y = r.y + r.h * q;
        } else if (!t.revealDone) {
          t.revealDone = true;
          t.el.classList.remove("sw-pending");
          t.el.classList.add("sw-reveal");
          t.el.style.setProperty("--sw-reveal-ms", `${Math.max(260, t.workMs * 0.6)}ms`);
          agent.shape = "arrow";
        }
        break;
      }
      case "text": {
        const n = Math.max(1, Math.floor(p * t.text.length));
        const next = t.text.slice(0, n);
        if (t.el.textContent !== next) t.el.textContent = next;
        if (n % 4 === 0) this.emit({ type: "typeTick" });
        break;
      }
      case "line": {
        t.el.style.transform = `scaleX(${p})`;
        agent.x = r.x + r.w * p;
        agent.y = r.y + r.h / 2;
        break;
      }
      case "guide":
        break;
      case "duplicate": {
        if (p >= 0.35) {
          const src = t.deps[0] ? this.tasks.get(t.deps[0])?.rect : undefined;
          const sr = src ?? r;
          const q = (p - 0.35) / 0.65;
          agent.x = sr.x + sr.w / 2 + (r.x + r.w / 2 - (sr.x + sr.w / 2)) * q;
          agent.y = sr.y + sr.h / 2 + (r.y + r.h / 2 - (sr.y + sr.h / 2)) * q;
        }
        break;
      }
    }
  }

  private finishTask(agent: Agent, t: Task, now: number) {
    t.status = "done";
    t.progress = 1;
    t.agentId = null;
    t.el.classList.remove("sw-pending");
    if (t.type === "text") {
      t.el.classList.remove("sw-typing");
      t.el.innerHTML = t.originalHTML;
    } else if (t.type === "line") {
      t.el.style.transform = "";
      t.el.classList.remove("sw-line");
    }
    this.renderer?.addFlash(t.rect);
    agent.taskId = null;
    agent.state = "idle";
    agent.idleSince = now;
    agent.shape = "arrow";
    this.emit({ type: "taskDone", kind: t.type });
    this.checkGroups();
  }

  private checkGroups() {
    for (const [id, g] of this.groups) {
      if (this.completedGroups.has(id)) continue;
      const allDone = g.taskIds.every((tid) => this.tasks.get(tid)?.status === "done");
      if (allDone) this.completedGroups.add(id);
    }
  }

  private emit(e: SwarmEvent) {
    this.onEvent?.(e);
  }
}

export const swarm = new SwarmEngine();
