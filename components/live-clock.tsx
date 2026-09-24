"use client"

import { useEffect, useState } from "react"

type Props = {
  timeZone?: string
  className?: string
  options?: Intl.DateTimeFormatOptions
}

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
  timeZoneName: "short",
}

export default function LiveClock({ timeZone = "UTC", className = "", options = DEFAULT_OPTIONS }: Props) {
  const [now, setNow] = useState<string>(() =>
    new Date().toLocaleString("en-US", { ...options, timeZone })
  )

  useEffect(() => {
    const id = setInterval(() => {
      setNow(
        new Date().toLocaleString("en-US", { ...options, timeZone })
      )
    }, 1000)
    return () => clearInterval(id)
  }, [timeZone, options])

  return (
    <div className={className} suppressHydrationWarning>
      {now}
    </div>
  )
}
