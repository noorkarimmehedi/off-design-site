import { defaultSelection, getCatalog, priceSelection, taka } from "@/lib/work-order/catalog"
import { resolveClient } from "@/lib/work-order/clients"
import { gardenCard, OG_SIZE } from "@/lib/og/garden"

// Link preview for WhatsApp, Messenger and social shares: one garden card per brand link.
// Fixed quotes show their price; pick-your-own orders show the delivery window instead.
export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Arc Labs work order"

export default async function OrderPreview({ params }: { params: Promise<{ slug: string }> }) {
  const client = resolveClient((await params).slug)
  const catalog = getCatalog(client.catalog)
  const second =
    catalog.mode === "quote"
      ? taka(priceSelection(defaultSelection(catalog, client.selection), catalog).total)
      : `Delivery ${catalog.delivery}`
  return gardenCard({
    lines: client.name ? [{ text: "Work order for" }, { text: client.name, ink: true }] : [{ text: "Your work order", ink: true }],
    chips: [catalog.name, second],
    logo: client.logo,
  })
}
