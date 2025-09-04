"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import LogoGlyphs from "./LogoGlyphs"
import Panel from "./Panel"
import StripeBlock from "./StripeBlock"
import Bullet from "./Bullet"


export default function IntroAxolot({ onComplete }) {
  const rootRef = useRef(null)
  const [played, setPlayed] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root || played) return

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduce) {
      root.style.opacity = "1"
      root.style.backgroundColor = "#1A1A1A"
      const all = root.querySelectorAll(
        "[data-piece],[data-tag] span,[data-panel],[data-stripes],[data-bullet],[data-guides],[data-scan]",
      )
      all.forEach((el) => (el.style.opacity = "1"))
      setPlayed(true)
      onComplete?.()
      return
    }

    // Nodes
    const pieces = root.querySelectorAll("[data-piece]")
    const tagline = root.querySelectorAll("[data-tag] span")
    const panels = root.querySelectorAll("[data-panel]")
    const stripes = root.querySelectorAll("[data-stripes]")
    const bullets = root.querySelectorAll("[data-bullet]")
    const guides = root.querySelectorAll("[data-guides]")
    const scan = root.querySelector("[data-scan]")
    const letterTop = root.querySelector("[data-letterbox='top']")
    const letterBot = root.querySelector("[data-letterbox='bottom']")
    const vignette = root.querySelector("[data-vignette]")
    const stage = root.querySelector("[data-stage]")
    const pixelOverlay = root.querySelector("[data-pixel-overlay]")
    const pixelCells = root.querySelectorAll("[data-cell]")

    // Initial state
    gsap.set(root, { opacity: 1, backgroundColor: "#1A1A1A" })
    gsap.set(stage, { scale: 1.035, transformOrigin: "50% 50%", willChange: "transform" })
    gsap.set([letterTop, letterBot], { yPercent: (i) => (i === 0 ? -110 : 110) })
    gsap.set(vignette, { opacity: 0 })
    gsap.set(scan, { opacity: 0, y: "-120%" })
    gsap.set(pixelOverlay, { opacity: 0 })
    gsap.set(pixelCells, { scale: 0, transformOrigin: "50% 50%" })

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut", duration: 0.8 },
      onComplete: () => {
        setPlayed(true)
        onComplete?.()
      },
    })

    // 0) Letterbox in + priming flicker + camera settle
    tl.to([letterTop, letterBot], { yPercent: 0, duration: 1.1, ease: "power3.out" }, 0)
      .fromTo(
        root,
        { backgroundColor: "#1A1A1A" },
        { backgroundColor: "#2A1A0A", duration: 0.12, ease: "power2.inOut" },
        0.05,
      )
      .to(root, { backgroundColor: "#1A1A1A", duration: 0.12 }, 0.22)
      .to(stage, { scale: 1.0, duration: 1.4, ease: "power2.out" }, 0)

    // 1) Center glyph cluster "lock-in" with jitter settle
    tl.to(
      pieces,
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        stagger: { each: 0.06, from: "center" },
        ease: "back.out(1.6)",
        duration: 0.72,
      },
      0.18,
    ).to(
      pieces,
      {
        keyframes: {
          "0%": { x: 0, y: 0 },
          "25%": { x: -1.5, y: 1 },
          "50%": { x: 1, y: -0.5 },
          "75%": { x: -0.75, y: 0.75 },
          "100%": { x: 0, y: 0 },
        },
        duration: 0.3,
        ease: "none",
      },
      0.98,
    )

    // 2) Tagline reveal, tick-tick cadence
    tl.to(tagline, { opacity: 1, y: 0, stagger: 0.06, duration: 0.55, ease: "power2.out" }, 0.42)

    // 3) Column guides and scanline sweep
    tl.to(guides, { opacity: 1, yPercent: 0, duration: 0.5 }, 0.46)
      .to(scan, { opacity: 0.22, y: "140%", duration: 1.1, ease: "power1.inOut" }, 0.55)
      .to(scan, { opacity: 0.04, duration: 0.3 }, 1.7)
      .to(vignette, { opacity: 1, duration: 0.8, ease: "sine.out" }, 0.55)

    // 4) Red panels slide in with clip reveal
    tl.to(
      panels,
      {
        opacity: 1,
        yPercent: 0,
        clipPath: "inset(0 0 0 0 round 2px)",
        stagger: 0.14,
        ease: "expo.out",
        duration: 0.9,
      },
      0.8,
    )

    // 5) Diagonal stripes sweep from sides
    tl.to(
      stripes,
      {
        opacity: 1,
        xPercent: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "expo.out",
      },
      1.05,
    )

    // 6) Bottom-left bullets reveal with cadence
    tl.to(
      bullets,
      {
        opacity: 1,
        x: 0,
        stagger: 0.28,
        duration: 0.48,
        ease: "steps(6)",
      },
      1.25,
    )

    // 7) Warm amber takeover flash + quick camera jitter + return to charcoal
    tl.to(root, { backgroundColor: "#F59E0B", duration: 0.42, ease: "power3.in" }, 2.2)
      .to(
        root,
        {
          keyframes: {
            "0%": { x: 0, y: 0 },
            "20%": { x: -2, y: 1 },
            "40%": { x: 1.5, y: -1 },
            "60%": { x: -1, y: 1 },
            "80%": { x: 1, y: 0 },
            "100%": { x: 0, y: 0 },
          },
          duration: 0.28,
          ease: "none",
        },
        2.28,
      )
      .to(root, { backgroundColor: "#1A1A1A", duration: 0.9, ease: "power3.out" }, 2.66)
      .to([letterTop, letterBot], { yPercent: (i) => (i === 0 ? -120 : 120), duration: 1.0, ease: "power3.in" }, 2.7)

    // 8) Wiggly stroke animation
    const wigglyStroke = root.querySelector("[data-piece] path")
    if (wigglyStroke) {
      tl.to(
        wigglyStroke,
        {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.out",
        },
        1.3
      )
    }

   

    return () => {
      tl.kill()
    }
  }, [played, onComplete])

  return (
    <section
      ref={rootRef}
      className="relative isolate min-h-dvh overflow-hidden bg-black text-white"
      aria-label="Intro animation"
    >
      {/* Cinematic letterbox bars */}
      <div data-letterbox="top" className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[10vh] bg-black/95" />
      <div data-letterbox="bottom" className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-[10vh] bg-black/95" />

      {/* Vignette overlay for depth */}
      <div
        data-vignette
        className="pointer-events-none absolute inset-0 z-30 opacity-0"
        aria-hidden="true"
        style={{
          background: "radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      <div data-stage className="absolute inset-0 z-20">
        {/* Column guides (subtle vertical grid) */}
        <div className="pointer-events-none absolute inset-0 z-0 flex" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              data-guides
              className="h-full flex-1 opacity-0"
              style={{
                backgroundImage: "linear-gradient(to right, rgba(251,146,60,0.12) 0 1px, rgba(0,0,0,0) 1px)",
                backgroundSize: "16.666% 100%",
                mixBlendMode: "soft-light",
              }}
            />
          ))}
        </div>

        {/* Scanline sweep overlay */}
        <div
          data-scan
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/3 opacity-0"
          aria-hidden="true"
          style={{
            background: "linear-gradient(to bottom, rgba(251,146,60,0.3), rgba(251,146,60,0))",
            mixBlendMode: "screen",
            filter: "blur(0.5px)",
          }}
        />

        {/* Center cluster */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex items-center gap-6">
            <LogoGlyphs />

            <div
              className="flex flex-col gap-0.5 font-mono text-[11px] leading-4 tracking-[0.12em] text-gray-300"
              data-tag
            >
              <span className="uppercase">Binart</span>
              <span className="uppercase">Digital Art</span>
              <span className="uppercase">Canvas</span>
            </div>
          </div>
        </div>

        {/* Solid red panels with clip reveal */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Panel className="left-[6%] top-[14%] h-40 w-40" tone="dark" />
          <Panel className="right-[20%] top-[10%] h-52 w-64" tone="darker" />
          <Panel className="left-[16%] bottom-[12%] h-56 w-56" tone="darker" />
          <Panel className="right-[10%] bottom-[10%] h-64 w-64" tone="dark" />
          {/* extra narrow bar like the site */}
          <Panel className="left-[0%] top-[35%] h-8 w-40" tone="dark" />
        </div>

        {/* Diagonal stripe blocks */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <StripeBlock className="left-[3%] top-[22%] h-64 w-56" />
          <StripeBlock className="right-[6%] top-[6%] h-56 w-56" />
          <StripeBlock className="right-[3%] bottom-[18%] h-60 w-60" />
          <StripeBlock className="left-[28%] bottom-[8%] h-56 w-56" />
          {/* small accent */}
          <StripeBlock className="left-[48%] top-[8%] h-24 w-24" />
        </div>

        {/* Bottom-left bullets */}
        <div className="absolute bottom-16 left-10 font-mono text-[11px] leading-6 text-gray-400">
          <Bullet index={1} text="WIGGLY DRAWING" />
          <Bullet index={2} text="BINARY EXPORT" />
          <Bullet index={3} text="PRIVACY FIRST" />
        </div>
        
      </div>

    </section>
  )
}
