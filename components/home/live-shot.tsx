"use client"

import { useEffect, useRef, useState } from "react"

// The concept runs live inside the iMac screen of its mockup poster: rendered at the desktop viewport
// it was captured at, scaled down onto the screen, frozen at the top of the page (no scroll, pointer or focus).
const VW = 1600
const VH = 900

// Where the screen sits in the poster, as fractions of the poster (mockup-kit desktop/mock.html
// rendered at 1920x1200 with l=420 t=170 w=1600: 20px bezel, 16:9 screen).
const SCREEN = { left: 440 / 1920, top: 190 / 1200, width: 1560 / 1920 }

export function LiveShot({ src, poster }: { src: string; poster: string }) {
  const box = useRef<HTMLSpanElement>(null)
  const [scale, setScale] = useState(0)
  const [near, setNear] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ro = new ResizeObserver(([e]) => setScale((e.contentRect.width * SCREEN.width) / VW))
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
      <span className="zoom">
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
            style={{
              left: `${SCREEN.left * 100}%`,
              top: `${SCREEN.top * 100}%`,
              width: VW,
              height: VH,
              transform: `scale(${scale})`,
            }}
          />
        )}
      </span>
    </span>
  )
}
