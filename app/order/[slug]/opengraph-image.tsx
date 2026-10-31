import { getCatalog } from "@/lib/work-order/catalog"
import { resolveClient } from "@/lib/work-order/clients"
import { gardenCard, OG_SIZE } from "@/lib/og/garden"

// Link preview for WhatsApp, Messenger and social shares: one garden card per brand link
export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Arc Labs work order"

export default async function OrderPreview({ params }: { params: Promise<{ slug: string }> }) {
  const client = resolveClient((await params).slug)
  const catalog = getCatalog(client.catalog)
  return gardenCard({
    title: client.name ?? "Your work order",
    subtitle: `Work order · ${catalog.name}`,
    logo: client.logo,
  })
}
