"use client"

import { useEffect, useState } from "react"
import { RuixenGradientFooter } from "@/components/ui/ruixen-gradient-footer"

// The glow's SVG is stretched to the viewport width, so its blur (in viewBox
// units) shrinks on narrow screens and the bars read as hard columns. Size the
// blur in screen pixels instead, and use fewer, wider bars on phones.
const VIEWBOX_WIDTH = 1271
const VIEWBOX_HEIGHT = 599

function glowFor(width: number, height: number) {
  const mobile = width < 640
  const bandVh = mobile ? 45 : 60
  const bandPx = (height * bandVh) / 100
  const blurPx = mobile ? 26 : 44
  return {
    bars: mobile ? 5 : 9,
    blur: (blurPx * VIEWBOX_WIDTH) / width,
    blurY: (blurPx * VIEWBOX_HEIGHT) / bandPx,
    gradientHeight: `${bandVh}vh`,
  }
}

// Text-free footer: a blurred gradient glow that rises from the bottom edge
// over the last stretch of scroll.
export default function SiteFooter() {
  const [glow, setGlow] = useState(() => glowFor(1440, 900))

  useEffect(() => {
    const update = () => setGlow(glowFor(window.innerWidth, window.innerHeight))
    update()
    window.addEventListener("resize", update, { passive: true })
    return () => window.removeEventListener("resize", update)
  }, [])

  return <RuixenGradientFooter className="relative bg-ink" {...glow} />
}
