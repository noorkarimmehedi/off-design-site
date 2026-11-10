"use client"

import { Fragment, useRef, useState, type FormEvent, type ReactNode } from "react"
import { TextShimmer } from "@/components/ui/shimmer-text"

// Last FAQ row: "Ask anything else" turns into an input in place, and the answer streams in below it.
// Answers come from /api/ask as plain text; URLs, emails and paragraph breaks are rendered here.
const LINK = /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"]|[\w.+-]+@[\w-]+\.[\w.-]*\w)/g

function linkify(text: string): ReactNode[] {
  return text.split(LINK).map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>
    const href = part.includes("@") && !part.startsWith("http") ? `mailto:${part}` : part
    const external = href.startsWith("http") && !href.includes("arc-bangladesh.com")
    return (
      <a key={i} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {part}
      </a>
    )
  })
}

export default function FaqAsk({ id }: { id: string }) {
  const [editing, setEditing] = useState(false)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "streaming" | "error" | "limited">("idle")
  const [daily, setDaily] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const abort = useRef<AbortController | null>(null)

  const open = () => {
    setEditing(true)
    requestAnimationFrame(() => input.current?.focus())
  }

  async function ask(e: FormEvent) {
    e.preventDefault()
    const q = question.trim()
    if (!q || status === "loading") return
    abort.current?.abort()
    const ctrl = new AbortController()
    abort.current = ctrl
    setAnswer("")
    setStatus("loading")
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
        signal: ctrl.signal,
      })
      if (res.status === 429) {
        // A short wait means the per-minute burst limit; a long one means the daily cap
        setDaily(Number(res.headers.get("Retry-After")) > 120)
        setStatus("limited")
        return
      }
      if (!res.ok || !res.body) throw new Error(await res.text())
      setStatus("streaming")
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let text = ""
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setAnswer(text)
      }
      if (!text.trim()) throw new Error("empty")
      setStatus("idle")
    } catch (err) {
      if ((err as Error).name === "AbortError") return
      setStatus("error")
    }
  }

  const shown = answer || status === "loading" || status === "error" || status === "limited"

  return (
    <div className="qa ask" data-open={shown ? "" : undefined}>
      {editing ? (
        <form className="ask-row" onSubmit={ask}>
          <label htmlFor={`${id}-ask`} className="sr-only">
            Ask a question
          </label>
          <input
            ref={input}
            id={`${id}-ask`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onBlur={() => !question && !shown && setEditing(false)}
            onKeyDown={(e) => e.key === "Escape" && !question && setEditing(false)}
            maxLength={400}
            placeholder="Ask anything else"
            autoComplete="off"
            enterKeyHint="send"
          />
          <button type="submit" className="ask-send" aria-label="Send question" disabled={!question.trim() || status === "loading"}>
            <Arrow />
          </button>
        </form>
      ) : (
        <button type="button" className="ask-row ask-idle" onClick={open}>
          <span>Ask anything else</span>
          <Arrow />
        </button>
      )}
      <div className="ans" aria-live="polite">
        <div>
          {status === "loading" && (
            <p className="ask-wait">
              <TextShimmer as="span" duration={1.6}>
                Thinking…
              </TextShimmer>
            </p>
          )}
          {status === "error" && (
            <p>
              Something went wrong. Try again, or email <a href="mailto:hello@arc-bangladesh.com">hello@arc-bangladesh.com</a>.
            </p>
          )}
          {status === "limited" && (
            <p>
              {daily ? "You’ve reached today’s question limit." : "That’s a lot of questions at once. Give it a minute, or"}{" "}
              <a href="/call">{daily ? "Book" : "book"} a free 15-minute call</a> and ask us directly.
            </p>
          )}
          {answer &&
            status !== "error" &&
            status !== "limited" &&
            answer
              .split(/\n\s*\n/)
              .filter((p) => p.trim())
              .map((p, i) => <p key={i}>{linkify(p.trim())}</p>)}
        </div>
      </div>
    </div>
  )
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
