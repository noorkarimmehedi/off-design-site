"use client"

import { useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"

// Re-mounts on every navigation: fades the incoming page up into place.
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    document.documentElement.classList.remove("is-leaving")
  }, [])

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, filter: "blur(8px)" }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: reduce ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        // A lingering filter/transform would break position: sticky and fixed children
        const el = document.getElementById("page-root")
        if (el) {
          el.style.filter = ""
          el.style.transform = ""
        }
      }}
      id="page-root"
    >
      {children}
    </motion.div>
  )
}
