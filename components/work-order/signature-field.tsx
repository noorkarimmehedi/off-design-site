"use client"

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { GLYPH_HEIGHT, layoutSignature } from "@/lib/work-order/signature-letters"
import SignaturePad, { type SignaturePadHandle } from "./signature-pad"

const MAX = 80
const PAD = 6

const initialsOf = (s: string) =>
  s
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")

export type SignatureFieldHandle = { toPng: () => Promise<string | null> }

// Type or draw a signature. Typed names are drawn stroke by stroke from hand-drawn letter paths
// as they're typed, and exported as a transparent dark-ink PNG — the same format the draw pad
// produces, so the API and the PDF treat both alike.
const SignatureField = forwardRef<SignatureFieldHandle, { defaultText: string; onChange: (signed: boolean) => void }>(
  function SignatureField({ defaultText, onChange }, ref) {
    const [mode, setMode] = useState<"type" | "draw">("type")
    const [text, setText] = useState("")
    const [edited, setEdited] = useState(false)
    const [initials, setInitials] = useState(false)
    const [drawn, setDrawn] = useState(false)
    const padRef = useRef<SignaturePadHandle>(null)

    // Follow the signer's name until they edit the signature text themselves
    const value = edited ? text : defaultText.slice(0, MAX)
    const shown = initials ? initialsOf(value) : value.trim()
    const layout = useMemo(() => layoutSignature(shown), [shown])
    const hasGlyphs = layout.glyphs.length > 0

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

    const tab = (m: "type" | "draw", label: string) => (
      <button
        type="button"
        role="tab"
        aria-selected={mode === m}
        onClick={() => setMode(m)}
        className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
          mode === m ? "bg-ivory text-ink" : "text-stone hover:text-ivory"
        }`}
      >
        {label}
      </button>
    )

    const viewWidth = layout.width + PAD * 2

    return (
      // min-w-0: a long signature must not widen the column past the screen
      <div className="flex min-w-0 flex-col">
        <style>{`
          .sig-stroke { stroke-dasharray: 1 2; stroke-dashoffset: 1; animation: sig-draw 0.7s cubic-bezier(0.45, 0, 0.2, 1) forwards; }
          @keyframes sig-draw { to { stroke-dashoffset: 0; } }
          @media (prefers-reduced-motion: reduce) { .sig-stroke { animation: none; stroke-dashoffset: 0; } }
        `}</style>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">Signature</span>
          <div role="tablist" aria-label="Signature method" className="flex border border-line">
            {tab("type", "Type")}
            {tab("draw", "Draw")}
          </div>
        </div>

        {mode === "type" ? (
          <>
            <div className="mt-2 flex h-[180px] w-full min-w-0 flex-col justify-end border border-line bg-ivory/[0.02] px-6 pb-6 pt-5">
              <div className="flex min-h-0 flex-1 items-end justify-center" aria-live="polite">
                {hasGlyphs ? (
                  <svg
                    role="img"
                    aria-label={`Signature: ${shown}`}
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
                        stroke="currentColor"
                        strokeWidth={1.1}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                  </svg>
                ) : (
                  <span className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-stone/70">
                    {shown ? "Use English letters, or Draw" : "Type your name below"}
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-3 border-t border-ivory/25 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
                <span>Signed by</span>
                {layout.skipped > 0 && hasGlyphs && <span className="ml-auto normal-case tracking-normal">Only A–Z letters are drawn</span>}
              </div>
            </div>

            <label className="mt-4 flex flex-col gap-2">
              <span className="flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
                <span>Signature text</span>
                <span className="tabular-nums">
                  {value.length} / {MAX}
                </span>
              </span>
              <span className="relative flex">
                <input
                  value={value}
                  maxLength={MAX}
                  autoComplete="off"
                  onChange={(e) => {
                    setEdited(true)
                    setText(e.target.value)
                  }}
                  placeholder="Your name"
                  className="w-full border border-line bg-transparent py-3 pl-4 pr-12 text-[16px] outline-none transition-colors placeholder:text-stone/50 focus:border-ivory/50"
                />
                {/* Pen mark, after the reference design's Sign button */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className={`pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 transition-opacity ${hasGlyphs ? "opacity-90" : "opacity-30"}`}
                  fill="currentColor"
                >
                  <path d="M7.72421 4.666H5.13421C4.86052 4.66592 4.59342 4.75007 4.3692 4.90703C4.14498 5.06398 3.97449 5.28614 3.88088 5.54333L1.37421 12.438C1.28555 12.6813 1.34621 12.954 1.52888 13.1373L1.72421 13.3327L6.00555 9.05133C6.00488 9.034 6.00022 9.01667 6.00022 8.99933C6.00022 8.80155 6.05886 8.60821 6.16875 8.44376C6.27863 8.27932 6.43481 8.15114 6.61753 8.07546C6.80026 7.99977 7.00132 7.97996 7.19531 8.01855C7.38929 8.05713 7.56747 8.15238 7.70732 8.29223C7.84717 8.43208 7.94241 8.61026 7.981 8.80424C8.01959 8.99823 7.99978 9.19929 7.92409 9.38202C7.84841 9.56474 7.72023 9.72092 7.55579 9.8308C7.39134 9.94069 7.198 9.99933 7.00022 9.99933C6.98288 9.99933 6.96555 9.99467 6.94822 9.994L2.66688 14.2753L2.86221 14.4707C2.95185 14.5605 3.06534 14.6228 3.18927 14.6503C3.31319 14.6777 3.44238 14.669 3.56155 14.6253L10.4562 12.118C10.7134 12.0244 10.9356 11.8539 11.0925 11.6297C11.2495 11.4055 11.3336 11.1384 11.3335 10.8647V8.27467L12.6662 6.94267L9.05688 3.33333L7.72421 4.666ZM13.2929 6.04067L9.95955 2.70733L11.3729 1.29333L14.7062 4.62667L13.2929 6.04067Z" />
                </svg>
              </span>
            </label>
            <label className="mt-3 flex cursor-pointer items-center gap-3 text-[13.5px] text-stone">
              <input
                type="checkbox"
                checked={initials}
                onChange={(e) => setInitials(e.target.checked)}
                className="h-4 w-4 accent-[#ff5941]"
              />
              Use initials
            </label>
          </>
        ) : (
          <>
            <SignaturePad ref={padRef} onChange={setDrawn} className="mt-2 h-[180px] border border-line bg-ivory/[0.02]" />
            <button
              type="button"
              onClick={() => padRef.current?.clear()}
              className="mt-2 self-end font-mono text-[10px] uppercase tracking-[0.2em] text-stone transition-colors hover:text-ivory"
            >
              Clear
            </button>
          </>
        )}
      </div>
    )
  },
)

export default SignatureField
