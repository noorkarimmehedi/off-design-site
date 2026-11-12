"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { satoshi } from "@/lib/fonts"
import { boxOf, morphIsland, setIsland, swapContent, type Box } from "@/lib/island"
import { onWidthResize } from "@/lib/viewport"
import "./chat-island.css"

const WHATSAPP = "https://api.whatsapp.com/send/?phone=8801733670129"

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
// Closes when the mouse leaves, on an outside tap, on Escape, or when focus leaves the island.
export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const dockRef = useRef<HTMLDivElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const compactRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef<HTMLDivElement>(null)
  const firstAction = useRef<HTMLAnchorElement>(null)
  const geo = useRef<{ W: number; H: number; compact: Box; open: Box } | null>(null)

  // Size the stage once to the larger state; both states are then just clip-path boxes inside it
  const measure = () => {
    const c = compactRef.current!
    const o = openRef.current!
    const compact = boxOf(c)
    const openBox = boxOf(o)
    const W = Math.max(compact.w, openBox.w)
    const H = Math.max(compact.h, openBox.h)
    const dock = dockRef.current!
    dock.style.width = `${W}px`
    dock.style.height = `${H}px`
    geo.current = { W, H, compact, open: openBox }
  }

  useLayoutEffect(() => {
    measure()
    const g = geo.current!
    setIsland(shellRef.current!, shadowRef.current!, g.W, g.H, g.compact, "bottom-right")
    // Satoshi may swap in after first paint and change widths
    const snap = () => {
      if (!shellRef.current || !shadowRef.current) return
      measure()
      const g2 = geo.current!
      const isOpen = shellRef.current.hasAttribute("data-open")
      setIsland(shellRef.current, shadowRef.current, g2.W, g2.H, isOpen ? g2.open : g2.compact, "bottom-right")
    }
    document.fonts?.ready.then(snap)
    // Re-measure only on a real width change (rotation). Phone toolbars sliding while scrolling fire
    // height-only resizes; ignoring them keeps a running morph from snapping in Chrome/Arc on iPhone.
    return onWidthResize(snap)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const first = useRef(true)
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const g = geo.current
    if (!g) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    morphIsland(
      shellRef.current!,
      shadowRef.current!,
      g.W,
      g.H,
      open ? g.compact : g.open,
      open ? g.open : g.compact,
      "bottom-right",
      reduce,
    )
    swapContent((open ? openRef : compactRef).current!, (open ? compactRef : openRef).current, false, reduce)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!shellRef.current?.contains(e.target as Node)) setOpen(false)
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

  return (
    <div ref={dockRef} className={`ci-dock ${satoshi.variable}`} data-chat-widget>
      <div ref={shadowRef} className="ci-shadow" aria-hidden="true" />
      <div
        ref={shellRef}
        className="ci-shell"
        data-open={open ? "" : undefined}
        onPointerEnter={(e) => mouse(e) && setOpen(true)}
        onPointerLeave={(e) => mouse(e) && setOpen(false)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false)
        }}
      >
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
            setOpen(true)
            if (e.detail === 0) requestAnimationFrame(() => firstAction.current?.focus())
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
  )
}
