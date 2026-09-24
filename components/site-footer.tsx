"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import TransitionLink from "@/components/transition-link"

type FooterLink = { label: string; href: string; external?: boolean }

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Index",
    links: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/work" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Book a call", href: "https://cal.com/noor-foumnf/15min", external: true },
      { label: "WhatsApp", href: "https://api.whatsapp.com/send/?phone=8801733670129", external: true },
    ],
  },
  {
    title: "Social",
    links: [{ label: "Facebook", href: "https://www.facebook.com/offdesign", external: true }],
  },
]

const linkClass =
  "relative inline-block text-stone transition-colors duration-300 hover:text-ivory after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-ivory/60 after:transition-transform after:duration-300 hover:after:scale-x-100"

export default function SiteFooter() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  // 0 when the footer's top meets the viewport bottom, 1 when its bottom does
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] })
  const logoY = useTransform(scrollYProgress, [0, 1], ["28%", "6%"])
  const logoOpacity = useTransform(scrollYProgress, [0.15, 0.9], [0, 1])
  const glowOpacity = useTransform(scrollYProgress, [0.3, 1], [0, 1])

  return (
    <footer ref={ref} className="relative z-10 overflow-hidden bg-ink text-ivory">
      <div className="mx-auto w-full max-w-[964px] px-2 sm:px-8">
        {/* Statement + link columns */}
        <div className="grid gap-12 border-t border-line pt-14 pb-12 sm:grid-cols-[1.2fr_2fr] sm:gap-8 sm:pt-20">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone">Arc Labs Corporation</p>
            <p className="mt-5 max-w-[16ch] text-[28px] font-black uppercase leading-[0.95] tracking-tighter sm:text-[36px]">
              Systems over <span className="text-stone">manual work.</span>
            </p>
          </div>

          <nav className="grid grid-cols-3 gap-6 font-mono text-[11px] uppercase tracking-[0.15em]">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-ivory/35">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                          {link.label}
                        </a>
                      ) : (
                        <TransitionLink href={link.href} className={linkClass}>
                          {link.label}
                        </TransitionLink>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between gap-4 border-t border-line py-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/35">
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

      {/* Giant wordmark rising out of the dark */}
      <div className="relative h-[27vw] max-h-[380px] overflow-hidden" aria-hidden="true">
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-full"
          style={{
            opacity: reduce ? 1 : glowOpacity,
            background: "radial-gradient(60% 90% at 50% 100%, rgb(184 191 230 / 0.16), transparent 70%)",
          }}
        />
        <motion.img
          src="/arc-logo-dark-lg.webp"
          alt=""
          width={1398}
          height={523}
          className="absolute left-1/2 top-0 w-[94vw] max-w-[1320px] -translate-x-1/2 select-none"
          style={{
            y: reduce ? "6%" : logoY,
            opacity: reduce ? 1 : logoOpacity,
            maskImage: "linear-gradient(to bottom, #000 35%, transparent 88%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 35%, transparent 88%)",
          }}
          draggable={false}
        />
      </div>
    </footer>
  )
}
