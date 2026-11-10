"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { navLinks, WHATSAPP } from "@/lib/home"
import { Roll, RollLink } from "./roll"

// Brand left, links from the centre line; on phones a "Menu" button drops a sheet from the top.
export default function HomeHeader() {
  const [open, setOpen] = useState(false)
  const path = usePathname()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header className="top">
        <Link className="brand" href="/" aria-label="Arc Labs, home">
          <img className="lt-only" src="/arc-logo-black.webp" alt="" width={600} height={215} draggable={false} />
          <img className="dk-only" src="/arc-logo-white.webp" alt="" width={600} height={215} draggable={false} />
        </Link>
        <nav className="nav" aria-label="Primary">
          {navLinks.map((l) => (
            <RollLink key={l.label} href={l.href} current={l.href === path}>
              {l.label}
            </RollLink>
          ))}
        </nav>
        <button className="menu-btn" aria-expanded={open} aria-controls="ah-sheet" onClick={() => setOpen((o) => !o)}>
          <Roll>{open ? "Close" : "Menu"}</Roll>
        </button>
      </header>

      <div className="sheet" id="ah-sheet" data-open={open ? "" : undefined} aria-hidden={!open} inert={!open}>
        <nav className="big" aria-label="Menu">
          {navLinks.map((l) => (
            <Link key={l.label} href={l.href} onClick={close}>
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>
        <div className="soc">
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <Link href="/call" onClick={close}>
            Book a call
          </Link>
          <Link href="/work" onClick={close}>
            Portfolio
          </Link>
        </div>
      </div>
    </>
  )
}
