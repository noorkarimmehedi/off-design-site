"use client"

import { useEffect, useRef } from "react"
import { services } from "@/lib/home"
import { Chrome } from "./liquid-chrome"

// Five service tiles, each with a live smoked-glass object, lit by a drifting band of the site yellow, that keeps working:
// a browser with a drop sliding across it, a bar chart re-measuring, a gyroscope, modules breathing, the arc. mark.
// On a fine pointer the object turns to the cursor and a glass drop follows it. Off-screen tiles don't render;
// with reduced motion each tile is one still frame.
export default function ServiceTiles() {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const tiles = Array.from(listRef.current!.querySelectorAll<HTMLLIElement>(".tile"))
    const objects = tiles.map((tile, i) => {
      const host = tile.querySelector<HTMLElement>(".chrome")!
      return new Chrome(tile, host, host.querySelector("canvas")!, i, reduced)
    })
    return () => objects.forEach((o) => o.destroy())
  }, [])

  return (
    <ul className="tiles rv" ref={listRef}>
      {services.map((s) => (
        <li className="tile" key={s.name}>
          <h3>{s.name}</h3>
          <div className="chrome" aria-hidden="true">
            <i className="chrome-shadow" />
            <canvas />
          </div>
          <p>{s.body}</p>
        </li>
      ))}
    </ul>
  )
}
