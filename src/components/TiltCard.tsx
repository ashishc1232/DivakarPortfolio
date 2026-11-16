import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

/**
 * Subtle realistic 3D tilt (max ~6°) with pointer-position lighting.
 * Disabled for touch pointers and reduced-motion users.
 */
export function TiltCard({ children, className, maxTilt = 6 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const active = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !active()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
      el.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
      el.style.transform = `perspective(950px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg)`;
    });
  };

  const onPointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("tilt-card relative", className)}
    >
      {children}
      <div className="tilt-glare pointer-events-none absolute inset-0 rounded-[inherit]" />
    </div>
  );
}
