"use client"

import { useEffect, useRef, useState } from "react"
import RevealOnView from "@/components/reveal-on-view"
import { cn } from "@/lib/utils"

type Props = {
  url: string
  title: string
  gradientFrom?: string
  gradientTo?: string
  className?: string
}

// A client's live page in a browser-window frame, framed like ProjectCard.
// The iframe only gets its src once the card nears the viewport, so the page doesn't load a whole site upfront.
// It stays inert until clicked: a cross-origin iframe swallows wheel and touch scrolling and never hands it back,
// which traps the page (worse under Lenis). Leaving the card, scrolling it away, or "Done" locks it again.
export default function LiveEmbed({ url, title, gradientFrom = "#111827", gradientTo = "#6b7280", className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [active, setActive] = useState(false)
  const display = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "300px" },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Lock again once the card is mostly scrolled away
  useEffect(() => {
    if (!active || !ref.current) return
    const observer = new IntersectionObserver(([entry]) => !entry.isIntersecting && setActive(false), { threshold: 0.25 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [active])

  return (
    <article
      className={cn("group relative", className)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setActive(false)}
    >
      <RevealOnView
        className="border border-ivory/10 p-1 shadow-[0_10px_60px_-10px_rgba(0,0,0,0.6)]"
        style={{ backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
      >
        <div className="overflow-hidden bg-white dark:bg-black">
          {/* Browser chrome: light window in light mode, dark window in dark mode */}
          <div className="flex items-center gap-3 border-b border-black/10 bg-[#f2f2f0] px-3 py-2 dark:border-white/10 dark:bg-[#111]">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-black/15 dark:bg-white/15" />
              <span className="size-2.5 rounded-full bg-black/15 dark:bg-white/15" />
              <span className="size-2.5 rounded-full bg-black/15 dark:bg-white/15" />
            </div>
            <div className="min-w-0 flex-1 truncate rounded-full bg-black/[0.05] px-3 py-1 text-center font-mono text-[10px] tracking-[0.05em] text-black/50 dark:bg-white/[0.06] dark:text-white/50">
              {display}
            </div>
            {active && (
              <button
                type="button"
                onClick={() => setActive(false)}
                className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-black/50 transition-colors hover:text-black dark:text-white/50 dark:hover:text-white"
              >
                Done
              </button>
            )}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-black/50 transition-colors hover:text-black dark:text-white/50 dark:hover:text-white"
            >
              Open ↗
            </a>
          </div>

          <div ref={ref} className="relative aspect-[2/3] w-full bg-white sm:aspect-[3/2] dark:bg-black">
            {!loaded && (
              <div className="absolute inset-0 z-[1] flex items-center justify-center bg-white dark:bg-black">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/15 border-t-black dark:border-white/20 dark:border-t-white" />
                  <div className="font-mono text-[10px] uppercase tracking-widest text-black/50 dark:text-white/60">Loading live site...</div>
                </div>
              </div>
            )}
            {visible && (
              <iframe
                src={url}
                title={title}
                onLoad={() => setLoaded(true)}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                referrerPolicy="strict-origin-when-cross-origin"
                // The embedded page reads its prefers-color-scheme from this, so a theme-aware site follows ours
                className={cn(
                  "absolute inset-0 h-full w-full border-0 [color-scheme:light] dark:[color-scheme:dark]",
                  !active && "pointer-events-none",
                )}
              />
            )}
            {loaded && !active && (
              <button
                type="button"
                onClick={() => setActive(true)}
                aria-label={`Browse ${title}`}
                className="absolute inset-0 z-[2] flex cursor-pointer items-end justify-center pb-4"
              >
                <span className="rounded-full bg-black/75 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-transform duration-150 ease-out active:scale-[0.97]">
                  <span className="[@media(hover:hover)]:hidden">Tap to browse</span>
                  <span className="hidden [@media(hover:hover)]:inline">Click to browse</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </RevealOnView>
    </article>
  )
}
