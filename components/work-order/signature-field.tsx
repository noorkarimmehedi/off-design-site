"use client"

import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react"
import SignaturePad, { type SignaturePadHandle } from "./signature-pad"

// Free (OFL) handwriting faces: elegant monoline, flowing brush, natural hand
const STYLES = [
  { id: "corinthia", label: "Elegant", family: "Corinthia" },
  { id: "alex", label: "Script", family: "Alex Brush" },
  { id: "dawning", label: "Handwritten", family: "Dawning of a New Day" },
] as const
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Alex+Brush&family=Corinthia:wght@400;700&family=Dawning+of+a+New+Day&display=swap"
const MAX = 80

const initialsOf = (s: string) =>
  s
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
const isBangla = (s: string) => /[ঀ-৿]/.test(s)

export type SignatureFieldHandle = { toPng: () => Promise<string | null> }

// Type or draw a signature. Typed signatures are rendered to a transparent PNG in dark ink,
// the same format the drawn pad produces, so the API and the PDF treat both alike.
const SignatureField = forwardRef<SignatureFieldHandle, { defaultText: string; onChange: (signed: boolean) => void }>(
  function SignatureField({ defaultText, onChange }, ref) {
    const [mode, setMode] = useState<"type" | "draw">("type")
    const [text, setText] = useState("")
    const [edited, setEdited] = useState(false)
    const [initials, setInitials] = useState(false)
    const [style, setStyle] = useState<(typeof STYLES)[number]>(STYLES[0])
    const [drawn, setDrawn] = useState(false)
    const padRef = useRef<SignaturePadHandle>(null)
    const boxRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLSpanElement>(null)
    const [fontSize, setFontSize] = useState(68)

    // Follow the signer's name until they edit the signature text themselves
    const value = edited ? text : defaultText.slice(0, MAX)
    const shown = initials ? initialsOf(value) : value.trim()
    const family = isBangla(shown) ? "'Hind Siliguri'" : `'${style.family}'`

    // Shrink the preview until the signature fits the box (long names, narrow phones)
    useLayoutEffect(() => {
      const box = boxRef.current
      const span = textRef.current
      if (!box || !span) return
      const fit = () => {
        const room = box.clientWidth - 48
        let size = 68
        span.style.fontSize = `${size}px`
        while (size > 24 && span.scrollWidth > room) span.style.fontSize = `${(size -= 2)}px`
        setFontSize(size)
      }
      fit()
      document.fonts.ready.then(fit)
      const ro = new ResizeObserver(fit)
      ro.observe(box)
      return () => ro.disconnect()
    }, [shown, family, mode])

    useEffect(() => {
      onChange(mode === "type" ? shown.length > 0 : drawn)
    }, [mode, shown, drawn, onChange])

    useImperativeHandle(ref, () => ({
      async toPng() {
        if (mode === "draw") return padRef.current?.toPng() ?? null
        if (!shown) return null
        const size = 150
        await document.fonts.load(`${size}px ${family}`, shown)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!
        ctx.font = `${size}px ${family}`
        const m = ctx.measureText(shown)
        const pad = 40
        canvas.width = Math.ceil(m.width + pad * 2)
        canvas.height = Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent + pad * 2)
        ctx.font = `${size}px ${family}`
        ctx.fillStyle = "#141210"
        ctx.textBaseline = "alphabetic"
        ctx.fillText(shown, pad, pad + m.actualBoundingBoxAscent)
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

    return (
      // min-w-0: a long unwrapped preview must not widen the column past the screen
      <div className="flex min-w-0 flex-col">
        <link rel="stylesheet" href={FONTS_HREF} precedence="default" />
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">Signature</span>
          <div role="tablist" aria-label="Signature method" className="flex border border-line">
            {tab("type", "Type")}
            {tab("draw", "Draw")}
          </div>
        </div>

        {mode === "type" ? (
          <>
            <div
              ref={boxRef}
              aria-live="polite"
              className="mt-2 flex h-[180px] w-full min-w-0 items-center justify-center overflow-hidden border border-line bg-ivory/[0.02] px-6"
            >
              {shown ? (
                <span ref={textRef} className="whitespace-nowrap leading-[1.6] text-ivory" style={{ fontFamily: family, fontSize }}>
                  {shown}
                </span>
              ) : (
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone/70">Type your name below</span>
              )}
            </div>

            <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Signature style">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={style.id === s.id}
                  onClick={() => setStyle(s)}
                  className={`min-w-0 flex-1 truncate border px-2 py-2 text-[20px] leading-none transition-colors ${
                    style.id === s.id ? "border-ivory/50 text-ivory" : "border-line text-stone hover:border-ivory/25"
                  }`}
                  style={{ fontFamily: `'${s.family}'` }}
                  title={s.label}
                >
                  {initialsOf(value) || "Aa"}
                </button>
              ))}
            </div>

            <label className="mt-4 flex flex-col gap-2">
              <span className="flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
                <span>Signature text</span>
                <span className="tabular-nums">
                  {value.length} / {MAX}
                </span>
              </span>
              <input
                value={value}
                maxLength={MAX}
                onChange={(e) => {
                  setEdited(true)
                  setText(e.target.value)
                }}
                placeholder="Your full name"
                className="border border-line bg-transparent px-4 py-3 text-[16px] outline-none transition-colors placeholder:text-stone/50 focus:border-ivory/50"
              />
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
