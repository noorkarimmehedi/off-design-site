import { MERCHANT_CATALOG } from "./catalogs/merchant"
import { WEB_BOT_CATALOG } from "./catalogs/web-bot"
import type { Catalog, Feature, Line, Selection } from "./types"

export type { Catalog, Feature, FeatureGroup, FeaturePointGroup, Line, Selection } from "./types"

// Every kind of project we quote. A client link picks one; the API re-prices from the same file.
export const CATALOGS: Record<string, Catalog> = {
  [MERCHANT_CATALOG.id]: MERCHANT_CATALOG,
  [WEB_BOT_CATALOG.id]: WEB_BOT_CATALOG,
}

export const DEFAULT_CATALOG_ID = MERCHANT_CATALOG.id

export function getCatalog(id?: string | null): Catalog {
  return (id && CATALOGS[id]) || CATALOGS[DEFAULT_CATALOG_ID]
}

export const featuresOf = (catalog: Catalog): Feature[] => catalog.groups.flatMap((g) => g.features)

/** Prices always come from the catalogue, never from the browser. */
export function priceSelection(selection: Selection, catalog: Catalog) {
  const lines: Line[] = []
  for (const feature of featuresOf(catalog)) {
    const raw = feature.required ? 1 : Math.floor(Number(selection[feature.id] ?? 0))
    const max = feature.perUnit?.max ?? 1
    const qty = Math.min(Math.max(raw, 0), max)
    if (qty > 0) lines.push({ feature, qty, price: feature.price * qty, compareAt: feature.compareAt * qty })
  }
  const total = lines.reduce((s, l) => s + l.price, 0)
  const compareAt = lines.reduce((s, l) => s + l.compareAt, 0)
  return { lines, total, compareAt, savings: compareAt - total, advance: Math.round(total / 2) }
}

export function defaultSelection(catalog: Catalog, preset?: Selection): Selection {
  const base: Selection = {}
  for (const f of featuresOf(catalog)) base[f.id] = f.required ? 1 : f.perUnit ? f.perUnit.default : 0
  return { ...base, ...preset }
}

export const taka = (n: number) => "৳" + n.toLocaleString("en-US")

export const lineLabel = (l: Line) => (l.feature.perUnit ? `${l.feature.name} ×${l.qty}` : l.feature.name)

export const BANK: [string, string][] = [
  ["Account name", "NUR KORIM"],
  ["Account number", "1061450000210"],
  ["Bank", "Eastern Bank Limited"],
  ["Branch", "Dhanmondi Branch"],
  ["Routing number", "095261188"],
]
