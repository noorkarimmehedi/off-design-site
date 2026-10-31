"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { satoshi } from "@/lib/fonts"
import "./chat-island.css"

const WHATSAPP = "https://api.whatsapp.com/send/?phone=8801733670129"

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
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

// Bottom-right chat island: a capsule that springs open into a bar with WhatsApp and Book a call.
// Opens on hover (mouse), Enter/Space (keyboard, focus moves into the bar) and first tap (touch).
// Closes when the mouse leaves, on an outside tap, on Escape, or when focus leaves the island.
export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const firstAction = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
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
        ref={ref}
        className="ci-isl"
        data-open={open ? "" : undefined}
        onPointerEnter={(e) => mouse(e) && setOpen(true)}
        onPointerLeave={(e) => mouse(e) && setOpen(false)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false)
        }}
      >
        <div className="ci-full" id="ci-actions" inert={!open}>
          <Mark />
          <a ref={firstAction} className="ci-act ci-wa" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            <WhatsAppMark />
            WhatsApp
          </a>
          <Link className="ci-act ci-call" href="/call" onClick={() => setOpen(false)}>
            Book a call
          </Link>
        </div>
        <button
          type="button"
          className="ci-mini"
          aria-expanded={open}
          aria-controls="ci-actions"
          aria-label="Chat with arc"
          onClick={(e) => {
            setOpen(true)
            // Opened from the keyboard (no pointer position): move focus into the bar
            if (e.detail === 0) requestAnimationFrame(() => firstAction.current?.focus())
          }}
        >
          <Mark />
          <span>Chat</span>
        </button>
      </div>
    </div>
  )
}
