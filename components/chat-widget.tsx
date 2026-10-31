"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { satoshi } from "@/lib/fonts"
import { springEasing } from "@/lib/spring"
import "./chat-island.css"

const WHATSAPP = "https://api.whatsapp.com/send/?phone=8801733670129"

// BeUI's Dynamic Island physics: one long glide with a barely-there bounce for the shell,
// a touch more life for the content. Same in both directions.
const SHELL = springEasing(0.8, 0.2)
const CONTENT = springEasing(0.8, 0.35)

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
  const shellRef = useRef<HTMLDivElement>(null)
  const compactRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef<HTMLDivElement>(null)
  const firstAction = useRef<HTMLAnchorElement>(null)
  const mounted = useRef(false)

  // The shell owns explicit dimensions from the first paint, so the first open springs instead of snapping
  useLayoutEffect(() => {
    const shell = shellRef.current
    const target = (open ? openRef : compactRef).current
    if (!shell || !target) return
    const to = { w: target.offsetWidth, h: target.offsetHeight }

    if (!mounted.current) {
      mounted.current = true
      shell.style.width = `${to.w}px`
      shell.style.height = `${to.h}px`
      return
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const from = { w: shell.offsetWidth, h: shell.offsetHeight } // wherever it is now, so it can be interrupted
    shell.getAnimations().forEach((a) => a.cancel())
    shell.style.width = `${to.w}px`
    shell.style.height = `${to.h}px`
    if (!reduce) {
      shell.animate(
        [
          { width: `${from.w}px`, height: `${from.h}px` },
          { width: `${to.w}px`, height: `${to.h}px` },
        ],
        { duration: SHELL.ms, easing: SHELL.easing },
      )
    }

    const outgoing = (open ? compactRef : openRef).current
    // Outgoing content is pulled back fast, before the moving shell can clip it
    outgoing?.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: "scale(0.9) translateY(6px)" },
      ],
      { duration: reduce ? 100 : 80, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
    )
    // Incoming content springs in from a soft blur, travelling with the shell
    target.animate(
      reduce
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            { opacity: 0, transform: "scale(0.9) translateY(8px)", filter: "blur(5px)" },
            { opacity: 1, transform: "none", filter: "blur(0px)" },
          ],
      { duration: reduce ? 150 : CONTENT.ms, easing: reduce ? "ease" : CONTENT.easing },
    )
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
    <div className={`ci-dock ${satoshi.variable}`} data-chat-widget>
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
