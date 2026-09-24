import type { ReactNode } from "react"
import LiveClock from "@/components/live-clock"
import TransitionLink from "@/components/transition-link"

const CLOCK_OPTIONS: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit", hour12: true }

// Top bar shared by every page: mono label · wordmark · live Dhaka clock
export default function SiteHeader({ left }: { left?: ReactNode }) {
  return (
    <header className="relative z-20 grid grid-cols-[1fr_auto_1fr] items-start px-4 pt-6 sm:px-8 sm:pt-10">
      <div className="font-mono text-[11px] tracking-[-0.02em] text-ivory/40 sm:text-[12px]">
        {left ?? "arc.labs"}
      </div>
      <TransitionLink href="/" aria-label="Arc Lab Technology — home" className="-mt-1 block">
        <img src="/arc-logo-dark.webp" alt="Arc Lab Technology" width={600} height={224} className="h-6 w-auto sm:h-8" />
      </TransitionLink>
      <LiveClock
        timeZone="Asia/Dhaka"
        options={CLOCK_OPTIONS}
        className="justify-self-end font-mono text-[11px] tabular-nums tracking-[-0.02em] text-ivory/40 sm:text-[12px]"
      />
    </header>
  )
}
