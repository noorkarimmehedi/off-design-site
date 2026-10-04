import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import TransitionLink from "@/components/transition-link"
import OrderBuilder from "@/components/work-order/order-builder"
import { resolveClient } from "@/lib/work-order/clients"

// The brand name in the link shows in the tab title and in WhatsApp / social link previews
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { name } = resolveClient(slug)
  const title = name ? `Work order — ${name} × Arc Labs` : "Work order — Arc Labs Corporation"
  const description = "Pick your features, see your price and sign your work order with Arc Labs Corporation."
  return {
    title,
    description,
    openGraph: { title, description, url: `/order/${slug}`, siteName: "Arc Labs Corporation", type: "website" },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: false, follow: false },
  }
}

export default async function ClientOrderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const client = resolveClient(slug)
  return (
    <main className="frame relative min-h-svh overflow-x-clip bg-ink text-ivory">
      <OrderBuilder
        slug={slug}
        clientName={client.name}
        preset={client.selection}
        nameLocked={client.locked}
        header={
          <SiteHeader
            left={
              <TransitionLink href="/" className="group inline-flex items-center gap-2 transition-colors hover:text-ivory">
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                Home
              </TransitionLink>
            }
          />
        }
      />
    </main>
  )
}
