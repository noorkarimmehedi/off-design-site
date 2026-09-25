"use client"

import { useEffect, useRef } from "react"
import { ProgressiveBlur } from "@/components/ui/progressive-blur"

// Distance from the page end over which the blur fades out, so the footer ends clean
const FADE = 240

// Viewport-fixed progressive blur along the bottom edge, in the theme's background colour
export default function BottomBlur() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const left = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)
      el.style.opacity = String(Math.min(1, Math.max(0, left / FADE)))
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
  }, [])

  return (
    <div ref={ref} className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[clamp(72px,11vh,128px)]">
      <ProgressiveBlur position="bottom" height="100%" blurAmount="4px" backgroundColor="var(--color-ink)" />
    </div>
  )
}
