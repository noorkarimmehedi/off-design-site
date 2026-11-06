"use client"

import { useEffect, useRef, useState } from "react"
import "./install-command.css"

// The install line: one row that never wraps (a long command scrolls and fades at the edge),
// and a copy button whose icon morphs into a check while the label rolls from Copy to Copied.
export default function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
    } catch {
      // No clipboard access: select the text so the person can copy it themselves
      const range = document.createRange()
      if (codeRef.current) range.selectNodeContents(codeRef.current)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="ic" data-copied={copied ? "" : undefined}>
      <code ref={codeRef} className="ic-code" tabIndex={0}>
        <span className="ic-prompt" aria-hidden="true">
          ${" "}
        </span>
        {command}
      </code>
      <button type="button" className="ic-btn" onClick={copy} aria-label={copied ? "Copied" : "Copy install command"}>
        <span className="ic-icon" aria-hidden="true">
          <svg className="ic-copy" viewBox="0 0 16 16" width="15" height="15">
            <rect x="5.25" y="5.25" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.75 2.75v-.25A1.75 1.75 0 0 0 9 .75H4A1.75 1.75 0 0 0 2.25 2.5V7c0 .97.78 1.75 1.75 1.75h.25" fill="none" stroke="currentColor" strokeWidth="1.5" transform="translate(0 1.5)" />
          </svg>
          <svg className="ic-check" viewBox="0 0 16 16" width="15" height="15">
            <path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
          </svg>
        </span>
        <span className="ic-label" aria-hidden="true">
          <span>Copy</span>
          <span>Copied</span>
        </span>
      </button>
      <span className="ic-live" role="status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  )
}
