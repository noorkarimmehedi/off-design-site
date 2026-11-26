import type { Selection } from "./catalog"

// Per-client order links: /order/<slug>. Any slug works — the brand name is read from the link
// (/order/bengal-mart → "Bengal Mart"). Add an entry here to pick the catalogue, lock the exact
// name or pre-tick features.
export type ClientPreset = {
  name: string
  /** Which price list this order is priced from */
  catalog?: string
  selection?: Selection
  /** Name the client can't edit (default true for saved clients) */
  locked?: boolean
  /** Brand logo in assets/og, shown beside the arc logo in the preview */
  logo?: string
  /** Brand logo in public/, drawn in the hero beside the client's name */
  heroLogo?: string
  /** Brand pill before the client's name in the hero; its words take turns */
  badge?: ClientBadge
}

export type ClientBadge = { words: string[]; color: string }

export const CLIENTS: Record<string, ClientPreset> = {
  "sera-khabar": { name: "সেরা খাবার", selection: { landing: 5 } },
  // Custom website + admin panel + custom bot — one fixed scope, one fixed price.
  "mahir-khan": {
    name: "Mr.Mahir Khan",
    catalog: "web-bot",
    locked: false,
  },
  // Website + admin panel + 5 landing pages — fixed scope, ৳65,000.
  "rajshahi-aambari": {
    name: "রাজশাহী আমবাড়ী",
    catalog: "web-admin-landing",
    logo: "rajshahi-aambari.png",
  },
  // Website + Merchant Suite admin (no social inbox) + 1 landing page — fixed scope, ৳35,000.
  icey: {
    name: "ICEy",
    catalog: "icey",
    badge: { words: ["Big Flavors.", "Better Vibes.", "Quick Refresh."], color: "#3d6ad6" },
  },
  // Grambangla (deshi food: ghee, mustard oil, semai, spices) — storefront ৳23,000 + admin panel with every
  // module ৳22,000; landing pages ৳8,000 each, off unless picked. Brand green from grambanglashop.com.
  grambangla: {
    name: "গ্রাম বাংলা",
    catalog: "grambangla",
    logo: "grambangla.png",
    heroLogo: "/clients/grambangla.webp",
    badge: { words: ["Pure Ghee.", "Mustard Oil.", "Deshi Spices."], color: "#1B5E20" },
  },
}

/** "bengal-mart" → "Bengal Mart"; Bangla slugs keep their script ("সেরা-খাবার" → "সেরা খাবার") */
export function nameFromSlug(slug: string): string | undefined {
  let raw = slug
  try {
    raw = decodeURIComponent(slug)
  } catch {}
  const words = raw.replace(/[-_+]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 60)
  if (!words || words.toLowerCase() === "new") return undefined
  return words.replace(/\b[a-z]/g, (c) => c.toUpperCase())
}

/** Saved client first, then the name read from the link */
export function resolveClient(slug: string): {
  name?: string
  selection?: Selection
  catalog?: string
  locked: boolean
  logo?: string
  heroLogo?: string
  badge?: ClientBadge
} {
  const saved = CLIENTS[slug] ?? CLIENTS[safeDecode(slug)]
  if (saved) return { ...saved, locked: saved.locked ?? true }
  return { name: nameFromSlug(slug), locked: false }
}

function safeDecode(s: string) {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}
