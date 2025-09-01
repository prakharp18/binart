"use client"

import { cn } from "@/lib/utils"

/**
 * StripeBlock
 * Diagonal red stripes on transparent. Starts offset horizontally and hidden.
 * GSAP animates xPercent to 0 and fades it in.
 */
export default function StripeBlock({ className, direction = "left" }) {
  const startOffset = direction === "left" ? "-30%" : "30%"
  return (
    <div
      data-stripes
      aria-hidden="true"
      className={cn("pointer-events-none absolute opacity-0", className)}
      style={{
        background: "repeating-linear-gradient(135deg, rgba(245,158,11,1) 0 3px, rgba(245,158,11,0) 3px 14px)",
        transform: `translateX(${startOffset})`,
        willChange: "transform, opacity, clip-path",
        clipPath: "inset(0 0 100% 0)", // hidden vertically until reveal
      }}
    />
  )
}
