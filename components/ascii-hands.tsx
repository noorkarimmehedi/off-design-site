"use client"

import { useEffect, useRef } from "react"

// Video frame size; the canvas keeps it so object-fit: cover crops it like the video did
const WIDTH = 1280
const HEIGHT = 800

// Pre-rendered ASCII videos (white background) blended into the page — screen in dark
// mode, multiply in light (see .ascii-clip / .ascii-hand in globals.css).
// The visible element is a canvas fed from a hidden video: iOS Safari composites <video>
// on its own layer with its own colour handling, so the footage's white never quite
// matches the page (and screenshots hide it). A canvas is plain page content.
// Placeholder footage in /public/video — swap for our own ASCII renders.
function HandVideo({ side }: { side: "left" | "right" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !video || !ctx) return

    let stopped = false
    let visible = true
    const draw = (source: CanvasImageSource) => ctx.drawImage(source, 0, 0, WIDTH, HEIGHT)

    // Poster first, so there's an image before (or without) playback
    const poster = new Image()
    poster.src = video.poster
    poster.onload = () => {
      if (!stopped && video.readyState < 2) draw(poster)
    }

    // Copy each decoded frame; requestVideoFrameCallback where supported, rAF otherwise
    const tick = () => {
      if (stopped) return
      if (video.readyState >= 2) draw(video)
      if ("requestVideoFrameCallback" in video) video.requestVideoFrameCallback(tick)
      else requestAnimationFrame(tick)
    }
    tick()

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => {
      if (reduce.matches || !visible) video.pause()
      else video.play().catch(() => {})
    }
    // Don't decode frames nobody can see
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting
      sync()
    })
    observer.observe(canvas)
    reduce.addEventListener("change", sync)
    video.addEventListener("loadeddata", () => draw(video), { once: true })

    return () => {
      stopped = true
      observer.disconnect()
      reduce.removeEventListener("change", sync)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className={`ascii-hand ascii-hand--${side}`} aria-hidden="true" />
      <video
        ref={videoRef}
        className="pointer-events-none absolute size-px opacity-0"
        src={`/video/hand-${side}.mp4`}
        poster={`/video/hand-${side}.webp`}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </>
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
