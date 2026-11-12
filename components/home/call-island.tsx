"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { satoshi } from "@/lib/fonts"
import { boxOf, dockMotion, morphIsland, setIsland, swapContent, type Box } from "@/lib/island"
import { onWidthResize, stableVh } from "@/lib/viewport"
import "./call-island.css"

const SEEN_KEY = "arc-call-island" // set when the visitor answers; lasts for this tab
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

  // Trigger: phones only, once per visit, after the visitor has scrolled into the page.
  // Uses the stable small-viewport height, not innerHeight, which jumps as phone toolbars slide.
  useEffect(() => {
    if (!window.matchMedia("(max-width: 809px)").matches || seen()) return
    let raf = 0
    const check = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - stableVh()
      if (max <= 0 || window.scrollY / max < TRIGGER) return
      window.removeEventListener("scroll", onScroll)
      setView("pill")
      later(() => setView((v) => (v === "pill" ? "ask" : v)), 650)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
      timers.current.forEach(clearTimeout)
    }
  }, [])

  // Stage = the larger of the two states; each state is a clip-path box inside it
  const measure = () => {
    const pill = boxOf(pillRef.current!, 30)
    const ask = boxOf(askRef.current!, 30)
    const W = Math.max(pill.w, ask.w)
    const H = Math.max(pill.h, ask.h)
    dockRef.current!.style.width = `${W}px`
    dockRef.current!.style.height = `${H}px`
    return { W, H, pill, ask }
  }

  // Re-measure only when the width really changes (rotation). Height-only resizes are the
  // toolbar sliding, and re-measuring then would snap a running morph.
  useEffect(() => {
    if (!mounted) return
    return onWidthResize(() => {
      const v = prev.current
      if (v === "hidden" || !shellRef.current || !shadowRef.current) return
      const g = measure()
      setIsland(shellRef.current, shadowRef.current, g.W, g.H, v === "ask" ? g.ask : g.pill, "top-center")
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  useLayoutEffect(() => {
    const from = prev.current
    prev.current = view
    const dock = dockRef.current
    const shell = shellRef.current
    const shadow = shadowRef.current
    if (!dock || !shell || !shadow || view === from) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (view === "hidden") {
      dockMotion(dock, false, reduce, () => {
        dock.hidden = true
        dock.style.opacity = ""
        dock.style.transform = ""
      })
      return
    }

    if (from === "hidden") dock.hidden = false // must be in layout before measuring
    const { W, H, pill, ask } = measure()
    const to: Box = view === "ask" ? ask : pill

    if (from === "hidden") {
      // First appearance: drop in under the top edge
      setIsland(shell, shadow, W, H, to, "top-center")
      dockMotion(dock, true, reduce)
      return
    }

    morphIsland(shell, shadow, W, H, view === "ask" ? pill : ask, to, "top-center", reduce)
    swapContent((view === "ask" ? askRef : pillRef).current!, (view === "ask" ? pillRef : askRef).current, true, reduce)
  }, [view])

  // Counts as seen only once the visitor answers, so a reload before answering asks again
  const notNow = () => {
    markSeen()
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
            <Link className="cl-btn cl-yes" href="/call" onClick={() => {
                markSeen()
                setView("hidden")
              }}>
              Book a call
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
