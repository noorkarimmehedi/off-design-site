import type { Catalog } from "../types"

// Fixed-scope quote for ICEy (drink syrups, Jessore): a funky, fast e-commerce website with a
// flavour upsell, the Merchant Suite admin panel (everything in its sidebar except Social inbox),
// including the iMessage AI agent, and one landing page. Every line is required, so the client signs rather than picks. Total ৳35,000.
export const ICEY_CATALOG: Catalog = {
  id: "icey",
  name: "Website, admin panel & landing page",
  docLabel: "Quotation",
  delivery: "14–21 days",
  mode: "quote",
  headline: "big flavours, bigger carts.",
  lead: "Everything below is included.",
  blurb:
    "We've scoped the work and fixed the price — review it, sign below, and we start as soon as the advance is confirmed.",
  groups: [
    {
      id: "build",
      title: "Website & admin",
      note: "Fixed scope",
      features: [
        {
          id: "site",
          name: "Custom e-commerce website",
          detail: "A funky, modern and very fast online store for ICEy, built to raise the value of every cart.",
          pointGroups: [
            {
              title: "Store",
              points: [
                "Custom funky, modern design made for ICEy's young crowd — bold colour, playful motion, flavour-first product pages",
                "Home, shop, flavour pages, cart, checkout, order tracking, about and contact",
                "Built to load fast on mobile data — animation never slows the shop down",
                "Cash on delivery checkout, in Bangla and English",
                "Products, flavours, prices and stock come live from your admin panel",
                "SEO-ready pages and share previews for Facebook",
              ],
            },
            {
              title: "Flavour upsell",
              points: [
                "Add-to-cart suggestions — when someone adds a flavour, we suggest the flavours that go with it",
                "Checkout picks — a last row of flavours at checkout, added with one tap",
                "Flavour mix packs — bundle 2, 3 or more flavours at a bundle price",
                "Free-delivery bar — “৳X more for free delivery” nudges a bigger cart",
              ],
            },
            {
              title: "Tracking",
              points: [
                "Meta Pixel + Conversions API — ViewContent, AddToCart, InitiateCheckout and Purchase from the browser and the server, duplicates filtered out",
                "Google Tag Manager — container set up so new tags need no code change",
                "Google Analytics 4 — connected through Tag Manager with e-commerce events",
                "Upsell clicks tracked, so you can see how much each suggestion adds",
              ],
            },
          ],
          price: 20000,
          compareAt: 34000,
          required: true,
        },
        {
          id: "admin",
          name: "Admin panel (Merchant Suite)",
          detail: "Your dashboard to run ICEy: orders, flavours, stock, customers, courier and reports.",
          highlight: "iMessage AI agent — run the whole Merchant Suite by text.",
          pointGroups: [
            {
              title: "iMessage AI agent",
              highlight: true,
              points: [
                "Run the whole Merchant Suite from iMessage — text it like a teammate and it does the work",
                "Ask for sales, orders, stock or a customer's history and get the answer in the chat",
                "Confirm, hold or cancel orders and send them to Steadfast or Pathao by text",
                "Update flavours, prices and stock without opening the dashboard",
                "Check a risky order or customer before you approve it",
                "Every change waits for your yes before it is applied",
              ],
            },
            {
              title: "Main menu",
              points: [
                "Home — live business snapshot by date and channel, plus live website visitors",
                "Orders — confirm, hold, cancel; Steadfast and Pathao dispatch, bulk dispatch, invoices, packing slips and Excel export",
                "Overview — orders, revenue, profit margin and delivery success rate",
                "Ask Edith — AI assistant that drafts changes to products, stock and orders; you approve each one",
                "Team inbox — staff chat with channels and direct messages, tag any order",
                "Business analytics — views → cart → purchase funnel, drop-off points and traffic sources",
              ],
            },
            {
              title: "Orders",
              points: [
                "Returns — Steadfast returns imported automatically, with lost revenue and return rate",
                "Customer list — repeat, win-back and risk segments, order history, follow-up reminders",
                "Order protection — risky orders held for review, trusted and blocked lists, phone fraud check",
                "Abandoned checkouts — see who left at checkout, send an SMS and turn it into an order",
              ],
            },
            {
              title: "Catalog",
              points: [
                "Products — flavours and sizes as variants, price, cost, stock, draft or publish",
                "Warehouses — stock per location",
                "Online store — live desktop and mobile preview of your website",
              ],
            },
            {
              title: "Marketing & reports",
              points: [
                "Campaign links — a tracked link per ad or post, with delivered orders and revenue per link",
                "Staff report — confirmations and delivery rate per staff member",
                "Activity log — who confirmed, cancelled or followed up on each order",
                "Business report — sales, order value and delivery outcomes against the previous period",
              ],
            },
          ],
          price: 12000,
          compareAt: 30000,
          required: true,
        },
      ],
    },
    {
      id: "pages",
      title: "Landing page",
      note: "Fixed scope",
      accent: true,
      features: [
        {
          id: "landing",
          name: "1 custom landing page",
          detail: "A product page for one flavour or campaign, made for Facebook ad traffic.",
          points: [
            "One product or campaign page, designed for ad traffic",
            "Quick order form connected to the admin panel",
            "Flavour suggestions inside the order form",
            "Tracked campaign link and Pixel events for your Facebook ads",
          ],
          price: 3000,
          compareAt: 5000,
          required: true,
        },
      ],
    },
  ],
  terms: [
    [
      "Scope",
      "This order covers the three deliverables listed: the custom e-commerce website, the admin panel (with the iMessage AI agent) and 1 landing page. Social inbox (Facebook, Instagram and WhatsApp inbox) is not included. Anything outside this list is quoted separately before it is built.",
    ],
    ["Your meeting points", "Specific requirements from our meeting are written into this order before you sign."],
    ["Delivery", "Complete delivery within 14–21 days from the date the advance payment is confirmed."],
    ["Payment", "৳17,500 advance to confirm and start work; the remaining ৳17,500 on completion and final approval, before handover."],
    ["Revisions", "Two rounds of design revisions are included before the build begins."],
    ["Content", "You provide your logo, product photos, flavours, prices and copy. The timeline starts once we have them."],
    ["Third-party costs", "Domain, hosting, SMS, courier, fraud-check and AI usage fees are not included and are billed at cost."],
    ["Ownership", "Once the final payment is made, the design, code and content we build are fully yours."],
    ["Support", "30 days of free bug fixes after launch. Ongoing support is available monthly."],
  ],
}
