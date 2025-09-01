"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"

/**
 * Professional, slow-paced, cinematic Axolot-style intro.
 * - 4-color palette: black (#000), white (#fff), red (#E10600), gray (#9CA3AF)
 * - Letterbox bars, scanline/grain overlay, subtle vignette
 * - Center glyph cluster lock-in + micro-jitter settle
 * - Red panels and diagonal striped blocks via clip-path and transforms
 * - Bottom-left ticking bullets, right-side label reveal
 * - Red flash with camera shake, reduced-motion support, Skip/Replay controls
 */
export default function IntroAxolotPro({
  onComplete,
}: {
  onComplete?: () => void
}) {
  const root = useRef<HTMLDivElement | null>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced =
        typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

      const tl = gsap.timeline({ paused: true })
      tlRef.current = tl

      const q = gsap.utils.selector(root)
      const stage = q(".stage")
      const glyphs = q(".glyph")
      const label = q(".label")
      const bullets = q(".bullet")
      const panels = q(".panel")
      const stripes = q(".stripe")
      const bars = q(".letterbox")
      const flash = q(".flash")
      const vignette = q(".vignette")
      const grid = q(".grid")

      // Initial state
      gsap.set(stage, { scale: 1.08, rotateZ: 0.25, opacity: 1, transformOrigin: "50% 50%" })
      gsap.set(glyphs, { opacity: 0, scale: 0.9, y: 16 })
      gsap.set(label, { opacity: 0, x: 16, clipPath: "inset(0 100% 0 0)" })
      gsap.set(bullets, { opacity: 0, y: 12 })
      gsap.set(panels, { opacity: 0, clipPath: "inset(0 100% 0 0)" })
      gsap.set(stripes, { opacity: 0, clipPath: "inset(0 0 100% 0)" })
      gsap.set(bars, { yPercent: (i) => (i === 0 ? -100 : 100) })
      gsap.set(flash, { opacity: 0 })
      gsap.set(vignette, { opacity: 0.0 })
      gsap.set(grid, { opacity: 0.0 })

      if (prefersReduced) {
        // Show end state immediately for reduced motion users
        gsap.set(bars, { yPercent: 0 })
        gsap.set(stage, { scale: 1, rotateZ: 0, opacity: 1 })
        gsap.set(glyphs, { opacity: 1, scale: 1, y: 0 })
        gsap.set(label, { opacity: 1, x: 0, clipPath: "inset(0 0 0 0)" })
        gsap.set(panels, { opacity: 1, clipPath: "inset(0 0 0 0)" })
        gsap.set(stripes, { opacity: 0.6, clipPath: "inset(0 0 0 0)" })
        gsap.set(bullets, { opacity: 1, y: 0 })
        gsap.set(vignette, { opacity: 0.25 })
        gsap.set(grid, { opacity: 0.12 })
        return
      }

      // 1) Letterbox in + faint grid/vignette
      tl.to(
        bars,
        {
          yPercent: 0,
          duration: 0.9,
          ease: "power2.out",
          stagger: { each: 0.05, from: "edges" },
        },
        0,
      )
        .to(vignette, { opacity: 0.25, duration: 1.2, ease: "power1.out" }, 0.1)
        .to(grid, { opacity: 0.12, duration: 1.0, ease: "power1.out" }, 0.1)

      // 2) Camera settle
      tl.to(
        stage,
        {
          scale: 1,
          rotateZ: 0,
          duration: 1.6,
          ease: "power3.out",
        },
        0.05,
      )

      // 3) Glyphs lock-in with micro jitter
      tl.to(
        glyphs,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.06,
        },
        0.2,
      ).add(() => {
        // micro jitter lock
        gsap.to(stage, {
          keyframes: [
            { x: 1.5, y: -1.2, duration: 0.06 },
            { x: -1.0, y: 0.8, duration: 0.06 },
            { x: 0, y: 0, duration: 0.08 },
          ],
          ease: "none",
        })
      }, 0.9)

      // 4) Red panels sweep in from alternating sides
      tl.to(
        panels,
        {
          opacity: 1,
          duration: 1.2,
          clipPath: (i) => (i % 2 === 0 ? "inset(0 0% 0 0)" : "inset(0 0 0 0%)"),
          ease: "power3.inOut",
          stagger: { each: 0.14, from: "random" },
        },
        0.6,
      )

      // 5) Diagonal stripes reveal
      tl.to(
        stripes,
        {
          opacity: 0.7,
          clipPath: "inset(0 0 0 0)",
          duration: 1.0,
          ease: "power2.out",
          stagger: { each: 0.12, from: "start" },
        },
        0.85,
      )

      // 6) Right-hand label
      tl.to(
        label,
        {
          opacity: 1,
          x: 0,
          clipPath: "inset(0 0 0 0)",
          duration: 0.9,
          ease: "power3.out",
        },
        1.05,
      )

      // 7) Bullets ticking in
      tl.to(
        bullets,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "steps(5)",
          stagger: 0.3,
        },
        1.2,
      )

      // 8) Red flash + camera shake, then letterbox release
      tl.to(
        flash,
        {
          opacity: 0.9,
          duration: 0.12,
          ease: "power4.in",
        },
        2.15,
      )
        .add(() => {
          gsap.to(stage, {
            keyframes: [
              { x: -2, y: 1, duration: 0.04 },
              { x: 2, y: -1, duration: 0.04 },
              { x: 0, y: 0, duration: 0.08 },
            ],
            ease: "none",
          })
        }, 2.17)
        .to(flash, { opacity: 0, duration: 0.25, ease: "power2.out" }, 2.28)
        .to(
          bars,
          {
            yPercent: (i) => (i === 0 ? -100 : 100),
            duration: 0.9,
            ease: "power2.inOut",
            stagger: { each: 0.05, from: "center" },
            onComplete: () => onComplete?.(),
          },
          2.5,
        )

      tl.play()

      // Cleanup
      return () => {
        tl.kill()
      }
    }, root)

    return () => ctx.revert()
  }, [onComplete])

  const handleSkip = () => {
    tlRef.current?.progress(1).kill()
    onComplete?.()
  }

  const handleReplay = () => {
    tlRef.current?.restart(true)
  }

  return (
    <section ref={root} className="relative h-dvh w-full overflow-hidden bg-black text-white">
      {/* Letterbox bars */}
      <div className="letterbox pointer-events-none absolute inset-x-0 top-0 h-[14svh] bg-black z-50" />
      <div className="letterbox pointer-events-none absolute inset-x-0 bottom-0 h-[14svh] bg-black z-50" />

      {/* Subtle grid and vignette */}
      <div
        className="grid pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(transparent 95%, rgba(255,255,255,0.03) 96%), linear-gradient(90deg, transparent 95%, rgba(255,255,255,0.03) 96%)",
          backgroundSize: "1.5rem 1.5rem, 1.5rem 1.5rem",
        }}
      />
      <div
        className="vignette pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Red flash overlay */}
      <div className="flash pointer-events-none absolute inset-0 z-40" style={{ background: "#E10600" }} />

      {/* Controls */}
      <div className="absolute right-4 top-4 z-50 flex items-center gap-2">
        <button
          onClick={handleSkip}
          className="rounded border border-white/40 px-3 py-1 text-xs tracking-widest text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          SKIP
        </button>
        <button
          onClick={handleReplay}
          className="rounded border border-white/20 px-3 py-1 text-xs tracking-widest text-white/70 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          REPLAY
        </button>
      </div>

      {/* Stage - everything animates relative to this */}
      <div className="stage relative z-10 flex h-full w-full items-center justify-center">
        {/* Center cluster */}
        <div className="relative flex items-center gap-6">
          {/* Left stack of modular glyphs */}
          <div className="flex flex-col items-end gap-3">
            {/* step blocks */}
            <div className="glyph flex gap-2">
              <div className="h-6 w-6 bg-white" />
              <div className="h-6 w-6 bg-white" />
            </div>
            {/* quarter circles bar */}
            <div className="glyph flex items-center gap-2">
              <div className="h-12 w-16 overflow-hidden bg-white">
                <div className="h-full w-1/2 rounded-r-full bg-black" />
              </div>
              <div className="h-12 w-12 rounded-full border-8 border-white" />
            </div>
            {/* checker */}
            <div className="glyph grid grid-cols-2 gap-2">
              <div className="h-8 w-8 bg-white" />
              <div className="h-8 w-8 bg-white/10" />
              <div className="h-8 w-8 bg-white/10" />
              <div className="h-8 w-8 bg-white" />
            </div>
          </div>

          {/* Stripes block */}
          <div className="glyph h-20 w-20 bg-white p-1">
            <div
              className="h-full w-full"
              style={{
                background: "repeating-linear-gradient(135deg, black 0 6px, transparent 6px 14px)",
              }}
            />
          </div>

          {/* Right-side label */}
          <div className="label w-[220px] text-right font-mono text-xs leading-5 text-[#9CA3AF]">
            <div className="tracking-[0.25em]">BIN</div>
            <div className="tracking-[0.25em]">AR</div>
            <div className="tracking-[0.25em]">T</div>
          </div>
        </div>

        {/* Panels and stripes around the stage */}
        {/* Panels: solid red */}
        <div className="panel absolute left-[8%] top-[14%] h-40 w-40 bg-[#E10600]/90" />
        <div className="panel absolute right-[18%] top-[10%] h-44 w-56 bg-[#E10600]/80" />
        <div className="panel absolute left-[10%] bottom-[14%] h-52 w-44 bg-[#E10600]/20" />
        <div className="panel absolute right-[8%] bottom-[18%] h-40 w-40 bg-[#E10600]/20" />

        {/* Striped blocks */}
        <div
          className="stripe absolute left-[4%] top-[22%] h-56 w-64"
          style={{
            background: "repeating-linear-gradient(135deg, rgba(225,6,0,1) 0 3px, rgba(225,6,0,0) 3px 14px)",
          }}
        />
        <div
          className="stripe absolute right-[6%] top-[14%] h-52 w-56"
          style={{
            background: "repeating-linear-gradient(135deg, rgba(225,6,0,1) 0 3px, rgba(225,6,0,0) 3px 14px)",
          }}
        />
        <div
          className="stripe absolute left-[20%] bottom-[12%] h-44 w-44"
          style={{
            background: "repeating-linear-gradient(135deg, rgba(225,6,0,1) 0 3px, rgba(225,6,0,0) 3px 14px)",
          }}
        />
      </div>

      {/* Bottom-left bullets */}
    </section>
  )
}
