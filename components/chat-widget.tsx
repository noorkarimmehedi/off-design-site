"use client"

import { motion, useReducedMotion } from "framer-motion"

const WHATSAPP = "https://api.whatsapp.com/send/?phone=8801733670129"
const EASE = [0.22, 1, 0.36, 1] as const

// Bottom-right chat launcher: a mono pill with registration brackets that opens WhatsApp
export default function ChatWidget() {
  const reduce = useReducedMotion()

  return (
    <motion.a
      href={WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={reduce ? false : { opacity: 0, y: 12, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.8 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      className="group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex h-11 items-center gap-3 border border-ivory/15 bg-ink px-4 font-mono text-[11px] uppercase tracking-[0.25em] text-ivory shadow-[0_16px_40px_-18px_rgb(0_0_0/0.5)] transition-colors duration-300 hover:border-ivory/35 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-dashed focus-visible:outline-ivory/40 sm:right-6 sm:bottom-6"
    >
      {/* Registration brackets, after the animated buttons; they tuck in on hover */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        {[
          "-top-px -left-px border-t border-l group-hover:translate-x-0.5 group-hover:translate-y-0.5",
          "-top-px -right-px border-t border-r group-hover:-translate-x-0.5 group-hover:translate-y-0.5",
          "-right-px -bottom-px border-r border-b group-hover:-translate-x-0.5 group-hover:-translate-y-0.5",
          "-bottom-px -left-px border-b border-l group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
        ].map((c) => (
          <span key={c} className={`absolute size-2 border-ivory/35 transition-transform duration-300 ${c}`} />
        ))}
      </span>
      <span aria-hidden="true" className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#ff5941] opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex size-1.5 rounded-full bg-[#ff5941]" />
      </span>
      Chat
      <span
        aria-hidden="true"
        className="text-[12px] leading-none text-stone transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ivory"
      >
        ↗
      </span>
    </motion.a>
  )
}
