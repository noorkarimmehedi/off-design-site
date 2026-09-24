"use client"

import { useEffect, useRef } from "react"

// Pre-rendered ASCII videos (white background) blended into the page with
// mix-blend-mode: multiply so only the glyphs show.
// Placeholder footage in /public/video — swap for our own ASCII renders.
function HandVideo({ side }: { side: "left" | "right" }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => {
      if (reduce.matches) video.pause()
      else video.play().catch(() => {})
    }
    sync()
    reduce.addEventListener("change", sync)
    return () => reduce.removeEventListener("change", sync)
  }, [])

  return (
    <video
      ref={ref}
      className={`ascii-hand ascii-hand--${side}`}
      src={`/video/hand-${side}.mp4`}
      poster={`/video/hand-${side}.webp`}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  )
}

export default function AsciiHands() {
  return (
    // Phones: a hairline box in flow under the header (matches the hero box); sm+: full-bleed layer
    <div className="ascii-stage">
      <div className="ascii-clip ascii-clip--left">
        <HandVideo side="left" />
      </div>
      <div className="ascii-clip ascii-clip--right">
        <HandVideo side="right" />
      </div>
    </div>
  )
}
