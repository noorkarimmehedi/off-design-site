// Shared shapes for the work-order builder. A catalogue is a priced feature list for one
// kind of project (a D2C merchant suite, a website + bot build) with its own terms.

export type Feature = {
  id: string
  name: string
  /** One-line explanation. Omitted when the feature list speaks for itself. */
  detail?: string
  /** Bullet points listed under the detail — what the deliverable actually includes */
  points?: string[]
  /** Points split under the catalogue's own section headings */
  pointGroups?: FeaturePointGroup[]
  price: number
  compareAt: number
  /** Always part of the order; shown ticked and locked */
  required?: boolean
  /** Priced per unit; the client picks how many */
  perUnit?: { label: string; min: number; max: number; default: number }
}

export type FeaturePointGroup = { title: string; points: string[] }

export type FeatureGroup = {
  id: string
  title: string
  note: string
  /** Drawn in the coral accent instead of stone */
  accent?: boolean
  features: Feature[]
}

export type Catalog = {
  id: string
  /** Shown in the order header and on the printed copy */
  name: string
  /** Delivery window quoted on the order */
  delivery: string
  /** "builder" lets the client pick features; "quote" is a fixed scope at a fixed price */
  mode: "builder" | "quote"
  /** Headline on the order page hero */
  headline: string
  /** Opening line of the hero paragraph, drawn in ivory */
  lead: string
  /** Rest of the hero paragraph */
  blurb: string
  groups: FeatureGroup[]
  terms: [string, string][]
}

/** Selection: feature id → quantity (1 for on/off features) */
export type Selection = Record<string, number>

export type Line = { feature: Feature; qty: number; price: number; compareAt: number }
