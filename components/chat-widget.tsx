"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { satoshi } from "@/lib/fonts"
import { move, stop } from "@/lib/island"
import { onWidthResize } from "@/lib/viewport"
import "./chat-island.css"

const WHATSAPP = "https://api.whatsapp.com/send/?phone=8801733670129"

// Motion after BeUI's Dynamic Island: the pill grows into the bar on one long spring with a
// barely-there bounce (Apple's duration/bounce form), and the content springs in with more life.
const SHELL_SPRING = { type: "spring", duration: 0.8, bounce: 0.2 } as const
const CONTENT_SPRING = { type: "spring", duration: 0.8, bounce: 0.35 } as const
const EASE_OUT = [0.23, 1, 0.32, 1] as const

// Built for Chrome and Arc on iPhone, where toolbars slide while scrolling and anything that runs
// on the page's main thread can stutter. Every frame is transform + opacity only, so the graphics
// chip runs it:
// - The shell is a stadium drawn from three pieces: two circles and a bar between them. Moving the
//   circles and stretching the bar (one transform each) makes any pill size, so corners never distort.
//   Both states are pills (radius = half the height), so this covers the whole morph.
// - Content is clipped by a rounded window that slides with transform while its contents slide back
//   the same amount, so the clip edge moves and the content stays still.
// - All pieces share one spring and start on the same frame, so they stay in step. A new move reads
//   where the shell is now and starts from there.
// - Sizes are measured once (and again after the font loads or the width changes). Height-only
//   resizes, which are the toolbar sliding, are ignored.

type Geo = { W: number; H: number; compact: { w: number; h: number }; open: { w: number; h: number } }

const px = (n: number) => `${n.toFixed(2)}px`
const capR = (h: number, H: number) => `translate(0px, 0px) scale(${(h / H).toFixed(4)})`
const capL = (w: number, h: number, H: number) => `translate(${px(-(w - h))}, 0px) scale(${(h / H).toFixed(4)})`
const mid = (w: number, h: number, W: number, H: number) =>
  `translate(${px(-h / 2)}, 0px) scale(${((w - h) / W).toFixed(4)}, ${(h / H).toFixed(4)})`
const shadow = (w: number, h: number, W: number, H: number) =>
  `translate(0px, 0px) scale(${(w / W).toFixed(4)}, ${(h / H).toFixed(4)})`
// The window slides sideways only: moving it down too would push its rounded bottom corner off the
// island. The bar is only a little taller than the pill, and content fades in while it grows.
const win = (w: number) => (W: number) => `translate(${px(W - w)}, 0px)`
const winIn = (w: number) => (W: number) => `translate(${px(-(W - w))}, 0px)`

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
    </svg>
  )
}

function Mark() {
  return (
    <span className="ci-av" aria-hidden="true">
      <img src="/arc-logo-black.webp" alt="" width={600} height={215} draggable={false} />
      <i />
    </span>
  )
}

// Bottom-right chat island: the "arc. Chat" pill springs open into a bar with WhatsApp and Book a call.
// Opens on hover (mouse), Enter/Space (keyboard, focus moves into the bar) and first tap (touch).
// Closes when the mouse leaves, on an outside tap, on Escape, or when focus moves out of the island.
export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const dockRef = useRef<HTMLDivElement>(null)
  const compactRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef<HTMLDivElement>(null)
  const firstAction = useRef<HTMLAnchorElement>(null)
  const geo = useRef<Geo | null>(null)
  const openNow = useRef(false)

  const parts = () => {
    const d = dockRef.current!
    const q = (s: string) => Array.from(d.querySelectorAll<HTMLElement>(s))
    return { capsR: q(".ci-cap-r"), capsL: q(".ci-cap-l"), mids: q(".ci-mid"), shadow: q(".ci-shadow")[0], win: q(".ci-win")[0], winIn: q(".ci-win-in")[0] }
  }

  // Lay every piece out for a pill of w × h, with no animation
  const snap = (w: number, h: number) => {
    const g = geo.current!
    const p = parts()
    const set = (el: HTMLElement, t: string) => {
      stop(el)
      el.style.transform = t
    }
    p.capsR.forEach((el) => set(el, capR(h, g.H)))
    p.capsL.forEach((el) => set(el, capL(w, h, g.H)))
    p.mids.forEach((el) => set(el, mid(w, h, g.W, g.H)))
    set(p.shadow, shadow(w, h, g.W, g.H))
    set(p.win, win(w)(g.W))
    set(p.winIn, winIn(w)(g.W))
  }

  // Measure both states once; the stage is the larger of the two
  const measure = () => {
    const c = compactRef.current!
    const o = openRef.current!
    const compact = { w: c.offsetWidth, h: c.offsetHeight }
    const openBox = { w: o.offsetWidth, h: o.offsetHeight }
    const W = Math.max(compact.w, openBox.w)
    const H = Math.max(compact.h, openBox.h)
    const d = dockRef.current!
    d.style.width = `${W}px`
    d.style.height = `${H}px`
    d.style.setProperty("--ci-w", `${W}px`)
    d.style.setProperty("--ci-h", `${H}px`)
    geo.current = { W, H, compact, open: openBox }
  }

  useLayoutEffect(() => {
    const relayout = () => {
      if (!dockRef.current) return
      measure()
      const g = geo.current!
      const s = openNow.current ? g.open : g.compact
      snap(s.w, s.h)
    }
    relayout()
    document.fonts?.ready.then(relayout) // the site font can swap in after first paint and change widths
    return onWidthResize(relayout) // real width changes only; toolbar slides are height-only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const first = useRef(true)
  useLayoutEffect(() => {
    openNow.current = open
    if (first.current) {
      first.current = false
      return
    }
    const g = geo.current
    if (!g) return
    const p = parts()
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const to = open ? g.open : g.compact

    // Where the shell is right now (mid-move if interrupted), read from the left circle
    const m = new DOMMatrix(getComputedStyle(p.capsL[0]).transform)
    const h = m.a * g.H
    const w = -m.e + h

    if (reduce) snap(to.w, to.h)
    else {
      const go = (el: HTMLElement, from: string, target: string) => {
        stop(el)
        el.style.transform = from // hold the current pose until the new spring's first frame
        move(el, { transform: [from, target] }, SHELL_SPRING)
      }
      p.capsR.forEach((el) => go(el, capR(h, g.H), capR(to.h, g.H)))
      p.capsL.forEach((el) => go(el, capL(w, h, g.H), capL(to.w, to.h, g.H)))
      p.mids.forEach((el) => go(el, mid(w, h, g.W, g.H), mid(to.w, to.h, g.W, g.H)))
      go(p.shadow, shadow(w, h, g.W, g.H), shadow(to.w, to.h, g.W, g.H))
      go(p.win, win(w)(g.W), win(to.w)(g.W))
      go(p.winIn, winIn(w)(g.W), winIn(to.w)(g.W))
    }

    // Content: outgoing is pulled back into the pill fast, incoming springs out of its corner
    const incoming = (open ? openRef : compactRef).current!
    const outgoing = (open ? compactRef : openRef).current!
    const rest = "translateY(0px) scale(1)"
    move(
      outgoing,
      reduce ? { opacity: [1, 0] } : { opacity: [1, 0], transform: [rest, "translateY(6px) scale(0.9)"] },
      { duration: reduce ? 0.1 : 0.08, ease: EASE_OUT },
      () => {
        outgoing.style.opacity = ""
        outgoing.style.transform = ""
      },
    )
    move(
      incoming,
      reduce ? { opacity: [0, 1] } : { opacity: [0, 1], transform: ["translateY(8px) scale(0.9)", rest] },
      reduce ? { duration: 0.15, ease: "easeOut" } : CONTENT_SPRING,
    )
    if (open && focusOnOpen.current) {
      focusOnOpen.current = false
      requestAnimationFrame(() => firstAction.current?.focus())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const focusOnOpen = useRef(false)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!dockRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const mouse = (e: React.PointerEvent) => e.pointerType === "mouse"
  const stadium = (cls: string) => (
    <div className={`ci-stadium ${cls}`} aria-hidden="true">
      <i className="ci-mid" />
      <i className="ci-cap-l" />
      <i className="ci-cap-r" />
    </div>
  )

  return (
    <div
      ref={dockRef}
      className={`ci-dock ${satoshi.variable}`}
      data-chat-widget
      onPointerEnter={(e) => mouse(e) && setOpen(true)}
      onPointerLeave={(e) => mouse(e) && setOpen(false)}
      onBlur={(e) => {
        const next = e.relatedTarget as Node | null
        if (next && !e.currentTarget.contains(next)) setOpen(false)
      }}
    >
      <div className="ci-shadow" aria-hidden="true" />
      {/* Ring under the fill: only its outer edge shows, so the seams between pieces never do */}
      {stadium("ci-ring")}
      {stadium("ci-fill")}
      <div className="ci-win">
        <div className="ci-win-in">
          <button
            ref={compactRef}
            type="button"
            className="ci-slot ci-compact"
            data-on={open ? undefined : ""}
            aria-expanded={open}
            aria-controls="ci-actions"
            aria-label="Chat with arc"
            tabIndex={open ? -1 : 0}
            onClick={(e) => {
              if (e.detail === 0) focusOnOpen.current = true // keyboard: move focus into the bar
              setOpen(true)
            }}
          >
            <Mark />
            <span>Chat</span>
          </button>
          <div ref={openRef} className="ci-slot ci-open" id="ci-actions" data-on={open ? "" : undefined} inert={!open}>
            <Mark />
            <a ref={firstAction} className="ci-act ci-wa" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <WhatsAppMark />
              WhatsApp
            </a>
            <Link className="ci-act ci-call" href="/call" onClick={() => setOpen(false)}>
              Book a call
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
