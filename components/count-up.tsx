"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type CountUpProps = {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  /** Seconds */
  duration?: number
  /** Seconds to wait after the number scrolls into view */
  delay?: number
  className?: string
}

// Fast start, long settle — the last digits creep into place
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

// Counts up from 0 when scrolled into view. An invisible copy of the final value holds
// the width, so the line doesn't reflow while the digits change.
export default function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 1.4, delay = 0.2, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [current, setCurrent] = useState(value)
  const format = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    setCurrent(0)
    let frame = 0
    let timer = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      timer = window.setTimeout(() => {
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / (duration * 1000))
          setCurrent(value * easeOutExpo(t))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      }, delay * 1000)
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [value, duration, delay])

  return (
    <span ref={ref} className={cn("relative inline-block tabular-nums", className)}>
      <span aria-hidden="true" className="invisible">{format(value)}</span>
      <span aria-hidden="true" className="absolute inset-0 text-right">{format(current)}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  )
}
