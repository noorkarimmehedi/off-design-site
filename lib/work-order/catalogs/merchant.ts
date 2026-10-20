import type { Catalog } from "../types"

// D2C merchant suite: storefront, admin portal, order capture and the back office.
export const MERCHANT_CATALOG: Catalog = {
  id: "merchant",
  name: "Merchant suite",
  delivery: "7–15 days",
  mode: "builder",
  headline: "build your order.",
  lead: "Pick what your business needs.",
  blurb: "Your price updates as you go — when it looks right, sign below and we start as soon as the advance is confirmed.",
  groups: [
    {
      id: "core",
      title: "Core",
      note: "Always included",
      features: [
        { id: "storefront", name: "Online storefront", detail: "Mobile-first store in Bangla & English, product catalogue, cart and checkout.", price: 25000, compareAt: 45000, required: true },
        { id: "admin", name: "Admin portal", detail: "Orders, products, stock and customers in one dashboard.", price: 25000, compareAt: 45000, required: true },
      ],
    },
    {
      id: "pages",
      title: "Pages",
      note: "Pick how many",
      features: [
        { id: "landing", name: "Custom landing pages", detail: "Campaign and product pages designed to your brand.", price: 3000, compareAt: 5000, perUnit: { label: "pages", min: 0, max: 20, default: 5 } },
      ],
    },
    {
      id: "grow",
      title: "Grow & protect",
      note: "New in Merchant Suite",
      accent: true,
      features: [
        { id: "protection", name: "Fake order protection", detail: "Risk score on every order, IP record, held-order review, repeat-attempt tracking and advance payment proof.", price: 4000, compareAt: 16000 },
        { id: "campaign-links", name: "Campaign links", detail: "A tracked link per ad or post with automatic UTM tags — clicks, orders and delivered revenue per link.", price: 3000, compareAt: 12000 },
        { id: "analytics", name: "Website analytics", detail: "Your own visitor tracking: visitors, sessions, entry pages, nightly reports and retention.", price: 3000, compareAt: 12000 },
        { id: "business-report", name: "Business report", detail: "P&L, order value, delivery outcomes, product weight and hourly sales against the previous period.", price: 4000, compareAt: 15000 },
      ],
    },
    {
      id: "sell",
      title: "Sell & talk",
      note: "Turn chats into orders",
      features: [
        { id: "inbox", name: "Social inbox", detail: "Facebook, Instagram and WhatsApp messages in one inbox.", price: 9000, compareAt: 22000 },
        { id: "ai-capture", name: "AI order capture", detail: "Turns chat messages into orders automatically.", price: 7000, compareAt: 18000 },
        { id: "payments", name: "bKash / Nagad payments", detail: "Online payment at checkout.", price: 5000, compareAt: 12000 },
        { id: "sms", name: "SMS order updates", detail: "Automatic confirmation and delivery messages.", price: 3000, compareAt: 8000 },
        { id: "abandoned", name: "Abandoned checkout recovery", detail: "See who left at checkout and follow up.", price: 4000, compareAt: 9000 },
      ],
    },
    {
      id: "ops",
      title: "Operations",
      note: "Run the back office",
      features: [
        { id: "courier", name: "Courier integration", detail: "Pathao and Steadfast dispatch and tracking from the dashboard.", price: 5000, compareAt: 12000 },
        { id: "warehouses", name: "Multi-warehouse stock", detail: "Stock tracked per warehouse.", price: 4500, compareAt: 9000 },
        { id: "returns", name: "Returns management", detail: "Log and track returns and refunds.", price: 3000, compareAt: 8000 },
        { id: "team", name: "Team roles & activity log", detail: "Staff accounts, permissions and a log of who did what.", price: 2500, compareAt: 6000 },
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
