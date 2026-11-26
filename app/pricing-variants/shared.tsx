"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import NumberFlow from "@number-flow/react"
import FaqList from "@/components/home/faq-list"
import { STOPS, ordersAt, positionOf, quote } from "./pricing"

const fmtK = (n: number) => (n >= 1000 ? `${n / 1000}k` : String(n))

export function usePricing(start: number) {
  const [orders, setOrders] = useState(start)
  const [yearly, setYearly] = useState(false)
  return { orders, setOrders, yearly, setYearly, q: quote(orders, yearly) }
}

export function Price({ value, className = "" }: { value: number; className?: string }) {
  return <NumberFlow value={value} locales="en-IN" prefix="৳" className={`num ${className}`} />
}

export function Count({ value }: { value: number }) {
  return (
    <>
      <NumberFlow value={value} locales="en-IN" className="num" />
      {value >= STOPS[STOPS.length - 1] ? "+" : ""}
    </>
  )
}

/* Orders slider. `ruler` draws fine tick marks under the track. Styled per variant through tokens. */
export function OrderSlider({
  orders,
  setOrders,
  id,
  label = true,
  ruler = false,
}: {
  orders: number
  setOrders: (n: number) => void
  id: string
  label?: boolean
  ruler?: boolean
}) {
  const p = positionOf(orders)
  return (
    <div className={`ps ${ruler ? "ps-ruler" : ""}`}>
      {label && (
        <label htmlFor={id} className="ps-label">
          <span>Orders a month</span>
          <b>
            <Count value={orders} />
          </b>
        </label>
      )}
      <div className="ps-track" style={{ ["--p" as string]: p } as CSSProperties}>
        {ruler && (
          <div className="ps-rule" aria-hidden="true">
            {Array.from({ length: 51 }, (_, i) => (
              <i key={i} data-major={i % 10 === 0 ? "" : undefined} style={{ left: `${i * 2}%` }} />
            ))}
          </div>
        )}
        <input
          id={id}
          type="range"
          min={0}
          max={1000}
          value={Math.round(p * 1000)}
          onChange={(e) => setOrders(ordersAt(Number(e.target.value) / 1000))}
          aria-label={label ? undefined : "Orders a month"}
          aria-valuetext={`${orders.toLocaleString("en-IN")} orders a month`}
        />
        <div className="ps-ticks" aria-hidden="true">
          {STOPS.map((s, i) => (
            <span key={s} style={{ left: `${(i / (STOPS.length - 1)) * 100}%` }}>
              {fmtK(s)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Monthly / yearly with one thumb that slides to the chosen option */
export function Billing({ yearly, setYearly }: { yearly: boolean; setYearly: (y: boolean) => void }) {
  const box = useRef<HTMLDivElement>(null)
  const thumb = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const place = () => {
      const b = box.current?.querySelectorAll("button")[yearly ? 1 : 0]
      if (!b || !thumb.current) return
      thumb.current.style.width = `${b.offsetWidth}px`
      thumb.current.style.transform = `translateX(${b.offsetLeft}px)`
    }
    place()
    document.fonts?.ready.then(place)
  }, [yearly])
  return (
    <div className="pb" ref={box} role="radiogroup" aria-label="Billing">
      <span className="pb-thumb" ref={thumb} aria-hidden="true" />
      <button role="radio" aria-checked={!yearly} onClick={() => setYearly(false)}>
        Monthly
      </button>
      <button role="radio" aria-checked={yearly} onClick={() => setYearly(true)}>
        Yearly <em>2 months free</em>
      </button>
    </div>
  )
}

/* Horizontal rail: native scroll + snap on touch, drag-to-scroll with a mouse */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let down = false
    let moved = false
    let x0 = 0
    let s0 = 0
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return
      down = true
      moved = false
      x0 = e.clientX
      s0 = el.scrollLeft
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - x0
      if (!moved && Math.abs(dx) > 4) {
        moved = true
        el.setPointerCapture(e.pointerId)
        el.dataset.drag = ""
      }
      if (moved) el.scrollLeft = s0 - dx
    }
    const onUp = () => {
      down = false
      delete el.dataset.drag
    }
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault()
        e.stopPropagation()
        moved = false
      }
    }
    el.addEventListener("pointerdown", onDown)
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerup", onUp)
    el.addEventListener("pointercancel", onUp)
    el.addEventListener("click", onClick, true)
    return () => {
      el.removeEventListener("pointerdown", onDown)
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerup", onUp)
      el.removeEventListener("pointercancel", onUp)
      el.removeEventListener("click", onClick, true)
    }
  }, [])
  return ref
}

export function RailNav({ rail, className = "" }: { rail: React.RefObject<HTMLElement | null>; className?: string }) {
  const go = (d: number) => {
    const el = rail.current
    const card = el?.querySelector<HTMLElement>(":scope > li")
    el?.scrollBy({ left: d * ((card?.offsetWidth ?? 360) + 12), behavior: "smooth" })
  }
  return (
    <div className={`prn ${className}`}>
      <button aria-label="Previous" onClick={() => go(-1)}>
        ←
      </button>
      <button aria-label="Next" onClick={() => go(1)}>
        →
      </button>
    </div>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="/" className="plogo" aria-label="Arc Labs, home">
      <img src={light ? "/arc-logo-white.webp" : "/arc-logo-black.webp"} alt="" width={600} height={215} draggable={false} />
    </a>
  )
}

// Shortest question first, so the list reads from less to more
export const FAQ = [
  {
    q: "Is there a free trial?",
    a: "No. Instead, you get a full refund if you ask within 7 days of your first payment.",
  },
  {
    q: "Is the domain included?",
    a: "The domain is bought in your name, about ৳1,500–3,000 a year. We connect it for you.",
  },
  {
    q: "What counts as an order?",
    a: "Every order that reaches your admin panel, from your landing page or created by your team.",
  },
  {
    q: "What if I go over my plan?",
    a: "Nothing stops working. If you stay over for two months in a row, we move you to the next plan.",
  },
]

export function Faq({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <ul className={`pfaq ${className}`}>
      {FAQ.map((f, i) => (
        <li key={f.q} data-open={open === i ? "" : undefined}>
          <button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            <span>{f.q}</span>
            <i aria-hidden="true" />
          </button>
          <div className="pfaq-a">
            <div>
              <p>{f.a}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

const TALK = "Let's Talk"
function TalkArrow({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 124 104" fill="none" stroke="currentColor" strokeWidth="13" aria-hidden="true">
      <path d="M0 52h112M66 6l46 46-46 46" />
    </svg>
  )
}

/* The homepage's own ending, word for word: the FAQ split and the giant Let's Talk (styles in home.css) */
export function PageEnd() {
  return (
    <div className="pend">
      <section className="split" aria-labelledby="pr-faq">
        <h2 className="label" id="pr-faq">
          Frequently Asked Questions
        </h2>
        <FaqList items={FAQ} id="pr" />
      </section>
      <a className="talk" href="/call" aria-label="Let's talk: book a call">
        <TalkArrow className="a-in" />
        <span className="word" aria-hidden="true">
          {[...TALK].map((c, i) =>
            c === " " ? (
              " "
            ) : (
              <span className="ch" key={i} style={{ ["--i" as string]: i } as CSSProperties}>
                {c}
              </span>
            ),
          )}
        </span>
        <TalkArrow className="a-out" />
      </a>
    </div>
  )
}
