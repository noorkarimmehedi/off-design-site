// Monthly running cost of a Merchant Suite store (storefront + admin on Cloudflare Workers, data in
// Supabase), by orders a day. Every per-order figure is measured on a live Merchant Suite store:
//
// - Cloudflare GraphQL analytics, 22–26 Nov 2026 (5 days after the move to Workers): 8,479,270 Worker
//   requests and 92,934,027 ms of CPU time for 7,428 orders → ~1,141 requests and ~12.5 s CPU per
//   order. Durable Objects (live presence): 862,064 requests for 9,554 orders over 18–26 Nov → ~90.
//   Most of those requests are the dashboard staying live for staff, which grows with order volume.
// - Supabase: Pro plan with Small compute; database 851 MB holding 18,449 orders → ~46 KB per order.
// - Cloudflare account: Workers Paid, $5 a month.
//
// Prices are Cloudflare's and Supabase's public list prices (USD). Compute tiers above what the
// measured store runs on are our estimate.

export const MEASURED = {
  requestsPerOrder: 1141,
  cpuMsPerOrder: 12511,
  durableRequestsPerOrder: 90,
  dbKbPerOrder: 46,
}

const CF = {
  base: 5,
  includedRequests: 10e6,
  perMillionRequests: 0.3,
  includedCpuMs: 30e6,
  perMillionCpuMs: 0.02,
  includedDurableRequests: 1e6,
  perMillionDurableRequests: 0.15,
}

// Supabase Pro is $25 with $10 of compute credit, which covers Micro.
const SUPABASE_PRO = 25
// Normal days run on Micro (covered by the credit); a rush moves up to Small, what the measured store
// runs on at ~1,500 orders a day. Past 2,000 a day normal days need Small and a rush needs Medium.
// Supabase compute list prices less the $10 credit: Micro $10, Small $15, Medium $60.
const COMPUTE = [
  { upTo: 2000, name: "Micro", extra: 0 },
  { upTo: Infinity, name: "Small", extra: 5 },
]
// One size up, for a rush (Eid, a big sale). Supabase bills compute by the hour.
const RUSH_SIZE: Record<string, { name: string; extra: number }> = {
  Micro: { name: "Small", extra: 5 },
  Small: { name: "Medium", extra: 50 },
}

/** Database space included in Supabase Pro, and the price of each GB past it */
export const INCLUDED_GB = 8
export const EXTRA_GB_USD = 0.125

/** Taka per US dollar used for the ৳ figures */
export const USD_TO_BDT = 122

const over = (used: number, included: number, perMillion: number) => (Math.max(0, used - included) / 1e6) * perMillion

/** `rush` prices the month as if the database ran one size bigger the whole month */
export function runningCost(ordersPerDay: number, rush = false) {
  const month = ordersPerDay * 30
  const cloudflare =
    CF.base +
    over(month * MEASURED.requestsPerOrder, CF.includedRequests, CF.perMillionRequests) +
    over(month * MEASURED.cpuMsPerOrder, CF.includedCpuMs, CF.perMillionCpuMs) +
    over(month * MEASURED.durableRequestsPerOrder, CF.includedDurableRequests, CF.perMillionDurableRequests)
  const normal = COMPUTE.find((c) => ordersPerDay <= c.upTo)!
  const compute = rush ? RUSH_SIZE[normal.name] : normal
  const supabase = SUPABASE_PRO + compute.extra
  /** Extra cost of running one size bigger for a 7-day rush, billed by the hour */
  const rushWeekUsd = ((RUSH_SIZE[normal.name].extra - normal.extra) / 30) * 7
  const usd = cloudflare + supabase
  return {
    month,
    cloudflare,
    supabase,
    compute: compute.name,
    normalSize: normal.name,
    rushSize: RUSH_SIZE[normal.name].name,
    rushWeekBdt: rushWeekUsd * USD_TO_BDT,
    usd,
    bdt: usd * USD_TO_BDT,
    perOrderBdt: month ? (usd * USD_TO_BDT) / month : 0,
    dbMbPerMonth: (month * MEASURED.dbKbPerOrder) / 1024,
    /** How many months of orders fit in the included space */
    storageMonths: month ? (INCLUDED_GB * 1024) / ((month * MEASURED.dbKbPerOrder) / 1024) : Infinity,
  }
}
