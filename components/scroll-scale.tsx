"use client"

import { useRef, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"

// Eases a block from slightly shrunk/faded to full size as it scrolls into view.
export default function ScrollScale({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.55"] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const scale = useTransform(progress, [0, 1], [0.94, 1])
  const opacity = useTransform(progress, [0, 1], [0.35, 1])

  if (reduce) return <div>{children}</div>

  return (
    <motion.div ref={ref} style={{ scale, opacity, transformOrigin: "50% 100%" }}>
      {children}
    </motion.div>
  )
}
