"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import TodayDate from "@/components/today-date"

export default function SiteFooter({ hideSignature = false }: { hideSignature?: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  // 0 when the footer's top meets the viewport bottom, 1 when its bottom does
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] })
  const logoY = useTransform(scrollYProgress, [0, 1], ["32%", "0%"])
  const logoOpacity = useTransform(scrollYProgress, [0.15, 0.9], [0, 1])
  const glowOpacity = useTransform(scrollYProgress, [0.3, 1], [0, 1])

  return (
    <footer ref={ref} className="relative z-10 overflow-hidden bg-ink text-ivory">
      {/* Meta row */}
      <div className="mx-auto w-full max-w-[964px] px-2 sm:px-8">
        <div className="flex items-center justify-between gap-4 py-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/35">
          <span>© {new Date().getFullYear()} Arc Labs</span>
          <span className="hidden sm:inline">23.8103° N — 90.4125° E</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
            className="group inline-flex items-center gap-2 uppercase transition-colors hover:text-ivory"
          >
            Back to top
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5">
              ↑
            </span>
          </button>
        </div>
      </div>

      {/* Giant wordmark, centred, rising out of the dark */}
      <div className="relative mt-4 sm:mt-8">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: reduce ? 1 : glowOpacity,
            background: "radial-gradient(55% 80% at 50% 100%, rgb(184 191 230 / 0.16), transparent 70%)",
          }}
        />

        {/* Signature + today's date, above the right side of the wordmark (the home page shows it in the hero) */}
        {!hideSignature && (
          <div className="relative mx-auto flex w-[88vw] max-w-[1100px] justify-end pb-3 sm:pb-4">
            <div className="flex flex-col items-end">
              <img
                src="/imgi_11_image.webp"
                alt="Signature"
                width={256}
                height={236}
                className="h-14 w-auto opacity-80 dark:invert sm:h-20"
                draggable={false}
              />
              <TodayDate className="-mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/45 sm:text-[11px]" />
            </div>
          </div>
        )}

        {/* Cropped: only the top 80% shows, flush with the page bottom.
            The webp has transparent padding, so it's scaled/offset to size the letters like the old logo */}
        <div className="relative mx-auto aspect-[1398/418] w-[calc(100%-16px)] max-w-[1100px] overflow-hidden sm:w-[88vw]">
          <motion.img
            src="/arc-footer.webp"
            alt=""
            width={1944}
            height={809}
            className="-mt-[5.55%] -ml-[12.1%] block h-auto w-[119.9%] max-w-none select-none"
            style={{
              y: reduce ? "0%" : logoY,
              opacity: reduce ? 1 : logoOpacity,
            }}
            draggable={false}
          />
        </div>
      </div>
    </footer>
  )
}
