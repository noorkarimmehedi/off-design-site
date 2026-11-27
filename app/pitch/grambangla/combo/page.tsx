import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { satoshi } from "@/lib/fonts"
import Combos from "./combos"
import "../../../home.css"
import "./combo.css"

// Four product-page combo ideas for Grambangla, side by side, to pick one for the pitch deck.
export const metadata: Metadata = {
  title: "Combo variants · গ্রাম বাংলা",
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <main className={`ah cb ${satoshi.variable} ${GeistSans.variable}`}>
      <Combos />
    </main>
  )
}
