import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { satoshi } from "@/lib/fonts"
import Deck from "./deck"
import "../../home.css"
import "../../pricing-variants/pricing.css"
import "../../pricing-variants/live/live.css"
import "./pitch.css"

// Pitch deck for the Grambangla founder call (Google Meet), sent as a link afterwards.
export const metadata: Metadata = {
  title: "গ্রাম বাংলা × arc.",
  description: "A store that puts more in every cart: product pages, built-in upsells, the Merchant Suite and what it costs to run.",
  robots: { index: false, follow: false },
}
export const viewport: Viewport = { themeColor: "#ededed" }

export default function Page() {
  return (
    <main className={`ah pv pg ${satoshi.variable} ${GeistSans.variable}`}>
      <Deck />
    </main>
  )
}
