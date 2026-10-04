"use client"

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { GLYPH_HEIGHT, layoutSignature } from "@/lib/work-order/signature-letters"
import SignaturePad, { type SignaturePadHandle } from "./signature-pad"

const MAX = 80
const PAD = 6

export type SignatureFieldHandle = { toPng: () => Promise<string | null> }

// The signer's name, written out stroke by stroke from hand-drawn letter paths, one letter after
// another like a pen. "Draw instead" swaps in a freehand pad. Both export a transparent dark-ink
// PNG, so the API and the PDF treat them alike.
const SignatureField = forwardRef<SignatureFieldHandle, { name: string; onChange: (signed: boolean) => void }>(
  function SignatureField({ name, onChange }, ref) {
    const layout = useMemo(() => layoutSignature(name.trim().slice(0, MAX)), [name])
    const hasGlyphs = layout.glyphs.length > 0
    // Names with no A–Z letters (e.g. Bangla) can't be typed out, so they start on the pad
    const [mode, setMode] = useState<"type" | "draw">(() => (hasGlyphs ? "type" : "draw"))
    const [drawn, setDrawn] = useState(false)
    const [take, setTake] = useState(0)
    const padRef = useRef<SignaturePadHandle>(null)

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
    const link = "text-[13px] text-stone underline decoration-stone/40 underline-offset-4 transition-colors hover:text-ivory"

    return (
      // min-w-0: a long signature must not widen the column past the screen
      <div className="flex min-w-0 flex-col">
        <style>{`
          .sig-stroke { stroke-dasharray: 1 2; stroke-dashoffset: 1; animation: sig-draw 0.55s cubic-bezier(0.45, 0, 0.2, 1) both; }
          @keyframes sig-draw { to { stroke-dashoffset: 0; } }
          @media (prefers-reduced-motion: reduce) { .sig-stroke { animation: none; stroke-dashoffset: 0; } }
        `}</style>

        <div className="flex h-[150px] w-full min-w-0 flex-col border border-line bg-ivory/[0.02] px-5 pb-3 sm:h-[170px]">
          {mode === "type" ? (
            <div className="flex min-h-0 flex-1 items-end justify-center pb-2 pt-4" aria-live="polite">
              {hasGlyphs ? (
                <svg
                  key={take}
                  role="img"
                  aria-label={`Signature: ${name.trim()}`}
                  viewBox={`${layout.minX - PAD} 0 ${viewWidth} ${GLYPH_HEIGHT}`}
                  className="h-auto max-h-full text-ivory"
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
              ) : (
                <span className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-stone/70">Add your name in step 1</span>
              )}
            </div>
          ) : (
            <SignaturePad ref={padRef} onChange={setDrawn} className="-mx-5 min-h-0 flex-1" />
          )}
          <div className="pointer-events-none flex items-center justify-between gap-3 border-t border-ivory/25 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
            <span>Signature</span>
            {mode === "type" && layout.skipped > 0 && hasGlyphs ? (
              <span className="normal-case tracking-normal">Only A–Z letters are drawn</span>
            ) : (
              <span className="tabular-nums">{today}</span>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          {mode === "type" ? (
            <button type="button" onClick={() => setMode("draw")} className={link}>
              Draw instead
            </button>
          ) : hasGlyphs ? (
            <button type="button" onClick={() => (setMode("type"), setDrawn(false))} className={link}>
              Use my typed name
            </button>
          ) : (
            <span className="text-[13px] text-stone">Draw your signature above</span>
          )}
          {mode === "type" ? (
            hasGlyphs && (
              <button type="button" onClick={() => setTake((t) => t + 1)} className={link}>
                Replay
              </button>
            )
          ) : (
            <button type="button" onClick={() => padRef.current?.clear()} className={link}>
              Clear
            </button>
          )}
        </div>
      </div>
    )
  },
)

export default SignatureField
