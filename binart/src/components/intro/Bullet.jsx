"use client"

import { cn } from "@/lib/utils"


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
