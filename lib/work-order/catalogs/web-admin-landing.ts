import type { Catalog } from "../types"

// Fixed-scope quote for an online store: website + admin panel + 5 landing pages, with the
// selling features (payments, courier, SMS, fake order protection) folded into the build.
// Every line is required, so the client signs rather than picks. Total ৳65,000.
export const WEB_ADMIN_LANDING_CATALOG: Catalog = {
  id: "web-admin-landing",
  name: "Website, admin panel & landing pages",
  delivery: "10–14 days",
  mode: "quote",
  headline: "your quote.",
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
          detail:
            "Bespoke, mobile-first online store in Bangla & English — built to sell fresh mangoes and seasonal produce directly to customers.",
          points: [
            "Home, shop, product, about, contact and order-tracking pages",
            "Product catalogue by variety (Himsagar, Langra, Fazli, Amrapali and more) with weight / crate options",
            "Cart and checkout with cash on delivery and bKash / Nagad online payment",
            "Pre-order and season-availability for upcoming harvests",
            "Meta Pixel + Conversions API — ViewContent, AddToCart, InitiateCheckout and Purchase tracked from the browser and the server, with duplicate events filtered out, so Facebook and Instagram ads are measured end to end",
            "Google Tag Manager — container set up so new tags can be added later without code changes",
            "Google Analytics 4 — connected through Tag Manager with e-commerce events",
            "Fast, SEO-ready and animated with the same care as our own site",
          ],
          price: 28000,
          compareAt: 42000,
          required: true,
        },
        {
          id: "admin",
          name: "Admin panel",
          detail:
            "Your own dashboard to run the business: orders, products, stock, customers and content — change anything without touching code.",
          pointGroups: [
            {
              title: "Orders & products",
              points: [
                "Order management — confirm, hold, cancel and print invoices",
                "Bulk order actions — select many orders at once to confirm, dispatch to courier, change status or print invoices, packing slips and courier labels",
                "Phone confirmation tracker — every order's call attempts in one segmented status: 1st attempt, 2nd attempt, 3rd attempt, each marked confirmed, no answer, call back or cancelled, with time and note",
                "Products, varieties, prices, stock and season availability",
                "Customer list with order history",
                "Landing page and website content editing",
              ],
            },
            {
              title: "Sell & protect",
              points: [
                "Fake order protection — risk score on every order, IP record, held-order review and advance payment proof",
                "SMS order updates — automatic confirmation and delivery messages",
                "Abandoned checkout recovery — see who left at checkout and follow up",
                "Campaign links — a tracked link per ad or post, with clicks, orders and revenue per link",
              ],
            },
            {
              title: "Operations",
              points: [
                "Courier integration — Pathao and Steadfast dispatch and tracking from the dashboard",
                "Business report — sales, order value, delivery outcomes and returns against the previous period",
                "Team roles & activity log — staff accounts, permissions and a log of who did what",
              ],
            },
          ],
          price: 22000,
          compareAt: 34000,
          required: true,
        },
      ],
    },
    {
      id: "pages",
      title: "Landing pages",
      note: "Fixed scope",
      accent: true,
      features: [
        {
          id: "landing",
          name: "5 custom landing pages",
          detail:
            "High-converting campaign and product pages designed to your brand — one per variety, offer or ad campaign — with a built-in quick order form.",
          points: [
            "5 landing pages, each with its own design and copy layout",
            "One-page quick order form connected to the admin panel",
            "Tracked campaign link per page for Facebook ads",
            "Mobile-first and fast loading for ad traffic",
          ],
          price: 15000,
          compareAt: 25000,
          required: true,
        },
      ],
    },
  ],
  terms: [
    [
      "Scope",
      "This order covers the three deliverables listed: the custom e-commerce website, the admin panel and 5 landing pages. Anything outside this list is quoted separately before it is built.",
    ],
    ["Delivery", "Complete delivery within 10–14 days from the date the advance payment is confirmed."],
    ["Payment", "৳32,500 advance to confirm and start work; the remaining ৳32,500 on completion and final approval, before handover."],
    ["Revisions", "Two rounds of design revisions are included before the build begins."],
    ["Content", "You provide your logo, product photos, prices and copy. The timeline starts once we have them."],
    ["Third-party costs", "Domain, hosting, SMS and payment-gateway fees are not included and are billed at cost."],
    ["Ownership", "Once the final payment is made, the design, code and content we build are fully yours."],
    ["Support", "30 days of free bug fixes after launch. Ongoing support is available monthly."],
  ],
}
