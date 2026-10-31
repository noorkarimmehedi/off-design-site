"use client"

import { useEffect, useRef } from "react"
import { services } from "@/lib/home"
import { fields } from "./ascii-fields"

const FONT = '10px "SF Mono", Menlo, Consolas, ui-monospace, monospace'
const CELL_H = 12.5
const INK = "#333333"

// Five service tiles, each with a live ASCII field drawn on a canvas. Fields only animate
// while on screen, speed up while the tile is hovered, and tick once a second for reduced motion.
export default function ServiceTiles() {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const tiles = Array.from(listRef.current!.querySelectorAll<HTMLLIElement>(".tile"))
    const cleanups: (() => void)[] = []

    const items = tiles.map((tile, i) => {
      const cv = tile.querySelector("canvas")!
      const it = {
        tile,
        cv,
        ctx: cv.getContext("2d")!,
        field: fields[services[i].ascii],
        t: Math.random() * 10,
        speed: 1,
        target: 1,
        on: false,
        C: 0,
        R: 0,
        cw: 6,
        ox: 0,
        oy: 0,
      }
      const size = () => {
        const r = cv.getBoundingClientRect()
        if (!r.width) return
        const d = Math.min(2, window.devicePixelRatio || 1)
        cv.width = Math.round(r.width * d)
        cv.height = Math.round(r.height * d)
        it.ctx.setTransform(d, 0, 0, d, 0, 0)
        it.ctx.font = FONT
        it.ctx.textBaseline = "top"
        it.cw = it.ctx.measureText("M").width
        it.C = Math.floor(r.width / it.cw)
        it.R = Math.floor(r.height / CELL_H)
        it.ox = (r.width - it.C * it.cw) / 2
        it.oy = (r.height - it.R * CELL_H) / 2
        draw(it)
      }
      const ro = new ResizeObserver(size)
      ro.observe(cv)
      const io = new IntersectionObserver(([e]) => (it.on = e.isIntersecting))
      io.observe(cv)
      const enter = () => (it.target = 2.6)
      const leave = () => (it.target = 1)
      tile.addEventListener("pointerenter", enter)
      tile.addEventListener("pointerleave", leave)
      cleanups.push(() => {
        ro.disconnect()
        io.disconnect()
        tile.removeEventListener("pointerenter", enter)
        tile.removeEventListener("pointerleave", leave)
      })
      return it
    })

    function draw(it: (typeof items)[number]) {
      if (!it.C) return
      const { ctx, C, R, cw, ox, oy } = it
      ctx.clearRect(0, 0, it.cv.width, it.cv.height)
      ctx.fillStyle = INK
      const boost = Math.min(1, 0.85 + (it.speed - 1) * 0.1)
      it.field(
        (x, y, ch, a) => {
          if (ch === " " || x < 0 || y < 0 || x >= C || y >= R) return
          ctx.globalAlpha = Math.min(1, a * boost)
          ctx.fillText(ch, ox + x * cw, oy + y * CELL_H)
        },
        C,
        R,
        it.t,
      )
      ctx.globalAlpha = 1
    }

    let frame = 0
    let timer = 0
    if (reduce) {
      timer = window.setInterval(() => items.forEach((it) => it.on && ((it.t += 1), draw(it))), 1000)
    } else {
      let last = performance.now()
      frame = requestAnimationFrame(function loop(now) {
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now
        for (const it of items) {
          if (!it.on) continue
          it.speed += (it.target - it.speed) * 0.08 // ease into and out of the hover speed-up
          it.t += dt * it.speed
          draw(it)
        }
        frame = requestAnimationFrame(loop)
      })
    }

    return () => {
      cancelAnimationFrame(frame)
      clearInterval(timer)
      cleanups.forEach((c) => c())
    }
  }, [])

  return (
    <ul className="tiles rv" ref={listRef}>
      {services.map((s) => (
        <li className="tile" key={s.name}>
          <h3>{s.name}</h3>
          <div className="ascii" aria-hidden="true">
            <canvas />
          </div>
          <p>{s.body}</p>
        </li>
      ))}
    </ul>
  )
}
