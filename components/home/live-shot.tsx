"use client"

import { useEffect, useRef, useState } from "react"

// The concept is rendered at a desktop viewport and scaled down to the tile, so the preview is the
// real hero running live, frozen at the top of the page: no scrolling, no pointer, no focus.
const VW = 1440
const VH = 900

export function LiveShot({ src, poster }: { src: string; poster: string }) {
  const box = useRef<HTMLSpanElement>(null)
  const [scale, setScale] = useState(0)
  const [near, setNear] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / VW))
    ro.observe(el)

    // Only boot the site once the tile is about to be seen
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: "400px 0px" },
    )
    io.observe(el)
    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return (
    <span className="shot" ref={box}>
      <img src={poster} alt="" width={1600} height={1000} loading="lazy" draggable={false} />
      {near && scale > 0 && (
        <iframe
          src={src}
          title=""
          aria-hidden="true"
          tabIndex={-1}
          scrolling="no"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={loaded ? "on" : undefined}
          style={{ width: VW, height: VH, transform: `scale(${scale})` }}
        />
      )}
    </span>
  )
}
