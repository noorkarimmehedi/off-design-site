"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

type CalApi = ((...args: unknown[]) => void) & { ns: Record<string, (...args: unknown[]) => void>; loaded?: boolean; q?: unknown[] }

declare global {
  interface Window {
    Cal?: CalApi
  }
}

const NAMESPACE = "call"

// Cal.com's official loader: queues calls on window.Cal until embed.js arrives
function loadCal() {
  /* eslint-disable */
  ;(function (C: any, A: string, L: string) {
    const p = function (a: any, ar: any) { a.q.push(ar) }
    const d = C.document
    C.Cal = C.Cal || function () {
      const cal = C.Cal
      const ar = arguments
      if (!cal.loaded) {
        cal.ns = {}
        cal.q = cal.q || []
        d.head.appendChild(d.createElement("script")).src = A
        cal.loaded = true
      }
      if (ar[0] === L) {
        const api: any = function () { p(api, arguments) }
        const namespace = ar[1]
        api.q = api.q || []
        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || api
          p(cal.ns[namespace], ar)
          p(cal, ["initNamespace", namespace])
        } else p(cal, ar)
        return
      }
      p(cal, ar)
    }
  })(window, "https://app.cal.com/embed/embed.js", "init")
  /* eslint-enable */
  return window.Cal!
}

// Inline Cal.com booker that follows the site's Dark / Light theme
export default function CalEmbed({ calLink, className }: { calLink: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === "light" ? "light" : "dark"

  useEffect(() => {
    const el = ref.current
    // The dataset flag survives Strict Mode's double effect, so only one iframe is mounted
    if (!el || el.dataset.embedded) return
    el.dataset.embedded = "1"

    const Cal = loadCal()
    Cal("init", NAMESPACE, { origin: "https://app.cal.com" })
    Cal.ns[NAMESPACE]("inline", {
      elementOrSelector: el,
      calLink,
      config: { layout: "month_view", theme, useSlotsViewOnSmallScreen: "true" },
    })
    Cal.ns[NAMESPACE]("ui", {
      theme,
      layout: "month_view",
      hideEventTypeDetails: false,
      cssVarsPerTheme: {
        light: { "cal-brand": "#16140f" },
        dark: { "cal-brand": "#ede8df" },
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calLink])

  useEffect(() => {
    window.Cal?.ns?.[NAMESPACE]?.("ui", { theme })
  }, [theme])

  return <div ref={ref} className={className} />
}
