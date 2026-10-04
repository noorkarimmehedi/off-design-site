"use client"

import NumberFlow, { type Format } from "@number-flow/react"

export { default as NumberFlow, NumberFlowGroup, type Value } from "@number-flow/react"

const TAKA_FORMAT: Format = { maximumFractionDigits: 0 }

// Animated ৳ amount. Strike is drawn as an overlay line: NumberFlow renders digits in a
// shadow root, where an inherited line-through doesn't reliably reach.
export function TakaFlow({ value, strike, className }: { value: number; strike?: boolean; className?: string }) {
  return (
    <span className={`relative inline-block tabular-nums ${className ?? ""}`}>
      <NumberFlow value={value} prefix="৳" locales="en-US" format={TAKA_FORMAT} willChange />
      {strike && <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-current opacity-70" />}
    </span>
  )
}
