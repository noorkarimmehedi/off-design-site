import type { Metadata } from "next"
import ClientOrderPage from "./[slug]/page"

export const metadata: Metadata = {
  title: "Work order — Arc Labs Corporation",
  robots: { index: false, follow: false },
}

// /order with no client slug: the client types their own business name
export default function OrderPage() {
  return <ClientOrderPage params={Promise.resolve({ slug: "new" })} />
}
