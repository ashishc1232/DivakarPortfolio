import { useCallback, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import beforeImg from "@/assets/before-after/before.jpg";
import afterImg from "@/assets/before-after/after.jpg";
import { cn } from "@/lib/utils";

/**
 * Interactive before/after comparison slider.
 * Keyboard accessible (arrow keys), pointer + touch drag.
 * Imagery is an illustrative demonstration, not client footage.
 */
export function BeforeAfterSlider({ className }: { className?: string }) {
  const [pos, setPos] = useState(52);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(96, Math.max(4, p)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  };
  const endDrag = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(4, p - 4));
    if (e.key === "ArrowRight") setPos((p) => Math.min(96, p + 4));
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={boxRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative aspect-video w-full cursor-ew-resize select-none overflow-hidden rounded-xl border border-border bg-card touch-none"
      >
        {/* Before (base layer) */}
        <img
          src={beforeImg}
          alt="Before: flat, ungraded footage"
          loading="lazy"
          width={1600}
          height={912}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        {/* After (clipped from the left) */}
        <img
          src={afterImg}
          alt="After: color graded, contrast-rich finish"
          loading="lazy"
          width={1600}
          height={912}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          draggable={false}
        />
        {/* Handle */}
        <div
          className="absolute inset-y-0 z-10 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.5)]"
          style={{ left: `${pos}%` }}
        >
          <div
            role="slider"
            tabIndex={0}
            aria-label="Before and after comparison slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            onKeyDown={onKeyDown}
            className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-white/40 bg-black/70 text-white backdrop-blur focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--selection)]"
          >
            <MoveHorizontal className="h-4 w-4" />
          </div>
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/90 backdrop-blur">
          Before
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/90 backdrop-blur">
          After
        </span>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Illustrative demonstration of the grading difference — drag or use arrow keys. Client
        before/after assets can replace this placeholder.
      </p>
    </div>
  );
}
