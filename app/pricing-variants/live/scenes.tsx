"use client"

import { useRef, useState, type CSSProperties } from "react"
import NumberFlow from "@number-flow/react"
import { Cursor, PEOPLE, Stage, useLoop, type Aim, type Wait, type Who } from "./engine"

/* Five feature moments in the Merchant Suite admin's own look, each a short script with one
   teammate's cursor. `on` plays them; `once` plays one pass then calls onDone (variant C);
   onEvent reports what happened to a live feed. */

export type FeedEvent = { who: Who; text: string }
export type SceneProps = { on: boolean; once?: boolean; onDone?: () => void; onEvent?: (e: FeedEvent) => void; max?: number }

export const W = 440
export const H = 380

function useCursor(rest: Aim) {
  const [at, setAt] = useState<Aim>(rest)
  const [press, setPress] = useState(0)
  const click = async (wait: Wait) => {
    setPress((p) => p + 1)
    await wait(180)
  }
  return { at, setAt, press, click }
}

async function finish(p: SceneProps, wait: Wait) {
  if (p.once) {
    p.onDone?.()
    await wait(60_000)
  }
}

/* ───────────── Order protection: checks run, Edith holds the order ───────────── */
const SIGNALS = [
  ["One device, 4 phone numbers", "+40", "#f43f5e"],
  ["Checkout in 9 seconds", "+23", "#f59e0b"],
  ["Address has no area", "+18", "#f59e0b"],
]
export function SceneProtect(p: SceneProps) {
  const c = useCursor({ x: 470, y: 420, abs: true })
  const [shown, setShown] = useState(0)
  const [held, setHeld] = useState(false)
  const [fade, setFade] = useState(false)
  useLoop(p.on, async (wait) => {
    setFade(false)
    await wait(500)
    for (let i = 1; i <= 3; i++) {
      setShown(i)
      await wait(420)
    }
    await wait(300)
    c.setAt({ t: "hold", x: 0.78, y: 0.7 })
    await wait(1050)
    await c.click(wait)
    setHeld(true)
    p.onEvent?.({ who: "edith", text: "held #4109 · one device, 4 numbers" })
    await wait(450)
    c.setAt({ x: 300, y: 300, abs: true })
    await wait(1850)
    c.setAt({ x: 470, y: 420, abs: true })
    await wait(700)
    await finish(p, wait)
    setFade(true)
    await wait(260)
    setShown(0)
    setHeld(false)
  })
  const score = [0, 40, 63, 81][shown]
  return (
    <Stage width={W} height={H} max={p.max} className="lv-scene">
      <div className="lv-body lv-protect" data-fade={fade || undefined}>
        <div className="lv-ord">
          <div className="lv-ord-top">
            <div>
              <p className="lv-eyebrow">New order</p>
              <p className="lv-h">#4109 · Karim U.</p>
              <p className="lv-sub">Uttara, Dhaka · Landing page</p>
            </div>
            <span key={held ? "h" : "c"} className={`lv-pill lv-swap ${held ? "warn" : "neutral"}`}>
              {held ? "Held for review" : shown < 3 ? "Checking…" : "Needs a decision"}
            </span>
          </div>
          <div className="lv-score">
            <span className="lv-eyebrow">Risk score</span>
            <b>
              <NumberFlow value={score} className="lv-num" />
              <small>/ 100</small>
            </b>
          </div>
          <div className="lv-scorebar">
            <i style={{ transform: `scaleX(${score / 100})` }} />
          </div>
        </div>
        <ul className="lv-signals">
          {SIGNALS.map(([l, pts, col], i) => (
            <li key={l} data-on={i < shown || undefined}>
              <i style={{ background: col }} />
              <span>{l}</span>
              <code>{pts}</code>
            </li>
          ))}
        </ul>
        <div className="lv-acts">
          <span className="lv-btn ghost">Approve</span>
          <span className="lv-btn dark" data-t="hold" data-done={held || undefined}>
            {held ? "Held" : "Hold order"}
          </span>
        </div>
      </div>
      <Cursor who="edith" at={c.at} press={c.press} />
    </Stage>
  )
}

/* ───────────── Courier: Imran picks three orders and sends them to Steadfast ───────────── */
const PARCELS = [
  ["#4101", "Rahim A.", "Mirpur 10", "SF-81203"],
  ["#4102", "Nusrat J.", "Dhanmondi", "SF-81204"],
  ["#4104", "Tanvir H.", "Agrabad", "SF-81205"],
]
export function SceneCourier(p: SceneProps) {
  const c = useCursor({ x: -30, y: 300, abs: true })
  const [sel, setSel] = useState<boolean[]>([false, false, false])
  const [sent, setSent] = useState(0)
  const [sending, setSending] = useState(false)
  const [fade, setFade] = useState(false)
  useLoop(p.on, async (wait) => {
    setFade(false)
    await wait(500)
    for (let i = 0; i < 3; i++) {
      c.setAt({ t: `chk${i}`, x: 0.6, y: 0.7 })
      await wait(i ? 560 : 950)
      await c.click(wait)
      setSel((s) => s.map((v, j) => (j === i ? true : v)))
    }
    c.setAt({ t: "send", x: 0.62, y: 0.68 })
    await wait(900)
    await c.click(wait)
    setSending(true)
    c.setAt({ x: 300, y: 250, abs: true })
    for (let i = 1; i <= 3; i++) {
      await wait(380)
      setSent(i)
    }
    setSending(false)
    p.onEvent?.({ who: "imran", text: "sent 3 parcels to Steadfast" })
    await wait(2200)
    c.setAt({ x: -30, y: 300, abs: true })
    await wait(700)
    await finish(p, wait)
    setFade(true)
    await wait(260)
    setSel([false, false, false])
    setSent(0)
  })
  const n = sel.filter(Boolean).length
  return (
    <Stage width={W} height={H} max={p.max} className="lv-scene">
      <div className="lv-body lv-courier" data-fade={fade || undefined}>
        <div className="lv-tool">
          <div>
            <p className="lv-eyebrow">Confirmed</p>
            <p className="lv-h">Ready to ship</p>
          </div>
          <span className="lv-btn dark lv-send" data-t="send" data-off={!n || undefined}>
            <span className="lv-sf">S</span>
            Send to Steadfast{n ? ` (${n})` : ""}
          </span>
        </div>
        <div className="lv-list">
          {PARCELS.map(([id, name, area, cn], i) => {
            const done = i < sent
            return (
              <div className="lv-row" key={id} data-sel={sel[i] || undefined}>
                <span className="lv-chk" data-t={`chk${i}`} data-on={sel[i] || undefined}>
                  <svg viewBox="0 0 12 12" width="10" height="10">
                    <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="lv-cell">
                  <b>{name}</b>
                  <small>
                    {id} · {area}
                  </small>
                </span>
                <span key={done ? "d" : sending && sel[i] ? "s" : "c"} className={`lv-pill lv-swap ${done ? "indigo" : "sky"}`}>
                  {done ? cn : sending && sel[i] ? "Sending…" : "Confirmed"}
                </span>
              </div>
            )
          })}
        </div>
        <div className="lv-foot" data-on={sent === 3 || undefined}>
          <span className="lv-dotlive" />3 parcels booked · pickup tomorrow 11am
        </div>
      </div>
      <Cursor who="imran" at={c.at} press={c.press} />
    </Stage>
  )
}

/* ───────────── Profit: Sadia scrubs the week, the headline rolls to the day under her ───────────── */
const DAYS = [
  ["Sat", 28400],
  ["Sun", 31900],
  ["Mon", 30200],
  ["Tue", 36800],
  ["Wed", 35100],
  ["Thu", 41200],
  ["Fri", 46900],
] as const
export function SceneProfit(p: SceneProps) {
  const c = useCursor({ x: 470, y: 120, abs: true })
  const [day, setDay] = useState<number | null>(null)
  useLoop(p.on, async (wait) => {
    await wait(500)
    for (const i of [1, 3, 5, 6]) {
      c.setAt({ t: `bar${i}`, x: 0.5, y: 0.35 })
      await wait(i === 1 ? 1000 : 700)
      setDay(i)
      await wait(i === 6 ? 300 : 650)
    }
    p.onEvent?.({ who: "sadia", text: "checked profit · Friday ৳46,900" })
    await wait(2000)
    c.setAt({ x: 470, y: 120, abs: true })
    setDay(null)
    await wait(1200)
    await finish(p, wait)
  })
  const total = DAYS.reduce((a, d) => a + d[1], 0)
  const v = day === null ? total : DAYS[day][1]
  return (
    <Stage width={W} height={H} max={p.max} className="lv-scene">
      <div className="lv-body lv-profit">
        <div className="lv-strip">
          {[
            ["Total sales", "৳9,84,200", "+18%"],
            ["Orders", "512", "+12%"],
            ["Returns", "3.1%", "−0.8%"],
          ].map(([l, val, ch]) => (
            <div key={l}>
              <span>{l}</span>
              <b>{val}</b>
              <em>{ch}</em>
            </div>
          ))}
        </div>
        <div className="lv-chart">
          <p className="lv-sub">{day === null ? "Net profit this week" : `Net profit · ${DAYS[day][0]}`}</p>
          <p className="lv-big">
            <NumberFlow value={v} prefix="৳" locales="en-IN" className="lv-num" />
          </p>
          <div className="lv-bars">
            {DAYS.map(([d, val], i) => (
              <span key={d} data-t={`bar${i}`} data-on={day === i || undefined}>
                <i style={{ height: `${(val / 46900) * 150}px` }} />
                <small>{d}</small>
              </span>
            ))}
          </div>
          <span className="lv-hair" style={{ opacity: day === null ? 0 : 1, transform: `translateX(${(day ?? 0) * 54 + 27}px)` }} />
        </div>
      </div>
      <Cursor who="sadia" at={c.at} press={c.press} />
    </Stage>
  )
}

/* ───────────── Ask Edith: Joya asks in Bangla, Edith answers and offers an action ───────────── */
const QUESTION = "আজকে কয়টা অর্ডার রিটার্ন হয়েছে?"
const ANSWER = "Today 4 orders came back. 2 are from the same customer in Chattogram, who has 3 returns this month."
export function SceneAsk(p: SceneProps) {
  const c = useCursor({ x: 470, y: 330, abs: true })
  const [typed, setTyped] = useState(0)
  const [sentQ, setSentQ] = useState(false)
  const [think, setThink] = useState(false)
  const [words, setWords] = useState(0)
  const [acted, setActed] = useState(false)
  const [fade, setFade] = useState(false)
  const ans = ANSWER.split(" ")
  useLoop(p.on, async (wait) => {
    setFade(false)
    await wait(400)
    c.setAt({ t: "input", x: 0.3, y: 0.62 })
    await wait(950)
    await c.click(wait)
    c.setAt({ x: 470, y: 330, abs: true })
    for (let i = 1; i <= QUESTION.length; i++) {
      setTyped(i)
      await wait(55)
    }
    await wait(250)
    setSentQ(true)
    setTyped(0)
    setThink(true)
    await wait(900)
    setThink(false)
    for (let i = 1; i <= ans.length; i++) {
      setWords(i)
      await wait(70)
    }
    await wait(500)
    c.setAt({ t: "act", x: 0.82, y: 0.66 })
    await wait(1000)
    await c.click(wait)
    setActed(true)
    p.onEvent?.({ who: "joya", text: "asked Edith · held that customer’s next order" })
    await wait(2200)
    c.setAt({ x: 470, y: 330, abs: true })
    await wait(600)
    await finish(p, wait)
    setFade(true)
    await wait(260)
    setSentQ(false)
    setWords(0)
    setActed(false)
  })
  return (
    <Stage width={W} height={H} max={p.max} className="lv-scene">
      <div className="lv-body lv-ask" data-fade={fade || undefined}>
        <div className="lv-thread">
          <span className="lv-me" data-on={sentQ || undefined}>
            {QUESTION}
          </span>
          <span className="lv-think" data-on={think || undefined}>
            <i />
            <i />
            <i />
          </span>
          <div className="lv-it" data-on={words > 0 || undefined}>
            <span className="lv-eyebrow">Edith</span>
            <p>
              {ans.slice(0, words).join(" ")}
            </p>
            {words === ans.length && (
              <span className="lv-btn dark sm" data-t="act" data-done={acted || undefined}>
                {acted ? "Held ✓" : "Hold their next order"}
              </span>
            )}
          </div>
        </div>
        <div className="lv-askbar">
          <div className="lv-askbar-in" data-t="input">
            <span className="lv-badge">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M12 3c.6 4.5 2.5 6.4 7 7-4.5.6-6.4 2.5-7 7-.6-4.5-2.5-6.4-7-7 4.5-.6 6.4-2.5 7-7z" />
              </svg>
            </span>
            <span className="lv-typed">
              {typed ? QUESTION.slice(0, typed) : <span className="lv-ph">Ask Edith anything about your orders</span>}
              {typed > 0 && <span className="lv-caret" />}
            </span>
            <span className="lv-go" data-on={typed > 0 || undefined}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </span>
          </div>
        </div>
      </div>
      <Cursor who="joya" at={c.at} press={c.press} />
    </Stage>
  )
}

/* ───────────── Landing pages: our real pages on Apple's iPhone 18 Pro, in the approved blue studio.
   The page scrolls under its fixed order dock (it rises once you scroll, like on the live sites);
   Sadia taps the dock's order button; the order arrives as a notification; the next site comes up. ───────────── */
const SITES = [
  { k: "ml", brand: "Mango Lover", path: "/khejurer-gur", top: "rgb(244 238 227)", mark: "#f07a1a", amt: "৳1,250", scrolls: [1150, 1900] },
  { k: "sk", brand: "Sera Khabar", path: "/step/khejurer-gur", top: "rgb(251 244 232)", mark: "#0f5c34", amt: "৳980", scrolls: [1000, 1750] },
  { k: "mlp", brand: "Mango Lover", path: "/premium-khejurer-gur", top: "rgb(247 240 227)", mark: "#d99a1e", amt: "৳2,150", scrolls: [1250, 2050] },
]
const PK = 0.372 // phone scale: 920pt tall bezel → 342px
export function SceneSite(p: SceneProps) {
  const c = useCursor({ x: 480, y: 330, abs: true })
  const [front, setFront] = useState(0)
  const [scroll, setScroll] = useState<{ y: number; ms: number }>({ y: 0, ms: 0 })
  const [tap, setTap] = useState(false)
  const [note, setNote] = useState(false)
  const [swap, setSwap] = useState(false)
  const order = useRef(4110)
  const frontRef = useRef(front)
  frontRef.current = front
  useLoop(p.on, async (wait) => {
    const site = SITES[frontRef.current]
    await wait(900)
    setScroll({ y: site.scrolls[0], ms: 2600 })
    await wait(3000)
    setScroll({ y: site.scrolls[1], ms: 1500 })
    await wait(1600)
    c.setAt({ t: "dockcta", x: 0.62, y: 0.62 })
    await wait(1050)
    await c.click(wait)
    setTap(true)
    await wait(240)
    setTap(false)
    setNote(true)
    p.onEvent?.({ who: "sadia", text: `got order #${order.current} from ${site.brand}` })
    await wait(450)
    c.setAt({ x: 480, y: 330, abs: true })
    await wait(2200)
    setNote(false)
    await wait(350)
    setSwap(true)
    await wait(320)
    order.current++
    setScroll({ y: 0, ms: 0 })
    setFront((f) => (f + 1) % SITES.length)
    await wait(60)
    setSwap(false)
    await wait(300)
    await finish(p, wait)
  })
  const site = SITES[front]
  const docked = scroll.y > 200
  return (
    <Stage width={W} height={H} max={p.max} className="lv-scene lv-studio-scene">
      <div className="lv-studio">
        <i className="lv-floor" />
        <i className="lv-cast" />
        <div className="lv-i18" style={{ transform: `translate(64px, 22px) scale(${PK})` }}>
          <i className="lv-i18-body" />
          <div className="lv-i18-screen" data-swap={swap || undefined}>
            <div className="lv-i18-status" style={{ background: site.top }}>
              <img src="/pricing/statusbar.png" alt="" draggable={false} />
            </div>
            <div className="lv-i18-view">
              <img
                className="lv-i18-page"
                src={`/pricing/page-${site.k}.jpg`}
                alt=""
                draggable={false}
                style={{ transform: `translateY(${-scroll.y}px)`, transitionDuration: `${scroll.ms}ms` }}
              />
              <div className="lv-i18-dock" data-on={docked || undefined} data-tap={tap || undefined}>
                <img src={`/pricing/dock-${site.k}.png`} alt="" draggable={false} />
                <span className="lv-i18-cta" data-t="dockcta" />
              </div>
            </div>
          </div>
          <img className="lv-i18-bezel" src="/pricing/iphone18-black.png" alt="" draggable={false} />
        </div>
        <ul className="lv-sites">
          {SITES.map((x, i) => (
            <li key={x.k} data-on={i === front || undefined}>
              <span className="lv-fav" style={{ background: x.mark }}>
                {x.brand[0]}
              </span>
              <span className="lv-site-t">
                <b>{x.brand}</b>
                <small>{x.path}</small>
              </span>
              <i className="lv-site-bar">
                <i key={`${i}-${front}`} data-run={i === front && p.on ? "" : undefined} />
              </i>
            </li>
          ))}
        </ul>
        <div className="lv-note" data-on={note || undefined}>
          <span className="lv-note-ico">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="lv-note-t">
            <span>
              <b>New order #{order.current}</b>
              <small>now</small>
            </span>
            <span>
              {site.brand} · {site.amt}
            </span>
          </span>
        </div>
      </div>
      <Cursor who="sadia" at={c.at} press={c.press} />
    </Stage>
  )
}

/* ───────────── Order flow: an order from the landing page lands in Pending; three teammates
   each drag it on to the next tab. It shrinks into the tab, the counts roll, the tab opens
   to show it arrived. ───────────── */
type Tab = "pending" | "confirmed" | "print" | "transit"
type FRow = { id: number; name: string; area: string; amt: string; src?: string; cn?: string; by?: Who }
const FTABS: { k: Tab; label: string; dot: string }[] = [
  { k: "pending", label: "Pending", dot: "#fbbf24" },
  { k: "confirmed", label: "Confirmed", dot: "#0ea5e9" },
  { k: "print", label: "Print", dot: "#84cc16" },
  { k: "transit", label: "In-Transit", dot: "#6366f1" },
]
const FPILL: Record<Tab, [string, string]> = { pending: ["Pending", "amber"], confirmed: ["Confirmed", "sky"], print: ["Print", "lime"], transit: ["In-Transit", "indigo"] }
const BUYERS = [
  ["Mehedi H.", "Uttara", "৳2,150"],
  ["Farhana R.", "Banani", "৳1,250"],
  ["Sabbir A.", "Sylhet", "৳980"],
]
const FROW = 58
const MOVES: { from: Tab; to: Tab; who: Who }[] = [
  { from: "pending", to: "confirmed", who: "sadia" },
  { from: "confirmed", to: "print", who: "joya" },
  { from: "print", to: "transit", who: "imran" },
]
const AWAY: Record<"sadia" | "joya" | "imran", Aim> = {
  sadia: { x: -110, y: 300, abs: true },
  joya: { x: 480, y: 330, abs: true },
  imran: { x: 480, y: 160, abs: true },
}
export function SceneFlow(p: SceneProps) {
  const body = useRef<HTMLDivElement>(null)
  const [tab, setTab] = useState<Tab>("pending")
  const [lists, setLists] = useState<Record<Tab, FRow[]>>({
    pending: [
      { id: 4107, name: "Karim U.", area: "Gazipur", amt: "৳1,990" },
      { id: 4106, name: "Lamia K.", area: "Mohammadpur", amt: "৳1,480" },
    ],
    confirmed: [
      { id: 4103, name: "Nusrat J.", area: "Dhanmondi", amt: "৳1,330" },
      { id: 4102, name: "Rahim A.", area: "Mirpur 10", amt: "৳2,480" },
    ],
    print: [
      { id: 4101, name: "Sumaiya B.", area: "Mirpur 2", amt: "৳980" },
      { id: 4098, name: "Rafiq S.", area: "Khulna", amt: "৳1,640" },
    ],
    transit: [
      { id: 4100, name: "Habib R.", area: "Narayanganj", amt: "৳3,120", cn: "SF-81194" },
      { id: 4099, name: "Tania M.", area: "Bashundhara", amt: "৳1,760", cn: "SF-81193" },
    ],
  })
  const [counts, setCounts] = useState<Record<Tab, number>>({ pending: 17, confirmed: 41, print: 12, transit: 186 })
  const [at, setAt] = useState<Record<"sadia" | "joya" | "imran", Aim>>(AWAY)
  const [press, setPress] = useState({ sadia: 0, joya: 0, imran: 0 })
  const [ghost, setGhost] = useState<{ row: FRow; tab: Tab; x: number; y: number; ox: number; oy: number; s: number; o: number; by: Who } | null>(null)
  const [hover, setHover] = useState<Tab | null>(null)
  const [lifted, setLifted] = useState<number | null>(null)
  const [fresh, setFresh] = useState<number | null>(null)
  const seq = useRef({ id: 4110, buyer: 0, cn: 81206 })

  // Layout positions in design px (offsets are unaffected by the stage's scale)
  const pos = (t: string) => {
    const root = body.current
    let el = root?.querySelector<HTMLElement>(`[data-t="${t}"]`) ?? null
    if (!root || !el) return { x: 0, y: 0, w: 0, h: 0 }
    const w = el.offsetWidth
    const h = el.offsetHeight
    let x = 0
    let y = 0
    while (el && el !== root) {
      x += el.offsetLeft
      y += el.offsetTop
      el = el.offsetParent as HTMLElement | null
    }
    return { x, y, w, h }
  }

  useLoop(p.on, async (wait) => {
    const s = seq.current
    const [name, area, amt] = BUYERS[s.buyer++ % BUYERS.length]
    let row: FRow = { id: s.id++, name, area, amt, src: "mangolover.com.bd" }
    setTab("pending")
    await wait(700)
    setLists((l) => ({ ...l, pending: [row, ...l.pending].slice(0, 3) }))
    setCounts((c) => ({ ...c, pending: c.pending + 1 }))
    setFresh(row.id)
    p.onEvent?.({ who: "sadia", text: `new order #${row.id} from the landing page` })
    await wait(1300)

    for (const m of MOVES) {
      const who = m.who as "sadia" | "joya" | "imran"
      const g = pos(`grip-${row.id}`)
      const r = pos(`row-${row.id}`)
      const cx = g.x + g.w * 0.5
      const cy = g.y + g.h * 0.6
      setAt((a) => ({ ...a, [who]: { x: cx, y: cy, abs: true } }))
      await wait(1000)
      setPress((q) => ({ ...q, [who]: q[who] + 1 }))
      setFresh(null)
      setLifted(row.id)
      setGhost({ row, tab: m.from, x: r.x, y: r.y, ox: cx - r.x, oy: cy - r.y, s: 1, o: 1, by: m.who })
      await wait(220)
      const t = pos(`tab-${m.to}`)
      const tx = t.x + t.w * 0.5
      const ty = t.y + t.h * 0.55
      setAt((a) => ({ ...a, [who]: { x: tx, y: ty, abs: true } }))
      setGhost((gh) => gh && { ...gh, x: tx - gh.ox, y: ty - gh.oy, s: 0.42 })
      await wait(800)
      setHover(m.to)
      await wait(300)
      setPress((q) => ({ ...q, [who]: q[who] + 1 }))
      setGhost((gh) => gh && { ...gh, s: 0.12, o: 0 })
      const moved: FRow = { ...row, src: undefined, by: m.who, cn: m.to === "transit" ? `SF-${s.cn++}` : undefined }
      setLists((l) => ({ ...l, [m.from]: l[m.from].filter((x) => x.id !== row.id), [m.to]: [moved, ...l[m.to]].slice(0, 3) }))
      setCounts((c) => ({ ...c, [m.from]: c[m.from] - 1, [m.to]: c[m.to] + 1 }))
      setLifted(null)
      row = moved
      await wait(260)
      setHover(null)
      setGhost(null)
      setTab(m.to)
      setFresh(row.id)
      setAt((a) => ({ ...a, [who]: AWAY[who] }))
      const verb = m.to === "confirmed" ? "confirmed" : m.to === "print" ? "printed the label for" : "handed to Steadfast"
      p.onEvent?.({ who: m.who, text: `${verb} #${row.id}` })
      await wait(1150)
    }
    await wait(1400)
    setFresh(null)
    await finish(p, wait)
  })

  const rows = lists[tab]
  const pill = (t: Tab, r: FRow) => (t === "transit" && r.cn ? r.cn : FPILL[t][0])
  return (
    <Stage width={W} height={H} max={p.max} className="lv-scene">
      <div className="lv-body lv-flow" ref={body}>
        <div className="lv-ftabs" style={{ ["--t" as string]: FTABS.findIndex((x) => x.k === tab) } as CSSProperties}>
          <span className="lv-ftabs-thumb" />
          {FTABS.map((t) => (
            <span key={t.k} className="lv-ftab" data-t={`tab-${t.k}`} data-sel={tab === t.k || undefined} data-hover={hover === t.k || undefined} style={ghost && hover === t.k ? ({ ["--who" as string]: PEOPLE[ghost.by].color } as CSSProperties) : undefined}>
              <b>
                <NumberFlow value={counts[t.k]} className="lv-num" />
              </b>
              <small>
                <i style={{ background: t.dot }} />
                {t.label}
              </small>
            </span>
          ))}
        </div>
        <div className="lv-flist" key={tab}>
          {rows.map((r, i) => (
            <div
              key={r.id}
              className="lv-frow"
              data-t={`row-${r.id}`}
              data-lifted={lifted === r.id || undefined}
              data-fresh={fresh === r.id || undefined}
              style={{ transform: `translateY(${i * FROW}px)`, ["--who" as string]: r.by ? PEOPLE[r.by].color : "#12a150" } as CSSProperties}
            >
              <FRowInner r={r} pill={pill(tab, r)} tone={FPILL[tab][1]} />
            </div>
          ))}
        </div>
        {ghost && (
          <div
            className="lv-frow lv-ghost"
            style={{ transform: `translate(${ghost.x}px, ${ghost.y}px) scale(${ghost.s})`, transformOrigin: `${ghost.ox}px ${ghost.oy}px`, opacity: ghost.o, ["--who" as string]: PEOPLE[ghost.by].color } as CSSProperties}
          >
            <FRowInner r={ghost.row} pill={pill(ghost.tab, ghost.row)} tone={FPILL[ghost.tab][1]} />
          </div>
        )}
      </div>
      {(["sadia", "joya", "imran"] as const).map((w) => (
        <Cursor key={w} who={w} at={at[w]} press={press[w]} />
      ))}
    </Stage>
  )
}
function FRowInner({ r, pill, tone }: { r: FRow; pill: string; tone: string }) {
  return (
    <>
      <span className="lv-grip" data-t={`grip-${r.id}`}>
        <svg viewBox="0 0 10 16" width="8" height="13">
          {[3, 8, 13].flatMap((y) => [2.5, 7.5].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill="currentColor" />))}
        </svg>
      </span>
      <span className="lv-cell">
        <b>
          {r.name} <span className="lv-fid">#{r.id}</span>
        </b>
        <small>{r.src ? <span className="lv-src">● {r.src}</span> : `${r.area} · ${r.amt}`}</small>
      </span>
      <span key={pill} className={`lv-pill lv-swap ${tone}`}>
        {pill}
      </span>
    </>
  )
}

export const SCENES = [
  { key: "site", title: "Your own landing page", body: "Pages like these, built by us for Mango Lover and Sera Khabar. Every order from them lands straight in your queue.", Scene: SceneSite, who: "sadia" as Who },
  { key: "flow", title: "Orders from your landing page", body: "Every order lands in one queue. Your team moves it from pending to confirmed to printed to shipped.", Scene: SceneFlow, who: "sadia" as Who },
  { key: "protect", title: "Fake orders held", body: "Every order is checked before it ships. Risky ones are held, with the reason in plain words.", Scene: SceneProtect, who: "edith" as Who },
  { key: "courier", title: "Courier in one click", body: "Pick the confirmed orders and send them to Steadfast or Pathao in one go.", Scene: SceneCourier, who: "imran" as Who },
  { key: "ask", title: "Ask Edith", body: "Ask in Bangla or English. Edith answers from your orders and can act on them.", Scene: SceneAsk, who: "joya" as Who },
  { key: "profit", title: "Profit, live", body: "Sales, costs, returns and ads worked into one profit number, every day.", Scene: SceneProfit, who: "sadia" as Who },
] as const

export const swapStyle = (who: string) => ({ ["--who" as string]: who }) as CSSProperties
