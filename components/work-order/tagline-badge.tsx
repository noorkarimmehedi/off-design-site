"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"

// The client's tagline as a brand-coloured pill in the hero. Its words take turns: the current one
// rises out the top as the next rises in from below, and the pill eases to the new word's width.
// Reduced motion keeps the first word still.
export default function TaglineBadge({ words, color, interval = 2400 }: { words: string[]; color: string; interval?: number }) {
  const [i, setI] = useState(0)
  const [widths, setWidths] = useState<number[]>([])
  const sizers = useRef<(HTMLSpanElement | null)[]>([])

  // Measure every word once the font is in, and again when the hero resizes with the viewport
  useLayoutEffect(() => {
    const measure = () => setWidths(sizers.current.map((el) => el?.getBoundingClientRect().width ?? 0))
    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [words])

  useEffect(() => {
    if (words.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), interval)
    return () => window.clearInterval(id)
  }, [words.length, interval])

  const prev = (i - 1 + words.length) % words.length
  const width = widths[i]

  return (
    <span className="tag-badge" style={{ backgroundColor: color }} role="img" aria-label={words.join(" ")}>
      <span className="tag-track" style={width ? { width } : undefined} aria-hidden="true">
        {words.map((w, n) => (
          <span key={w} className={`tag-word ${n === i ? "in" : n === prev && words.length > 1 ? "out" : ""}`}>
            {w}
          </span>
        ))}
      </span>
      <span className="tag-sizers" aria-hidden="true">
        {words.map((w, n) => (
          <span
            key={w}
            ref={(el) => {
              sizers.current[n] = el
            }}
          >
            {w}
          </span>
        ))}
      </span>
    </span>
  )
}
