"use client"

import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type Ref } from "react"
import { satoshi } from "@/lib/fonts"
import "./chat-island.css"

const WHATSAPP = "https://api.whatsapp.com/send/?phone=8801733670129"

// Motion after BeUI's Dynamic Island (beui.dev/components/blocks/dynamic-island).
// Shell physics in Apple's duration/bounce form: one long glide with a barely-there bounce, the same
// both ways. The shell springs its real width/height (not a transform), so content is never distorted.
const SHELL_SPRING = { type: "spring", duration: 0.8, bounce: 0.2 } as const
// Content gets a touch more life than the shell
const CONTENT_SPRING = { type: "spring", duration: 0.8, bounce: 0.35 } as const
const EASE_OUT = [0.23, 1, 0.32, 1] as const
// Constant radius, never animated. The browser clamps it to half the height, so the pill-to-bar
// morph falls out of the resize with no corner glitches.
const RADIUS = 32
// Pill size before the first measure, so the shell always owns explicit dimensions to spring from
const PILL = { width: 100, height: 44 }

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

/** Tracks the natural size of the content so the shell can spring to it. */
function useContentSize() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState<{ width: number; height: number } | null>(null)

  // Synchronous mount measure: the shell owns explicit dimensions before the first interaction,
  // so a quick first tap springs instead of snapping open.
  useLayoutEffect(() => {
    const el = ref.current
    if (el) setSize({ width: el.offsetWidth, height: el.offsetHeight })
  }, [])

  // Content swaps and the font swap-in resize the content, never the viewport, so toolbar
  // resizes on iPhone (height-only) can't reach this.
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => setSize({ width: el.offsetWidth, height: el.offsetHeight }))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, size] as const
}

// `ref` goes through to the motion element: popLayout needs it to lift the outgoing slot out of the
// flow at once, so the shell measures only the incoming content
function Slot({ children, className, ref }: { children: ReactNode; className: string; ref?: Ref<HTMLDivElement> }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      ref={ref}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 8, filter: "blur(5px)" }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      // Exit is pulled back into the pill: fast and blur-free, before the shrinking shell can clip it
      exit={
        reduce
          ? { opacity: 0, transition: { duration: 0.1 } }
          : { opacity: 0, scale: 0.9, y: 6, filter: "blur(0px)", transition: { duration: 0.08, ease: EASE_OUT } }
      }
      // One spring drives transform, opacity and blur together, so content travels with the shell
      transition={reduce ? { duration: 0.15 } : CONTENT_SPRING}
      // Anchored to the pill's corner: content unfurls up and left out of it, and is pulled back in
      style={{ transformOrigin: "100% 100%" }}
      className={`ci-slot ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Bottom-right chat island: the "arc. Chat" pill springs open into a bar with WhatsApp and Book a call.
// Opens on hover (mouse), Enter/Space (keyboard, focus moves into the bar) and first tap (touch).
// Closes when the mouse leaves, on an outside tap, on Escape, or when focus moves out of the island.
export default function ChatWidget() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [sizerRef, size] = useContentSize()
  const shellRef = useRef<HTMLDivElement>(null)
  const firstAction = useRef<HTMLAnchorElement>(null)
  const focusOnOpen = useRef(false)

  useEffect(() => {
    if (open && focusOnOpen.current) {
      focusOnOpen.current = false
      firstAction.current?.focus()
    }
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
      <motion.div
        ref={shellRef}
        className="ci-shell"
        initial={false}
        animate={size ? { width: size.width, height: size.height } : PILL}
        transition={reduce ? { duration: 0 } : SHELL_SPRING}
        style={{ borderRadius: RADIUS }}
        onPointerEnter={(e) => mouse(e) && setOpen(true)}
        onPointerLeave={(e) => mouse(e) && setOpen(false)}
        onBlur={(e) => {
          // Only a move to somewhere else on the page closes it; a swapped-out button losing focus doesn't
          const next = e.relatedTarget as Node | null
          if (next && !e.currentTarget.contains(next)) setOpen(false)
        }}
      >
        {/* max-content keeps this at the natural size of the active content; the shell springs toward it */}
        <div ref={sizerRef} className="ci-sizer">
          <AnimatePresence mode="popLayout" initial={false} anchorX="right" anchorY="bottom">
            {open ? (
              <Slot key="open" className="ci-open">
                <div id="ci-actions" className="ci-row">
                  <Mark />
                  <a ref={firstAction} className="ci-act ci-wa" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                    <WhatsAppMark />
                    WhatsApp
                  </a>
                  <Link className="ci-act ci-call" href="/call" onClick={() => setOpen(false)}>
                    Book a call
                  </Link>
                </div>
              </Slot>
            ) : (
              <Slot key="compact" className="ci-compact-slot">
                <button
                  type="button"
                  className="ci-compact"
                  aria-expanded={false}
                  aria-controls="ci-actions"
                  aria-label="Chat with arc"
                  onClick={(e) => {
                    if (e.detail === 0) focusOnOpen.current = true // keyboard: move focus into the bar
                    setOpen(true)
                  }}
                >
                  <Mark />
                  <span>Chat</span>
                </button>
              </Slot>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
