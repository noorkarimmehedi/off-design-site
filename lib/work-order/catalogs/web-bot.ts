import type { Catalog } from "../types"

// Fixed-scope quote for a custom website + admin panel + custom bot.
// One price, one scope: every line below is required, so the client signs rather than picks.
export const WEB_BOT_CATALOG: Catalog = {
  id: "web-bot",
  name: "Website, bot & admin panel",
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
          name: "Custom website",
          detail:
            "Bespoke design and build — home, about, services, gallery and contact pages. Mobile-first, fast, and animated with the same care as our own site.",
          price: 18000,
          compareAt: 28000,
          required: true,
        },
        {
          id: "admin",
          name: "Admin panel",
          detail:
            "Your own dashboard: pages and content, enquiries, media library, users, roles and settings. Change anything without touching code.",
          price: 12000,
          compareAt: 18000,
          required: true,
        },
      ],
    },
    {
      id: "automate",
      title: "Features & automations",
      note: "Fixed scope",
      accent: true,
      features: [
        {
          id: "bot",
          name: "Features & automations",
          detail:
            "Every feature we build, renamed and grouped by section — all of it included.",
          pointGroups: [
            {
              title: "Grow & protect",
              points: [
                "Fake order protection — Risk score on every order, IP record, held-order review, repeat-attempt tracking and advance payment proof",
                "Campaign links — A tracked link per ad or post with automatic UTM tags; clicks, orders and delivered revenue per link",
                "Meta Pixel setup — The Meta Pixel installed and configured with the right events, so your Facebook and Instagram ads are measured end to end",
                "Website analytics — Your own visitor tracking: visitors, sessions, entry pages, nightly reports and retention",
                "Business report — P&L, order value, delivery outcomes, product weight and hourly sales against the previous period",
              ],
            },
            {
              title: "Sell & talk",
              points: [
                "bKash / Nagad payments — Online payment at checkout",
                "SMS order updates — Automatic confirmation and delivery messages",
                "Abandoned checkout recovery — See who left at checkout and follow up",
              ],
            },
            {
              title: "Operations",
              points: [
                "Courier integration — Pathao and Steadfast dispatch and tracking from the dashboard",
                "Multi-warehouse stock — Stock tracked per warehouse",
                "Returns management — Log and track returns and refunds",
                "Team roles & activity log — Staff accounts, permissions and a log of who did what",
              ],
            },
          ],
          price: 10000,
          compareAt: 12000,
          required: true,
        },
      ],
    },
  ],
  terms: [
    [
      "Scope",
      "This order covers the three deliverables listed: the custom website, the admin panel and the features & automations. Anything outside this list is quoted separately before it is built.",
    ],
    ["Delivery", "Complete delivery within 10–14 days from the date the advance payment is confirmed."],
    ["Payment", "৳20,000 advance to confirm and start work; the remaining ৳20,000 on completion and final approval, before handover."],
    ["Revisions", "Two rounds of design revisions are included before the build begins."],
    ["Content", "You provide your logo, copy and images. The timeline starts once we have them."],
    ["Third-party costs", "Domain, hosting and AI model usage fees are not included and are billed at cost."],
    ["Ownership", "Once the final payment is made, the design, code and content we build are fully yours."],
    ["Support", "30 days of free bug fixes after launch. Ongoing support is available monthly."],
  ],
}
