"use client"

import { useEffect, useState } from "react"

const FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Dhaka",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

// DD.MM.YYYY
function today() {
  const parts = Object.fromEntries(FORMAT.formatToParts(new Date()).map((p) => [p.type, p.value]))
  return `${parts.day}.${parts.month}.${parts.year}`
}

// Today's date in Dhaka. Computed in the browser (not at build time) and
// re-checked every minute, so it rolls over at midnight even on an open page.
export default function TodayDate({ className }: { className?: string }) {
  const [date, setDate] = useState<string | null>(null)

  useEffect(() => {
    setDate(today())
    const id = window.setInterval(() => setDate(today()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <time className={className} suppressHydrationWarning>
      {date ?? " "}
    </time>
  )
}
