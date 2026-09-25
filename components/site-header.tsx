import type { ReactNode } from "react"
import LiveClock from "@/components/live-clock"
import ThemeToggle from "@/components/theme-toggle"
import TransitionLink from "@/components/transition-link"

const CLOCK_OPTIONS: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true }

// Top bar shared by every page: optional left slot · wordmark with the live Dhaka clock beneath · theme toggle
export default function SiteHeader({ left }: { left?: ReactNode }) {
  return (
    <header className="relative z-20 grid grid-cols-[1fr_auto_1fr] items-start px-2 pt-3 sm:px-8 sm:pt-5">
      <div className="font-mono text-[11px] tracking-[-0.02em] text-ivory/40 sm:text-[12px]">{left}</div>
      <div className="flex flex-col items-center">
        <TransitionLink href="/" aria-label="Arc Lab Technology — home" className="-mt-1 block">
          <img src="/arc-logo-dark.webp" alt="Arc Lab Technology" width={600} height={224} className="h-7 w-auto sm:h-10 light:hidden" />
          <img src="/arc-logo.webp" alt="Arc Lab Technology" width={600} height={217} className="hidden h-7 w-auto sm:h-10 light:block" />
        </TransitionLink>
        <LiveClock
          timeZone="Asia/Dhaka"
          options={CLOCK_OPTIONS}
          className="mt-1.5 font-mono text-[9px] tabular-nums tracking-[0.15em] text-ivory/40 sm:mt-2 sm:text-[11px]"
        />
      </div>
      <div className="flex justify-end pt-0.5">
        <ThemeToggle />
      </div>
    </header>
  )
}
