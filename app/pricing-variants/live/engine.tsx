"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"

/* A tiny authored-demo engine: a fixed-size stage scaled to fit, named cursors that glide to
   [data-t] targets and click with a burst, and a script loop that runs only while in view.
   Rules from the stageshow kit: one colour per person everywhere, the name rides the cursor,
   moves ease in and out over most of a second, the cursor never covers the words it clicks. */

export const PEOPLE = {
  sadia: { name: "Sadia", color: "#F76B15" },
  imran: { name: "Imran", color: "#2F6FEB" },
  joya: { name: "Joya", color: "#D6409F" },
  edith: { name: "Edith · AI", color: "#12A150" },
} as const
export type Who = keyof typeof PEOPLE

type StageCtx = { el: () => HTMLDivElement | null; scale: number; tick: number }
const Ctx = createContext<StageCtx>({ el: () => null, scale: 1, tick: 0 })

export function useReduced() {
  const [r, setR] = useState(false)
  useEffect(() => setR(matchMedia("(prefers-reduced-motion: reduce)").matches), [])
  return r
}

export function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, on] as const
}

export type Wait = (ms: number) => Promise<void>

/* Runs `beat` over and over while `on`. Stops cleanly mid-beat when it goes out of view. */
export function useLoop(on: boolean, beat: (wait: Wait) => Promise<void>) {
  const fn = useRef(beat)
  fn.current = beat
  useEffect(() => {
    if (!on) return
    let alive = true
    const timers = new Set<ReturnType<typeof setTimeout>>()
    const wait: Wait = (ms) =>
      new Promise((res, rej) => {
        const t = setTimeout(() => {
          timers.delete(t)
          alive ? res() : rej(new Error("stopped"))
        }, ms)
        timers.add(t)
      })
    ;(async () => {
      try {
        while (alive) await fn.current(wait)
      } catch {
        /* stopped */
      }
    })()
    return () => {
      alive = false
      timers.forEach(clearTimeout)
    }
  }, [on])
}

/* Fixed design size, scaled down to the column; the cursors measure in design pixels */
export function Stage({ width, height, className = "", max = 1, children }: { width: number; height: number; className?: string; max?: number; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [tick, setTick] = useState(0)
  useLayoutEffect(() => {
    const el = outer.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setScale(Math.min(max, el.clientWidth / width))
      setTick((t) => t + 1)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [width, max])
  const el = useCallback(() => inner.current, [])
  return (
    <div ref={outer} className={`lv-stage-outer ${className}`} style={{ height: height * scale }}>
      <div ref={inner} className="lv-stage" style={{ width, height, transform: `scale(${scale})` }}>
        <Ctx.Provider value={{ el, scale, tick }}>{children}</Ctx.Provider>
      </div>
    </div>
  )
}

export type Aim = { t: string; x?: number; y?: number } | { x: number; y: number; abs: true }

/* A teammate's cursor. `at` names a [data-t] target (aimed at x/y fractions of its box) or an
   absolute point. Each `press` bump plays one click: the arrow dips and the rays burst. */
export function Cursor({ who, at, press, slow, hidden }: { who: Who; at: Aim; press: number; slow?: boolean; hidden?: boolean }) {
  const { el, scale, tick } = useContext(Ctx)
  const [xy, setXy] = useState<{ x: number; y: number } | null>(null)
  const key = JSON.stringify(at)
  useLayoutEffect(() => {
    const stage = el()
    if (!stage) return
    if ("abs" in at) return setXy({ x: at.x, y: at.y })
    const t = stage.querySelector<HTMLElement>(`[data-t="${at.t}"]`)
    if (!t) return
    const s = stage.getBoundingClientRect()
    const r = t.getBoundingClientRect()
    setXy({
      x: (r.left - s.left) / scale + (r.width / scale) * (at.x ?? 0.85),
      y: (r.top - s.top) / scale + (r.height / scale) * (at.y ?? 0.65),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, scale, tick])
  const p = PEOPLE[who]
  if (!xy) return null
  return (
    <span
      className="lv-cur"
      data-slow={slow || undefined}
      data-hidden={hidden || undefined}
      style={{ transform: `translate(${xy.x}px, ${xy.y}px)`, ["--who" as string]: p.color } as CSSProperties}
      aria-hidden="true"
    >
      <span className="lv-cur-in" key={press} data-press={press ? "" : undefined}>
        <svg className="lv-rays" width="30" height="30" viewBox="-15 -15 30 30">
          {[200, 245, 290, 335, 155].map((a) => (
            <line key={a} x1={Math.cos((a * Math.PI) / 180) * 6} y1={Math.sin((a * Math.PI) / 180) * 6} x2={Math.cos((a * Math.PI) / 180) * 12} y2={Math.sin((a * Math.PI) / 180) * 12} />
          ))}
        </svg>
        <svg className="lv-arrow" width="20" height="20" viewBox="0 0 20 20">
          <path d="M2.2 1.6 18 7.4a.8.8 0 0 1 0 1.5l-6.6 2.3-3.4 6.9a.8.8 0 0 1-1.5-.2L1.2 2.6a.8.8 0 0 1 1-1z" />
        </svg>
      </span>
      <span className="lv-flag">{p.name}</span>
    </span>
  )
}

export function Avatar({ who, size = 22 }: { who: Who; size?: number }) {
  const p = PEOPLE[who]
  return (
    <span className="lv-av" style={{ width: size, height: size, background: p.color, fontSize: size * 0.45 } as CSSProperties}>
      {who === "edith" ? "E" : p.name[0]}
    </span>
  )
}
