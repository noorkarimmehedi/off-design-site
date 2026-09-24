"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

export default function SiteFooter() {
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
        <div className="flex items-center justify-between gap-4 py-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/35 sm:border-t sm:border-line">
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
      <div className="relative mt-4 pb-8 sm:mt-8 sm:pb-12" aria-hidden="true">
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: reduce ? 1 : glowOpacity,
            background: "radial-gradient(55% 80% at 50% 100%, rgb(184 191 230 / 0.16), transparent 70%)",
          }}
        />
        <div className="relative mx-auto w-[88vw] max-w-[1100px] overflow-hidden">
          <motion.img
            src="/arc-logo-dark-lg.webp"
            alt=""
            width={1398}
            height={523}
            className="block h-auto w-full select-none"
            style={{
              y: reduce ? "0%" : logoY,
              opacity: reduce ? 1 : logoOpacity,
              maskImage: "linear-gradient(to bottom, #000 55%, rgb(0 0 0 / 0.2) 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, #000 55%, rgb(0 0 0 / 0.2) 100%)",
            }}
            draggable={false}
          />
        </div>
      </div>
    </footer>
  )
}
