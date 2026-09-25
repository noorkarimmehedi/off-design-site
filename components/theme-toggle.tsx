"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { flushSync } from "react-dom"

const THEME_COLOR = { dark: "#000000", light: "#ffffff" } as const

// Mono "Dark / Light" switch for the header. The active word is lit by CSS
// (dark:/light: variants), so the server HTML is right before hydration.
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  // Browser chrome (iOS status bar, Android toolbar) follows the page, including after a reload
  useEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[resolvedTheme])
  }, [resolvedTheme])

  const toggle = () => {
    const next = resolvedTheme === "light" ? "dark" : "light"
    const apply = () => flushSync(() => setTheme(next))
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    // Cross-fade the whole page where View Transitions exist; instant otherwise
    if (!reduce && document.startViewTransition) document.startViewTransition(apply)
    else apply()
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark mode"
      className="group -my-2 inline-flex items-center gap-1.5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40 transition-colors hover:text-ivory/70 sm:text-[11px]"
    >
      <span aria-hidden="true" className="relative inline-block size-[7px] rounded-full border border-current">
        {/* Half-filled disc: the lit half flips with the theme */}
        <span className="absolute inset-y-0 left-0 w-1/2 rounded-l-full bg-current transition-transform duration-500 light:translate-x-full light:rounded-l-none light:rounded-r-full" />
      </span>
      {/* Phones show only the active mode; sm+ shows both */}
      <span className="dark:text-ivory max-sm:light:hidden">Dark</span>
      <span aria-hidden="true" className="max-sm:hidden">/</span>
      <span className="light:text-ivory max-sm:dark:hidden">Light</span>
    </button>
  )
}
