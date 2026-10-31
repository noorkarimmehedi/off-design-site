import type { AsciiKind } from "@/lib/home"

// Each field writes glyphs into a cols × rows grid for time t (seconds).
export type Put = (x: number, y: number, ch: string, alpha: number) => void
type Field = (put: Put, C: number, R: number, t: number) => void

const pad = (n: number, w: number) => String(n).padStart(w, "0")

// AI Automation: interference waves
const flow: Field = (put, C, R, t) => {
  const ramp = " .:*!)(%@&"
  for (let y = 0; y < R; y++)
    for (let x = 0; x < C; x++) {
      let v =
        Math.sin(x * 0.16 + t) +
        Math.sin(y * 0.45 - t * 0.8) +
        Math.sin(x * 0.1 + y * 0.3 + t * 0.6) +
        Math.sin(Math.hypot(x - C / 2, (y - R / 2) * 2) * 0.35 - t * 1.4)
      v = (v + 4) / 8
      put(x, y, ramp[Math.min(ramp.length - 1, Math.floor(v * ramp.length))], 0.2 + v * 0.7)
    }
}

// Custom Software & ERP: a stock ledger scrolling past a scan line
const ledger: Field = (put, C, R, t) => {
  const head = "ITEM      STOCK       QTY"
  for (let x = 0; x < C; x++) {
    put(x, 0, head[x - 1] || " ", 0.85)
    put(x, 1, "-", 0.35)
  }
  const off = Math.floor(t * 1.4)
  const scan = (t * 4) % (R + 4)
  for (let y = 2; y < R; y++) {
    const seed = ((y + off) * 7919) % 9973
    const fill = 3 + (seed % 9)
    const live = Math.abs(y - scan) < 1
    const qty = live ? pad(Math.floor(Math.random() * 9999), 4) : pad(seed % 9999, 4)
    const row = ("SKU-" + pad(seed % 997, 3)).padEnd(10) + ("#".repeat(fill) + ".".repeat(11 - fill)).padEnd(12) + qty
    const a = 0.28 + 0.65 * Math.max(0, 1 - Math.abs(y - scan) / 2.2)
    for (let x = 0; x < C; x++) put(x, y, row[x - 1] || " ", a)
  }
}

// Internal Tools & Dashboards: live bars over a dotted grid
const bars: Field = (put, C, R, t) => {
  const n = Math.floor((C - 1) / 3)
  for (let y = 0; y < R - 1; y++) for (let x = 0; x < C; x++) if ((x + y) % 3 === 0) put(x, y, ".", 0.14)
  for (let i = 0; i < n; i++) {
    const h = Math.max(1, (0.5 + 0.32 * Math.sin(t * 0.9 + i * 0.7) + 0.12 * Math.sin(t * 2.3 + i * 1.7)) * (R - 3))
    for (let y = 0; y < R - 1; y++) {
      const fromBase = R - 2 - y
      if (fromBase >= h) continue
      const cap = fromBase + 1 >= h
      put(i * 3 + 1, y, cap ? "=" : "#", cap ? 0.95 : 0.6)
      put(i * 3 + 2, y, cap ? "=" : "#", cap ? 0.95 : 0.6)
    }
  }
  for (let x = 0; x < C; x++) put(x, R - 1, "_", 0.5)
}

// Web Design & Development: a page layout assembling inside a browser frame
const web: Field = (put, C, R, t) => {
  for (let x = 0; x < C; x++) {
    const corner = x === 0 || x === C - 1
    put(x, 0, corner ? "+" : "-", 0.55)
    put(x, 2, "-", 0.3)
    put(x, R - 1, corner ? "+" : "-", 0.55)
  }
  for (let y = 1; y < R - 1; y++) {
    put(0, y, "|", 0.55)
    put(C - 1, y, "|", 0.55)
  }
  const bar = " o o o  [ arc-bangladesh.com ]"
  for (let x = 1; x < C - 1; x++) put(x, 1, bar[x - 1] || " ", 0.6)
  const p = (t * 0.22) % 1.5
  const W = C - 4
  const top = 4
  const bottom = R - 2
  const blocks: [number, number, number, number, string][] = [
    [2, 3, W, 1, "."],
    [2, top + 1, Math.floor(W * 0.5), 1, "="],
    [2, top + 2, Math.floor(W * 0.38), 1, "="],
    [2, top + 4, Math.floor(W * 0.22), 1, ":"],
    [2 + Math.floor(W * 0.58), top + 1, Math.ceil(W * 0.42), 4, "%"],
  ]
  const cw = Math.floor((W - 2) / 3)
  for (let i = 0; i < 3; i++) blocks.push([2 + i * (cw + 1), top + 6, cw, Math.max(1, bottom - (top + 6)), ":"])
  blocks.forEach(([bx, by, bw, bh, ch], i) => {
    const local = Math.min(1, Math.max(0, (p - i * 0.11) / 0.18))
    const shown = Math.floor(bw * local)
    for (let yy = by; yy < Math.min(by + bh, bottom); yy++)
      for (let xx = 0; xx < shown; xx++) put(bx + xx, yy, ch, ch === "%" ? 0.75 : 0.55)
  })
  if (Math.floor(t * 2.5) % 2 === 0) put(2 + Math.floor(W * 0.22) + 1, top + 4, "_", 0.95)
}

// Brand & Product Design: a rotating 3D ring, shaded by glyph density
const ring: Field = (put, C, R, t) => {
  const ramp = ".,-~:;=!*#$@"
  const A = t * 0.9
  const B = t * 0.5
  const z = new Float32Array(C * R)
  const lum = new Float32Array(C * R)
  const out: string[] = new Array(C * R).fill(" ")
  const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B)
  const K2 = 5
  const K1 = Math.min(C * 0.27, R * 0.62)
  for (let th = 0; th < 6.283; th += 0.07) {
    const ct = Math.cos(th), st = Math.sin(th)
    for (let ph = 0; ph < 6.283; ph += 0.02) {
      const cp = Math.cos(ph), sp = Math.sin(ph)
      const cx = 2 + ct
      const x = cx * (cB * cp + sA * sB * sp) - st * cA * sB
      const y = cx * (sB * cp - sA * cB * sp) + st * cA * cB
      const ooz = 1 / (K2 + cA * cx * sp + st * sA)
      const xp = Math.floor(C / 2 + K1 * ooz * x * 2)
      const yp = Math.floor(R / 2 - K1 * ooz * y)
      const L = cp * ct * sB - cA * ct * sp - sA * st + cB * (cA * st - ct * sA * sp)
      if (xp < 0 || xp >= C || yp < 0 || yp >= R || L <= 0) continue
      const k = xp + yp * C
      if (ooz > z[k]) {
        z[k] = ooz
        lum[k] = L / 1.5
        out[k] = ramp[Math.min(11, Math.floor(L * 8))]
      }
    }
  }
  for (let k = 0; k < C * R; k++) if (out[k] !== " ") put(k % C, Math.floor(k / C), out[k], 0.3 + Math.min(1, lum[k]) * 0.65)
}

export const fields: Record<AsciiKind, Field> = { flow, ledger, bars, web, ring }
