// Feature catalogue for the client work-order builder. Prices are one-time build fees in BDT.
// The API recomputes every total from this file, so a price is only ever changed here.

export type Feature = {
  id: string
  name: string
  detail: string
  price: number
  compareAt: number
  /** Always part of the order; shown ticked and locked */
  required?: boolean
  /** Priced per unit; the client picks how many */
  perUnit?: { label: string; min: number; max: number; default: number }
}

export type FeatureGroup = { id: string; title: string; note: string; features: Feature[] }

export const CATALOG: FeatureGroup[] = [
  {
    id: "core",
    title: "Core",
    note: "Always included",
    features: [
      { id: "storefront", name: "Online storefront", detail: "Mobile-first store in Bangla & English, product catalogue, cart and checkout.", price: 25000, compareAt: 45000, required: true },
      { id: "admin", name: "Admin portal", detail: "Orders, products, stock and customers in one dashboard.", price: 25000, compareAt: 45000, required: true },
    ],
  },
  {
    id: "pages",
    title: "Pages",
    note: "Pick how many",
    features: [
      { id: "landing", name: "Custom landing pages", detail: "Campaign and product pages designed to your brand.", price: 3000, compareAt: 5000, perUnit: { label: "pages", min: 0, max: 20, default: 5 } },
    ],
  },
  {
    id: "grow",
    title: "Grow & protect",
    note: "New in Merchant Suite",
    features: [
      { id: "protection", name: "Fake order protection", detail: "Risk score on every order, IP record, held-order review, repeat-attempt tracking and advance payment proof.", price: 4000, compareAt: 16000 },
      { id: "campaign-links", name: "Campaign links", detail: "A tracked link per ad or post with automatic UTM tags — clicks, orders and delivered revenue per link.", price: 3000, compareAt: 12000 },
      { id: "analytics", name: "Website analytics", detail: "Your own visitor tracking: visitors, sessions, entry pages, nightly reports and retention.", price: 3000, compareAt: 12000 },
      { id: "business-report", name: "Business report", detail: "P&L, order value, delivery outcomes, product weight and hourly sales against the previous period.", price: 4000, compareAt: 15000 },
    ],
  },
  {
    id: "sell",
    title: "Sell & talk",
    note: "Turn chats into orders",
    features: [
      { id: "inbox", name: "Social inbox", detail: "Facebook, Instagram and WhatsApp messages in one inbox.", price: 9000, compareAt: 22000 },
      { id: "ai-capture", name: "AI order capture", detail: "Turns chat messages into orders automatically.", price: 7000, compareAt: 18000 },
      { id: "payments", name: "bKash / Nagad payments", detail: "Online payment at checkout.", price: 5000, compareAt: 12000 },
      { id: "sms", name: "SMS order updates", detail: "Automatic confirmation and delivery messages.", price: 3000, compareAt: 8000 },
      { id: "abandoned", name: "Abandoned checkout recovery", detail: "See who left at checkout and follow up.", price: 4000, compareAt: 9000 },
    ],
  },
  {
    id: "ops",
    title: "Operations",
    note: "Run the back office",
    features: [
      { id: "courier", name: "Courier integration", detail: "Pathao and Steadfast dispatch and tracking from the dashboard.", price: 5000, compareAt: 12000 },
      { id: "warehouses", name: "Multi-warehouse stock", detail: "Stock tracked per warehouse.", price: 4500, compareAt: 9000 },
      { id: "returns", name: "Returns management", detail: "Log and track returns and refunds.", price: 3000, compareAt: 8000 },
      { id: "team", name: "Team roles & activity log", detail: "Staff accounts, permissions and a log of who did what.", price: 2500, compareAt: 6000 },
    ],
  },
]

export const FEATURES: Feature[] = CATALOG.flatMap((g) => g.features)
export const FEATURE_BY_ID = new Map(FEATURES.map((f) => [f.id, f]))

export const TERMS: [string, string][] = [
  ["Delivery", "Complete delivery within 7–15 days from the date the advance payment is confirmed."],
  ["Payment", "50% advance to confirm and start work; the remaining 50% on completion and final approval, before handover."],
  ["Revisions", "Two rounds of design revisions are included before build begins."],
  ["Content", "You provide your logo, product photos and prices. The timeline starts once we have them."],
  ["Third-party costs", "Domain, hosting, SMS and payment-gateway fees are not included and are billed at cost."],
  ["Ownership", "Once the final payment is made, everything we build is fully yours."],
  ["Support", "30 days of free bug fixes after launch. Ongoing support is available monthly."],
]

export const BANK: [string, string][] = [
  ["Account name", "NUR KORIM"],
  ["Account number", "1061450000210"],
  ["Bank", "Eastern Bank Limited"],
  ["Branch", "Dhanmondi Branch"],
  ["Routing number", "095261188"],
]

/** Selection: feature id → quantity (1 for on/off features) */
export type Selection = Record<string, number>

export type Line = { feature: Feature; qty: number; price: number; compareAt: number }

export function priceSelection(selection: Selection) {
  const lines: Line[] = []
  for (const feature of FEATURES) {
    const raw = feature.required ? 1 : Math.floor(Number(selection[feature.id] ?? 0))
    const max = feature.perUnit?.max ?? 1
    const qty = Math.min(Math.max(raw, 0), max)
    if (qty > 0) lines.push({ feature, qty, price: feature.price * qty, compareAt: feature.compareAt * qty })
  }
  const total = lines.reduce((s, l) => s + l.price, 0)
  const compareAt = lines.reduce((s, l) => s + l.compareAt, 0)
  return { lines, total, compareAt, savings: compareAt - total, advance: Math.round(total / 2) }
}

export function defaultSelection(preset?: Selection): Selection {
  const base: Selection = {}
  for (const f of FEATURES) base[f.id] = f.required ? 1 : f.perUnit ? f.perUnit.default : 0
  return { ...base, ...preset }
}

export const taka = (n: number) => "৳" + n.toLocaleString("en-US")

export const lineLabel = (l: Line) => (l.feature.perUnit ? `${l.feature.name} ×${l.qty}` : l.feature.name)
