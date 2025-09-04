"use client"

import { cn } from "@/lib/utils"

export default function Panel({ className, tone = "dark" }) {
  const bg =
    tone === "dark"
      ? "rgba(245, 158, 11, 0.85)" 
      : "rgba(245, 158, 11, 0.22)"
  return (
    <div
      data-panel
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-[2px]", "opacity-0", className)}
      style={{
        background: bg,
        transform: "translateY(10%)",
        clipPath: "inset(0 100% 0 0 round 2px)",
        willChange: "transform, clip-path, opacity",
      }}
    />
  )
}
