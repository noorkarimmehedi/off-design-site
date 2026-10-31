"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

// A dark dot that trails the mouse and opens into a "drag" disc over the work rail.
// Rendered into <body> so the page's entrance transform can't offset it.
export default function CursorDot() {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const dot = ref.current
    if (!dot || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const root = document.documentElement
    root.classList.add("ah-dot")

    let tx = -100, ty = -100, cx = -100, cy = -100, s = 0.33, ts = 0.33
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      tx = e.clientX
      ty = e.clientY
      dot.classList.add("on")
      const over = !!(e.target as Element | null)?.closest?.('[data-cursor="drag"]')
      dot.classList.toggle("big", over)
      ts = over ? 1 : 0.33
    }
    const onLeave = () => dot.classList.remove("on")
    window.addEventListener("pointermove", onMove)
    document.addEventListener("pointerleave", onLeave)

    let frame = requestAnimationFrame(function follow() {
      cx += (tx - cx) * 0.22
      cy += (ty - cy) * 0.22
      s += (ts - s) * 0.18
      dot.style.transform = `translate3d(${cx}px,${cy}px,0) scale(${s})`
      frame = requestAnimationFrame(follow)
    })

    return () => {
      cancelAnimationFrame(frame)
      root.classList.remove("ah-dot")
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
    }
  }, [mounted])

  if (!mounted) return null
  return createPortal(
    <div className="ah-cursor" ref={ref} aria-hidden="true">
      <span>drag</span>
    </div>,
    document.body,
  )
}
