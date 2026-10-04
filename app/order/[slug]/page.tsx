import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import TransitionLink from "@/components/transition-link"
import OrderBuilder from "@/components/work-order/order-builder"
import { CLIENTS } from "@/lib/work-order/clients"

export const metadata: Metadata = {
  title: "Work order — Arc Labs Corporation",
  robots: { index: false, follow: false },
}

export default async function ClientOrderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const client = CLIENTS[slug]
  return (
    <main className="frame relative min-h-svh overflow-x-clip bg-ink text-ivory">
      <SiteHeader
        left={
          <TransitionLink href="/" className="group inline-flex items-center gap-2 transition-colors hover:text-ivory">
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Home
          </TransitionLink>
        }
      />
      <OrderBuilder slug={slug} clientName={client?.name} preset={client?.selection} />
    </main>
  )
}
