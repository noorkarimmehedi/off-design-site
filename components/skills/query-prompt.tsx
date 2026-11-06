"use client"

import { useEffect, useRef, useState } from "react"
import "./query-prompt.css"

// An HTML copy of query's floating prompt (PromptView.swift): a 400pt black card, radius 30,
// fingerprint badge, "n of m" counter, one 46pt field per key and a capsule send button.
// The indigo aura behind it stands in for the Metal smoke.

const FP =
  "M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41c-.24.13-.54.04-.68-.2a.506.506 0 0 1 .2-.68C7.82 2.52 9.86 2 12.010 2c2.13 0 3.99.47 6.03 1.52c.25.13.34.43.21.67a.49.49 0 0 1-.44.28M3.5 9.72a.499.499 0 0 1-.41-.79c.99-1.4 2.250-2.5 3.75-3.27C9.98 4.04 14 4.030 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25a.5.5 0 0 1-.12.7c-.23.16-.54.11-.7-.12a9.4 9.4 0 0 0-3.39-2.94c-2.87-1.47-6.54-1.47-9.4.01c-1.36.7-2.5 1.7-3.4 2.96c-.08.14-.23.21-.39.21m6.25 12.07a.47.47 0 0 1-.35-.15c-.87-.87-1.34-1.43-2.01-2.64c-.69-1.23-1.05-2.73-1.05-4.34c0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39s-4.66 1.97-4.66 4.39c0 1.44.32 2.77.93 3.85c.64 1.15 1.08 1.64 1.85 2.42c.19.2.19.51 0 .71c-.11.1-.24.15-.37.15m7.17-1.85c-1.19 0-2.24-.3-3.1-.89c-1.49-1.01-2.38-2.65-2.38-4.39c0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56c.71.48 1.54.71 2.54.71c.24 0 .64-.03 1.04-.1c.27-.05.53.13.58.41c.05.27-.13.53-.41.58c-.57.11-1.07.12-1.21.12M14.91 22c-.04 0-.09-.01-.13-.02c-1.59-.44-2.630-1.03-3.72-2.1a7.3 7.3 0 0 1-2.17-5.22c0-1.62 1.38-2.94 3.08-2.94s3.08 1.32 3.08 2.94c0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.830c-2.84 0-5.44 1.58-6.61 4.03c-.39.81-.59 1.76-.59 2.8c0 .78.07 2.01.67 3.61c.1.26-.03.55-.29.64c-.26.1-.55-.04-.64-.29a11.1 11.1 0 0 1-.73-3.96c0-1.2.23-2.29.68-3.24c1.33-2.79 4.28-4.6 7.51-4.6c4.55 0 8.25 3.51 8.25 7.83c0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.870 4.51c.95.94 1.86 1.46 3.27 1.85c.27.07.42.35.35.61c-.05.23-.26.38-.47.38"

type Key = { name: string; value: string }

export default function QueryPrompt({
  requester = "claude",
  reason = "Run the checkout tests",
  keys = [{ name: "STRIPE_SECRET_KEY", value: "sk_test_51Hx8Jq2mX7vLr0sKp4Tz" }],
  action = "Send to npm",
  autoplay = true,
  aura = true,
}: {
  requester?: string
  reason?: string
  keys?: Key[]
  action?: string
  autoplay?: boolean
  aura?: boolean
}) {
  // Types each value in, holds, clears, repeats, so the counter and button change state
  const [typed, setTyped] = useState<number[]>(() => keys.map((k) => (autoplay ? 0 : k.value.length)))
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!autoplay) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(keys.map((k) => k.value.length))
      return
    }
    let i = 0
    let c = 0
    const step = () => {
      if (i >= keys.length) {
        timer.current = setTimeout(() => {
          i = 0
          c = 0
          setTyped(keys.map(() => 0))
          timer.current = setTimeout(step, 900)
        }, 2600)
        return
      }
      c++
      setTyped((t) => t.map((v, j) => (j === i ? c : v)))
      if (c >= keys[i].value.length) {
        i++
        c = 0
        timer.current = setTimeout(step, 420)
      } else timer.current = setTimeout(step, 45 + Math.random() * 50)
    }
    timer.current = setTimeout(step, 1100)
    return () => clearTimeout(timer.current)
  }, [autoplay, keys])

  const filled = typed.filter((n, j) => n > 0 && n >= keys[j].value.length).length
  const complete = filled === keys.length
  const active = typed.findIndex((n, j) => n < keys[j].value.length)
  const focus = active === -1 ? keys.length - 1 : active

  return (
    <div className={`qp-stage${aura ? " qp-aura" : ""}`}>
      {aura && <div className="qp-light" aria-hidden="true" />}
      <div className="qp-card" role="img" aria-label={`query prompt: ${requester} needs ${keys.length} value`}>
        <div className="qp-head">
          <span className="qp-badge">
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <path d={FP} fill="currentColor" />
            </svg>
          </span>
          <span className="qp-titles">
            <span className="qp-title">
              {requester} needs {keys.length} {keys.length === 1 ? "value" : "values"}
            </span>
            <span className="qp-sub">{reason}</span>
          </span>
          <span className="qp-count">
            {filled} of {keys.length}
          </span>
          <span className="qp-x" aria-hidden="true">
            <svg viewBox="0 0 10 10" width="8" height="8">
              <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
        </div>

        {keys.map((k, j) => (
          <div className="qp-field" data-focus={j === focus ? "" : undefined} key={k.name}>
            <span className="qp-key">{k.name}</span>
            <span className="qp-val">
              {"•".repeat(Math.min(typed[j], 24))}
              {j === focus && !complete && <i className="qp-caret" />}
            </span>
            <svg className="qp-eye" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path
                d="M1.5 12S5.5 4.5 12 4.5 22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          </div>
        ))}

        <span className="qp-send" data-ready={complete ? "" : undefined}>
          {action}
        </span>
      </div>
    </div>
  )
}
