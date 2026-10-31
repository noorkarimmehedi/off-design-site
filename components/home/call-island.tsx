"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { satoshi } from "@/lib/fonts"
import { springEasing } from "@/lib/spring"
import "./call-island.css"

const SHELL = springEasing(0.8, 0.2)
const CONTENT = springEasing(0.8, 0.35)
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
    if (!dock || !shell || view === from) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ease = "cubic-bezier(0.23, 1, 0.32, 1)"

    if (view === "hidden") {
      const out = dock.animate(
        reduce
          ? [{ opacity: 1 }, { opacity: 0 }]
          : [
              { opacity: 1, transform: "none" },
              { opacity: 0, transform: "translateY(-12px) scale(0.9)" },
            ],
        { duration: 220, easing: ease, fill: "forwards" },
      )
      out.onfinish = () => {
        dock.hidden = true
        out.cancel()
      }
      return
    }

    const target = (view === "ask" ? askRef : pillRef).current!
    if (from === "hidden") dock.hidden = false // must be in layout before measuring
    const to = { w: target.offsetWidth, h: target.offsetHeight }

    if (from === "hidden") {
      // First appearance: drop in under the top edge
      shell.style.width = `${to.w}px`
      shell.style.height = `${to.h}px`
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

    // pill <-> ask: the shell springs its real size; content is swapped with a spring
    const size = { w: shell.offsetWidth, h: shell.offsetHeight }
    shell.getAnimations().forEach((a) => a.cancel())
    shell.style.width = `${to.w}px`
    shell.style.height = `${to.h}px`
    if (!reduce) {
      shell.animate(
        [
          { width: `${size.w}px`, height: `${size.h}px` },
          { width: `${to.w}px`, height: `${to.h}px` },
        ],
        { duration: SHELL.ms, easing: SHELL.easing },
      )
    }
    const outgoing = (view === "ask" ? pillRef : askRef).current
    outgoing?.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: "scale(0.9) translateY(-6px)" },
      ],
      { duration: 80, easing: ease },
    )
    target.animate(
      reduce
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            { opacity: 0, transform: "scale(0.9) translateY(-8px)", filter: "blur(5px)" },
            { opacity: 1, transform: "none", filter: "blur(0px)" },
          ],
      { duration: reduce ? 150 : CONTENT.ms, easing: reduce ? "ease" : CONTENT.easing },
    )
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
