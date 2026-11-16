export type CursorShape =
  | "arrow"
  | "crosshair"
  | "ibeam"
  | "pen"
  | "move"
  | "resize"
  | "duplicate";

export type TaskType =
  | "rect"
  | "text"
  | "media"
  | "line"
  | "marquee"
  | "guide"
  | "duplicate";

export type TaskStatus = "pending" | "active" | "done";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Task {
  id: string;
  type: TaskType;
  el: HTMLElement;
  deps: string[];
  priority: number;
  meta: string;
  variant: string;
  status: TaskStatus;
  progress: number;
  agentId: number | null;
  rect: Rect | null;
  text: string;
  originalHTML: string;
  workMs: number;
  workT: number;
  revealDone: boolean;
}

export interface Agent {
  id: number;
  name: string;
  color: string;
  shape: CursorShape;
  x: number;
  y: number;
  tx: number;
  ty: number;
  state: "spawn" | "travel" | "work" | "idle";
  speed: number;
  taskId: string | null;
  idleSince: number;
}

export type SwarmEvent =
  | { type: "taskDone"; kind: TaskType }
  | { type: "typeTick" }
  | { type: "selectStart" };
