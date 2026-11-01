"use client"

import { useEffect, useState } from "react"

const fmt = () =>
  new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Dhaka", hour: "numeric", minute: "2-digit" }).toLowerCase()

// The time in Dhaka, kept current to the minute. The server's minute can differ from the browser's.
export default function DhakaTime() {
  const [now, setNow] = useState(fmt)
  useEffect(() => {
    const id = window.setInterval(() => setNow(fmt()), 15000)
    return () => clearInterval(id)
  }, [])
  return <span suppressHydrationWarning>{now}</span>
}
