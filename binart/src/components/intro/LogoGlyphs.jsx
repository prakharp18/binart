"use client"

import { cn } from "@/lib/utils"

export default function LogoGlyphs({
  className,
  color = "#F59E0B",
  secondary = "#FB923C",
  bg = "#1A1A1A",
}) {
  return (
    <div className={cn("relative flex items-center gap-6", className)} aria-label="Binart digital canvas">
      <div className="flex flex-col items-end gap-3">
        <div className="relative">
          <div
            data-piece
            className="h-8 w-3 opacity-0 translate-y-4 scale-95"
            style={{ background: color }}
          />
          <div
            data-piece
            className="h-2 w-5 -mt-1 opacity-0 translate-y-4 scale-95"
            style={{ background: secondary }}
          />
        </div>
        
        {/* Brush handle */}
        <div
          data-piece
          className="h-16 w-4 opacity-0 translate-y-4 scale-95"
          style={{ background: color }}
        />
        
        <div className="grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              data-piece
              className="h-2 w-2 opacity-0 translate-y-4 scale-95"
              style={{ 
                background: i % 3 === 0 ? color : i % 2 === 0 ? secondary : 'transparent',
                border: `1px solid ${secondary}`
              }}
            />
          ))}
        </div>
      </div>

      {/* Center: Binary code block */}
      <div className="flex flex-col gap-2">
        {/* Binary digits */}
        <div className="flex gap-1 font-mono text-xs">
          {['1','0','1','1','0'].map((digit, i) => (
            <span
              key={i}
              data-piece
              className="opacity-0 translate-y-4 scale-95"
              style={{ color: digit === '1' ? color : secondary }}
            >
              {digit}
            </span>
          ))}
        </div>
        
        {/* Main binary block */}
        <div 
          data-piece 
          className="h-20 w-20 p-2 opacity-0 translate-y-4 scale-95 font-mono text-[8px] leading-3 overflow-hidden"
          style={{ background: color, color: bg }}
        >
          <div className="grid grid-cols-8 gap-px">
            {'10110010011010110100101101001011010010110100101101001011'.split('').map((bit, i) => (
              <span key={i} className="block text-center">{bit}</span>
            ))}
          </div>
        </div>
        
        {/* More binary */}
        <div className="flex gap-1 font-mono text-xs">
          {['0','1','0','0','1'].map((digit, i) => (
            <span
              key={i}
              data-piece
              className="opacity-0 translate-y-4 scale-95"
              style={{ color: digit === '1' ? color : secondary }}
            >
              {digit}
            </span>
          ))}
        </div>
      </div>

      {/* Right: Drawing canvas representation */}
      <div className="flex flex-col gap-2">
        {/* Canvas frame */}
        <div 
          data-piece
          className="h-16 w-16 border-2 opacity-0 translate-y-4 scale-95 relative"
          style={{ borderColor: color }}
        >
          {/* Wiggly stroke inside */}
          <svg className="absolute inset-1" viewBox="0 0 48 48">
            <path
              data-piece
              d="M8,24 Q16,16 24,24 T40,24"
              fill="none"
              stroke={secondary}
              strokeWidth="2"
              className="opacity-0"
              style={{ 
                strokeDasharray: "100",
                strokeDashoffset: "100",
                willChange: "stroke-dashoffset"
              }}
            />
          </svg>
        </div>
        
        {/* Export format indicators */}
        <div className="flex gap-1">
          <div
            data-piece
            className="px-1 py-0.5 text-[8px] font-mono opacity-0 translate-y-4 scale-95"
            style={{ background: secondary, color: bg }}
          >
            BINARY
          </div>
          <div
            data-piece
            className="px-1 py-0.5 text-[8px] font-mono opacity-0 translate-y-4 scale-95"
            style={{ background: color, color: bg }}
          >
            JPG
          </div>
        </div>
      </div>

      {/* Right: stacked label (optional external text can be placed separately) */}
      <div className="sr-only">BINART — Digital Art Canvas</div>
    </div>
  )
}
