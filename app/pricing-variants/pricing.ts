// Merchant Suite pricing, from the 2026-11-23 pricing session. Draft numbers, not final.

export type Tier = { name: string; max: number; price: number; note: string }

export const TIERS: Tier[] = [
  { name: "Starter", max: 500, price: 1000, note: "For a shop just finding its feet" },
  { name: "Small", max: 1500, price: 2000, note: "Steady daily orders" },
  { name: "Growth", max: 4000, price: 4500, note: "A busy shop with a team" },
  { name: "Large", max: 10000, price: 10000, note: "High volume, every day" },
]

export const OVER_PER_ORDER = 1
export const SETUP_FEE = 5000

// Slider stops: each segment between stops takes the same width, so plan boundaries sit on even ticks
export const STOPS = [100, 500, 1500, 4000, 10000, 20000]

export function ordersAt(t: number) {
  const seg = STOPS.length - 1
  const x = Math.min(Math.max(t, 0), 1) * seg
  const i = Math.min(Math.floor(x), seg - 1)
  const f = x - i
  const raw = STOPS[i] + (STOPS[i + 1] - STOPS[i]) * f
  const step = raw < 1000 ? 25 : raw < 5000 ? 50 : 100
  return Math.round(raw / step) * step
}

export function positionOf(orders: number) {
  const seg = STOPS.length - 1
  for (let i = 0; i < seg; i++) {
    if (orders <= STOPS[i + 1]) return (i + (orders - STOPS[i]) / (STOPS[i + 1] - STOPS[i])) / seg
  }
  return 1
}

export function quote(orders: number, yearly: boolean) {
  const idx = TIERS.findIndex((t) => orders <= t.max)
  const tier = idx === -1 ? TIERS[TIERS.length - 1] : TIERS[idx]
  const over = idx === -1 ? (orders - tier.max) * OVER_PER_ORDER : 0
  const monthly = tier.price + over
  const perMonth = yearly ? Math.round((monthly * 10) / 12) : monthly
  return {
    tier,
    tierIndex: idx === -1 ? TIERS.length : idx,
    over,
    monthly,
    perMonth,
    perOrder: perMonth / Math.max(orders, 1),
    yearTotal: monthly * 10,
  }
}

export const tk = (n: number) => "৳" + Math.round(n).toLocaleString("en-IN")

export const FEATURES = [
  { key: "site", title: "Your own landing page", body: "Designed for your brand, on your domain. Product, price and stock edits go live without a rebuild." },
  { key: "queue", title: "One order queue", body: "Pending to approved to printed to shipped. Every order in one place, with tabs for each step." },
  { key: "risk", title: "Fake orders held", body: "Every order is checked before it ships. Risky ones are held, with the reason in plain words." },
  { key: "courier", title: "Courier in one click", body: "Send to Steadfast or Pathao, one at a time or in bulk. Search any parcel by consignment ID." },
  { key: "advance", title: "Advance payment", body: "Take part of the money upfront. The courier only collects what is still due." },
  { key: "print", title: "Invoices and labels", body: "A4 invoices, thermal shipping labels and a packing list for the day's picking." },
  { key: "profit", title: "Profit, live", body: "Sales, cost of goods, delivery, returns and Meta ad spend, worked into one number every day." },
  { key: "staff", title: "Staff accountability", body: "Every change is logged with who made it and why. See who confirms and who delivers." },
  { key: "edith", title: "Ask Edith", body: "Ask your order data a question in Bangla or English. Admins can ask it to make changes too." },
] as const

export type FeatureKey = (typeof FEATURES)[number]["key"]
