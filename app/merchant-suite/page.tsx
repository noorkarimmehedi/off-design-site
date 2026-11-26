import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { satoshi } from "@/lib/fonts"
import SiteFoot from "@/components/home/site-foot"
import Studio from "../pricing-variants/v1-studio"
import "../home.css"
import "../pricing-variants/pricing.css"
import "../pricing-variants/live/live.css"

// Merchant Suite: design and operations under one roof, priced by monthly orders.
// The page is the "Studio" direction from app/pricing-variants (the review page stays local).
export const metadata: Metadata = {
  title: "Merchant Suite · Design and operations, under one roof · arc.",
  description:
    "Your landing page, order queue, fraud checks, courier booking, staff and live profit in one place. From ৳1,000 a month, priced by the orders you get.",
  alternates: { canonical: "/merchant-suite" },
  openGraph: {
    title: "Merchant Suite by arc.",
    description: "Design and operations, under one roof. From ৳1,000 a month.",
    url: "/merchant-suite",
  },
}
export const viewport: Viewport = { themeColor: "#111111" }

export default function Page() {
  return (
    <main className={`ah pv pv-1 ${satoshi.variable} ${GeistSans.variable}`}>
      <Studio />
      <SiteFoot />
    </main>
  )
}
