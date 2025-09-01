"use client"

import { cn } from "@/lib/utils"

/**
 * Bullet
 * Monospace line like: [01] ........ SURVIVAL SANDBOX
 * Starts slightly left and transparent. GSAP reveals with steps() cadence.
 */
export default function Bullet({ className, index, text }) {
  const idx = String(index).padStart(2, "0")
  return (
    <div
      data-bullet
      className={cn("opacity-0 -translate-x-2", "font-mono tracking-[0.4em] text-gray-400", className)}
      style={{ willChange: "transform, opacity" }}
    >
      [{idx}] ........ {text}
    </div>
  )
}
