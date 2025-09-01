"use client"

import { cn } from "@/lib/utils"

/**
 * Panel
 * Solid red panels used around the stage. Starts clipped and slightly translated,
 * then GSAP reveals them via clipPath and yPercent.
 */
export default function Panel({ className, tone = "dark" }) {
  const bg =
    tone === "dark"
      ? "rgba(245, 158, 11, 0.85)" // warm amber, strong
      : "rgba(245, 158, 11, 0.22)" // warm amber, muted
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
