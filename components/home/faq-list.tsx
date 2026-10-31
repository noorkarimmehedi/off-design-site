"use client"

import { useState } from "react"
import { faqs } from "@/lib/home"

export default function FaqList() {
  const [open, setOpen] = useState<Set<number>>(new Set())
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  return (
    <div className="faq rv">
      {faqs.map((f, i) => {
        const isOpen = open.has(i)
        return (
          <div className="qa" key={f.q} data-open={isOpen ? "" : undefined}>
            <button id={`ah-q${i}`} aria-expanded={isOpen} aria-controls={`ah-a${i}`} onClick={() => toggle(i)}>
              <span>{f.q}</span>
              <i className="plus" aria-hidden="true" />
            </button>
            <div className="ans" id={`ah-a${i}`} role="region" aria-labelledby={`ah-q${i}`}>
              <div>
                <p>{f.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
