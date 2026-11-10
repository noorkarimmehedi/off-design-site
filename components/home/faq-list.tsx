"use client"

import { useState } from "react"
import { faqs } from "@/lib/home"
import FaqAsk from "./faq-ask"

// Homepage FAQ by default; /call passes its own questions with a different id prefix
export default function FaqList({ items = faqs, id = "ah" }: { items?: { q: string; a: string }[]; id?: string }) {
  const [open, setOpen] = useState<Set<number>>(new Set())
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  return (
    <div className="faq rv">
      {items.map((f, i) => {
        const isOpen = open.has(i)
        return (
          <div className="qa" key={f.q} data-open={isOpen ? "" : undefined}>
            <button id={`${id}-q${i}`} aria-expanded={isOpen} aria-controls={`${id}-a${i}`} onClick={() => toggle(i)}>
              <span>{f.q}</span>
              <i className="plus" aria-hidden="true" />
            </button>
            <div className="ans" id={`${id}-a${i}`} role="region" aria-labelledby={`${id}-q${i}`}>
              <div>
                <p>{f.a}</p>
              </div>
            </div>
          </div>
        )
      })}
      <FaqAsk id={id} />
    </div>
  )
}
