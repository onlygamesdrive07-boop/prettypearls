"use client";

import { useEffect, useRef } from "react";

/**
 * A quiet, ring-style cursor that trails the pointer with gentle lag.
 * Disabled on touch devices — it should never get in the way of the craft.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.16;
      pos.current.y += (target.current.y - pos.current.y) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.current.x - 14}px, ${pos.current.y - 14}px, 0)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-7 w-7 rounded-full border border-gold/70 mix-blend-difference md:block"
      aria-hidden
    />
  );
}
