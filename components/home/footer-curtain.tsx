"use client"

import { useLayoutEffect, useRef, useState, type ReactNode } from "react"

// The footer sits fixed to the bottom of the screen, clipped to a placeholder of its own height,
// so the page slides up off it like a curtain. Falls back to normal flow if it's taller than the screen.
export default function FooterCurtain({ children, className = "" }: { children: ReactNode; className?: string }) {
  const inner = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | null>(null)

  useLayoutEffect(() => {
    const el = inner.current
    if (!el) return
    const measure = () => setHeight(el.offsetHeight <= window.innerHeight ? el.offsetHeight : null)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  return (
    <div className={`curtain ${className}`} style={height === null ? undefined : { height }}>
      <div ref={inner} className={height === null ? "curtain-in" : "curtain-in fixed"}>
        {children}
      </div>
    </div>
  )
}
