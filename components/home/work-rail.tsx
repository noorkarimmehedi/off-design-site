"use client"

import { useEffect, useRef } from "react"
import { VIDEO_BASE, work, type WorkCard } from "@/lib/home"

const SPEED = 60 // px per second, measured from the template

function Card({ w, copy }: { w: WorkCard; copy: number }) {
  const external = w.href.startsWith("http")
  const hidden = copy > 0 // the loop's extra copies are decoration for screen readers
  return (
    <a
      className={`card${w.wide ? " wide" : ""}`}
      href={w.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      draggable={false}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      {w.video ? (
        <video
          src={VIDEO_BASE + w.video}
          poster={`/home/work/${w.img}.webp`}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={w.alt}
        />
      ) : (
        <img src={`/home/work/${w.img}.webp`} alt={hidden ? "" : w.alt} draggable={false} />
      )}
      <span className="meta">
        <span className="pill">{w.name}</span>
        <span className="pill">View</span>
      </span>
    </a>
  )
}

// A strip of work that drifts left forever. With a mouse it can be dragged, with momentum after release;
// on touch screens it ignores the finger and keeps a steady drift.
export default function WorkRail() {
  const railRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rail = railRef.current!
    const track = trackRef.current!
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let x = 0
    let v = 0
    let dragging = false
    let lastX = 0
    let lastT = 0
    let moved = 0
    let setW = 0

    const measure = () => {
      const c = track.children as HTMLCollectionOf<HTMLElement>
      setW = c[work.length].offsetLeft - c[0].offsetLeft
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)

    let prev = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      if (!dragging) {
        if (Math.abs(v) > 5) {
          x += v * dt
          v *= Math.pow(0.04, dt) // momentum decays, then the drift takes over again
        } else if (!reduce) {
          x -= SPEED * dt
          v = 0
        }
      }
      if (setW) x = ((x % setW) - setW) % setW
      track.style.transform = `translate3d(${x}px,0,0)`
      frame = requestAnimationFrame(tick)
    })

    const down = (e: PointerEvent) => {
      // Mouse only. On touch the rail just keeps drifting: a finger landing on it to scroll the page
      // must not stop it, nudge it sideways, or fling it. Taps still open the card.
      if (dragging || e.button || e.pointerType !== "mouse") return
      dragging = true
      moved = 0
      v = 0
      lastX = e.clientX
      lastT = performance.now()
      rail.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      const now = performance.now()
      const dx = e.clientX - lastX
      x += dx
      moved += Math.abs(dx)
      v = (dx / Math.max(1, now - lastT)) * 1000
      lastX = e.clientX
      lastT = now
    }
    const up = () => {
      if (!dragging) return
      dragging = false
      if (performance.now() - lastT > 80) v = 0 // held still before letting go: no fling
    }
    const click = (e: MouseEvent) => {
      if (moved > 6) e.preventDefault() // a drag is not a click
    }
    rail.addEventListener("pointerdown", down)
    rail.addEventListener("pointermove", move)
    rail.addEventListener("pointerup", up)
    rail.addEventListener("pointercancel", up)
    rail.addEventListener("click", click, true)

    // Films play only while on screen
    const io = new IntersectionObserver((entries) =>
      entries.forEach((en) => {
        const vid = en.target as HTMLVideoElement
        if (en.isIntersecting && !reduce) vid.play().catch(() => {})
        else vid.pause()
      }),
    )
    track.querySelectorAll("video").forEach((vid) => io.observe(vid))

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      io.disconnect()
      rail.removeEventListener("pointerdown", down)
      rail.removeEventListener("pointermove", move)
      rail.removeEventListener("pointerup", up)
      rail.removeEventListener("pointercancel", up)
      rail.removeEventListener("click", click, true)
    }
  }, [])

  return (
    <div className="rail" ref={railRef} data-cursor="drag" aria-label="Selected work, drag to browse" role="region">
      <div className="rail-track" ref={trackRef}>
        {[0, 1, 2].flatMap((copy) => work.map((w, i) => <Card key={`${copy}-${i}`} w={w} copy={copy} />))}
      </div>
    </div>
  )
}
