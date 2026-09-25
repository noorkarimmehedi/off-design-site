"use client"

import { useEffect, useRef } from "react"
import { ProgressiveBlur } from "@/components/ui/progressive-blur"

// Scroll distance over which the blur fades: in from the page top, out toward the page end,
// so the header starts clean and the footer ends clean
const FADE = 240

const HEIGHT = {
  top: "h-[clamp(56px,8vh,96px)]",
  bottom: "h-[clamp(72px,11vh,128px)]",
} as const

// Viewport-fixed progressive blur along one screen edge, in the theme's background colour
export default function EdgeBlur({ position }: { position: "top" | "bottom" }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const distance =
        position === "top"
          ? window.scrollY
          : document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)
      el.style.opacity = String(Math.min(1, Math.max(0, distance / FADE)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [position])

  return (
    <div
      ref={ref}
      className={`pointer-events-none fixed inset-x-0 z-30 ${position === "top" ? "top-0" : "bottom-0"} ${HEIGHT[position]}`}
    >
      <ProgressiveBlur position={position} height="100%" blurAmount="4px" backgroundColor="var(--color-ink)" />
    </div>
  )
}
