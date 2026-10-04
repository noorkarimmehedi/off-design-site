import ClientOrderPage from "./[slug]/page"

export { metadata } from "./[slug]/page"

// /order with no client slug: the client types their own business name
export default function OrderPage() {
  return <ClientOrderPage params={Promise.resolve({ slug: "new" })} />
}
