"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { satoshi } from "@/lib/fonts"
import { boxOf, CONTENT, EASE_OUT, morphIsland, setIsland, swapContent } from "@/lib/island"
import "./call-island.css"

const SEEN_KEY = "arc-call-island" // once per visit
const TRIGGER = 0.3 // share of the page scrolled, roughly past Services

type View = "hidden" | "pill" | "ask"

function Mark() {
  return (
    <span className="cl-av" aria-hidden="true">
      <img src="/arc-logo-black.webp" alt="" width={600} height={215} draggable={false} />
      <i />
    </span>
  )
}

const seen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1"
  } catch {
    return false
  }
}
const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, "1")
  } catch {}
}

// Phone-only island that drops in from the top once someone has been reading:
// a small arc. pill appears, then springs open into "Would you like to book a call with arc?".
// "Not now" pulls it back into the pill and it leaves; it does not come back this visit.
export default function CallIsland() {
  const [view, setView] = useState<View>("hidden")
  const [mounted, setMounted] = useState(false)
  const dockRef = useRef<HTMLDivElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const askRef = useRef<HTMLDivElement>(null)
  const prev = useRef<View>("hidden")
  const timers = useRef<number[]>([])

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))

  useEffect(() => setMounted(true), [])

  // Trigger: phones only, once per visit, after the visitor has scrolled into the page
  useEffect(() => {
    if (!window.matchMedia("(max-width: 809px)").matches || seen()) return
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0 || window.scrollY / max < TRIGGER) return
      window.removeEventListener("scroll", onScroll)
      markSeen()
      setView("pill")
      later(() => setView((v) => (v === "pill" ? "ask" : v)), 650)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      timers.current.forEach(clearTimeout)
    }
  }, [])

  useLayoutEffect(() => {
    const from = prev.current
    prev.current = view
    const dock = dockRef.current
    const shell = shellRef.current
    const shadow = shadowRef.current
    if (!dock || !shell || !shadow || view === from) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (view === "hidden") {
      const out = dock.animate(
        reduce
          ? [{ opacity: 1 }, { opacity: 0 }]
          : [
              { opacity: 1, transform: "none" },
              { opacity: 0, transform: "translateY(-12px) scale(0.92)" },
            ],
        { duration: 220, easing: EASE_OUT, fill: "forwards" },
      )
      out.onfinish = () => {
        dock.hidden = true
        out.cancel()
      }
      return
    }

    if (from === "hidden") dock.hidden = false // must be in layout before measuring
    // Stage = the larger of the two states; each state is a clip-path box inside it
    const pill = boxOf(pillRef.current!, 30)
    const ask = boxOf(askRef.current!, 30)
    const W = Math.max(pill.w, ask.w)
    const H = Math.max(pill.h, ask.h)
    dock.style.width = `${W}px`
    dock.style.height = `${H}px`
    const to = view === "ask" ? ask : pill

    if (from === "hidden") {
      // First appearance: drop in under the top edge
      setIsland(shell, shadow, W, H, to, "top-center")
      dock.animate(
        reduce
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: "translateY(-14px) scale(0.9)", filter: "blur(6px)" },
              { opacity: 1, transform: "none", filter: "blur(0px)" },
            ],
        { duration: reduce ? 200 : CONTENT.ms, easing: reduce ? "ease" : CONTENT.easing },
      )
      return
    }

    morphIsland(shell, shadow, W, H, view === "ask" ? pill : ask, to, "top-center", reduce)
    swapContent((view === "ask" ? askRef : pillRef).current!, (view === "ask" ? pillRef : askRef).current, true, reduce)
  }, [view])

  const notNow = () => {
    setView("pill")
    later(() => setView("hidden"), 700)
  }

  // Rendered into <body>: the page wrapper keeps a filter/transform from its entrance animation,
  // which would turn position: fixed into "scrolls with the page".
  if (!mounted) return null
  return createPortal(
    <div ref={dockRef} className={`cl-top ${satoshi.variable}`} hidden role="dialog" aria-label="Book a call with arc" aria-live="polite">
      <div ref={shadowRef} className="cl-shadow" aria-hidden="true" />
      <div ref={shellRef} className="cl-shell">
        <div ref={pillRef} className="cl-slot cl-pill" data-on={view === "pill" ? "" : undefined} aria-hidden="true">
          <Mark />
          <span>arc.</span>
        </div>
        <div ref={askRef} className="cl-slot cl-ask" data-on={view === "ask" ? "" : undefined} inert={view !== "ask"}>
          <div className="cl-head">
            <Mark />
            <div>
              <b>Would you like to book a call with arc?</b>
              <small>Pick a time that suits you</small>
            </div>
          </div>
          <div className="cl-btns">
            <button type="button" className="cl-btn cl-no" onClick={notNow}>
              Not now
            </button>
            <Link className="cl-btn cl-yes" href="/call" onClick={() => setView("hidden")}>
              Book a call
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
