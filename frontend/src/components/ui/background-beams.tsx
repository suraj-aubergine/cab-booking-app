"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function BackgroundBeams({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;

      container.style.setProperty("--x", x.toString());
      container.style.setProperty("--y", y.toString());
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-radial before:from-primary/20 before:to-transparent before:blur-2xl before:opacity-50",
        "after:absolute after:inset-0 after:bg-gradient-conic after:from-sky-500/40 after:via-blue-500/40 after:blur-2xl after:opacity-30",
        "[--x:0.5] [--y:0.5]",
        "before:[--gradient-position:calc(50%+var(--x,0)*100%)] before:[--gradient-size:calc(100%+var(--y,0)*100%)]",
        "after:[--gradient-position:calc(50%+var(--x,0)*100%)] after:[--gradient-size:calc(100%+var(--y,0)*100%)]",
        "animate-background-shine",
        className
      )}
    />
  );
} 