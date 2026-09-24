"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { ComponentProps, MouseEvent } from "react"

// Must match the html.is-leaving transition duration in styles/globals.css
const LEAVE_MS = 320

type Props = ComponentProps<typeof Link> & { href: string }

// Internal link that fades the current page out before navigating;
// app/template.tsx fades the next page in.
export default function TransitionLink({ href, onClick, children, ...rest }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    if (href === pathname) return

    e.preventDefault()
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      router.push(href)
      return
    }
    document.documentElement.classList.add("is-leaving")
    router.prefetch(href)
    window.setTimeout(() => router.push(href), LEAVE_MS)
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}
