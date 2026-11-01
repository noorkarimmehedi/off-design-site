"use client"

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { GLYPH_HEIGHT, layoutSignature } from "@/lib/work-order/signature-letters"
import SignaturePad, { type SignaturePadHandle } from "./signature-pad"

const MAX = 80
const PAD = 6
// Wait for the step's fold to open before the pen starts, so the first letters aren't missed
const OPEN_DELAY = 380

export type SignatureFieldHandle = { toPng: () => Promise<string | null> }

// The signer's name, written out stroke by stroke from hand-drawn letter paths, one letter after
// another like a pen. It writes itself each time the step becomes active. "Draw instead" swaps in a
// freehand pad. Both export a transparent dark-ink PNG, so the API and the PDF treat them alike.
// Styles live in app/order/order.css (.sig-*).
const SignatureField = forwardRef<SignatureFieldHandle, { name: string; onChange: (signed: boolean) => void; active?: boolean }>(
  function SignatureField({ name, onChange, active = true }, ref) {
    const layout = useMemo(() => layoutSignature(name.trim().slice(0, MAX)), [name])
    const hasGlyphs = layout.glyphs.length > 0
    // Names with no A–Z letters (e.g. Bangla) can't be typed out, so they go to the pad
    const [mode, setMode] = useState<"type" | "draw">("type")
    const [drawn, setDrawn] = useState(false)
    const [take, setTake] = useState(0)
    const [shown, setShown] = useState(false)
    const padRef = useRef<SignaturePadHandle>(null)

    useEffect(() => {
      if (!active) return setShown(false)
      const t = window.setTimeout(() => (setShown(true), setTake((n) => n + 1)), OPEN_DELAY)
      return () => clearTimeout(t)
    }, [active])

    useEffect(() => {
      if (!hasGlyphs && name.trim()) setMode("draw")
    }, [hasGlyphs, name])

    useEffect(() => {
      onChange(mode === "type" ? hasGlyphs : drawn)
    }, [mode, hasGlyphs, drawn, onChange])

    useImperativeHandle(ref, () => ({
      async toPng() {
        if (mode === "draw") return padRef.current?.toPng() ?? null
        if (!hasGlyphs) return null
        const scale = 6
        const canvas = document.createElement("canvas")
        canvas.width = Math.ceil((layout.width + PAD * 2) * scale)
        canvas.height = Math.ceil(GLYPH_HEIGHT * scale)
        const ctx = canvas.getContext("2d")!
        ctx.scale(scale, scale)
        ctx.translate(PAD - layout.minX, 0)
        ctx.strokeStyle = "#141210"
        ctx.lineWidth = 1.4
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        for (const g of layout.glyphs) {
          ctx.save()
          ctx.translate(g.x, 0)
          ctx.stroke(new Path2D(g.d))
          ctx.restore()
        }
        return canvas.toDataURL("image/png")
      },
    }))

    const viewWidth = layout.width + PAD * 2
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })

    return (
      // min-w-0: a long signature must not widen the column past the screen
      <div className="min-w-0">
        <div className="sig-box">
          {mode === "type" ? (
            <div className="sig-type" aria-live="polite">
              {!hasGlyphs ? (
                <span className="empty">Add your name in step 1</span>
              ) : (
                shown && (
                  <svg
                    key={take}
                    role="img"
                    aria-label={`Signature: ${name.trim()}`}
                    viewBox={`${layout.minX - PAD} 0 ${viewWidth} ${GLYPH_HEIGHT}`}
                    style={{ width: `min(100%, ${viewWidth * 2.6}px)` }}
                    fill="none"
                  >
                    {layout.glyphs.map((g, i) => (
                      <path
                        key={`${i}-${g.char}`}
                        d={g.d}
                        transform={`translate(${g.x} 0)`}
                        pathLength={1}
                        className="sig-stroke"
                        style={{ animationDelay: `${0.2 + i * 0.14}s` }}
                        stroke="currentColor"
                        strokeWidth={1.1}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                  </svg>
                )
              )}
            </div>
          ) : (
            <SignaturePad ref={padRef} onChange={setDrawn} className="sig-pad" />
          )}
          <div className="sig-line">
            <span>Signature</span>
            {mode === "type" && layout.skipped > 0 && hasGlyphs ? (
              <span>Only A–Z letters are drawn</span>
            ) : (
              <span suppressHydrationWarning>{today}</span>
            )}
          </div>
        </div>

        <div className="sig-acts">
          {mode === "type" ? (
            <button type="button" onClick={() => setMode("draw")} className="link">
              Draw instead
            </button>
          ) : hasGlyphs ? (
            <button type="button" onClick={() => (setMode("type"), setDrawn(false), setTake((t) => t + 1))} className="link">
              Use my typed name
            </button>
          ) : (
            <span className="link" style={{ textDecoration: "none" }}>
              Draw your signature above
            </span>
          )}
          {mode === "type" ? (
            hasGlyphs && (
              <button type="button" onClick={() => setTake((t) => t + 1)} className="link">
                Replay
              </button>
            )
          ) : (
            <button type="button" onClick={() => padRef.current?.clear()} className="link">
              Clear
            </button>
          )}
        </div>
      </div>
    )
  },
)

export default SignatureField
