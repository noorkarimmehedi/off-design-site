"use client"

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"

type Point = { x: number; y: number }
export type SignaturePadHandle = { clear: () => void; toPng: () => string | null }

// Strokes are kept as points so the saved PNG can be redrawn in dark ink on a transparent
// background, whatever colour the pen shows in the current theme.
const SignaturePad = forwardRef<SignaturePadHandle, { onChange?: (signed: boolean) => void; className?: string }>(
  function SignaturePad({ onChange, className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const strokes = useRef<Point[][]>([])
    const drawing = useRef(false)
    const [empty, setEmpty] = useState(true)

    const paint = useCallback((ctx: CanvasRenderingContext2D, color: string, scale: number) => {
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.lineWidth = 2.2 * scale
      ctx.strokeStyle = color
      for (const s of strokes.current) {
        ctx.beginPath()
        s.forEach((p, i) => (i ? ctx.lineTo(p.x * scale, p.y * scale) : ctx.moveTo(p.x * scale, p.y * scale)))
        if (s.length === 1) ctx.lineTo(s[0].x * scale + 0.1, s[0].y * scale)
        ctx.stroke()
      }
    }, [])

    const redraw = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      const { width, height } = canvas.getBoundingClientRect()
      if (canvas.width !== Math.round(width * dpr)) {
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
      }
      const ctx = canvas.getContext("2d")!
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      paint(ctx, getComputedStyle(canvas).color, dpr)
    }, [paint])

    useEffect(() => {
      redraw()
      const ro = new ResizeObserver(redraw)
      if (canvasRef.current) ro.observe(canvasRef.current)
      // Theme toggles swap the pen colour
      const mo = new MutationObserver(redraw)
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
      return () => {
        ro.disconnect()
        mo.disconnect()
      }
    }, [redraw])

    const point = (e: React.PointerEvent): Point => {
      const r = canvasRef.current!.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    const setSigned = (signed: boolean) => {
      setEmpty(!signed)
      onChange?.(signed)
    }

    useImperativeHandle(ref, () => ({
      clear() {
        strokes.current = []
        redraw()
        setSigned(false)
      },
      toPng() {
        const canvas = canvasRef.current
        if (!canvas || !strokes.current.length) return null
        const { width, height } = canvas.getBoundingClientRect()
        const out = document.createElement("canvas")
        out.width = Math.round(width * 2)
        out.height = Math.round(height * 2)
        paint(out.getContext("2d")!, "#141210", 2)
        return out.toDataURL("image/png")
      },
    }))

    return (
      <div className={`relative ${className ?? ""}`}>
        <canvas
          ref={canvasRef}
          aria-label="Signature pad — draw your signature"
          className="block h-full w-full cursor-crosshair touch-none text-ivory"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            drawing.current = true
            strokes.current.push([point(e)])
            redraw()
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return
            strokes.current[strokes.current.length - 1].push(point(e))
            redraw()
          }}
          onPointerUp={() => {
            if (!drawing.current) return
            drawing.current = false
            setSigned(true)
          }}
          onPointerCancel={() => (drawing.current = false)}
        />
        {empty && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.2em] text-stone/70">
            Sign here
          </span>
        )}
      </div>
    )
  },
)

export default SignaturePad
