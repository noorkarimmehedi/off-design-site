import type { Catalog } from "../types"

// Grambangla (deshi food: ghee, mustard oil, semai, spices): the Merchant Suite with every module
// bundled into the admin panel — each module keeps its own row and compare-at price but reads
// "Included". Storefront ৳23,000 + admin panel ৳22,000 are fixed; landing pages are ৳8,000 each
// and start unticked, so the client adds them only if they need them.
export const GRAMBANGLA_CATALOG: Catalog = {
  id: "grambangla",
  name: "Merchant suite",
  delivery: "7–15 days",
  mode: "builder",
  headline: "your quotation.",
  lead: "Your store and admin panel are included.",
  blurb: "Add landing pages if you need them — your price updates as you go. Sign below and we start as soon as the advance is confirmed.",
  groups: [
    {
      id: "core",
      title: "Core",
      note: "Always included",
      features: [
        {
          id: "storefront",
          name: "Online storefront",
          detail: "Mobile-first store in Bangla & English, with upsells built into the cart and a designed page for every product.",
          highlight: "Every product gets its own individually designed page.",
          pointGroups: [
            {
              title: "Product pages",
              highlight: true,
              points: [
                "Every product — ghee, mustard oil, semai, each spice — gets its own individually designed page, not one shared template",
                "Its own story, photos and sections: where it comes from, how it's made, how to use it",
                "Size and pack options (500 g, 1 kg, 2 L, 5 L…) with the price changing as you pick",
                "Reviews, delivery info and a sticky order button on phones",
              ],
            },
            {
              title: "Upsell & bigger carts",
              points: [
                "Add-to-cart suggestions — add ghee and we suggest the semai or spices that go with it",
                "Cart upsell — a row of matching products inside the cart, added with one tap",
                "Checkout picks — one last offer at checkout without leaving the page",
                "Combo packs — bundle products (ghee + semai, a spice set) at a bundle price",
                "Bigger-size nudge — “2 L saves ৳X” when someone picks the smaller pack",
                "Free-delivery bar — “৳X more for free delivery” pushes a bigger order",
              ],
            },
            {
              title: "Store",
              points: [
                "Home, shop, product pages, cart, checkout, order tracking, about and contact",
                "Cash on delivery checkout, in Bangla and English",
                "Built to load fast on mobile data",
                "Products, prices and stock come live from your admin panel",
                "Meta Pixel + Conversions API, Google Tag Manager and GA4 with e-commerce events",
                "SEO-ready pages and share previews for Facebook",
              ],
            },
          ],
          price: 23000,
          compareAt: 32000,
          required: true,
        },
        {
          id: "admin",
          name: "Admin panel",
          detail: "Orders, products, stock and customers in one dashboard — every feature in Grow & protect, Sell & follow up and Operations comes with it.",
          price: 22000,
          compareAt: 30000,
          required: true,
        },
      ],
    },
    {
      id: "grow",
      title: "Grow & protect",
      note: "In your admin panel",
      accent: true,
      features: [
        { id: "protection", name: "Fake order protection", detail: "Every order is checked before it ships. Risky ones are held with the reason in plain words — risk score, IP record, repeat-attempt tracking and advance payment proof.", price: 0, compareAt: 2500, bundled: true, required: true },
        { id: "campaign-links", name: "Campaign links", detail: "A tracked link per ad or post with automatic UTM tags — clicks, orders and delivered revenue per link.", price: 0, compareAt: 1500, bundled: true, required: true },
        { id: "analytics", name: "Website analytics", detail: "Your own visitor tracking: visitors, sessions, entry pages, nightly reports and retention.", price: 0, compareAt: 1500, bundled: true, required: true },
        { id: "business-report", name: "Business report", detail: "P&L, order value, delivery outcomes, product weight and hourly sales against the previous period.", price: 0, compareAt: 2000, bundled: true, required: true },
      ],
    },
    {
      id: "sell",
      title: "Sell & follow up",
      note: "In your admin panel",
      features: [
        { id: "payments", name: "bKash / Nagad payments", detail: "Online payment at checkout.", price: 0, compareAt: 2000, bundled: true, required: true },
        { id: "sms", name: "SMS order updates", detail: "Automatic confirmation and delivery messages.", price: 0, compareAt: 1000, bundled: true, required: true },
        { id: "abandoned", name: "Abandoned checkout recovery", detail: "See who left at checkout and follow up.", price: 0, compareAt: 1500, bundled: true, required: true },
      ],
    },
    {
      id: "ops",
      title: "Operations",
      note: "In your admin panel",
      features: [
        { id: "queue", name: "One order queue", detail: "Orders from your website and landing pages land in one queue. Your team moves each one from pending to confirmed to printed to shipped, with a tab for every step.", price: 0, compareAt: 1500, bundled: true, required: true },
        {
          id: "imessage",
          name: "iMessage AI agent",
          detail: "Run your whole Merchant Suite from iMessage — text it like a teammate and it does the work.",
          highlight: "Manage your entire Merchant Suite by text.",
          points: [
            "Ask for sales, orders, stock or a customer's history and get the answer in the chat",
            "Confirm, hold or cancel orders and send them to the courier by text",
            "Track any parcel by consignment ID",
            "Update products, prices and stock without opening the dashboard",
            "Hand an order to a teammate — it lands in their Team Inbox with the order card",
            "New-order and low-stock alerts straight to your iMessage; voice notes understood",
            "Every change waits for your YES before it is applied",
          ],
          price: 0,
          compareAt: 3000,
          bundled: true,
          required: true,
        },
        { id: "working", name: "Live “working on” indicator", detail: "Each order row shows which teammate has it open, in their colour, so two people never handle the same order — on orders and incomplete checkouts alike.", price: 0, compareAt: 1000, bundled: true, required: true },
        { id: "courier", name: "Courier integration", detail: "Pathao and Steadfast dispatch and tracking from the dashboard.", price: 0, compareAt: 2000, bundled: true, required: true },
        { id: "warehouses", name: "Multi-warehouse stock", detail: "Stock tracked per warehouse.", price: 0, compareAt: 1000, bundled: true, required: true },
        { id: "returns", name: "Returns management", detail: "Log and track returns and refunds.", price: 0, compareAt: 1000, bundled: true, required: true },
        { id: "team", name: "Team roles & activity log", detail: "Staff accounts, permissions and a log of who did what.", price: 0, compareAt: 1000, bundled: true, required: true },
      ],
    },
    {
      id: "pages",
      title: "Pages",
      note: "Add if you need them",
      features: [
        {
          id: "landing",
          name: "Custom landing pages",
          detail: "Campaign and product pages designed to your brand, made for Facebook ad traffic.",
          price: 8000,
          compareAt: 12000,
          perUnit: { label: "pages", min: 0, max: 20, default: 0 },
        },
      ],
    },
  ],
  terms: [
    ["Delivery", "Complete delivery within 7–15 days from the date the advance payment is confirmed."],
    ["Payment", "50% advance to confirm and start work; the remaining 50% on completion and final approval, before handover."],
    ["Revisions", "Two rounds of design revisions are included before build begins."],
    ["Content", "You provide your logo, product photos and prices. The timeline starts once we have them."],
    ["Third-party costs", "Domain, hosting, SMS and payment-gateway fees are not included and are billed at cost."],
    ["Ownership", "Once the final payment is made, everything we build is fully yours."],
    ["Support", "30 days of free bug fixes after launch. Ongoing support is available monthly."],
  ],
}
