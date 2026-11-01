"use client"

import { useEffect, useRef } from "react"
import { services } from "@/lib/home"
import { MORPH_MS, Mind, type ShapeName } from "./dither-mind"

const STEP_MS = 2600
const LINGER_MS = 1400 // extra time on each service's last shape, its "result"

// Five service tiles, each with a dithered 3D object that steps through three shapes, like an agent narrating its work.
// Dots conjure into the first shape when the row scrolls in. No two tiles ever show the same shape at once:
// a tile claims a shape before morphing to it, and skips ahead when another tile holds it.
// Tiles only step while on screen; with reduced motion each shows its final shape, still.
export default function ServiceTiles() {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const tiles = Array.from(listRef.current!.querySelectorAll<HTMLLIElement>(".tile"))
    const held = new Map<ShapeName, number>()
    const free = (s: ShapeName, owner: number) => !held.has(s) || held.get(s) === owner
    const timers = new Set<number>()
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id)
        fn()
      }, ms)
      timers.add(id)
      return id
    }
    const cleanups: (() => void)[] = []

    tiles.forEach((tile, i) => {
      const steps = services[i].steps
      const host = tile.querySelector<HTMLElement>(".mind")!
      const pref = reduced ? [2, 1, 0] : [0, 1, 2]
      let k = pref.find((j) => free(steps[j], i)) ?? pref[0]
      held.set(steps[k], i)
      const mind = new Mind(host, host.querySelector("canvas")!, steps[k], i * 2.3 + 1, reduced)
      if (!mind.ok) return
      let timer = 0
      let inView = false

      const advance = () => {
        // next step whose shape nobody else is showing; if both are taken, hold and look again shortly
        const next = [1, 2].map((d) => (k + d) % 3).find((j) => free(steps[j], i))
        if (next === undefined) {
          timer = later(advance, 600)
          return
        }
        const prev = steps[k]
        k = next
        held.set(steps[k], i)
        mind.show(steps[k])
        later(() => held.get(prev) === i && held.delete(prev), MORPH_MS / 2)
        tick()
      }
      const tick = () => {
        clearTimeout(timer)
        if (!inView || reduced) return
        timer = later(advance, STEP_MS + (k === 2 ? LINGER_MS : 0))
      }

      let conjured = false
      const io = new IntersectionObserver(
        ([e]) => {
          inView = e.isIntersecting
          if (!inView) return clearTimeout(timer)
          if (!conjured) {
            conjured = true
            later(() => mind.conjure(), i * 90) // left to right
          }
          later(tick, i * 380)
        },
        { threshold: 0.35 },
      )
      io.observe(tile)
      cleanups.push(() => {
        io.disconnect()
        mind.destroy()
      })
    })

    return () => {
      timers.forEach(clearTimeout)
      cleanups.forEach((c) => c())
    }
  }, [])

  return (
    <ul className="tiles rv" ref={listRef}>
      {services.map((s) => (
        <li className="tile" key={s.name}>
          <h3>{s.name}</h3>
          <div className="mind" aria-hidden="true">
            <canvas />
          </div>
          <p>{s.body}</p>
        </li>
      ))}
    </ul>
  )
}
