"use client"

import { useEffect } from "react"

// Fades and lifts every `.rv` element as it scrolls into view. Content already on the first
// screen (and everything, if the script never runs) stays visible from the start.
export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return
          en.target.classList.remove("pre")
          io.unobserve(en.target)
        }),
      { rootMargin: "0px 0px -12% 0px" },
    )
    document.querySelectorAll<HTMLElement>(".ah .rv").forEach((el) => {
      if (el.getBoundingClientRect().top <= window.innerHeight) return
      el.classList.add("pre")
      el.style.transitionDelay = el.classList.contains("label") ? "0ms" : "90ms"
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])
  return null
}
