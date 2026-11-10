import type { Metadata, Viewport } from "next"
import HomeHeader from "@/components/home/home-header"
import SiteFoot from "@/components/home/site-foot"
import ScrollReveal from "@/components/home/scroll-reveal"
import OrderBuilder from "@/components/work-order/order-builder"
import { satoshi } from "@/lib/fonts"
import { getCatalog } from "@/lib/work-order/catalog"
import { resolveClient } from "@/lib/work-order/clients"
import "../../home.css"
import "../order.css"

// Paints the phone's status bar / browser bar in the page grey, as on the homepage
export const viewport: Viewport = { themeColor: "#111111" }

// The brand name in the link shows in the tab title and in WhatsApp / social link previews
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { name, catalog: catalogId } = resolveClient(slug)
  const catalog = getCatalog(catalogId)
  const title = name ? `Work order — ${name} × Arc Labs` : "Work order — Arc Labs Corporation"
  const description =
    catalog.mode === "quote"
      ? `Review the scope and price for ${name ?? "your project"}, then sign your work order with Arc Labs Corporation.`
      : "Pick your features, see your price and sign your work order with Arc Labs Corporation."
  return {
    title,
    description,
    openGraph: { title, description, url: `/order/${slug}`, siteName: "Arc Labs Corporation", type: "website" },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: false, follow: false },
  }
}

// The work order in the homepage's shell: same header and menu, same footer, same grey ground.
export default async function ClientOrderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const client = resolveClient(slug)
  const catalog = getCatalog(client.catalog)
  return (
    <main className={`ah wo ${satoshi.variable}`}>
      <div className="print:hidden">
        <HomeHeader />
      </div>
      <OrderBuilder slug={slug} clientName={client.name} preset={client.selection} catalog={catalog} nameLocked={client.locked} />
      <SiteFoot />
      <ScrollReveal />
    </main>
  )
}
