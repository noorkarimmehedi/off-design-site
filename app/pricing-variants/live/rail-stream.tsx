"use client"

import { useCallback, useRef, useState, type CSSProperties } from "react"
import { useDragScroll, RailNav } from "../shared"
import { Avatar, PEOPLE, useInView, useReduced } from "./engine"
import { SCENES, type FeedEvent } from "./scenes"

/* B · Live rail: every feature is its own small live screen on a sideways rail, each with
   one teammate's cursor at work, under a ticker of what the team just did. */
const TICKER: FeedEvent[] = [
  { who: "edith", text: "held #4109 · one device, 4 numbers" },
  { who: "sadia", text: "confirmed #4108 by phone" },
  { who: "imran", text: "sent 3 parcels to Steadfast" },
  { who: "joya", text: "asked Edith about returns" },
  { who: "sadia", text: "changed Khejur gur to ৳800" },
  { who: "edith", text: "flagged a repeat returner in Chattogram" },
  { who: "imran", text: "printed 24 shipping labels" },
]

function Card({ i }: { i: number }) {
  const [ref, on] = useInView<HTMLLIElement>(0.5)
  const reduce = useReduced()
  const { Scene, title, body, who } = SCENES[i]
  const p = PEOPLE[who]
  return (
    <li ref={ref} className="lv-card" style={{ ["--who" as string]: p.color } as CSSProperties}>
      <div className="lv-card-shot">
        <Scene on={on && !reduce} />
      </div>
      <div className="lv-card-meta">
        <span className="lv-card-who">
          <Avatar who={who} size={20} />
          {p.name}
        </span>
        <h4>{title}</h4>
        <p>{body}</p>
      </div>
    </li>
  )
}

export function LiveRail() {
  const rail = useDragScroll<HTMLUListElement>()
  return (
    <div className="lv-railwrap">
      <div className="lv-ticker" aria-label="What the team just did">
        <span className="lv-ticker-tag">
          <span className="lv-dotlive" />
          Live
        </span>
        <div className="lv-ticker-win">
          <div className="lv-ticker-track">
            {[...TICKER, ...TICKER].map((e, i) => (
              <span key={i} className="lv-tick" aria-hidden={i >= TICKER.length || undefined}>
                <i style={{ background: PEOPLE[e.who].color }} />
                <b>{PEOPLE[e.who].name}</b> {e.text}
              </span>
            ))}
          </div>
        </div>
        <RailNav rail={rail} />
      </div>
      <ul className="lv-cards" ref={rail}>
        {SCENES.map((s, i) => (
          <Card key={s.key} i={i} />
        ))}
      </ul>
    </div>
  )
}

/* C · Activity stream: one large stage plays each feature in turn; whatever the cursor does
   arrives at the top of the team's activity stream in that person's colour. Tabs jump. */
type Item = FeedEvent & { id: number }
export function LiveStream() {
  const [ref, on] = useInView<HTMLDivElement>(0.3)
  const reduce = useReduced()
  const [cur, setCur] = useState(0)
  const [run, setRun] = useState(0)
  const seq = useRef(10)
  const [items, setItems] = useState<Item[]>([
    { id: 3, who: "imran", text: "printed 24 shipping labels" },
    { id: 2, who: "sadia", text: "confirmed #4103 by phone" },
    { id: 1, who: "edith", text: "held #4099 · fake address" },
  ])
  const onEvent = useCallback((e: FeedEvent) => setItems((l) => [{ ...e, id: ++seq.current }, ...l].slice(0, 8)), [])
  const next = useCallback(() => {
    setTimeout(() => {
      setCur((c) => (c + 1) % SCENES.length)
      setRun((r) => r + 1)
    }, 200)
  }, [])
  const go = (i: number) => {
    setCur(i)
    setRun((r) => r + 1)
  }
  return (
    <div ref={ref} className="lv-stream">
      <aside className="lv-col">
        <div className="lv-col-head">
          <p className="lv-eyebrow">Team activity</p>
          <span className="lv-livepill">
            <span className="lv-dotlive" />
            Live
          </span>
        </div>
        <div className="lv-col-list">
          {items.map((e, i) => (
            <div key={e.id} className="lv-ev" style={{ transform: `translateY(${i * 66}px)`, opacity: i < 7 ? 1 - i * 0.11 : 0 }}>
              <Avatar who={e.who} size={26} />
              <span>
                <b style={{ color: PEOPLE[e.who].color }}>{PEOPLE[e.who].name}</b> {e.text}
                <small>just now</small>
              </span>
            </div>
          ))}
        </div>
      </aside>
      <div className="lv-big-stage">
        {SCENES.map(({ key, Scene }, i) => (
          <div key={key} className="lv-big-scene" data-on={i === cur || undefined}>
            {i === cur && <Scene key={run} on={on && !reduce} once onDone={next} onEvent={onEvent} max={1.25} />}
          </div>
        ))}
      </div>
      <ol className="lv-steps" role="tablist">
        {SCENES.map((x, i) => (
          <li key={x.key}>
            <button role="tab" aria-selected={i === cur} onClick={() => go(i)} style={{ ["--who" as string]: PEOPLE[x.who].color } as CSSProperties}>
              <span className="lv-step-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="lv-step-t">{x.title}</span>
              <span className="lv-step-b">
                <span>{x.body}</span>
              </span>
              <i className="lv-step-bar">
                <i key={`${i}-${run}`} data-run={i === cur && on && !reduce ? "" : undefined} />
              </i>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
