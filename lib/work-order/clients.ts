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
}

export const CLIENTS: Record<string, ClientPreset> = {
  "sera-khabar": { name: "সেরা খাবার", selection: { landing: 5 } },
  // Custom website + admin panel + custom bot — one fixed scope, one fixed price.
  "mahir-khan": {
    name: "Mr.Mahir Khan",
    catalog: "web-bot",
    locked: false,
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
