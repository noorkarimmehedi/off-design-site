"use client"

import { useEffect, useRef } from "react"
import { fanImages } from "@/lib/home"

// Riffle: an open book of the work lying three-quarter on a smoked cover, thumbing through itself.
// Eight double-sided pages turn about the spine one after another (one full riffle every 9.6s), so three
// or four are always in the air. On a fine pointer, sweeping sideways thumbs pages forward or back and
// the book leans toward the cursor. The scene is designed at 760×600 and scaled to its column.
// Only ticks on screen and in a visible tab; with reduced motion it turns at 6% speed and ignores the pointer.

const N = 8
const T = 9.6 // seconds per riffle
const F = 0.4 // share of the cycle a page spends turning
const G = 5 // px between resting pages
const PT = F + 2.6 / N // phase where a turned page drops back under the right-hand stack
const W = 760
const H = 600

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const mod = (x: number, n: number) => ((x % n) + n) % n
const smooth = (x: number) => x * x * (3 - 2 * x)
const damp = (dt: number, rate: number) => 1 - Math.exp(-dt * rate)

export default function RiffleBook() {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current!
    const fit = stage.querySelector<HTMLElement>(".rf-fit")!
    const book = stage.querySelector<HTMLElement>(".rf-book")!
    const pages = Array.from(stage.querySelectorAll<HTMLElement>(".rf-page")).map((page) => ({
      page,
      fs: page.querySelector<HTMLElement>(".face.f .sh")!,
      bs: page.querySelector<HTMLElement>(".face.b .sh")!,
    }))
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches

    const refit = () => fit.style.setProperty("--s", Math.min(1, stage.clientWidth / W).toFixed(4))
    const ro = new ResizeObserver(refit)
    ro.observe(stage)
    refit()

    // pointer, in scene units; dx accumulates sideways sweeps between frames
    const p = { x: 0, nx: 0, ny: 0, dx: 0, inside: false }
    const scene = stage.querySelector<HTMLElement>(".rf-scene")!
    const move = (e: PointerEvent) => {
      const r = scene.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) * W
      const y = ((e.clientY - r.top) / r.height) * H
      if (p.inside) p.dx += x - p.x
      p.x = x
      p.nx = clamp((x / W) * 2 - 1, -1, 1)
      p.ny = clamp((y / H) * 2 - 1, -1, 1)
      p.inside = true
    }
    const leave = () => (p.inside = false)
    if (fine) {
      stage.addEventListener("pointermove", move)
      stage.addEventListener("pointerleave", leave)
    }

    let ph = 0
    let vel = 0
    let rx = 0
    let rz = 0
    const draw = (sdt: number, dt: number, rm: boolean) => {
      if (!rm) vel += p.dx * 0.004
      p.dx = 0
      vel *= Math.exp(-dt * 5)
      ph += sdt / T + vel * dt
      const on = p.inside && !rm
      rx += ((on ? p.ny : 0) - rx) * damp(dt, 4)
      rz += ((on ? p.nx : 0) - rz) * damp(dt, 4)
      book.style.transform = `rotateX(${(52 - rx * 4).toFixed(2)}deg) rotateZ(${(-24 + rz * 5).toFixed(2)}deg)`
      for (let i = 0; i < N; i++) {
        const q = mod(ph + i / N, 1)
        let th: number, z: number, fsh: number, bsh: number
        let op = 1
        if (q < F) {
          // turning: lifts off the stack in an arc and lands face down on the left
          const e = smooth(q / F)
          th = 180 * e
          z = 0.5 + Math.sin(e * Math.PI) * 2
          fsh = 0.5 * e
          bsh = 0.5 * (1 - e)
        } else if (q < PT) {
          // resting on the left stack, sinking as newer pages land on it
          const r = (q - F) * N
          th = 180
          z = -r * G
          fsh = 0
          bsh = Math.min(0.5, r * 0.12)
          op = clamp((PT - q) / 0.03)
        } else {
          // back under the right stack, rising to the top
          const r = (1 - q) * N
          th = 0
          z = -r * G
          bsh = 0
          fsh = Math.min(0.5, r * 0.12)
          op = clamp((q - PT) / 0.03)
        }
        const pg = pages[i]
        pg.page.style.transform = `translateZ(${z.toFixed(2)}px) rotateY(${(-th).toFixed(2)}deg)`
        pg.page.style.opacity = op.toFixed(3)
        pg.fs.style.opacity = fsh.toFixed(3)
        pg.bs.style.opacity = bsh.toFixed(3)
      }
    }

    let raf = 0
    let last = 0
    let visible = false
    const frame = (now: number) => {
      raf = 0
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
      last = now
      const rm = reduced.matches
      draw(dt * (rm ? 0.06 : 1), dt, rm)
      kick()
    }
    const kick = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        last = 0
        kick()
      },
      { rootMargin: "80px" },
    )
    io.observe(stage)
    const vis = () => {
      last = 0
      kick()
    }
    document.addEventListener("visibilitychange", vis)
    draw(0, 1 / 60, true) // first frame before it scrolls into view

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", vis)
      stage.removeEventListener("pointermove", move)
      stage.removeEventListener("pointerleave", leave)
    }
  }, [])

  return (
    <div className="riffle" ref={stageRef} aria-hidden="true">
      <div className="rf-fit">
        <div className="rf-scene">
          <div className="rf-book">
            <div className="rf-cover" />
            <div className="rf-spine" />
            {fanImages.map((src, i) => (
              <div className="rf-page" key={src}>
                <div className="face f">
                  <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
                  <i className="sh" />
                </div>
                <div className="face b">
                  <img src={fanImages[(i + 4) % N]} alt="" loading="lazy" decoding="async" draggable={false} />
                  <i className="sh" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
