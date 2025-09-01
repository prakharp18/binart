"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { gsap } from "gsap"

type Props = {
  onComplete?: () => void
  autoplay?: boolean
}

export default function IntroCinematic({ onComplete, autoplay = true }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const [done, setDone] = useState(false)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    // Respect reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Cleanup previous timeline
    tlRef.current?.kill()
    gsap.set(el.querySelectorAll("[data-anim]"), { clearProps: "all" })

    if (prefersReduced || !autoplay) {
      gsap.set(el, { opacity: 1 })
      gsap.set(["#glyph", "#label", "#bullets"], { opacity: 1 })
      return
    }

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        setDone(true)
        onComplete?.()
      },
    })
    tlRef.current = tl

    const letterTop = el.querySelector("#letterTop")
    const letterBot = el.querySelector("#letterBot")
    const glyph = el.querySelector("#glyph")
    const label = el.querySelector("#label")
    const bullets = el.querySelectorAll(".bullet")
    const redPanels = el.querySelectorAll(".red-panel")
    const stripeBlocks = el.querySelectorAll(".stripe-block")
    const grain = el.querySelector("#grain")
    const flash = el.querySelector("#flash")

    // Initial states
    gsap.set(el, { opacity: 1 })
    gsap.set([letterTop, letterBot], { yPercent: -110, transformOrigin: "50% 0%" })
    gsap.set(letterBot, { yPercent: 110 })
    gsap.set(glyph, { opacity: 0, scale: 0.92, rotate: -2, y: 8, filter: "blur(2px)" })
    gsap.set(label, { opacity: 0, x: 12 })
    gsap.set(bullets, { opacity: 0, x: -8 })
    gsap.set(redPanels, { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", opacity: 0.95 })
    gsap.set(stripeBlocks, { xPercent: 12, opacity: 0 })
    gsap.set(grain, { opacity: 0 })
    gsap.set(flash, { opacity: 0 })

    // Sequence — slow, cinematic pacing
    tl
      // Letterbox bars slide in
      .to([letterTop, letterBot], { yPercent: 0, duration: 1.1, ease: "power3.out" }, 0)
      // Subtle grain up
      .to(grain, { opacity: 0.28, duration: 0.8, ease: "sine.out" }, 0.1)
      // Glyph lock-in: materialize then settle
      .to(
        glyph,
        { opacity: 1, scale: 1, rotate: 0, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
        0.25,
      )
      .fromTo(
        "#g-square, #g-circle, #g-arcLeft, #g-arcRight, #g-bars > rect",
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: "power3.out" },
        0.35,
      )
      // Micro-jitter settle for realism
      .to(glyph, { x: 0.3, y: -0.3, duration: 0.08, ease: "sine.inOut", yoyo: true, repeat: 3 }, 1.0)
      // Right label reveal
      .to(label, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 0.95)
      // Panel sweeps using clip-path
      .to(
        redPanels,
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 1.3,
          ease: "power3.inOut",
          stagger: 0.2,
        },
        1.2,
      )
      // Stripe blocks float in with slight parallax
      .to(stripeBlocks, { xPercent: 0, opacity: 1, duration: 1.1, ease: "power3.out", stagger: 0.15 }, 1.35)
      // Bullets tick in, one by one
      .to(
        bullets,
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "steps(6)",
          stagger: 0.35,
        },
        1.65,
      )
      // Brief red flash and release letterbox
      .to(flash, { opacity: 0.7, duration: 0.12, ease: "power2.out" }, 3.0)
      .to(flash, { opacity: 0, duration: 0.35, ease: "sine.inOut" }, 3.12)
      .to([letterTop, letterBot], { yPercent: -120, duration: 0.9, ease: "power3.in" }, 3.2)
      // Fade grain slightly to keep subtlety
      .to(grain, { opacity: 0.18, duration: 0.8, ease: "sine.inOut" }, 3.2)

    return () => {
      tl.kill()
    }
  }, [autoplay, onComplete])

  const skip = () => {
    tlRef.current?.progress(1).kill()
    setDone(true)
    onComplete?.()
  }

  const replay = () => {
    setDone(false)
    tlRef.current?.restart(true, false)
  }

  return (
    <section
      ref={root}
      className="relative h-[100dvh] w-full bg-black text-white overflow-hidden"
      aria-label="Cinematic intro"
      data-anim
    >
      {/* Letterbox bars */}
      <div
        id="letterTop"
        className="pointer-events-none fixed left-0 top-0 z-40 h-[10vh] w-full bg-black/95"
        data-anim
      />
      <div
        id="letterBot"
        className="pointer-events-none fixed left-0 bottom-0 z-40 h-[10vh] w-full bg-black/95"
        data-anim
      />

      {/* Scanline / grain overlay */}
      <div
        id="grain"
        className="pointer-events-none absolute inset-0 z-10 mix-blend-overlay opacity-20"
        data-anim
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 2px)",
          backgroundSize: "100% 2px",
        }}
      />

      {/* Red flash overlay */}
      <div id="flash" className="absolute inset-0 z-30 bg-red-600 opacity-0" data-anim />

      {/* Composition center */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="relative flex items-center gap-8">
          {/* Glyph cluster (SVG, crisp and scalable) */}
          <svg
            id="glyph"
            className="h-28 w-28 md:h-36 md:w-36"
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden="true"
            data-anim
          >
            {/* Square */}
            <rect id="g-square" x="8" y="8" width="26" height="26" fill="white" rx="2" />
            {/* Circle */}
            <circle id="g-circle" cx="76" cy="24" r="14" stroke="white" strokeWidth="8" />
            {/* Bars */}
            <g id="g-bars">
              <rect x="42" y="60" width="10" height="32" fill="white" />
              <rect x="56" y="60" width="10" height="32" fill="white" />
              <rect x="70" y="60" width="10" height="32" fill="white" />
            </g>
            {/* Arcs that form a “C” shape */}
            <path
              id="g-arcLeft"
              d="M8 56a18 18 0 0 1 18-18h16v12H26a6 6 0 0 0-6 6v2a6 6 0 0 0 6 6h16v12H26a18 18 0 0 1-18-18Z"
              fill="white"
            />
            <path
              id="g-arcRight"
              d="M92 56a18 18 0 0 1-18 18H58V62h16a6 6 0 0 0 6-6v-2a6 6 0 0 0-6-6H58V36h16a18 18 0 0 1 18 18Z"
              fill="white"
              opacity="0"
            />
          </svg>

          {/* Right label */}
          <div id="label" className="text-left select-none" data-anim>
            <p className="text-xs md:text-sm tracking-[0.2em] text-gray-300">AXOLOT</p>
            <p className="text-sm md:text-base font-mono tracking-[0.25em] text-white">GAME DEVELOPER & PUBLISHER</p>
          </div>
        </div>
      </div>

      {/* Cinematic environment elements */}
      <div aria-hidden className="absolute inset-0 z-[5]">
        {/* Red panels */}
        <div className="red-panel absolute left-0 top-[8%] h-[28vh] w-[26vw] bg-red-700/80" data-anim />
        <div className="red-panel absolute right-[10%] top-[22%] h-[22vh] w-[22vw] bg-red-900/80" data-anim />
        <div className="red-panel absolute left-[14%] bottom-[14%] h-[22vh] w-[24vw] bg-red-900/80" data-anim />

        {/* Striped blocks */}
        <div
          className="stripe-block absolute right-[6%] bottom-[12%] h-[28vh] w-[22vw] opacity-0"
          data-anim
          style={{
            background: "repeating-linear-gradient(135deg, rgba(220,38,38,0.95) 0 3px, transparent 3px 18px)",
          }}
        />
        <div
          className="stripe-block absolute left-[6%] top-[18%] h-[26vh] w-[20vw] opacity-0"
          data-anim
          style={{
            background: "repeating-linear-gradient(135deg, rgba(220,38,38,0.9) 0 3px, transparent 3px 18px)",
          }}
        />
      </div>

      {/* Bottom-left bullets */}
      <div id="bullets" className="absolute left-8 bottom-10 z-20 text-gray-300 font-mono text-xs md:text-sm space-y-1">
        <div className="bullet" data-anim>
          [01] ........ SURVIVAL SANDBOX
        </div>
        <div className="bullet" data-anim>
          [02] ........ MULTIPLAYER GAMES
        </div>
        <div className="bullet" data-anim>
          [03] ........ GAME DEVELOPER
        </div>
        <div className="bullet" data-anim>
          [04] ........ INDIE PUBLISHER
        </div>
      </div>

      {/* Controls */}
      <div className="absolute right-6 top-6 z-40 flex items-center gap-3">
        <button
          onClick={skip}
          className="rounded border border-white/30 px-3 py-1 text-xs tracking-wide text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Skip intro"
        >
          Skip
        </button>
        {done && (
          <button
            onClick={replay}
            className="rounded border border-white/20 px-3 py-1 text-xs tracking-wide text-gray-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Replay intro"
          >
            Replay
          </button>
        )}
      </div>
    </section>
  )
}
